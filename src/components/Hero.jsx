import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, User, Mail, CheckCircle, ChevronDown } from 'lucide-react'
import heroImg from '../assets/hero.png'

const Hero = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState('idle') // idle, submitting, success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tier: 'VIP',
    date: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormState('submitting')
    // Simulate API call
    setTimeout(() => {
      setFormState('success')
    }, 1500)
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden py-20 lg:py-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/60 lg:bg-black/40 z-10" />
        <img 
          src={heroImg} 
          alt="Fantasy Island Background" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-20 pt-10 lg:pt-20">
        
        {/* Left Side: Copy */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sensual-red uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold mb-4 md:mb-6 block">
              Experience Perfection
            </span>
            <h1 className="text-4xl md:text-8xl font-display leading-[0.9] text-white mb-6 md:mb-8">
              UNLEASH YOUR <br />
              <span className="text-gradient-red">FANTASY</span>
            </h1>
            <p className="text-white/70 text-base md:text-xl font-light leading-relaxed mb-8 md:mb-10 max-w-xl">
              Step into a realm where every desire is catered to. 
              Book your private session now and discover the true meaning of exclusivity.
            </p>

            <button 
              onClick={() => navigate('/rooms')}
              className="bg-white/5 border border-white/10 hover:border-sensual-red hover:bg-sensual-red/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all duration-300 flex items-center group mb-8 md:mb-10"
            >
              <span>Explore Available Suites</span>
              <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-white/40 uppercase tracking-widest text-[8px] md:text-[10px]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-sensual-red animate-pulse" />
                <span>Now Accepting Reservations</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <span>Secret Location, Norway</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="lg:col-span-5 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 red-shadow relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-sensual-red rounded-full flex items-center justify-center mb-3 mx-auto red-shadow">
                      <CheckCircle className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-display">Confirmed</h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">ID: FI-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                  </div>

                  {/* Receipt Card */}
                  <div className="bg-white text-obsidian p-6 rounded-2xl relative overflow-hidden mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-obsidian/40">Guest: {formData.name}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-obsidian/40">{formData.date}</div>
                    </div>
                    <div className="border-t border-dashed border-obsidian/10 pt-4 mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{formData.tier} Package</span>
                        <span className="font-bold">${formData.tier === 'Regular' ? '580' : formData.tier === 'VIP' ? '1000' : '1500'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Service Fee</span>
                        <span className="font-bold">$50</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-obsidian/5">
                      <div className="text-[9px] font-bold uppercase tracking-widest">Total Paid</div>
                      <div className="text-xl font-display font-bold text-sensual-red">
                        ${(formData.tier === 'Regular' ? 580 : formData.tier === 'VIP' ? 1000 : 1500) + 50}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setFormState('idle')}
                    className="w-full py-4 rounded-xl bg-sensual-red text-white font-bold uppercase tracking-widest text-xs red-shadow hover:scale-[1.02] transition-all"
                  >
                    Close & Finish
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  <h3 className="text-3xl font-display mb-8">Book Your Stay</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="Full Name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    {/* Email */}
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                      <input 
                        required
                        type="email" 
                        placeholder="Email Address"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Tier Select */}
                      <div className="relative group">
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={18} />
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm appearance-none cursor-pointer"
                          value={formData.tier}
                          onChange={(e) => setFormData({...formData, tier: e.target.value})}
                        >
                          <option value="Regular" className="bg-obsidian">Regular ($580)</option>
                          <option value="VIP" className="bg-obsidian">VIP ($1,000)</option>
                          <option value="Membership" className="bg-obsidian">Membership ($1,500)</option>
                        </select>
                      </div>

                      {/* Date */}
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                        <input 
                          required
                          type="date" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm [color-scheme:dark]"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="w-full bg-sensual-red hover:bg-white hover:text-sensual-red text-white py-5 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 red-shadow flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {formState === 'submitting' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Secure Reservation</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    
                    <p className="text-white/20 text-[10px] text-center uppercase tracking-widest">
                      Secure encrypted transaction &bull; Absolute privacy
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-sensual-red/5 to-transparent pointer-events-none" />
    </section>
  )
}

export default Hero
