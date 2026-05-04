import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Camera, Settings, LogOut, Menu, X, Home as HomeIcon, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logoLady from '../../assets/logo-lady.png'

const AdminSidebar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Reservations', icon: Calendar, path: '/admin/bookings' },
    { name: 'Suites', icon: HomeIcon, path: '/admin/suites' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ]

  const SidebarContent = ({ isMobile = false }) => (
    <div className="h-full flex flex-col bg-[#0D0202]">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center space-x-3 md:space-x-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden border border-sensual-red/30 bg-black shadow-[0_0_20px_rgba(196,30,58,0.2)]"
            >
              <img src={logoLady} alt="FI" className="w-full h-full object-cover scale-150" />
            </motion.div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl md:text-2xl font-display font-bold text-white tracking-tighter uppercase leading-none">
                ADMIN<span className="text-sensual-red">FI</span>
              </span>
              <span className="text-[6px] md:text-[7px] uppercase tracking-[0.6em] text-white/20 font-bold">Protocol Dashboard</span>
            </div>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-5 md:px-6 py-3.5 md:py-5 rounded-xl md:rounded-[1.25rem] transition-all duration-500 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-sensual-red text-white shadow-[0_10px_30px_rgba(196,30,58,0.3)]' 
                    : 'text-white/30 hover:bg-white/[0.03] hover:text-white border border-transparent hover:border-white/5'
                }`}
              >
                <div className="flex items-center space-x-4 relative z-10">
                  <item.icon size={20} className={`${isActive ? 'text-white' : 'text-white/20 group-hover:text-sensual-red transition-colors'} transition-transform duration-500 group-hover:scale-110`} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]"
                  />
                )}
                {!isActive && (
                  <ChevronRight size={14} className="text-white/5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 md:p-8 border-t border-white/5">
        <Link 
          to="/" 
          className="flex items-center space-x-4 px-5 md:px-6 py-3.5 md:py-5 rounded-xl md:rounded-2xl text-white/30 hover:bg-rose-500/5 hover:text-rose-500 transition-all group border border-transparent hover:border-rose-500/10"
        >
          <LogOut size={18} md:size={20} className="text-white/20 group-hover:text-rose-500 transition-colors" />
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold">Terminate Session</span>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Glass Header - Compact */}
      <div className="lg:hidden fixed top-0 left-0 w-full p-3.5 bg-[#0D0202]/60 backdrop-blur-2xl border-b border-white/5 z-[90] flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-sensual-red/20 bg-black">
            <img src={logoLady} alt="FI" className="w-full h-full object-cover scale-150" />
          </div>
          <span className="text-lg font-display font-bold text-white tracking-tighter uppercase">
            ADMIN<span className="text-sensual-red">FI</span>
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-white/60 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-xl"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 h-screen bg-[#0D0202] border-r border-white/5 flex-col fixed left-0 top-0 z-[100]">
        <SidebarContent />
      </div>

      {/* Mobile Premium Drawer */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-[110]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-[#0D0202] border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <SidebarContent isMobile />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminSidebar
