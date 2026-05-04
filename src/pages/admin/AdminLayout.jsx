import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="bg-obsidian min-h-screen text-white">
      <AdminSidebar />
      <main className="lg:ml-72 min-h-screen relative pt-24 lg:pt-0">
        {/* Subtle background glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-sensual-red/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        
        <div className="p-6 md:p-12 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
