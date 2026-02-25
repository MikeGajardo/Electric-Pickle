import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsOpen(false)
    }, [location])

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Tournaments', path: '/tournaments' },
        { name: 'Events', path: '/events' },
        { name: 'Shop', path: '/shop' }
    ]

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300 border-b",
            scrolled ? "glass py-4 border-pickle-green/20" : "bg-transparent py-6 border-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center group cursor-pointer">
                        <div className="relative">
                            <Zap className="h-8 w-8 text-pickle-green relative z-10 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-pickle-green blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                        </div>
                        <span className="font-display text-2xl font-black tracking-tighter ml-3">ELECTRIC PICKLE</span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-10">
                            {navLinks.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            "px-3 py-2 text-sm font-bold tracking-wide transition-colors relative group",
                                            location.pathname === item.path ? "text-pickle-green" : "text-gray-300 hover:text-pickle-green"
                                        )}
                                    >
                                        {item.name}
                                        <span className={cn(
                                            "absolute bottom-0 left-0 h-0.5 bg-pickle-green transition-all group-hover:w-full",
                                            location.pathname === item.path ? "w-full" : "w-0"
                                        )} />
                                    </Link>
                                </motion.div>
                            ))}
                            <button className="bg-pickle-green text-pickle-dark px-6 py-2.5 rounded-full font-black text-xs tracking-widest btn-glow uppercase">
                                JOIN CLUB
                            </button>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white transition-colors p-2"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-pickle-green/10"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={cn(
                                        "block px-4 py-4 text-lg font-bold rounded-xl transition-all",
                                        location.pathname === item.path ? "text-pickle-green bg-white/5" : "text-gray-300 hover:text-pickle-green hover:bg-white/5"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <button className="w-full bg-pickle-green text-pickle-dark py-4 rounded-xl font-black text-xs tracking-widest btn-glow uppercase">
                                    JOIN CLUB
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
