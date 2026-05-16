import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { API } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const statusConfig = {
  Pending: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    label: 'Awaiting Verification',
    message: 'Your payment is being reviewed. We will confirm your reservation shortly.'
  },
  Confirmed: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    label: 'Reservation Confirmed',
    message: 'Your payment has been verified. Your suite is reserved and ready for your arrival.'
  },
  Cancelled: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    label: 'Reservation Cancelled',
    message: 'This reservation has been cancelled. Contact us if you believe this is an error.'
  },
  Completed: {
    icon: CheckCircle2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
    label: 'Stay Completed',
    message: 'Thank you for your stay at Fantasy Island. We hope to welcome you again.'
  }
}

const BookingCard = ({ booking }) => {
  const s = statusConfig[booking.bookingStatus] || statusConfig.Pending
  const Icon = s.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
    >
      {/* Status Banner */}
      <div className={`flex items-center space-x-3 p-5 border-b border-white/5 ${s.bg}`}>
        <Icon size={20} className={s.color} />
        <div>
          <div className={`font-bold text-sm uppercase tracking-widest ${s.color}`}>{s.label}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{s.message}</div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/30 text-[10px] uppercase tracking-widest">Suite</span>
          <span className="text-sm font-bold">{booking.suiteTitle}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/30 text-[10px] uppercase tracking-widest">Check-in</span>
          <span className="text-sm font-bold">{new Date(booking.checkInDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/30 text-[10px] uppercase tracking-widest">Duration</span>
          <span className="text-sm font-bold">{booking.duration} Night{booking.duration > 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/30 text-[10px] uppercase tracking-widest">Payment</span>
          <span className="text-sm font-bold">{booking.paymentMethod}</span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex justify-between items-center">
          <span className="text-white/30 text-[10px] uppercase tracking-widest">Total</span>
          <span className="text-lg font-bold text-sensual-red">${booking.totalAmount}</span>
        </div>
        <div className="pt-1">
          <span className="text-white/20 text-[9px] font-mono">ID: {booking._id}</span>
        </div>
      </div>
    </motion.div>
  )
}

const ManageBooking = () => {
  const [email, setEmail] = useState('')
  const [searchEmail, setSearchEmail] = useState(null)

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings-by-email', searchEmail],
    queryFn: async () => {
      const res = await fetch(`${API.bookings}/by-email/${encodeURIComponent(searchEmail)}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'No bookings found')
      return data.data
    },
    enabled: !!searchEmail,
    retry: false
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSearchEmail(email.trim().toLowerCase())
  }

  return (
    <div className="bg-obsidian min-h-screen text-white font-sans">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold mb-4">Track Your <span className="text-sensual-red">Booking</span></h1>
          <p className="text-white/40 uppercase tracking-widest text-xs">Enter the email you used when booking</p>
        </motion.div>

        {/* Search Form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={20} />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-sensual-red text-white font-bold uppercase tracking-[0.2em] rounded-2xl red-shadow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Clock size={18} />}
              <span>{isLoading ? 'Searching...' : 'Check Status'}</span>
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4"
            >
              <AlertCircle className="mx-auto text-white/20" size={40} />
              <p className="text-white/40 uppercase tracking-widest text-xs">{error.message}</p>
              <button
                onClick={() => setSearchEmail(null)}
                className="text-sensual-red text-xs uppercase tracking-widest font-bold hover:underline flex items-center space-x-1 mx-auto"
              >
                <ArrowLeft size={12} />
                <span>Try another email</span>
              </button>
            </motion.div>
          )}

          {bookings && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">{bookings.length} booking{bookings.length > 1 ? 's' : ''} found</p>
                <button
                  onClick={() => { setSearchEmail(null); setEmail('') }}
                  className="text-sensual-red text-[10px] uppercase tracking-widest font-bold hover:underline flex items-center space-x-1"
                >
                  <ArrowLeft size={10} />
                  <span>Search again</span>
                </button>
              </div>
              {bookings.map(b => <BookingCard key={b._id} booking={b} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default ManageBooking
