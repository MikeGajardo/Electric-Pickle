import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'

const ProductCard = ({ title, price, image, category, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="group"
    >
        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-pickle-gray mb-6 shadow-2xl border border-white/5">
            <img src={image} alt={title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-pickle-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-6 left-6 right-6">
                <button className="w-full bg-white text-pickle-dark py-4 rounded-2xl font-black tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 btn-glow shadow-xl uppercase text-sm">
                    ADD TO CART
                </button>
            </div>
        </div>
        <div className="flex justify-between items-end px-2">
            <div>
                <span className="text-[10px] text-pickle-green font-black tracking-[0.2em] uppercase mb-1 block">{category}</span>
                <h3 className="text-2xl font-display font-black leading-tight">{title}</h3>
            </div>
            <p className="text-3xl font-display font-black text-gradient leading-none">${price}</p>
        </div>
    </motion.div>
)

const Shop = () => {
    return (
        <div className="pt-32 pb-40 bg-pickle-dark min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-24 text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-display font-black mb-8"
                    >
                        THE <br /><span className="text-gradient">UNIFORM</span>
                    </motion.h1>
                    <p className="text-xl text-gray-400">
                        High-performance gear engineered for the elite. The standard for the Electric Pickle Social Club.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    <ProductCard
                        title="Volt X-1 Paddle"
                        price="189"
                        category="PADDLES"
                        image="https://images.unsplash.com/photo-1626225912762-4709d7dd73a2?w=800&q=80"
                        delay={0.1}
                    />
                    <ProductCard
                        title="Electric Grip"
                        price="18"
                        category="ACCESSORIES"
                        image="https://images.unsplash.com/photo-1595435063131-482084920601?w=800&q=80"
                        delay={0.2}
                    />
                    <ProductCard
                        title="Pro Ball Pack"
                        price="32"
                        category="EQUIPMENT"
                        image="https://images.unsplash.com/photo-1563810148-3939987259f6?w=800&q=80"
                        delay={0.3}
                    />
                    <ProductCard
                        title="Performance Tee"
                        price="65"
                        category="APPAREL"
                        image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
                        delay={0.4}
                    />
                    <ProductCard
                        title="Club Tech Hoodie"
                        price="120"
                        category="APPAREL"
                        image="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
                        delay={0.5}
                    />
                    <ProductCard
                        title="Tournament Tote"
                        price="85"
                        category="BAGS"
                        image="https://images.unsplash.com/photo-1544816153-12ad5d7140b2?w=800&q=80"
                        delay={0.6}
                    />
                </div>
            </div>
        </div>
    )
}

export default Shop
