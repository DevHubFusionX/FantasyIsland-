import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className="bg-obsidian min-h-screen text-white">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`${isCollapsed ? 'lg:ml-24' : 'lg:ml-80'} min-h-screen relative pt-24 lg:pt-0 transition-all duration-500 ease-in-out`}>
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
