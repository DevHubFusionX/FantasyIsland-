import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Home, LayoutGrid, Calendar, Phone } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logoLady from '../assets/logo-lady.png'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Suites', href: '/rooms', icon: LayoutGrid },
    { name: 'Manage', href: '/manage-booking', icon: Calendar },
  ]

  const isActive = (path) => {
    if (path.startsWith('/#')) return false
    return location.pathname === path
  }

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo - Simple & Elegant */}
        <Link 
          to="/" 
          className="pointer-events-auto flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-sensual-red/40 transition-all duration-500 bg-black">
            <img src={logoLady} alt="FI" className="w-full h-full object-cover scale-150" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-display font-bold text-white tracking-widest uppercase">
              FANTASY<span className="text-sensual-red">ISLAND</span>
            </span>
            <span className="text-[7px] uppercase tracking-[0.5em] text-white/20 font-bold">Private Access</span>
          </div>
        </Link>

        {/* Floating Glass Navigation */}
        <motion.div 
          animate={{ 
            y: isScrolled ? 0 : 0,
            scale: isScrolled ? 0.95 : 1,
            backgroundColor: isScrolled ? 'rgba(13, 2, 2, 0.6)' : 'rgba(13, 2, 2, 0)'
          }}
          className={`hidden md:flex pointer-events-auto items-center px-2 py-2 rounded-full border transition-all duration-500 ${
            isScrolled ? 'backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'border-transparent'
          }`}
        >
          <div className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 relative group ${
                  isActive(link.href) ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive(link.href) && (
                  <motion.div 
                    layoutId="navGlow"
                    className="absolute inset-0 bg-sensual-red rounded-full shadow-[0_0_20px_rgba(196,30,58,0.4)]"
                  />
                )}
                {!isActive(link.href) && (
                  <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Right Action Button - Premium Animation */}
        <div className="hidden md:flex pointer-events-auto items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/rooms')}
            className="relative group px-8 py-3 rounded-full overflow-hidden transition-all duration-500"
          >
            {/* Animated Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-sensual-red/20 via-sensual-red/40 to-sensual-red/20 group-hover:from-sensual-red/40 group-hover:via-sensual-red/60 group-hover:to-sensual-red/40 transition-all duration-1000 animate-gradient-x" />
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg]"
              />
            </div>

            {/* Glowing Border */}
            <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-sensual-red/50 transition-colors duration-500" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Book Now
              </span>
              <ArrowRight size={14} className="text-white group-hover:translate-x-1.5 transition-transform duration-500" />
            </div>

            {/* Pulsing Aura */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-sensual-red/20 rounded-full blur-xl -z-10 group-hover:bg-sensual-red/40"
            />
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden pointer-events-auto w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu - Premium Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-8 flex flex-col pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-sensual-red/20 bg-black">
                  <img src={logoLady} alt="FI" className="w-full h-full object-cover scale-150" />
                </div>
                <span className="text-base font-display font-bold text-white tracking-widest uppercase">
                  FANTASY<span className="text-sensual-red">ISLAND</span>
                </span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-sensual-red/30 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <link.icon size={20} className="text-sensual-red" />
                    <span className="text-xl font-display font-bold text-white uppercase tracking-widest">{link.name}</span>
                  </div>
                  <ArrowRight size={18} className="text-white/10 group-hover:text-sensual-red group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            <div className="mt-auto">
              <button 
                onClick={() => { navigate('/rooms'); setIsMobileMenuOpen(false); }}
                className="w-full py-5 rounded-2xl bg-sensual-red text-white font-bold uppercase tracking-widest red-shadow"
              >
                Experience the Island
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
