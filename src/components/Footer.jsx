import { Zap } from 'lucide-react'

const Footer = () => (
    <footer className="py-32 border-t border-white/5 bg-pickle-dark relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-pickle-green/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center mb-6">
                        <Zap className="h-10 w-10 text-pickle-green mr-3" />
                        <span className="font-display text-3xl font-black tracking-tighter">ELECTRIC PICKLE</span>
                    </div>
                    <p className="text-gray-500 max-w-sm">
                        Redefining the culture of pickleball since 2024. Join the social revolution.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <h5 className="font-black text-xs tracking-widest uppercase">Club</h5>
                        <ul className="space-y-2 text-gray-500 text-sm">
                            <li><a href="#" className="hover:text-pickle-green transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-pickle-green transition-colors">Locations</a></li>
                            <li><a href="#" className="hover:text-pickle-green transition-colors">Join</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-black text-xs tracking-widest uppercase">Support</h5>
                        <ul className="space-y-2 text-gray-500 text-sm">
                            <li><a href="#" className="hover:text-pickle-green transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-pickle-green transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-pickle-green transition-colors">Shipping</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[10px] font-black tracking-widest text-gray-600 uppercase">
                <span>© 2024 ELECTRIC PICKLE SOCIAL CLUB INC.</span>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
)

export default Footer
