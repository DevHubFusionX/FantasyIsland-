import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Star, Shield, Flame, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { API } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutDrawer from '../components/CheckoutDrawer'

import { API } from '../config/api'

const RoomCard = React.memo(({ title, price, img, features, icon: Icon, delay, onReserve }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="group bg-dark-velvet/20 border border-white/5 rounded-[3rem] overflow-hidden hover:border-sensual-red/30 transition-all duration-500 glass"
  >
    <div className="relative h-64 md:h-80 overflow-hidden">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
      <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-sensual-red text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest red-shadow">
        ${price} / Night
      </div>
    </div>
    
    <div className="p-6 md:p-10">
      <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4 text-sensual-red">
        <Icon size={16} md:size={20} />
        <span className="uppercase tracking-[0.3em] text-[9px] md:text-xs font-bold">Exclusive Suite</span>
      </div>
      <h3 className="text-2xl md:text-4xl font-display mb-4 md:mb-6 text-white group-hover:text-sensual-red transition-colors">{title}</h3>
      
      <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
        {features.map((f, i) => (
          <li key={i} className="flex items-center text-white/50 text-xs md:text-sm">
            <CheckCircle2 size={14} md:size={16} className="text-sensual-red mr-2 md:mr-3 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={onReserve}
        className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-sensual-red hover:border-sensual-red transition-all duration-300 active:scale-95"
      >
        Reserve This Room
      </button>
    </div>
  </motion.div>
))

const iconMap = {
  Shield: Shield,
  Star: Star,
  Flame: Flame
}



const RoomsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [prefilledData, setPrefilledData] = useState(null)
  const location = useLocation()

  const { data: suitesData, isLoading, error } = useQuery({
    queryKey: ['suites'],
    queryFn: async () => {
      const response = await fetch(API.suites)
      const data = await response.json()
      return data.data
    }
  })

  useEffect(() => {
    // Only attempt prefill if data is ready, a prefill exists in state, and we haven't selected a room yet
    if (suitesData && location.state?.prefill && !selectedRoom) {
      const prefill = location.state.prefill
      const roomToSelect = suitesData.find(r => r.title === prefill.room)
      
      if (roomToSelect) {
        // We use a timeout to move these updates to the next tick,
        // preventing the "cascading renders" React warning.
        const timer = setTimeout(() => {
          setSelectedRoom(roomToSelect)
          setPrefilledData(prefill)
          setIsDrawerOpen(true)
        }, 0)
        
        return () => clearTimeout(timer)
      }
    }
  }, [suitesData, location.state, selectedRoom])

  const handleReserve = (room) => {
    setSelectedRoom(room)
    setPrefilledData(null) // Clear prefill if manual selection happens
    setIsDrawerOpen(true)
  }

  return (
    <main className="bg-obsidian min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          <Link to="/" className="inline-flex items-center text-white/40 hover:text-sensual-red transition-colors uppercase tracking-widest text-[10px] font-bold mb-6 md:mb-8 group">
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-2 transition-transform" />
            Back to Island
          </Link>
          <h1 className="text-4xl md:text-8xl font-display mb-4 md:mb-6 text-white">Available <span className="text-gradient-red">Suites</span></h1>
          <p className="text-white/40 max-w-2xl text-base md:text-lg font-light leading-relaxed">
            Each of our rooms is a masterpiece of dark luxury, designed to provide the ultimate private experience for our most distinguished guests.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="text-sensual-red animate-spin mb-4" size={48} />
            <p className="text-white/20 uppercase tracking-[0.5em] text-xs">Loading Suites...</p>
          </div>
        ) : error ? (
          <div className="text-center py-40">
            <p className="text-sensual-red">Error loading suites. Please check if the backend is running.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {suitesData.map((room, index) => (
              <RoomCard 
                key={room._id} 
                {...room} 
                img={room.img}
                icon={iconMap[room.icon] || Shield}
                delay={index * 0.1}
                onReserve={() => handleReserve(room)}
              />
            ))}
          </div>
        )}
      </div>

      <CheckoutDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        room={selectedRoom} 
        prefillData={prefilledData}
      />

      <Footer />
    </main>
  )
}

export default RoomsPage
