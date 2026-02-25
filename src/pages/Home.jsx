import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Star, Trophy, Calendar, ShoppingBag, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const EmojiRain = () => {
    const [drops, setDrops] = useState([])

    useEffect(() => {
        const newDrops = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            emoji: Math.random() > 0.5 ? '⚡️' : '🥒',
            x: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 6 + Math.random() * 6,
            size: 24 + Math.random() * 32,
            rotateStart: Math.random() * 360,
            rotateEnd: Math.random() * 360 + (Math.random() > 0.5 ? 360 : -360)
        }))
        setDrops(newDrops)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {drops.map((drop) => (
                <motion.div
                    key={drop.id}
                    initial={{ y: -100, x: `${drop.x}vw`, rotate: drop.rotateStart, opacity: 0 }}
                    animate={{ y: '120vh', rotate: drop.rotateEnd, opacity: [0, 0.5, 0.5, 0] }}
                    transition={{
                        duration: drop.duration,
                        repeat: Infinity,
                        delay: drop.delay,
                        ease: "linear"
                    }}
                    className="absolute"
                    style={{ fontSize: `${drop.size}px`, filter: 'drop-shadow(0 0 15px rgba(164, 255, 0, 0.3))' }}
                >
                    {drop.emoji}
                </motion.div>
            ))}
        </div>
    )
}

const Hero = () => {
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-mesh noise-bg">
            <EmojiRain />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ y: y1, opacity }}
                    className="text-center"
                >
                    <div className="inline-flex items-center py-2 px-4 rounded-full bg-pickle-green/10 text-pickle-green text-xs font-black tracking-[0.2em] mb-8 border border-pickle-green/30 backdrop-blur-sm uppercase">
                        <Star size={14} className="mr-2 fill-pickle-green" /> The Social Evolution
                    </div>

                    <h1 className="text-7xl md:text-9xl font-display font-black mb-8 leading-[0.9] tracking-tighter">
                        ELECTRIC <br />
                        <span className="text-gradient">PICKLE</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-400 mb-12 font-medium leading-relaxed">
                        Where high-performance meets high-intensity social connection.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/tournaments" className="px-10 py-5 bg-pickle-green text-pickle-dark font-black rounded-2xl hover:bg-white transition-all transform hover:scale-105 btn-glow text-lg uppercase tracking-tight flex items-center justify-center">
                            CREATE TOURNAMENT
                        </Link>
                        <Link to="/events" className="px-10 py-5 bg-pickle-gray text-white font-bold rounded-2xl border border-white/10 hover:border-white/30 transition-all text-lg uppercase tracking-tight glass flex items-center justify-center">
                            EXPLORE EVENTS
                        </Link>
                    </div>
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pickle-dark to-transparent pointer-events-none" />
        </section>
    )
}

const TeaserCard = ({ title, description, icon: Icon, link, linkText, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="glass-morphism p-10 rounded-[2.5rem] group hover:border-pickle-green/30 transition-all card-hover flex flex-col items-center text-center"
    >
        <div className="w-16 h-16 rounded-2xl bg-pickle-green/10 flex items-center justify-center mb-6 text-pickle-green group-hover:scale-110 transition-transform">
            <Icon size={32} />
        </div>
        <h3 className="text-3xl font-display font-black mb-4">{title}</h3>
        <p className="text-gray-400 mb-8 leading-relaxed">{description}</p>
        <Link to={link} className="mt-auto py-4 px-8 rounded-xl border border-white/10 group-hover:bg-pickle-green group-hover:text-pickle-dark font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2">
            {linkText} <ChevronRight size={16} />
        </Link>
    </motion.div>
)

const Home = () => {
    return (
        <div className="bg-pickle-dark">
            <Hero />

            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TeaserCard
                            title="THE ENGINE"
                            description="Our proprietary Round Robin generator. Fair, high-stakes matchups for your weekly crew."
                            icon={Trophy}
                            link="/tournaments"
                            linkText="GENERATE NOW"
                            delay={0.1}
                        />
                        <TeaserCard
                            title="THE VIBE"
                            description="Elite night mix-ins, social pints, and competitive shootouts. Find your next game."
                            icon={Calendar}
                            link="/events"
                            linkText="VIEW CALENDAR"
                            delay={0.2}
                        />
                        <TeaserCard
                            title="THE GEAR"
                            description="High-performance paddles and apparel. Designed for the bold, engineered for the elite."
                            icon={ShoppingBag}
                            link="/shop"
                            linkText="SHOP COLLECTION"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            <section className="py-40 bg-mesh relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-5xl md:text-8xl font-display font-black mb-12"
                    >
                        JOIN THE <br /><span className="text-gradient">REVOLUTION</span>
                    </motion.h2>
                    <p className="max-w-xl mx-auto text-gray-400 text-lg mb-12">
                        The Electric Pickle Social Club is more than a game—it's a culture. Sign up for exclusive access to underground pop-ups and member-only gear.
                    </p>
                    <div className="max-w-xl mx-auto flex gap-4">
                        <div className="flex-1 relative group text-left">
                            <input type="email" id="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 pt-6 pb-2 focus:outline-none focus:border-pickle-green focus:bg-white/10 transition-all peer placeholder-transparent" placeholder="Your email..." />
                            <label htmlFor="email" className="absolute left-6 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-pickle-green cursor-text pointer-events-none">Email address</label>
                        </div>
                        <button className="bg-pickle-green text-pickle-dark px-10 py-4 rounded-2xl font-black btn-glow tracking-widest uppercase">Join</button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
