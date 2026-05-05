import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Loader2, Plus, Edit3, Trash2, Award, DollarSign, CheckCircle2 } from 'lucide-react'
import TierModal from '../../components/admin/TierModal'
import { API } from '../../config/api'
import apiClient from '../../config/apiClient'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

const AdminTiers = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: tiers, isLoading } = useQuery({
    queryKey: ['tiers'],
    queryFn: async () => {
      const response = await apiClient.get(API.tiers)
      return response.data.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (newTier) => {
      const response = await apiClient.post(API.tiers, newTier)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers'])
      setIsModalOpen(false)
      setSelectedTier(null)
      toast.success('Tier created successfully')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create tier')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await apiClient.patch(`${API.tiers}/${id}`, updates)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers'])
      setIsModalOpen(false)
      setSelectedTier(null)
      toast.success('Tier updated successfully')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update tier')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`${API.tiers}/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers'])
      toast.success('Tier deleted')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete tier')
    }
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tier?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEditOpen = (tier) => {
    setSelectedTier(tier)
    setIsModalOpen(true)
  }

  const handleAddOpen = () => {
    setSelectedTier(null)
    setIsModalOpen(true)
  }

  const handleSave = (id, data) => {
    if (id) {
      updateMutation.mutate({ id, updates: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const filteredTiers = tiers?.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.badge.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pb-10 md:pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6 text-center md:text-left">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-1 md:mb-2 text-white">Tier <span className="text-sensual-red">Management</span></h1>
          <p className="text-white/20 uppercase tracking-[0.4em] text-[8px] md:text-[10px] font-bold">Destiny & Pricing Strategy Control</p>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddOpen}
          className="py-3 px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl bg-sensual-red text-white text-[9px] md:text-[10px] uppercase tracking-widest font-bold shadow-[0_10px_30px_rgba(196,30,58,0.3)] flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <Plus size={14} />
          <span>Add Tier</span>
        </motion.button>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 mb-8 md:mb-12">
        <div className="relative max-w-md">
          <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10" size={16} />
          <input 
            type="text" 
            placeholder="Search tiers..."
            className="w-full bg-black/40 border border-white/5 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-black/60 transition-all text-xs md:text-sm text-white placeholder:text-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="text-sensual-red animate-spin mb-4" size={40} />
          <p className="text-white/10 uppercase tracking-widest text-[10px]">Syncing pricing tiers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredTiers?.map((tier, index) => (
              <motion.div 
                key={tier._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden hover:border-sensual-red/30 transition-all duration-700 p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-sensual-red/10 rounded-2xl text-sensual-red">
                      <Award size={20} />
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditOpen(tier)}
                        className="w-8 h-8 bg-white/5 hover:bg-sensual-red text-white rounded-lg flex items-center justify-center transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tier._id)}
                        className="w-8 h-8 bg-white/5 hover:bg-rose-600 text-white rounded-lg flex items-center justify-center transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-[10px] text-sensual-red font-bold uppercase tracking-[0.3em] mb-1 block">{tier.subtitle}</span>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">{tier.title}</h3>
                    <div className="flex items-end space-x-1">
                      <span className="text-3xl font-bold text-white">${tier.price}</span>
                      <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1.5">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features?.map((f, i) => (
                      <li key={i} className="flex items-center text-[11px] text-white/40 uppercase tracking-widest">
                        <CheckCircle2 size={12} className="text-sensual-red mr-2" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-white/10 uppercase tracking-widest font-bold">Badge Identifier</span>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] text-sensual-red font-bold uppercase tracking-widest border border-sensual-red/20">{tier.badge}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <TierModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tier={selectedTier}
        onSave={handleSave}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

export default AdminTiers
