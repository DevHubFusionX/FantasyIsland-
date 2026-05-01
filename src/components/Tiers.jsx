import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Flame, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TierCard = ({ title, price, features, delay, icon: Icon, isPopular }) => {
  const navigate = useNavigate()
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
        Pure Indulgence
      </div>
    )}
    
    <div className={`mb-8 p-5 rounded-3xl w-fit ${isPopular ? 'bg-sensual-red text-white' : 'bg-white/5 text-sensual-red'} transition-colors duration-500`}>
      <Icon className="w-10 h-10" />
    </div>
    
    <h3 className="text-4xl font-display mb-2 group-hover:text-sensual-red transition-colors">{title}</h3>
    <div className="flex items-baseline mb-8">
      <span className="text-5xl font-bold text-white">${price}</span>
      <span className="text-white/40 ml-2 text-sm uppercase tracking-widest">/ Reservation</span>
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
  const tiers = [
    {
      title: "Regular",
      price: "580",
      icon: Heart,
      features: [
        "Four curated sessions",
        "Elegantly designed private room",
        "Complimentary signature drink",
        "Club facility access",
        "Standard etiquette policy"
      ],
      delay: 0.1
    },
    {
      title: "VIP",
      price: "1000",
      icon: Star,
      isPopular: true,
      features: [
        "Eight immersive sessions",
        "Premium velvet private suite",
        "Premium open bar (Selection)",
        "Priority VIP entrance",
        "Personalized mood lighting"
      ],
      delay: 0.2
    },
    {
      title: "Membership",
      price: "1500",
      icon: Flame,
      features: [
        "Unlimited sessions access",
        "The Royal Obsidian Suite",
        "Full premium complimentary bar",
        "Personal lifestyle concierge",
        "24/7 Priority booking"
      ],
      delay: 0.3
    }
  ]

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tiers.map((tier, index) => (
            <TierCard key={index} {...tier} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tiers
