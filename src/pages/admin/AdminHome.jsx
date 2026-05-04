import React from 'react'
import { useQuery } from '@tanstack/react-query'
import AdminStats from '../../components/admin/AdminStats'
import { Loader2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { API } from '../../config/api'

const AdminHome = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await fetch(API.bookings)
      const data = await response.json()
      return data.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="text-sensual-red animate-spin mb-4" size={48} />
        <p className="text-white/20 uppercase tracking-widest text-xs">Loading Dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">System <span className="text-sensual-red">Overview</span></h1>
        <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold">Real-time Performance Metrics</p>
      </div>

      <AdminStats bookings={bookings} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h3 className="text-2xl font-display font-bold text-white text-center sm:text-left">Recent Activity</h3>
            <Link to="/admin/bookings" className="text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-sensual-red transition-colors flex items-center">
              View All <ArrowRight size={12} className="ml-2" />
            </Link>
          </div>
          
          <div className="space-y-6">
            {bookings?.slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5 gap-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-10 h-10 rounded-full bg-sensual-red/20 flex items-center justify-center text-sensual-red text-xs font-bold uppercase">
                    {booking.guestName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{booking.guestName}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">{booking.suiteTitle}</div>
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-sm font-bold text-sensual-red">${booking.totalAmount}</div>
                  <div className="text-[9px] text-white/20 uppercase tracking-widest">{new Date(booking.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-sensual-red/5 border border-sensual-red/10 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-sensual-red rounded-full flex items-center justify-center mb-6 red-shadow">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h4 className="text-xl font-display font-bold text-white mb-4">System Healthy</h4>
          <p className="text-white/30 text-[10px] uppercase tracking-widest leading-loose mb-8">
            The reservation engine is operating at peak performance. All API endpoints are responsive.
          </p>
          <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all">
            Run Diagnostics
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
