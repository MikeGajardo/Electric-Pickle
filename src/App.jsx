import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Events from './pages/Events'
import Shop from './pages/Shop'

const ScrollToTop = () => {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

const App = () => {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-pickle-dark text-white selection:bg-pickle-green selection:text-pickle-dark overflow-x-hidden">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tournaments" element={<Tournaments />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/shop" element={<Shop />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
