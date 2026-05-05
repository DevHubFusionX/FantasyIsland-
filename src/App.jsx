import React, { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import RoomsPage from './pages/RoomsPage'
import ManageBooking from './pages/ManageBooking'
import AdminLogin from './pages/AdminLogin'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy-load admin routes — guests never download admin code
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminHome = lazy(() => import('./pages/admin/AdminHome'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminSuites = lazy(() => import('./pages/admin/AdminSuites'))
const AdminTiers = lazy(() => import('./pages/admin/AdminTiers'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

const AdminFallback = () => (
  <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center">
    <div className="w-8 h-8 border-2 border-sensual-red border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-white/20 uppercase tracking-[0.3em] text-[10px] font-bold">Loading Admin Panel...</p>
  </div>
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes before refetch
      gcTime: 1000 * 60 * 10,   // 10 minutes cache lifetime
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "test" }}>
      <QueryClientProvider client={queryClient}>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0D0202',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '16px 24px'
            },
            success: {
              iconTheme: {
                primary: '#C41E3A',
                secondary: '#fff',
              },
            },
          }}
        />
        <AuthProvider>
          <Router>
          <div className="min-h-screen bg-obsidian text-white font-sans selection:bg-sensual-red selection:text-white">

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/manage-booking" element={<ManageBooking />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Suspense fallback={<AdminFallback />}>
                    <AdminLayout />
                  </Suspense>
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="bookings" replace />} />
                <Route path="bookings" element={
                  <Suspense fallback={<AdminFallback />}><AdminBookings /></Suspense>
                } />
                <Route path="suites" element={
                  <Suspense fallback={<AdminFallback />}><AdminSuites /></Suspense>
                } />
                <Route path="tiers" element={
                  <Suspense fallback={<AdminFallback />}><AdminTiers /></Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
        </AuthProvider>
      </QueryClientProvider>
    </PayPalScriptProvider>
  )
}

export default App
