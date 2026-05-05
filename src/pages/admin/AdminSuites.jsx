import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Loader2, Plus, Edit3, Trash2, Home, DollarSign, Star, Shield, Flame, MoreVertical } from 'lucide-react'
import SuiteModal from '../../components/admin/SuiteModal'
import { API } from '../../config/api'
import apiClient from '../../config/apiClient'
import { motion, AnimatePresence } from 'framer-motion'

const IconMap = { Shield, Star, Flame }

const AdminSuites = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSuite, setSelectedSuite] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: suites, isLoading, error } = useQuery({
    queryKey: ['suites'],
    queryFn: async () => {
      const response = await apiClient.get(API.suites)
      return response.data.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (newSuite) => {
      const response = await apiClient.post(API.suites, newSuite)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['suites'])
      setIsModalOpen(false)
      setSelectedSuite(null)
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await apiClient.patch(`${API.suites}/${id}`, updates)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['suites'])
      setIsModalOpen(false)
      setSelectedSuite(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`${API.suites}/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['suites'])
    }
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this suite? This will affect existing bookings.')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEditOpen = (suite) => {
    setSelectedSuite(suite)
    setIsModalOpen(true)
  }

  const handleAddOpen = () => {
    setSelectedSuite(null)
    setIsModalOpen(true)
  }

  const handleSave = (id, data) => {
    if (id) {
      updateMutation.mutate({ id, updates: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const filteredSuites = suites?.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pb-10 md:pb-20 px-4 md:px-0">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6 text-center md:text-left">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-1 md:mb-2 text-white">Suite <span className="text-sensual-red">Inventory</span></h1>
          <p className="text-white/20 uppercase tracking-[0.4em] text-[8px] md:text-[10px] font-bold">Catalog Synchronization Protocol</p>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddOpen}
          className="py-3 px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl bg-sensual-red text-white text-[9px] md:text-[10px] uppercase tracking-widest font-bold shadow-[0_10px_30px_rgba(196,30,58,0.3)] flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <Plus size={14} />
          <span>New Record</span>
        </motion.button>
      </div>

      {/* Search Module */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 mb-8 md:mb-12">
        <div className="relative max-w-md">
          <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10" size={16} />
          <input 
            type="text" 
            placeholder="Search identifier..."
            className="w-full bg-black/40 border border-white/5 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-black/60 transition-all text-xs md:text-sm text-white placeholder:text-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="text-sensual-red animate-spin mb-4" size={40} />
          <p className="text-white/10 uppercase tracking-widest text-[10px]">Retrieving inventory data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredSuites.map((suite, index) => {
              const Icon = IconMap[suite.icon] || Home
              return (
                <motion.div 
                  key={suite._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden hover:border-sensual-red/30 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  {/* Card Visual */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img src={suite.img} alt={suite.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0202] via-transparent to-transparent opacity-80" />
                    
                    {/* Floating Controls */}
                    <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 md:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={() => handleEditOpen(suite)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-sensual-red text-white rounded-xl flex items-center justify-center transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(suite._id)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-rose-600 text-white rounded-xl flex items-center justify-center transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-5 flex items-center space-x-2">
                      <div className="p-2 bg-sensual-red/20 backdrop-blur-md border border-sensual-red/30 rounded-lg text-sensual-red">
                        <Icon size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{suite.icon} Class</span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1">{suite.title}</h3>
                        <div className="flex items-center text-sensual-red space-x-1">
                          <DollarSign size={14} />
                          <span className="text-lg md:text-xl font-bold">{suite.price}</span>
                          <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold ml-1">/ Night</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {suite.features?.slice(0, 2).map((f, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[8px] md:text-[9px] text-white/30 uppercase font-bold tracking-widest border border-white/5">
                          {f}
                        </span>
                      ))}
                      {suite.features?.length > 2 && (
                        <span className="px-3 py-1 text-[8px] md:text-[9px] text-sensual-red/60 uppercase font-bold tracking-widest flex items-center">
                          <Plus size={8} className="mr-1" />
                          {suite.features.length - 2} Meta
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <SuiteModal 
        key={selectedSuite?._id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        suite={selectedSuite}
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

export default AdminSuites
