import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, User, Phone, Mail, Clock, Save, Trash2, CheckCircle2 } from 'lucide-react'
import { API } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ManageBooking = () => {
  const [bookingId, setBookingId] = useState('')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(`${API.bookings}/${bookingId}`)
      const data = await response.json()
      if (data.success) {
        setBooking(data.data)
      } else {
        setMessage('Booking not found. Please check your ID.')
      }
    } catch (error) {
      console.error('Search error:', error)
      setMessage('Error fetching booking.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const response = await fetch(`${API.bookings}/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      })
      const data = await response.json()
      if (data.success) {
        setBooking(data.data)
        alert('Booking updated successfully!')
      } else {
        alert('Update failed: ' + data.message)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Error updating booking.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      const response = await fetch(`${API.bookings}/${booking._id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        alert('Booking cancelled.')
        setBooking(null)
        setBookingId('')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error cancelling booking.')
    }
  }

  return (
    <div className="bg-obsidian min-h-screen text-white font-sans">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold mb-4">Manage <span className="text-sensual-red">Reservation</span></h1>
          <p className="text-white/40 uppercase tracking-widest text-xs">Access and modify your existing booking details</p>
        </motion.div>

        {!booking ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter Booking ID (e.g. 64abc...)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-lg"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-sensual-red text-white font-bold uppercase tracking-[0.2em] rounded-2xl red-shadow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find Reservation'}
              </button>
              {message && <p className="text-sensual-red text-center text-sm">{message}</p>}
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Booking Summary Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-sensual-red/10 border border-sensual-red/20 rounded-3xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-sensual-red rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Status</div>
                    <div className="font-bold text-sm uppercase tracking-widest">{booking.bookingStatus}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/40 text-xs uppercase tracking-widest">Suite</span>
                    <span className="text-sm font-bold">{booking.suiteTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 text-xs uppercase tracking-widest">Total Paid</span>
                    <span className="text-sm font-bold text-sensual-red">${booking.totalAmount}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleDelete}
                className="w-full py-4 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-white/40 hover:text-red-500 rounded-2xl transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-bold"
              >
                <Trash2 size={16} />
                <span>Cancel Booking</span>
              </button>
            </div>

            {/* Edit Form */}
            <div className="md:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Guest Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 transition-all text-sm"
                          value={booking.guestName}
                          onChange={(e) => setBooking({...booking, guestName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="email" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 transition-all text-sm"
                          value={booking.email}
                          onChange={(e) => setBooking({...booking, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="tel" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 transition-all text-sm"
                          value={booking.phone}
                          onChange={(e) => setBooking({...booking, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="date" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 transition-all text-sm [color-scheme:dark]"
                          value={booking.checkInDate.split('T')[0]}
                          onChange={(e) => setBooking({...booking, checkInDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 ml-2">Duration (Nights)</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="number" 
                          min="1"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 transition-all text-sm"
                          value={booking.duration}
                          onChange={(e) => setBooking({...booking, duration: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-4 bg-white/5 border border-sensual-red/30 hover:bg-sensual-red text-white font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Save size={18} />
                    <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ManageBooking
