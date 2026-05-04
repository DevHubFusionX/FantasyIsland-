import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Loader2, Plus, Download } from 'lucide-react'
import BookingRow from '../../components/admin/BookingRow'
import BookingModal from '../../components/admin/BookingModal'
import { API } from '../../config/api'
import apiClient from '../../config/apiClient'

const AdminBookings = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await apiClient.get(API.bookings)
      return response.data.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (newBooking) => {
      const response = await apiClient.post(API.bookings, newBooking)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      setIsModalOpen(false)
      setSelectedBooking(null)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await apiClient.patch(`${API.bookings}/${id}`, updates)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      setIsModalOpen(false)
      setSelectedBooking(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`${API.bookings}/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
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

  const filteredBookings = bookings?.filter(b => 
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b._id.includes(searchTerm)
  )

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 text-center md:text-left">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Manage <span className="text-sensual-red">Reservations</span></h1>
          <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold">Comprehensive Control Panel</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none py-4 px-6 md:px-8 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
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
        <div className="bg-white/5 border border-white/5 rounded-3xl md:rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0">
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
