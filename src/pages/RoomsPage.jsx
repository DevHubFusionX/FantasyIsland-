import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Star, Shield, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutDrawer from '../components/CheckoutDrawer'

import regularRoom from '../assets/room-regular.png'
import vipRoom from '../assets/room-vip.png'
import royalRoom from '../assets/room-royal.png'

const RoomCard = ({ title, price, img, features, icon: Icon, delay, onReserve }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="group bg-dark-velvet/20 border border-white/5 rounded-[3rem] overflow-hidden hover:border-sensual-red/30 transition-all duration-500 glass"
  >
    <div className="relative h-80 overflow-hidden">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
      <div className="absolute top-6 right-6 bg-sensual-red text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest red-shadow">
        ${price} / Night
      </div>
    </div>
    
    <div className="p-10">
      <div className="flex items-center space-x-3 mb-4 text-sensual-red">
        <Icon size={20} />
        <span className="uppercase tracking-[0.3em] text-xs font-bold">Exclusive Suite</span>
      </div>
      <h3 className="text-4xl font-display mb-6 text-white group-hover:text-sensual-red transition-colors">{title}</h3>
      
      <ul className="space-y-4 mb-10">
        {features.map((f, i) => (
          <li key={i} className="flex items-center text-white/50 text-sm">
            <CheckCircle2 size={16} className="text-sensual-red mr-3 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={onReserve}
        className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-sensual-red hover:border-sensual-red transition-all duration-300"
      >
        Reserve This Room
      </button>
    </div>
  </motion.div>
)

const RoomsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const handleReserve = (room) => {
    setSelectedRoom(room)
    setIsDrawerOpen(true)
  }

  const rooms = [
    {
      title: "The Velvet Lounge",
      price: "580",
      img: regularRoom,
      icon: Shield,
      delay: 0.1,
      features: ["Four curated sessions", "Private obsidian finishes", "Complimentary signature drink", "Soundproof sanctuary"]
    },
    {
      title: "Crimson VIP Suite",
      price: "1000",
      img: vipRoom,
      icon: Star,
      delay: 0.2,
      features: ["Eight immersive sessions", "Private bar & mixologist", "Premium open selection", "Priority concierge access"]
    },
    {
      title: "Royal Obsidian",
      price: "1500",
      img: royalRoom,
      icon: Flame,
      delay: 0.3,
      features: ["Unlimited session access", "24/7 Personal concierge", "Full premium complimentary bar", "The peak of luxury"]
    }
  ]

  return (
    <main className="bg-obsidian min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-16">
          <Link to="/" className="inline-flex items-center text-white/40 hover:text-sensual-red transition-colors uppercase tracking-widest text-xs font-bold mb-8 group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-2 transition-transform" />
            Back to Island
          </Link>
          <h1 className="text-6xl md:text-8xl font-display mb-6 text-white">Available <span className="text-gradient-red">Suites</span></h1>
          <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
            Each of our rooms is a masterpiece of dark luxury, designed to provide the ultimate private experience for our most distinguished guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room, index) => (
            <RoomCard 
              key={index} 
              {...room} 
              onReserve={() => handleReserve(room)}
            />
          ))}
        </div>
      </div>

      <CheckoutDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        room={selectedRoom} 
      />

      <Footer />
    </main>
  )
}

export default RoomsPage
