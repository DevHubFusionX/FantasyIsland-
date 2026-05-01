import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import RoomsPage from './pages/RoomsPage'
import CustomCursor from './components/CustomCursor'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-obsidian text-white font-sans selection:bg-sensual-red selection:text-white">
          <CustomCursor />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
