import { useState } from 'react'
import { Trophy, Users, Plus, Trash2, Award, Swords, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Tournaments = () => {
    const [players, setPlayers] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4'])
    const [newPlayer, setNewPlayer] = useState('')
    const [matches, setMatches] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [format, setFormat] = useState('round-robin')
    const [teamSize, setTeamSize] = useState('doubles')
    const [gauntletWinners, setGauntletWinners] = useState({})

    const addPlayer = () => {
        if (newPlayer && players.length < 12) {
            setPlayers([...players, newPlayer])
            setNewPlayer('')
        }
    }

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index))
    }

    const updatePlayer = (index, newName) => {
        const updatedPlayers = [...players]
        updatedPlayers[index] = newName
        setPlayers(updatedPlayers)
    }

    const generateSchedule = () => {
        setIsGenerating(true)
        setGauntletWinners({}) // Reset winners
        setTimeout(() => {
            const generatedMatches = []

            let activePlayers = [...players]
            if (teamSize === 'doubles') {
                activePlayers = []
                for (let i = 0; i < players.length; i += 2) {
                    if (i + 1 < players.length) {
                        activePlayers.push(`${players[i]} & ${players[i + 1]}`)
                    } else {
                        activePlayers.push(`${players[i]} & BYE`)
                    }
                }
            }

            if (format === 'round-robin') {
                let p = [...activePlayers]
                if (p.length % 2 !== 0) p.push('BYE')
                const rounds = p.length - 1
                const half = p.length / 2
                for (let round = 0; round < rounds; round++) {
                    const roundMatches = []
                    for (let i = 0; i < half; i++) {
                        const p1 = p[i]
                        const p2 = p[p.length - 1 - i]
                        if (p1 !== 'BYE' && p2 !== 'BYE') roundMatches.push({ p1, p2 })
                    }
                    if (roundMatches.length > 0) {
                        generatedMatches.push({ round: round + 1, matches: roundMatches })
                    }
                    p.splice(1, 0, p.pop())
                }
            } else if (format === 'gauntlet') {
                for (let i = 1; i < activePlayers.length; i++) {
                    const p1 = i === 1 ? activePlayers[0] : `Winner of Game ${i - 1}`
                    const p2 = activePlayers[i]
                    // Store the raw base match, we will compute dynamic p1 at render time
                    generatedMatches.push({ round: i, matches: [{ p1, p2, isP1Dynamic: i > 1 }] })
                }
            }

            setMatches(generatedMatches)
            setIsGenerating(false)
        }, 600)
    }

    const handleWinnerSelect = (roundIndex, winnerName) => {
        if (format !== 'gauntlet') return
        setGauntletWinners(prev => ({ ...prev, [roundIndex]: winnerName }))
    }

    const getDynamicPlayer1 = (match, roundIndex) => {
        if (format !== 'gauntlet' || !match.isP1Dynamic) return match.p1
        const previousWinner = gauntletWinners[roundIndex - 1]
        return previousWinner ? previousWinner : match.p1 // match.p1 holds the "Winner of Game X" fallback string
    }

    return (
        <div className="pt-32 pb-40 bg-pickle-dark min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-display font-black mb-8"
                    >
                        THE <br /><span className="text-gradient">ENGINE</span>
                    </motion.h1>
                    <p className="text-xl text-gray-400">
                        Professional Round Robin tournament management. Built for fair play, high energy, and social competition.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 glass-morphism p-10 rounded-[2.5rem]"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                                <Users className="text-pickle-green" size={28} /> ROSTER
                            </h3>
                            <span className="text-pickle-green text-sm font-black bg-pickle-green/10 px-3 py-1 rounded-lg">
                                {players.length}/12
                            </span>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    id="newPlayer"
                                    value={newPlayer}
                                    onChange={(e) => setNewPlayer(e.target.value)}
                                    placeholder="Player Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 pt-6 pb-2 focus:outline-none focus:border-pickle-green focus:bg-white/10 transition-all peer placeholder-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                                />
                                <label htmlFor="newPlayer" className="absolute left-6 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-pickle-green cursor-text pointer-events-none">Player Name</label>
                            </div>
                            <button
                                onClick={addPlayer}
                                className="bg-pickle-green text-pickle-dark px-6 rounded-2xl hover:bg-white transition-all btn-glow flex items-center justify-center min-w-[72px]"
                            >
                                <Plus size={24} strokeWidth={3} />
                            </button>
                        </div>
                        <div className="space-y-3 mb-10 min-h-[300px] max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {players.map((player, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-pickle-green/20 group transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-pickle-green/10 flex items-center justify-center text-pickle-green font-bold text-xs border border-pickle-green/20 shrink-0">
                                                {idx + 1}
                                            </div>
                                            <input
                                                type="text"
                                                value={player}
                                                onChange={(e) => updatePlayer(idx, e.target.value)}
                                                className="font-bold text-lg bg-transparent border-b border-transparent focus:border-pickle-green focus:outline-none transition-colors w-full text-white placeholder-gray-600"
                                                placeholder={`Player ${idx + 1}`}
                                            />
                                        </div>
                                        <button onClick={() => removePlayer(idx)} className="text-gray-600 hover:text-red-500 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-4 mb-4">
                            <div className="flex bg-white/5 p-1 rounded-2xl flex-1">
                                <button
                                    onClick={() => setTeamSize('singles')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${teamSize === 'singles' ? 'bg-pickle-green text-pickle-dark' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <User size={16} /> SINGLES
                                </button>
                                <button
                                    onClick={() => setTeamSize('doubles')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${teamSize === 'doubles' ? 'bg-pickle-green text-pickle-dark' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Users size={16} /> DOUBLES
                                </button>
                            </div>
                        </div>

                        <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
                            <button
                                onClick={() => setFormat('round-robin')}
                                className={`flex-1 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${format === 'round-robin' ? 'bg-pickle-green text-pickle-dark' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Trophy size={16} /> ROUND ROBIN
                            </button>
                            <button
                                onClick={() => setFormat('gauntlet')}
                                className={`flex-1 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${format === 'gauntlet' ? 'bg-pickle-green text-pickle-dark' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Swords size={16} /> GAUNTLET
                            </button>
                        </div>

                        <button
                            onClick={generateSchedule}
                            disabled={players.length < 2 || isGenerating}
                            className="w-full py-5 bg-white text-pickle-dark font-black tracking-widest rounded-2xl hover:bg-pickle-green transition-all text-lg btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100 disabled:hover:translate-y-0"
                        >
                            {isGenerating ? "OPTIMIZING..." : "GENERATE SCHEDULE"}
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 glass-morphism p-10 rounded-[2.5rem] relative min-h-[600px]"
                    >
                        <h3 className="text-2xl font-display font-bold mb-10 flex items-center gap-3">
                            <Trophy className="text-pickle-green" size={28} /> LIVE MATCHUPS
                        </h3>

                        <AnimatePresence mode="wait">
                            {matches.length > 0 ? (
                                <motion.div
                                    key="matches"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-12 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar"
                                >
                                    {matches.map((round) => (
                                        <div key={round.round}>
                                            <div className="inline-block text-xs font-black text-pickle-green mb-5 uppercase tracking-[0.3em] px-4 py-1.5 bg-pickle-green/10 rounded-lg border border-pickle-green/20">
                                                {format === 'gauntlet' ? 'Game' : 'Round'} {round.round}
                                            </div>
                                            <div className={`grid grid-cols-1 ${format === 'gauntlet' || teamSize === 'doubles' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                                                {round.matches.map((match, mIdx) => {
                                                    const p1Display = getDynamicPlayer1(match, round.round)
                                                    const p2Display = match.p2
                                                    const isP1Winner = gauntletWinners[round.round] === p1Display
                                                    const isP2Winner = gauntletWinners[round.round] === p2Display

                                                    return (
                                                        <div key={mIdx} className="p-6 bg-pickle-gray/50 rounded-2xl border border-white/5 flex items-center justify-between group">
                                                            {format === 'gauntlet' ? (
                                                                <button
                                                                    onClick={() => handleWinnerSelect(round.round, p1Display)}
                                                                    className={`font-black text-lg transition-colors hover:text-pickle-green text-left flex-1 ${isP1Winner ? 'text-pickle-green' : 'text-white'}`}
                                                                >
                                                                    {p1Display}
                                                                </button>
                                                            ) : (
                                                                <span className="font-black text-lg text-left flex-1">{p1Display}</span>
                                                            )}

                                                            <span className="text-[10px] font-black text-gray-500 tracking-widest px-4 text-center">VS</span>

                                                            {format === 'gauntlet' ? (
                                                                <button
                                                                    onClick={() => handleWinnerSelect(round.round, p2Display)}
                                                                    className={`font-black text-lg transition-colors hover:text-pickle-green text-right flex-1 ${isP2Winner ? 'text-pickle-green' : 'text-white'}`}
                                                                >
                                                                    {p2Display}
                                                                </button>
                                                            ) : (
                                                                <span className="font-black text-lg text-right flex-1">{p2Display}</span>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                                    <Award size={120} strokeWidth={1} className="mb-6" />
                                    <p className="text-xl font-bold">READY FOR ACTION</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Tournaments
