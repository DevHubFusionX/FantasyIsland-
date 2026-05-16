import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, XCircle, AlertCircle, Loader2, ArrowLeft, Calendar, Clock, CreditCard, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { API } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const statusConfig = {
  Pending: {
    icon: AlertCircle,
    color: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    dot: 'bg-amber-400',
    label: 'Awaiting Verification',
    message: 'Your payment is being reviewed. We will confirm your reservation shortly.'
  },
  Confirmed: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-400',
    label: 'Reservation Confirmed',
    message: 'Payment verified. Your suite is reserved and ready for your arrival.'
  },
  Cancelled: {
    icon: XCircle,
    color: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    dot: 'bg-red-400',
    label: 'Reservation Cancelled',
    message: 'This reservation has been cancelled. Contact us if you believe this is an error.'
  },
  Completed: {
    icon: CheckCircle2,
    color: 'text-blue-400',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    dot: 'bg-blue-400',
    label: 'Stay Completed',
    message: 'Thank you for your stay at Fantasy Island. We hope to welcome you again.'
  }
}

const BookingCard = ({ booking, index }) => {
  const s = statusConfig[booking.bookingStatus] || statusConfig.Pending
  const Icon = s.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl md:rounded-[2rem] border overflow-hidden ${s.border} bg-white/[0.03]`}
    >
      {/* Status bar */}
      <div className={`${s.bg} px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2`}>
        <div className="flex items-center space-x-2 min-w-0">
          <div className={`w-2 h-2 shrink-0 rounded-full ${s.dot} animate-pulse`} />
          <Icon size={14} className={`${s.color} shrink-0`} />
          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${s.color} truncate`}>{s.label}</span>
        </div>
        <span className="text-[9px] text-white/20 font-mono shrink-0">
          {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Suite name + message */}
      <div className="px-4 md:px-6 pt-5 pb-4 border-b border-white/5">
        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Suite</p>
        <h3 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">{booking.suiteTitle}</h3>
        <p className={`text-[11px] md:text-xs mt-1.5 leading-relaxed ${s.color}`}>{s.message}</p>
      </div>

      {/* Details grid — 2 cols always, tighter on mobile */}
      <div className="grid grid-cols-2 gap-px bg-white/5">
        {[
          { icon: Calendar, label: 'Check-in', value: new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
          { icon: Clock, label: 'Duration', value: `${booking.duration} Night${booking.duration > 1 ? 's' : ''}` },
          { icon: CreditCard, label: 'Payment', value: booking.paymentMethod },
          { label: 'Total', value: `$${booking.totalAmount}`, highlight: true }
        ].map((item, i) => (
          <div key={i} className="bg-[#0D0202] px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center space-x-1.5 mb-1">
              {item.icon && <item.icon size={11} className="text-white/20 shrink-0" />}
              <span className="text-[9px] text-white/30 uppercase tracking-widest">{item.label}</span>
            </div>
            <span className={`text-sm md:text-base font-bold leading-tight block ${item.highlight ? s.color : 'text-white'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between bg-white/[0.02] gap-2">
        <span className="text-[9px] text-white/15 font-mono truncate">REF: {booking._id.slice(-10).toUpperCase()}</span>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shrink-0 ${s.bg} ${s.color}`}>
          {booking.paymentStatus}
        </span>
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

      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-12 md:pb-20 px-5 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[600px] h-[300px] md:h-[400px] bg-sensual-red/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-lg mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sensual-red text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold mb-3 md:mb-4">
              Reservation Portal
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-3 md:mb-4 leading-tight">
              Track Your<br /><span className="text-sensual-red">Reservation</span>
            </h1>
            <p className="text-white/40 text-xs md:text-sm leading-relaxed mb-8 md:mb-10 px-2">
              Enter the email address you used during booking to view your reservation status.
            </p>

            {/* Search form — stacked on mobile, inline on sm+ */}
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sensual-red transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-sensual-red text-white font-bold uppercase tracking-widest rounded-2xl red-shadow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-xs"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                <span>{isLoading ? 'Searching...' : 'Check Status'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-20 px-5 md:px-6">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center py-12 space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={22} className="text-white/20" />
                </div>
                <p className="text-white/50 text-sm font-medium">{error.message}</p>
                <p className="text-white/20 text-[10px] uppercase tracking-widest">No reservations found for this email</p>
                <button
                  onClick={() => { setSearchEmail(null); setEmail('') }}
                  className="pt-2 flex items-center space-x-2 text-sensual-red text-xs uppercase tracking-widest font-bold mx-auto hover:underline"
                >
                  <ArrowLeft size={12} />
                  <span>Try a different email</span>
                </button>
              </motion.div>
            )}

            {bookings && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Results header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-white text-sm font-bold">
                      {bookings.length} Reservation{bookings.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest truncate max-w-[180px] md:max-w-none">
                      {searchEmail}
                    </p>
                  </div>
                  <button
                    onClick={() => { setSearchEmail(null); setEmail('') }}
                    className="flex items-center space-x-1.5 text-white/30 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors"
                  >
                    <ArrowLeft size={11} />
                    <span>Search again</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {bookings.map((b, i) => <BookingCard key={b._id} booking={b} index={i} />)}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ManageBooking
