import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Plus, Trash2, Award, DollarSign, List, Tag } from 'lucide-react'

const TierModal = ({ isOpen, onClose, tier, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price: '',
    period: '/ Reservation',
    features: [''],
    badge: '',
    order: 0
  })

  useEffect(() => {
    if (tier) {
      setFormData({
        title: tier.title || '',
        subtitle: tier.subtitle || '',
        price: tier.price || '',
        period: tier.period || '/ Reservation',
        features: tier.features?.length > 0 ? [...tier.features] : [''],
        badge: tier.badge || '',
        order: tier.order || 0
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        price: '',
        period: '/ Reservation',
        features: [''],
        badge: '',
        order: 0
      })
    }
  }, [tier, isOpen])

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const handleRemoveFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] })
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanFeatures = formData.features.filter(f => f.trim() !== '')
    onSave(tier?._id, { ...formData, features: cleanFeatures })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0D0202] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-1">
                {tier ? 'Configure' : 'Design'} <span className="text-sensual-red">Tier</span>
              </h2>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Pricing Architecture Module</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-bold flex items-center">
                  <Tag size={10} className="mr-2" /> Display Title
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Regular"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-sensual-red/40 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-bold flex items-center">
                  <Award size={10} className="mr-2" /> Subtitle
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. FANTASY"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-sensual-red/40 transition-all"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-bold flex items-center">
                  <DollarSign size={10} className="mr-2" /> Price
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-sensual-red/40 transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-bold flex items-center">
                   Identifier Badge
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Regular, VIP"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-sensual-red/40 transition-all"
                  value={formData.badge}
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-white/30 ml-4 font-bold flex items-center">
                <List size={10} className="mr-2" /> Inclusion Features
              </label>
              <div className="space-y-3">
                <AnimatePresence>
                  {formData.features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex space-x-2"
                    >
                      <input 
                        type="text" 
                        placeholder="Feature description..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white text-xs outline-none focus:border-sensual-red/40 transition-all"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-rose-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button 
                type="button"
                onClick={handleAddFeature}
                className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[9px] uppercase tracking-widest font-bold text-white/20 hover:text-white hover:border-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <Plus size={12} />
                <span>Add Inclusion</span>
              </button>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 py-5 bg-sensual-red text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl flex items-center justify-center space-x-3 shadow-lg shadow-sensual-red/20 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? 'Synchronizing...' : (tier ? 'Update Architecture' : 'Commit Tier')}</span>
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="px-10 py-5 bg-white/5 text-white/40 font-bold uppercase tracking-widest text-[11px] rounded-2xl hover:bg-white/10 transition-all"
              >
                Abort
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default TierModal
