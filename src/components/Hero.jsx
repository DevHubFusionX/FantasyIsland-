import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, User, Mail, Calendar, CheckCircle, Loader2, ChevronDown } from 'lucide-react'
import { useLocation } from '../hooks/useLocation'
import { API } from '../config/api'

const Hero = () => {
  const { location } = useLocation()
  const navigate = useNavigate()
  const [formState, setFormState] = useState('idle') // idle, submitting, success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    room: 'The Velvet Lounge',
    date: '',
    duration: '1'
  })

  const roomConfig = {
    'The Velvet Lounge': { price: 580, minDays: 1, maxDays: 7 },
    'Crimson VIP Suite': { price: 1000, minDays: 2, maxDays: 14 },
    'Royal Obsidian': { price: 1500, minDays: 3, maxDays: 30 }
  }

  // Auto-adjust duration if room changes and current duration is invalid
  useEffect(() => {
    const config = roomConfig[formData.room]
    const currentDur = parseInt(formData.duration)
    if (currentDur < config.minDays) {
      setFormData(prev => ({ ...prev, duration: config.minDays.toString() }))
    } else if (currentDur > config.maxDays) {
      setFormData(prev => ({ ...prev, duration: config.maxDays.toString() }))
    }
  }, [formData.room])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState('submitting')
    
    try {
      const config = roomConfig[formData.room]
      const duration = parseInt(formData.duration)
      const bookingData = {
        guestName: formData.name,
        email: formData.email,
        phone: 'N/A',
        suiteTitle: formData.room,
        suitePrice: config.price,
        checkInDate: formData.date,
        duration: duration,
        totalAmount: (config.price * duration) + 50,
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'Pending'
      }

      const response = await fetch(API.bookings, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()
      if (data.success) {
        // Redirect to rooms page with pre-filled data to start the booking flow
        navigate('/rooms', { 
          state: { 
            prefill: {
              name: formData.name,
              email: formData.email,
              room: formData.room,
              date: formData.date,
              duration: formData.duration
            } 
          } 
        })
      } else {
        alert('Booking failed: ' + data.message)
        setFormState('idle')
      }
    } catch (error) {
      console.error('Error:', error)
      setFormState('idle')
    }
  }

  const renderDurationOptions = () => {
    const config = roomConfig[formData.room]
    const options = []
    for (let i = config.minDays; i <= config.maxDays; i++) {
      options.push(<option key={i} value={i} className="bg-obsidian">{i} {i === 1 ? 'Day' : 'Days'}</option>)
    }
    return options
  }

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
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-sensual-red rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-sensual-red/20">
                    <CheckCircle className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display text-white mb-2">Booking Sent</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-8">Ref: {formData._id?.slice(-8)}</p>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 text-left space-y-4">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                      <span>Room</span>
                      <span className="text-white font-bold">{formData.room}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                      <span>Stay</span>
                      <span className="text-white font-bold">{formData.duration} {formData.duration === '1' ? 'Day' : 'Days'}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                      <span>Date</span>
                      <span className="text-white font-bold">{formData.date}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setFormState('idle')}
                    className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-[10px] transition-all"
                  >
                    Book Another Room
                  </button>
                </motion.div>
              ) : (
                <div key="form">
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-display text-white mb-2">Book Your <span className="text-sensual-red">Stay</span></h3>
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Check if the room is ready</p>
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
                          value={formData.room}
                          onChange={(e) => setFormData({...formData, room: e.target.value})}
                        >
                          <option value="The Velvet Lounge" className="bg-obsidian">Velvet Lounge</option>
                          <option value="Crimson VIP Suite" className="bg-obsidian">VIP Suite</option>
                          <option value="Royal Obsidian" className="bg-obsidian">Royal Obsidian</option>
                        </select>
                      </div>
                      <div className="relative group">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sensual-red transition-colors" size={14} />
                        <input 
                          required
                          type="date" 
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
                        {renderDurationOptions()}
                      </select>
                    </div>

                    <button 
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="w-full bg-sensual-red/90 hover:bg-sensual-red text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-lg shadow-sensual-red/20 flex items-center justify-center space-x-3 disabled:opacity-50 text-[11px]"
                    >
                      {formState === 'submitting' ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <span>Check Availability</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.4em]">
                      Your Data is Safe
                    </p>
                  </form>
                </div>
              )}
            </AnimatePresence>
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
