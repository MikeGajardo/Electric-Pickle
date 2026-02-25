import { motion } from 'framer-motion'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'

const EventCard = ({ title, date, location, type, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass-morphism p-10 rounded-[2.5rem] group cursor-pointer hover:border-pickle-green/50 transition-all card-hover"
    >
        <div className="flex justify-between items-start mb-8">
            <span className="text-[10px] font-black tracking-[0.3em] text-pickle-green uppercase bg-pickle-green/10 px-4 py-1.5 rounded-lg border border-pickle-green/20">
                {type}
            </span>
            <Calendar className="text-gray-600 group-hover:text-pickle-green transition-colors" size={24} />
        </div>
        <h2 className="text-3xl font-display font-black mb-8 group-hover:text-pickle-green transition-colors leading-[1.1]">{title}</h2>
        <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 text-gray-400 font-medium">
                <Calendar size={18} className="text-pickle-green" />
                {date}
            </div>
            <div className="flex items-center gap-4 text-gray-400 font-medium">
                <MapPin size={18} className="text-pickle-green" />
                {location}
            </div>
        </div>
        <button className="w-full py-4 rounded-2xl bg-white text-pickle-dark font-black tracking-widest hover:bg-pickle-green transition-all btn-glow uppercase text-sm">
            RESERVE SPOT
        </button>
    </motion.div>
)

const Events = () => {
    return (
        <div className="pt-32 pb-40 bg-pickle-dark min-h-screen bg-mesh">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-24 text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-display font-black mb-8"
                    >
                        UPCOMING <br /><span className="text-gradient">VIBES</span>
                    </motion.h1>
                    <p className="text-xl text-gray-400">
                        From elite mixers to underground pop-ups. Experience the culture of pickleball like never before.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <EventCard
                        title="Electric Night Lights"
                        date="Friday, Oct 25 • 7:00 PM"
                        location="Central Court Complex"
                        type="MIXER"
                        delay={0.1}
                    />
                    <EventCard
                        title="Pickle & Pints"
                        date="Saturday, Oct 26 • 2:00 PM"
                        location="The Warehouse"
                        type="SOCIAL"
                        delay={0.2}
                    />
                    <EventCard
                        title="Elite Singles Shootout"
                        date="Sunday, Oct 27 • 9:00 AM"
                        location="Northside Park"
                        type="COMPETITIVE"
                        delay={0.3}
                    />
                    <EventCard
                        title="Pop-Up: Neon Courts"
                        date="Wednesday, Nov 1 • 8:00 PM"
                        location="Secret Location"
                        type="UNDERGROUND"
                        delay={0.4}
                    />
                    <EventCard
                        title="Master Class: Spiking"
                        date="Saturday, Nov 4 • 10:00 AM"
                        location="West Side Center"
                        type="CLINIC"
                        delay={0.5}
                    />
                    <EventCard
                        title="Club Championship"
                        date="Nov 10-12 • All Day"
                        location="Grand Arena"
                        type="TOURNAMENT"
                        delay={0.6}
                    />
                </div>
            </div>
        </div>
    )
}

export default Events
