import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Flame, CheckCircle2, Loader2, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { API } from '../config/api'

const IconMap = {
  'Regular': Heart,
  'VIP': Star,
  'Membership': Flame,
  'Standard': Shield
}

const TierCard = ({ title, price, features, delay, badge, subtitle, period }) => {
  const navigate = useNavigate()
  const Icon = IconMap[badge] || IconMap[title] || Shield
  const isPopular = badge === 'VIP'

  return (
    <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10, scale: 1.02 }}
    className={`relative p-10 rounded-[2.5rem] glass flex flex-col h-full border ${
      isPopular ? 'border-sensual-red bg-dark-velvet/40' : 'border-white/5 bg-white/[0.02]'
    } transition-all duration-500 group overflow-hidden`}
  >
    {/* Background Glow */}
    <div className="absolute inset-0 bg-sensual-red/0 group-hover:bg-sensual-red/[0.03] transition-colors duration-500 pointer-events-none" />
    {isPopular && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-sensual-red text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest red-shadow">
        {subtitle}
      </div>
    )}
    
    <div className={`mb-8 p-5 rounded-3xl w-fit ${isPopular ? 'bg-sensual-red text-white' : 'bg-white/5 text-sensual-red'} transition-colors duration-500`}>
      <Icon className="w-10 h-10" />
    </div>
    
    <h3 className="text-4xl font-display mb-2 group-hover:text-sensual-red transition-colors">{title}</h3>
    <div className="flex items-baseline mb-8">
      <span className="text-5xl font-bold text-white">${price}</span>
      <span className="text-white/40 ml-2 text-sm uppercase tracking-widest">{period || '/ Reservation'}</span>
    </div>
    
    <ul className="space-y-5 mb-12 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start text-white/70 text-sm leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-sensual-red mr-3 flex-shrink-0 mt-0.5" />
          {feature}
        </li>
      ))}
    </ul>
    
    <button 
      onClick={() => navigate('/rooms')}
      className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 ${
      isPopular 
        ? 'bg-sensual-red text-white hover:bg-white hover:text-sensual-red red-shadow' 
        : 'bg-white/5 hover:bg-sensual-red text-white border border-white/10'
    }`}>
      Select Tier
    </button>
  </motion.div>
)}

const Tiers = () => {
  const { data: tiers, isLoading } = useQuery({
    queryKey: ['tiers'],
    queryFn: async () => {
      const response = await fetch(API.tiers)
      const data = await response.json()
      return data.data
    }
  })

  return (
    <section id="tiers" className="py-32 px-6 md:px-12 bg-obsidian relative">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sensual-red/5 rounded-full blur-[150px] -ml-64 -mb-64" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <h2 className="text-5xl md:text-7xl font-display mb-6">Choose Your <br /><span className="text-gradient-red">Destiny</span></h2>
            <p className="text-white/40 max-w-xl uppercase tracking-widest text-sm leading-loose">
              Every desire has its place. Discover the perfect tier for your night of absolute fantasy.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-sensual-red font-display text-8xl opacity-10">FANTASY</div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-sensual-red animate-spin mb-4" size={48} />
            <p className="text-white/20 uppercase tracking-widest text-xs">Syncing Tiers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {tiers?.map((tier, index) => (
              <TierCard key={tier._id} {...tier} delay={index * 0.1} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Tiers
