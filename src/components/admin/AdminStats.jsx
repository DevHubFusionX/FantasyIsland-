import React from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Users, Calendar, TrendingUp } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all duration-500"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-[60px] opacity-20 transition-all duration-700 group-hover:scale-110 ${color}`} />
    
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors duration-500">
        <Icon size={24} />
      </div>
      <div className="flex items-center space-x-1 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
        <TrendingUp size={12} />
        <span>Live</span>
      </div>
    </div>
    
    <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">{title}</div>
    <div className="text-4xl font-display font-bold text-white tracking-tighter">{value}</div>
  </motion.div>
)

const AdminStats = ({ bookings }) => {
  const totalRevenue = bookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0
  const totalGuests = bookings?.length || 0
  const pendingBookings = bookings?.filter(b => b.bookingStatus === 'Pending').length || 0
  const confirmedBookings = bookings?.filter(b => b.bookingStatus === 'Confirmed').length || 0

  const stats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: CreditCard, color: 'bg-sensual-red', delay: 0.1 },
    { title: 'Reservations', value: totalGuests, icon: Calendar, color: 'bg-blue-500', delay: 0.2 },
    { title: 'Pending Approval', value: pendingBookings, icon: Users, color: 'bg-yellow-500', delay: 0.3 },
    { title: 'Success Rate', value: `${totalGuests > 0 ? Math.round((confirmedBookings / totalGuests) * 100) : 0}%`, icon: TrendingUp, color: 'bg-green-500', delay: 0.4 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}

export default AdminStats
