import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Calendar, Home, CreditCard, Save, Clock, Hash, Smartphone, DollarSign, Fingerprint } from 'lucide-react'

const BookingModal = ({ isOpen, onClose, booking, onSave, isSaving }) => {
  const isEdit = !!booking
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    suiteTitle: '',
    checkInDate: '',
    duration: '1',
    totalAmount: '0',
    bookingStatus: 'Pending',
    paymentStatus: 'Pending'
  })

  useEffect(() => {
    if (booking) {
      setFormData({
        guestName: booking.guestName || '',
        email: booking.email || '',
        phone: booking.phone || '',
        suiteTitle: booking.suiteTitle || '',
        checkInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : '',
        duration: booking.duration || '1',
        totalAmount: booking.totalAmount || '0',
        bookingStatus: booking.bookingStatus || 'Pending',
        paymentStatus: booking.paymentStatus || 'Pending'
      })
    } else {
      setFormData({
        guestName: '',
        email: '',
        phone: '',
        suiteTitle: '',
        checkInDate: new Date().toISOString().split('T')[0],
        duration: '1',
        totalAmount: '0',
        bookingStatus: 'Pending',
        paymentStatus: 'Pending'
      })
    }
  }, [booking, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(booking?._id, formData)
  }

  const statusColors = {
    'Pending': 'text-amber-500 bg-amber-500/10',
    'Confirmed': 'text-emerald-500 bg-emerald-500/10',
    'Cancelled': 'text-rose-500 bg-rose-500/10',
    'Completed': 'text-blue-500 bg-blue-500/10'
  }

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-5xl bg-[#0D0202] border border-white/5 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
        >
          {/* Left Panel: Record Meta */}
          <div className="w-full md:w-1/3 bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 p-5 md:p-8 flex flex-col shrink-0">
            <div className="mb-6 md:mb-12">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-sensual-red mb-1 md:mb-2 block">System Record</span>
              <h4 className="text-xl md:text-3xl font-display font-bold text-white leading-tight">Reservation <span className="text-white/20">Archive</span></h4>
            </div>

            <div className="space-y-6">
              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-black/40 border border-white/5">
                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <Fingerprint size={14} md:size={16} className="text-sensual-red" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/40">Reference ID</span>
                </div>
                <code className="text-[10px] md:text-xs text-white/60 block truncate font-mono">
                  {booking?._id || 'UNASSIGNED_RECORD'}
                </code>
              </div>

              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-black/40 border border-white/5">
                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <Hash size={14} md:size={16} className="text-sensual-red" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/40">Status Logic</span>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <select 
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest outline-none focus:border-sensual-red/30 transition-all ${statusColors[formData.bookingStatus]}`}
                    value={formData.bookingStatus}
                    onChange={(e) => setFormData({...formData, bookingStatus: e.target.value})}
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex items-center space-x-4 text-white/20">
                <div className="h-[1px] flex-1 bg-white/5" />
                <Sparkles size={14} />
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
            </div>
          </div>

          {/* Right Panel: Data Entry */}
          <div className="flex-1 p-6 md:p-12 md:max-h-[90vh] md:overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-8 md:mb-12">
              <div>
                <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-1 md:mb-2">{isEdit ? 'Refine' : 'Manual'} <span className="text-sensual-red">Entry</span></h3>
                <p className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold">Protocol for system synchronization</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-sensual-red transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              {/* Guest Profile */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 px-2">
                  <User size={14} className="text-sensual-red" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Guest Profile</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="relative group">
                    <User className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs md:text-sm text-white placeholder:text-white/10"
                      value={formData.guestName}
                      onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                      placeholder="Legal Name"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs md:text-sm text-white placeholder:text-white/10"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Digital Address"
                    />
                  </div>
                </div>
                <div className="relative group">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={18} />
                  <input 
                    type="tel" 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-sm text-white placeholder:text-white/10"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Communication Line (Optional)"
                  />
                </div>
              </div>

              {/* Stay Configuration */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 px-2">
                  <Home size={14} className="text-sensual-red" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Lounge Allocation</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={18} />
                    <input 
                      type="date" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-sm text-white [color-scheme:dark]"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Home className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-sm text-white placeholder:text-white/10"
                      value={formData.suiteTitle}
                      onChange={(e) => setFormData({...formData, suiteTitle: e.target.value})}
                      placeholder="Suite Name"
                    />
                  </div>
                </div>
              </div>

              {/* Financial & Chronological */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 px-2">
                  <DollarSign size={14} className="text-sensual-red" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Financial Integrity</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={18} />
                    <input 
                      type="number" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-sm text-white"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                      placeholder="Total Transaction"
                    />
                  </div>
                  <div className="relative group">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={18} />
                    <input 
                      type="number" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-sm text-white"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="Nights"
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 md:pt-8">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-sensual-red text-white font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center space-x-3 md:space-x-4 shadow-[0_10px_40px_rgba(196,30,58,0.3)] hover:shadow-[0_10px_60px_rgba(196,30,58,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      <span className="text-[10px] md:text-xs">{isEdit ? 'Authorize Record Update' : 'Initialize Manual Booking'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

export default BookingModal
