import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Loader2, Plus, Download, Edit3, Trash2 } from 'lucide-react'
import BookingRow from '../../components/admin/BookingRow'
import BookingModal from '../../components/admin/BookingModal'
import { API } from '../../config/api'
import { getBookings, createBooking, updateBooking, deleteBooking } from '../../services/firebaseService'
import { toast } from 'react-hot-toast'

const AdminBookings = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      return await getBookings()
    }
  })

  const createMutation = useMutation({
    mutationFn: async (newBooking) => {
      const res = await createBooking(newBooking)
      if (!res.success) throw new Error('Create failed')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setIsModalOpen(false)
      setSelectedBooking(null)
      toast.success('Reservation recorded successfully')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to record reservation')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const res = await updateBooking(id, updates)
      if (!res.success) throw new Error('Update failed')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setIsModalOpen(false)
      setSelectedBooking(null)
      toast.success('Reservation updated')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update reservation')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await deleteBooking(id)
      if (!res.success) throw new Error('Delete failed')
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Reservation deleted')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete reservation')
    }
  })

  const handleStatusUpdate = (id, field, value) => {
    updateMutation.mutate({ id, updates: { [field]: value } })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking permanently?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEditOpen = (booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleAddOpen = () => {
    setSelectedBooking(null)
    setIsModalOpen(true)
  }

  const handleSave = (id, data) => {
    if (id) {
      updateMutation.mutate({ id, updates: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleExportCSV = () => {
    if (!bookings?.length) return
    const headers = ['ID', 'Guest Name', 'Email', 'Suite', 'Check-In', 'Duration', 'Total', 'Payment Method', 'Payment Status', 'Booking Status', 'Created At']
    const rows = bookings.map(b => [
      b._id, b.guestName, b.email, b.suiteTitle,
      new Date(b.checkInDate).toLocaleDateString(), b.duration,
      b.totalAmount, b.paymentMethod, b.paymentStatus, b.bookingStatus,
      new Date(b.createdAt).toLocaleDateString()
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredBookings = bookings?.filter(b => 
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b._id.includes(searchTerm)
  ) ?? []

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 text-center md:text-left">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Manage <span className="text-sensual-red">Reservations</span></h1>
          <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold">Comprehensive Control Panel</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button onClick={handleExportCSV} className="flex-1 md:flex-none py-4 px-6 md:px-8 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button 
            onClick={handleAddOpen}
            className="flex-1 md:flex-none py-4 px-6 md:px-8 rounded-2xl bg-sensual-red text-white text-[10px] uppercase tracking-widest font-bold red-shadow hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Manual</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 mb-8">
        <div className="relative max-w-md mx-auto md:mx-0">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search Guest, Email or ID..."
            className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-sensual-red/30 transition-all text-sm text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="text-sensual-red animate-spin mb-4" size={48} />
          <p className="text-white/20 uppercase tracking-widest text-xs">Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-500/5 border border-red-500/10 rounded-3xl">
          <p className="text-red-500 text-xs uppercase tracking-widest font-bold">System Connection Error</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white/5 border border-white/5 rounded-3xl md:rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                    <th className="px-8 py-6">Guest Identity</th>
                    <th className="px-8 py-6">Suite & Period</th>
                    <th className="px-8 py-6">Payment Details</th>
                    <th className="px-8 py-6">Current Status</th>
                    <th className="px-8 py-6 text-right">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <BookingRow 
                      key={booking._id} 
                      booking={booking} 
                      onStatusUpdate={handleStatusUpdate}
                      onDelete={handleDelete}
                      onEdit={handleEditOpen}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Grid/Card View */}
          <div className="lg:hidden space-y-4">
            {filteredBookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4 relative overflow-hidden group shadow-lg"
              >
                {/* Visual Accent top bar for premium touch */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sensual-red/40 via-transparent to-sensual-red/40" />

                {/* Card Header: Guest Identity */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-base mb-0.5">{booking.guestName}</div>
                    <div className="text-xs text-white/40">{booking.email}</div>
                    <div className="text-[9px] text-sensual-red mt-1 font-mono uppercase tracking-tighter">ID: {booking._id}</div>
                  </div>
                </div>

                {/* Suite & Stay Period */}
                <div className="p-4 bg-black/20 rounded-2xl border border-white/5 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/80">{booking.suiteTitle}</div>
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Check-in: <strong className="text-white font-mono">{new Date(booking.checkInDate).toLocaleDateString()}</strong></span>
                    <span>Duration: <strong className="text-white">{booking.duration} Night(s)</strong></span>
                  </div>
                </div>

                {/* Financial and Status Details */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Total Stay Cost</div>
                    <div className="text-base font-bold text-sensual-red">${booking.totalAmount}</div>
                    <div className="text-[9px] text-white/20 uppercase tracking-widest">{booking.paymentMethod}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Payment Status</div>
                    <select 
                      className={`w-full text-[9px] uppercase tracking-widest font-bold px-2 py-1.5 rounded-xl bg-black/40 border border-white/10 outline-none cursor-pointer ${
                        booking.paymentStatus === 'Completed' ? 'text-green-500' : 'text-yellow-500'
                      }`}
                      value={booking.paymentStatus}
                      onChange={(e) => handleStatusUpdate(booking._id, 'paymentStatus', e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Booking Status Dropdown and Card Actions */}
                <div className="border-t border-white/5 pt-4 flex justify-between items-center gap-4">
                  <div className="flex-grow">
                    <select 
                      className={`w-full text-[9px] uppercase tracking-widest font-bold px-3 py-2 rounded-full bg-white/5 border border-white/10 outline-none cursor-pointer text-center ${
                        booking.bookingStatus === 'Confirmed' ? 'text-blue-500 border-blue-500/30' : 
                        booking.bookingStatus === 'Cancelled' ? 'text-red-500 border-red-500/30' : 'text-white/40'
                      }`}
                      value={booking.bookingStatus}
                      onChange={(e) => handleStatusUpdate(booking._id, 'bookingStatus', e.target.value)}
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button 
                      onClick={() => handleEditOpen(booking)}
                      className="p-2.5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white rounded-xl transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(booking._id)}
                      className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-20 text-white/10 uppercase tracking-widest text-[10px] font-bold">
              No matching records found in database
            </div>
          )}
        </div>
      )}

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        onSave={handleSave}
        isSaving={updateMutation.isPending || createMutation.isPending}
      />
    </div>
  )
}

export default AdminBookings
