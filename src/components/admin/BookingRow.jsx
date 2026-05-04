import React from 'react'
import { Trash2, Edit3, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react'

const BookingRow = ({ booking, onStatusUpdate, onDelete, onEdit }) => {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="px-8 py-6">
        <div className="font-bold text-white mb-1">{booking.guestName}</div>
        <div className="text-xs text-white/40">{booking.email}</div>
        <div className="text-[10px] text-sensual-red mt-1 font-mono uppercase tracking-tighter">ID: {booking._id}</div>
      </td>
      <td className="px-8 py-6">
        <div className="text-sm font-bold mb-1">{booking.suiteTitle}</div>
        <div className="text-xs text-white/40">
          {new Date(booking.checkInDate).toLocaleDateString()} &bull; {booking.duration} Night(s)
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="text-sm font-bold text-sensual-red mb-1">${booking.totalAmount}</div>
        <div className="flex items-center space-x-2">
          <select 
            className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-black/40 border border-white/10 outline-none cursor-pointer ${
              booking.paymentStatus === 'Completed' ? 'text-green-500' : 'text-yellow-500'
            }`}
            value={booking.paymentStatus}
            onChange={(e) => onStatusUpdate(booking._id, 'paymentStatus', e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <span className="text-[8px] text-white/20 uppercase tracking-widest">{booking.paymentMethod}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <select 
          className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 outline-none cursor-pointer ${
            booking.bookingStatus === 'Confirmed' ? 'text-blue-500 border-blue-500/30' : 
            booking.bookingStatus === 'Cancelled' ? 'text-red-500 border-red-500/30' : 'text-white/40'
          }`}
          value={booking.bookingStatus}
          onChange={(e) => onStatusUpdate(booking._id, 'bookingStatus', e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Stayed">Stayed</option>
        </select>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end space-x-3">
          <button 
            onClick={() => onEdit(booking)}
            className="p-2 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white rounded-xl transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => onDelete(booking._id)}
            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BookingRow
