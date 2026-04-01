/**
 * PaddleCustomizer.jsx — Electric Pickle Paddle Studio
 *
 * Drop this into src/pages/ and import in Shop.jsx.
 * Requires:  npm install three
 *
 * The edge guard tape is the star product. Customise its color, the text that
 * wraps around the perimeter, and the face design — all in real-time 3D.
 */

import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Config ───────────────────────────────────────────────────────────────────
const SHAPES = {
  widebody: { label: 'Widebody', w: 8.5, h: 8, r: 1.3, hL: 4.8, hW: 2.6, desc: 'Max sweet spot · Power game' },
  hybrid: { label: 'Hybrid', w: 7, h: 10, r: 1.1, hL: 5.0, hW: 2.3, desc: 'Balanced reach · Power & control' },
  elongated: { label: 'Elongated', w: 6, h: 12, r: 0.9, hL: 5.4, hW: 2.0, desc: 'Extended reach · Spin & precision' },
}
const EDGE_COLORS = ['#A4FF00', '#111111', '#FF6B00', '#00D4FF', '#FF1493', '#FFD700', '#FF4444', '#FFFFFF']
const FACE_COLORS = ['#0d0d0d', '#1a1a2e', '#0f2f1a', '#3d0000', '#ffffff', '#e8e0d0', '#1a1000']
const TEXT_COLORS = ['#111111', '#ffffff', '#A4FF00', '#FF6B00', '#00D4FF', '#FF1493', '#FFD700', '#FF4444']

// ─── THREE.js helpers ─────────────────────────────────────────────────────────

function makePaddleShape(w, h, r) {
  const s = new THREE.Shape()
  const [hw, hh] = [w / 2, h / 2]
  s.moveTo(-hw + r, -hh); s.lineTo(hw - r, -hh); s.quadraticCurveTo(hw, -hh, hw, -hh + r)
  s.lineTo(hw, hh - r); s.quadraticCurveTo(hw, hh, hw - r, hh)
  s.lineTo(-hw + r, hh); s.quadraticCurveTo(-hw, hh, -hw, hh - r)
  s.lineTo(-hw, -hh + r); s.quadraticCurveTo(-hw, -hh, -hw + r, -hh)
  return s
}

/**
 * Custom ribbon geometry that exactly traces the paddle outline.
 * UV.x = 0→1 around the full perimeter; UV.y = 0 (back face) → 1 (front face).
 * outwardNudge pushes vertices slightly outward to prevent z-fighting with the
 * underlying solid geometry.
 */
function makeEdgeStripGeo(w, h, r, depth, divisions = 500, outwardNudge = 0.018) {
  const pts = [...makePaddleShape(w, h, r).getPoints(divisions)]
  pts.push(pts[0].clone()) // close the loop

  let totalLen = 0
  const cumlens = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x, dy = pts[i].y - pts[i - 1].y
    totalLen += Math.sqrt(dx * dx + dy * dy)
    cumlens.push(totalLen)
  }

  const pos = [], uvs = [], nrm = [], idx = []
  const n = pts.length

  for (let i = 0; i < n; i++) {
    const p = pts[i], u = cumlens[i] / totalLen
    // Outward normal: CCW tangent → outward = (ty, −tx)
    const pi = Math.max(0, i - 1), ni = Math.min(n - 1, i + 1)
    let tx = pts[ni].x - pts[pi].x, ty = pts[ni].y - pts[pi].y
    const tl = Math.sqrt(tx * tx + ty * ty) || 1
    tx /= tl; ty /= tl
    const nx = ty, ny = -tx
    const ox = p.x + nx * outwardNudge, oy = p.y + ny * outwardNudge

    pos.push(ox, oy, depth / 2); uvs.push(u, 1); nrm.push(nx, ny, 0) // front
    pos.push(ox, oy, -depth / 2); uvs.push(u, 0); nrm.push(nx, ny, 0) // back
  }

  for (let i = 0; i < n - 1; i++) {
    const [a, b, c, d] = [i * 2, i * 2 + 1, (i + 1) * 2, (i + 1) * 2 + 1]
    idx.push(a, b, c, b, d, c)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3))
  geo.setIndex(idx)
  return geo
}

/** Edge guard SIDE texture — text tiles around the full perimeter */
function makeEdgeGuardTex(text, bgColor, textColor) {
  const W = 4096, H = 512
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')

  ctx.fillStyle = bgColor; ctx.fillRect(0, 0, W, H)

  // Pinstripes
  const stripe = 14
  ctx.fillStyle = textColor + '45'
  ctx.fillRect(0, 0, W, stripe); ctx.fillRect(0, H - stripe, W, stripe)
  ctx.fillStyle = textColor + '25'
  ctx.fillRect(0, stripe, W, 4); ctx.fillRect(0, H - stripe - 4, W, 4)

  // Repeating text
  const fs = Math.round(H * 0.52)
  ctx.font = `900 ${fs}px "Arial Black", Arial, sans-serif`
  ctx.fillStyle = textColor
  ctx.textBaseline = 'middle'
  ctx.shadowColor = textColor; ctx.shadowBlur = 10

  const unit = (text.trim().toUpperCase() || 'ELECTRIC PICKLE') + '   ◆   '
  const uw = ctx.measureText(unit).width
  let x = 0
  while (x < W + uw) { ctx.fillText(unit, x, H / 2); x += uw }
  ctx.shadowBlur = 0

  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

/** Paddle face canvas texture */
function makeFaceTex(text, bgColor, textColor, accentColor) {
  const N = 1024
  const cv = document.createElement('canvas')
  cv.width = cv.height = N
  const ctx = cv.getContext('2d')
  ctx.fillStyle = bgColor; ctx.fillRect(0, 0, N, N)

  ctx.fillStyle = textColor + '18'
  for (let x = 50; x < N; x += 68)
    for (let y = 50; y < N; y += 68) {
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill()
    }

  ctx.fillStyle = accentColor
  ctx.fillRect(60, N - 130, N - 120, 3)
  ctx.font = 'bold 38px Arial'; ctx.fillStyle = accentColor
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('ELECTRIC PICKLE', N / 2, N - 84)

  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length) {
    const maxLen = Math.max(...lines.map(l => l.length))
    const fs = Math.min(220, Math.max(56, Math.floor(820 / Math.max(maxLen, 1))))
    ctx.font = `900 ${fs}px "Arial Black", Arial`
    ctx.fillStyle = textColor
    ctx.shadowColor = textColor; ctx.shadowBlur = 24
    const lh = fs * 1.16
    const usableH = N - 150
    const startY = usableH / 2 - (lines.length * lh) / 2
    lines.forEach((l, i) => ctx.fillText(l, N / 2, startY + i * lh + lh / 2))
    ctx.shadowBlur = 0
  }
  return new THREE.CanvasTexture(cv)
}

/** Assemble the full 3D paddle group */
function buildPaddleMesh(cfg, edgeC, faceC, textC, handleC, edgeText, faceText) {
  const group = new THREE.Group()
  const D = 1.4, EG = 0.30

  // 1. Solid paddle body (edge guard color) — shows as ring on front/back
  const egMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makePaddleShape(cfg.w + EG * 2, cfg.h + EG * 2, cfg.r + EG), { depth: D, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: edgeC, roughness: 0.35, metalness: 0.1 })
  )
  egMesh.position.z = -D / 2
  group.add(egMesh)

  // 2. Face body (face color) — covers the interior
  const fbMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(makePaddleShape(cfg.w, cfg.h, cfg.r), { depth: D - 0.04, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: faceC, roughness: 0.6 })
  )
  fbMesh.position.z = -D / 2 + 0.02
  group.add(fbMesh)

  // 3. Edge guard strip — THE HERO: text wraps around the perimeter
  group.add(new THREE.Mesh(
    makeEdgeStripGeo(cfg.w + EG * 2, cfg.h + EG * 2, cfg.r + EG, D),
    new THREE.MeshStandardMaterial({
      map: makeEdgeGuardTex(edgeText, edgeC, textC),
      roughness: 0.28, metalness: 0.12,
      side: THREE.DoubleSide,
    })
  ))

  // 4. Front face design
  const tMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(cfg.w - 0.22, cfg.h - 0.22),
    new THREE.MeshStandardMaterial({ map: makeFaceTex(faceText, faceC, '#aaaaaa', edgeC), roughness: 0.42 })
  )
  tMesh.position.z = D / 2 + 0.025
  group.add(tMesh)

  // 5. Handle
  const hMesh = new THREE.Mesh(
    new THREE.BoxGeometry(cfg.hW, cfg.hL, D),
    new THREE.MeshStandardMaterial({ color: handleC, roughness: 0.88 })
  )
  hMesh.position.y = -cfg.h / 2 - cfg.hL / 2
  group.add(hMesh)

  // 6. Grip tape (matches edge guard color)
  const gCount = Math.round(cfg.hL / 0.62)
  const hY = -cfg.h / 2 - cfg.hL / 2
  for (let i = 0; i < gCount; i++) {
    const gy = hY - cfg.hL / 2 + 0.35 + i * ((cfg.hL - 0.45) / gCount)
    const gm = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.hW + 0.12, 0.16, D + 0.06),
      new THREE.MeshStandardMaterial({ color: edgeC, roughness: 0.72, transparent: true, opacity: 0.6 })
    )
    gm.position.y = gy
    group.add(gm)
  }

  group.position.y = cfg.hL / 2
  return group
}

function disposePaddle(paddle, scene) {
  if (!paddle) return
  paddle.traverse(o => {
    o.geometry?.dispose()
      ;[o.material].flat().forEach(m => { m?.map?.dispose(); m?.dispose() })
  })
  scene.remove(paddle)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PaddleCustomizer() {
  const mountRef = useRef(null)
  const ctx3 = useRef({})

  const [shape, setShape] = useState('widebody')
  const [edgeC, setEdgeC] = useState('#A4FF00')
  const [faceC, setFaceC] = useState('#0d0d0d')
  const [textC, setTextC] = useState('#111111')
  const [handleC, setHandleC] = useState('#1a1a1a')
  const [edgeText, setEdgeText] = useState('ELECTRIC PICKLE')
  const [faceText, setFaceText] = useState('EP')

  // Init Three.js scene
  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#080808')
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 200)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(6, 9, 14); key.castShadow = true; scene.add(key)
    const fill = new THREE.DirectionalLight(0xa4ff00, 0.2)
    fill.position.set(-10, -4, -6); scene.add(fill)
    const rim = new THREE.PointLight(0x4499ff, 0.5, 80)
    rim.position.set(-12, 6, -10); scene.add(rim)

    const mouse = { down: false, x: 0, y: 0, rx: -0.25, ry: 0.5, auto: true, t: 0, zoom: 30 }
    ctx3.current = { scene, camera, renderer, paddle: null, mouse, animId: null }

    const animate = () => {
      ctx3.current.animId = requestAnimationFrame(animate)
      mouse.t += 0.005
      if (ctx3.current.paddle && mouse.auto) {
        ctx3.current.paddle.rotation.y = mouse.ry + Math.sin(mouse.t) * 0.9
        ctx3.current.paddle.rotation.x = mouse.rx + Math.sin(mouse.t * 0.35) * 0.08
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', onResize)

    const cv = renderer.domElement
    const onDown = e => { mouse.down = true; mouse.auto = false; mouse.x = e.clientX; mouse.y = e.clientY }
    const onMove = e => {
      if (!mouse.down || !ctx3.current.paddle) return
      mouse.ry += (e.clientX - mouse.x) * 0.008
      mouse.rx += (e.clientY - mouse.y) * 0.008
      ctx3.current.paddle.rotation.y = mouse.ry
      ctx3.current.paddle.rotation.x = mouse.rx
      mouse.x = e.clientX; mouse.y = e.clientY
    }
    const onUp = () => { mouse.down = false; setTimeout(() => { mouse.auto = true }, 3000) }
    const onWheel = e => {
      e.preventDefault()
      mouse.zoom = Math.max(12, Math.min(55, mouse.zoom + e.deltaY * 0.04))
      camera.position.z = mouse.zoom
    }
    cv.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    cv.addEventListener('wheel', onWheel, { passive: false })

    const toE = e => ({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })
    cv.addEventListener('touchstart', e => onDown(toE(e)), { passive: true })
    window.addEventListener('touchmove', e => { if (mouse.down) onMove(toE(e)) }, { passive: true })
    window.addEventListener('touchend', onUp)

    return () => {
      cancelAnimationFrame(ctx3.current.animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      renderer.dispose()
      if (el.contains(cv)) el.removeChild(cv)
    }
  }, [])

  // Rebuild paddle when any setting changes
  useEffect(() => {
    const { scene, mouse } = ctx3.current
    if (!scene) return
    disposePaddle(ctx3.current.paddle, scene)
    const cfg = SHAPES[shape]
    const paddle = buildPaddleMesh(cfg, edgeC, faceC, textC, handleC, edgeText, faceText)
    if (mouse) { paddle.rotation.x = mouse.rx; paddle.rotation.y = mouse.ry }
    scene.add(paddle)
    ctx3.current.paddle = paddle
  }, [shape, edgeC, faceC, textC, handleC, edgeText, faceText])

  // ── Styles ──────────────────────────────────────────────────────────────────
  const div = { borderTop: '1px solid #1c1c1c', margin: '20px 0' }
  const lbl = { color: '#555', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 11 }
  const row = { display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 11 }
  const inp = { width: '100%', height: 35, borderRadius: 8, border: '1px solid #222', cursor: 'pointer', background: 'none' }
  const ta = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #222', background: '#080808', color: '#fff', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, letterSpacing: 2, resize: 'none', outline: 'none', boxSizing: 'border-box' }
  const hint = { color: '#333', fontSize: 10, marginTop: 5, letterSpacing: 0.5 }
  const pill = { display: 'inline-block', background: 'rgba(164,255,0,0.1)', border: '1px solid rgba(164,255,0,0.3)', color: '#A4FF00', fontSize: 9, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, marginBottom: 12 }
  const sw = (c, a) => ({ width: 33, height: 33, borderRadius: 8, background: c, border: `2px solid ${a ? '#fff' : 'transparent'}`, cursor: 'pointer', transform: a ? 'scale(1.18)' : 'scale(1)', transition: 'all 0.15s', flexShrink: 0 })
  const sbtn = k => ({ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', marginBottom: 8, borderRadius: 12, border: `2px solid ${shape === k ? '#A4FF00' : '#222'}`, background: shape === k ? 'rgba(164,255,0,0.07)' : 'transparent', color: shape === k ? '#A4FF00' : '#777', cursor: 'pointer', transition: 'all 0.18s' })

  return (
    <div style={{ display: 'flex', height: '100%', background: '#080808', color: '#fff', fontFamily: "'Inter','Helvetica Neue',sans-serif", overflow: 'hidden' }}>

      {/* ── 3D Viewport ── */}
      <div ref={mountRef} style={{ flex: 1, position: 'relative', cursor: 'grab' }}>
        <div style={{ position: 'absolute', top: 18, left: 20, color: '#A4FF00', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.6, pointerEvents: 'none' }}>
          ★ Edge Guard Tape Customizer
        </div>
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', color: '#252525', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', pointerEvents: 'none' }}>
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{ width: 340, background: '#0f0f0f', borderLeft: '1px solid #1c1c1c', overflowY: 'auto', padding: '28px 22px' }}>
        <div style={{ color: '#A4FF00', fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 4 }}>Electric Pickle</div>
        <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900 }}>Paddle Studio</h2>
        <div style={{ color: '#444', fontSize: 11, marginBottom: 26 }}>Design your edge guard tape</div>

        {/* Shape */}
        <span style={lbl}>Paddle Shape</span>
        {Object.entries(SHAPES).map(([k, v]) => (
          <button key={k} onClick={() => setShape(k)} style={sbtn(k)}>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>{v.label}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>{v.desc}</div>
          </button>
        ))}

        <div style={div} />

        {/* ── Edge Guard — hero section ── */}
        <div style={pill}>★ Main Product</div>
        <span style={lbl}>Edge Guard Color</span>
        <div style={row}>{EDGE_COLORS.map(c => <button key={c} onClick={() => setEdgeC(c)} style={sw(c, edgeC === c)} />)}</div>
        <input type="color" value={edgeC} onChange={e => setEdgeC(e.target.value)} style={inp} />

        <div style={{ marginTop: 16 }}>
          <span style={lbl}>Edge Guard Text</span>
          <textarea rows={2} maxLength={30} value={edgeText} onChange={e => setEdgeText(e.target.value)} placeholder="Your brand or name..." style={ta} />
          <div style={hint}>Wraps around the perimeter of the tape</div>
        </div>

        <div style={{ marginTop: 14 }}>
          <span style={lbl}>Text Color</span>
          <div style={row}>{TEXT_COLORS.map(c => <button key={c} onClick={() => setTextC(c)} style={sw(c, textC === c)} />)}</div>
          <input type="color" value={textC} onChange={e => setTextC(e.target.value)} style={inp} />
        </div>

        <div style={div} />

        {/* Face */}
        <span style={lbl}>Face Color</span>
        <div style={row}>{FACE_COLORS.map(c => <button key={c} onClick={() => setFaceC(c)} style={sw(c, faceC === c)} />)}</div>
        <input type="color" value={faceC} onChange={e => setFaceC(e.target.value)} style={inp} />

        <div style={{ marginTop: 14 }}>
          <span style={lbl}>Face Text / Initials</span>
          <textarea rows={2} maxLength={20} value={faceText} onChange={e => setFaceText(e.target.value)} placeholder="Initials or text..." style={ta} />
        </div>

        <div style={div} />

        <span style={lbl}>Handle Color</span>
        <input type="color" value={handleC} onChange={e => setHandleC(e.target.value)} style={inp} />

        <div style={div} />

        <button
          onClick={() => alert('🥒 Order placed! Your custom edge guard tape is on the way.')}
          style={{ width: '100%', padding: 15, borderRadius: 14, border: 'none', background: '#A4FF00', color: '#080808', fontWeight: 900, fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', cursor: 'pointer', marginBottom: 10 }}
        >
          Order Edge Guard Tape →
        </button>
        <button
          onClick={() => alert('Design saved!')}
          style={{ width: '100%', padding: 11, borderRadius: 14, border: '1px solid #222', background: 'transparent', color: '#555', fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Save Design
        </button>
      </div>
    </div>
  )
}
