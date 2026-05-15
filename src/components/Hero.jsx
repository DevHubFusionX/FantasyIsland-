import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, User, Mail, Calendar, ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from '../hooks/useLocation'
import { API } from '../config/api'

const Hero = () => {
  const { location } = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    room: '',
    date: '',
    duration: '1'
  })

  const { data: suites = [] } = useQuery({
    queryKey: ['suites'],
    queryFn: async () => {
      const res = await fetch(API.suites)
      const data = await res.json()
      return data.data || []
    }
  })

  const selectedSuite = suites.find(s => s.title === formData.room) || suites[0]

  const handleRoomChange = (e) => {
    const suite = suites.find(s => s.title === e.target.value)
    const maxDays = suite?.maxDays || 7
    const currentDur = parseInt(formData.duration)
    setFormData(prev => ({
      ...prev,
      room: e.target.value,
      duration: currentDur > maxDays ? maxDays.toString() : prev.duration
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/rooms', {
      state: {
        prefill: {
          name: formData.name,
          email: formData.email,
          room: formData.room || selectedSuite?.title,
          date: formData.date,
          duration: formData.duration
        }
      }
    })
  }

  const maxDays = selectedSuite?.maxDays || 7
  const roomTitle = formData.room || selectedSuite?.title || ''

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center overflow-hidden bg-obsidian pt-32 pb-20 lg:py-0">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/40 to-obsidian z-10" />
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          src="/woman.jpg" 
          alt="Fantasy Island" 
          className="w-full h-full object-cover object-right grayscale-[10%]"
        />
      </div>

      <div className="relative z-30 max-w-[1500px] mx-auto px-8 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Brand Copy */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-sans font-semibold leading-[1.1] text-white mb-8 tracking-tight">
              Fantasy Island.<br />
              The Best Rooms.
            </h1>

            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-xl">
              Enjoy private rooms and special service. 
              We are here to make your stay perfect.
            </p>

            <div className="flex flex-wrap items-center gap-10">
              <button 
                onClick={() => navigate('/rooms')}
                className="group flex items-center space-x-3 text-sm font-bold text-white uppercase tracking-widest relative pb-2"
              >
                <span>See Our Rooms</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/20 group-hover:bg-sensual-red transition-colors" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Smart Form */}
        <div className="lg:col-span-5 w-full flex justify-center lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full lg:max-w-none glass-premium p-6 md:p-10 rounded-3xl lg:rounded-[2.5rem] border border-white/5 lg:border-white/5 relative overflow-hidden max-h-[85vh] overflow-y-auto custom-scrollbar text-center lg:text-left"
          >
            <div>
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-display text-white mb-2">Book Your <span className="text-sensual-red">Stay</span></h3>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Select a room and check in</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sensual-red transition-colors" size={16} />
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/10 transition-all text-[13px] text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sensual-red transition-colors" size={16} />
                    <input 
                      required
                      type="email" 
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/10 transition-all text-[13px] text-white"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-sensual-red/30 transition-all text-[11px] uppercase text-white/70 appearance-none"
                      value={roomTitle}
                      onChange={handleRoomChange}
                    >
                      {suites.map(s => (
                        <option key={s._id} value={s.title} className="bg-obsidian">{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sensual-red transition-colors" size={14} />
                    <input 
                      required
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/30 transition-all text-[11px] uppercase text-white/70 [color-scheme:dark]"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative">
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-sensual-red/30 transition-all text-[11px] uppercase text-white/70 appearance-none"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    {Array.from({ length: maxDays }, (_, i) => i + 1).map(n => {
                      const unit = selectedSuite?.durationType || 'Night'
                      return (
                        <option key={n} value={n} className="bg-obsidian">{n} {unit}{n > 1 ? 's' : ''}</option>
                      )
                    })}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-sensual-red/90 hover:bg-sensual-red text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-lg shadow-sensual-red/20 flex items-center justify-center space-x-3 text-[11px]"
                >
                  <span>Check Availability</span>
                  <ArrowRight size={16} />
                </button>
                
                <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.4em]">
                  Your Data is Safe
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Details */}
      <div className="absolute bottom-10 left-8 md:left-16 z-30 flex items-center space-x-6 text-[9px] uppercase tracking-[0.5em] text-white/20 font-bold hidden lg:flex">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-sensual-red animate-pulse" />
          <span>Concierge Online</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center space-x-2">
          <MapPin size={10} className="text-sensual-red/50" />
          <span>Available in {location}</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
