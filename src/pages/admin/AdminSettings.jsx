import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, Loader2, CreditCard, Landmark, Bitcoin, ShieldCheck, RefreshCw } from 'lucide-react'
import { API } from '../../config/api'
import apiClient from '../../config/apiClient'
import { toast } from 'react-hot-toast'

const AdminSettings = () => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({})

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await apiClient.get(API.settings)
      return response.data
    }
  })

  useEffect(() => {
    if (settings?.data) {
      setFormData(settings.data)
    }
  }, [settings])

  const mutation = useMutation({
    mutationFn: async (updatedSettings) => {
      const response = await apiClient.post(API.settings, { settings: updatedSettings })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['settings'])
      toast.success('System configurations updated')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings')
    }
  })

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="text-sensual-red animate-spin mb-4" size={48} />
      <p className="text-white/20 uppercase tracking-widest text-xs">Synchronizing System Data...</p>
    </div>
  )

  const sections = [
    {
      title: 'Bank Transfer Details',
      icon: Landmark,
      keys: ['bank_name', 'account_name', 'account_number'],
      description: 'These details will be displayed to guests during the Bank Transfer checkout flow.'
    },
    {
      title: 'Cryptocurrency Configuration',
      icon: Bitcoin,
      keys: ['bitcoin_address'],
      description: 'The destination wallet address for all Bitcoin reservations.'
    },
    {
      title: 'Payment Gateway (PayPal)',
      icon: CreditCard,
      keys: ['paypal_client_id'],
      description: 'Your PayPal REST API Client ID for processing automated payments.'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">System <span className="text-sensual-red">Config</span></h1>
          <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold">Global Application Parameters</p>
        </div>
        <button 
          onClick={() => queryClient.invalidateQueries(['settings'])}
          className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-sensual-red/10 flex items-center justify-center text-sensual-red">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">{section.title}</h3>
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {section.keys.map(key => {
                const setting = settings?.raw?.find(s => s.key === key)
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-2">{setting?.label || key.replace('_', ' ')}</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-sensual-red/30 transition-all text-sm text-white"
                      value={formData[key] || ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <button 
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-6 rounded-2xl bg-sensual-red text-white font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-3 red-shadow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            <span>{mutation.isPending ? 'Propagating Changes...' : 'Save Global Configurations'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
