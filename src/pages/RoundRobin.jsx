import { useMemo, useState } from 'react'
import { generateRoundRobin, calculateStandings } from '../lib/roundRobin'

const starterPlayers = Array.from({ length: 16 }, (_, i) => `Player ${i + 1}`).join('\n')
export default function RoundRobin() {
  const [roster, setRoster] = useState(starterPlayers)
  const [courts, setCourts] = useState(4)
  const [roundCount, setRoundCount] = useState(5)
  const [schedule, setSchedule] = useState([])
  const [scores, setScores] = useState({})
  const [players, setPlayers] = useState([])
  const [error, setError] = useState('')
  const standings = useMemo(() => calculateStandings(schedule, scores, players), [schedule, scores, players])
  function generate() {
    try {
      const list = roster.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
      const result = generateRoundRobin(list, courts, roundCount)
      setPlayers(list);setSchedule(result);setScores({});setError('')
    } catch (e) { setError(e.message) }
  }
  function setScore(id, side, value) {
    if(value !== '' && (!/^\d+$/.test(value) || Number(value)>99)) return
    setScores(previous => ({...previous,[id]:{a:'',b:'',...previous[id],[side]:value}}))
  }
  return <div className="min-h-screen bg-pickle-dark bg-mesh pt-32 pb-24 text-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <p className="uppercase text-pickle-green font-black tracking-[0.3em] text-xs mb-3">Electric Pickle Social Club</p>
      <h1 className="font-display font-black text-5xl md:text-7xl mb-3">ROUND <span className="text-pickle-green">ROBIN</span></h1>
      <p className="text-gray-400 mb-10">Generate rotating doubles matchups, assign courts, enter scores, and track standings. Demo mode — results are not saved or sent to DUPR.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <label className="md:col-span-2 block bg-white/5 border border-white/10 rounded-2xl p-5">
          <span className="font-bold block mb-3">Players (one name per line)</span>
          <textarea aria-label="Players" value={roster} onChange={e=>setRoster(e.target.value)} rows={9} className="w-full bg-pickle-dark border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-pickle-green" />
        </label>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
          <label className="font-bold">Courts<input type="number" min="1" max="16" value={courts} onChange={e=>setCourts(e.target.value)} className="mt-2 block w-full bg-pickle-dark border border-white/20 rounded-xl p-3" /></label>
          <label className="font-bold">Rounds<input type="number" min="1" max="30" value={roundCount} onChange={e=>setRoundCount(e.target.value)} className="mt-2 block w-full bg-pickle-dark border border-white/20 rounded-xl p-3" /></label>
          <button onClick={generate} className="bg-pickle-green text-pickle-dark font-black uppercase rounded-xl py-4 px-5 hover:opacity-90">Generate matchups</button>
          {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
        </div>
      </div>
      {schedule.length>0 && <>
        <h2 className="text-3xl font-black mb-5">LIVE STANDINGS</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 mb-12">
          <table className="w-full text-left text-sm"><thead className="bg-white/10"><tr>{['Player','W','L','PF','PA','Diff'].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{standings.map(s=><tr key={s.name} className="border-t border-white/10"><td className="p-3 font-bold">{s.name}</td><td className="p-3">{s.wins}</td><td className="p-3">{s.losses}</td><td className="p-3">{s.pointsFor}</td><td className="p-3">{s.pointsAgainst}</td><td className="p-3">{s.pointsFor-s.pointsAgainst}</td></tr>)}</tbody></table>
        </div>
        {schedule.map(round=><section key={round.number} className="mb-10">
          <h2 className="text-2xl font-black mb-4">ROUND {round.number}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {round.matches.map(m=><div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-pickle-green text-xs uppercase tracking-widest font-black mb-4">Court {m.court}</p>
              <div className="flex items-center justify-between gap-3 mb-3"><span>{m.teamA.join(' / ')}</span><input aria-label={`Round ${round.number} court ${m.court} team A score`} type="number" min="0" max="99" value={scores[m.id]?.a ?? ''} onChange={e=>setScore(m.id,'a',e.target.value)} className="w-20 bg-pickle-dark border border-white/20 rounded-lg p-2" /></div>
              <div className="flex items-center justify-between gap-3"><span>{m.teamB.join(' / ')}</span><input aria-label={`Round ${round.number} court ${m.court} team B score`} type="number" min="0" max="99" value={scores[m.id]?.b ?? ''} onChange={e=>setScore(m.id,'b',e.target.value)} className="w-20 bg-pickle-dark border border-white/20 rounded-lg p-2" /></div>
            </div>)}
          </div>
          {round.byes.length>0 && <p className="text-gray-400 mt-3">Resting: {round.byes.join(', ')}</p>}
        </section>)}
      </>}
    </div>
  </div>
}
