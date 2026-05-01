import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
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
    { name: 'Experience', href: '#experience' },
    { name: 'Tiers', href: '#tiers' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled ? 'bg-obsidian/80 backdrop-blur-2xl py-3 border-b border-sensual-red/10' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-10 h-10 bg-sensual-red rounded-full flex items-center justify-center red-shadow"
          >
            <Heart className="text-white w-6 h-6 fill-current" />
          </motion.div>
          <span className="text-2xl font-display font-bold text-white tracking-tighter">
            FANTASY<span className="text-sensual-red">ISLAND</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm uppercase tracking-[0.2em] font-medium text-white/70 hover:text-sensual-red transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sensual-red transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={() => navigate('/rooms')}
            className="bg-sensual-red hover:bg-white hover:text-sensual-red text-white px-8 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 red-shadow hover:scale-105 active:scale-95"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-obsidian border-b border-sensual-red/20 overflow-hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-display text-white/80 hover:text-sensual-red transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => { navigate('/rooms'); setIsMobileMenuOpen(false); }}
                className="bg-sensual-red text-white py-4 rounded-xl font-bold uppercase tracking-widest"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
