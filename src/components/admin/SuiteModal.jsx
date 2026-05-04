import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, DollarSign, List, Camera, Save, Plus, Trash2, Star, Shield, Flame, Clock, Sparkles, Image as ImageIcon } from 'lucide-react'

const SuiteModal = ({ isOpen, onClose, suite, onSave, isSaving }) => {
  const isEdit = !!suite
  const fileInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const [previewImg, setPreviewImg] = useState(null)
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [activeTab, setActiveTab] = useState('details') // 'details' or 'visuals'
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    features: [],
    icon: 'Shield',
    img: null,
    gallery: [],
    maxDays: 7
  })
  const [newFeature, setNewFeature] = useState('')

  useEffect(() => {
    if (suite) {
      setFormData({
        title: suite.title || '',
        price: suite.price || '',
        features: suite.features || [],
        icon: suite.icon || 'Shield',
        img: null,
        gallery: [],
        maxDays: suite.maxDays || 7
      })
      setPreviewImg(suite.img)
      setGalleryPreviews(suite.gallery || [])
    } else {
      setFormData({
        title: '',
        price: '',
        features: [],
        icon: 'Shield',
        img: null,
        gallery: [],
        maxDays: 7
      })
      setPreviewImg(null)
      setGalleryPreviews([])
    }
  }, [suite, isOpen])

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, img: file })
      setPreviewImg(URL.createObjectURL(file))
    }
  }

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setFormData({ ...formData, gallery: files })
      const previews = files.map(file => URL.createObjectURL(file))
      setGalleryPreviews(previews)
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('title', formData.title)
    data.append('price', formData.price)
    data.append('icon', formData.icon)
    data.append('maxDays', formData.maxDays)
    data.append('features', JSON.stringify(formData.features))
    
    if (formData.img) {
      data.append('img', formData.img)
    }
    
    if (formData.gallery && formData.gallery.length > 0) {
      formData.gallery.forEach(file => {
        data.append('gallery', file)
      })
    }
    
    onSave(suite?._id, data)
  }

  const icons = [
    { name: 'Shield', icon: Shield },
    { name: 'Star', icon: Star },
    { name: 'Flame', icon: Flame }
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-4xl bg-[#0D0202] border border-white/5 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
        >
          {/* Left Panel: Visuals & Preview */}
          <div className="w-full md:w-[40%] bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 p-5 md:p-8 flex flex-col shrink-0">
            <div className="mb-4 md:mb-8">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-sensual-red mb-1 md:mb-2 block">Live Preview</span>
              <h4 className="text-xl md:text-2xl font-display font-bold text-white">Visual <span className="text-white/20">Identity</span></h4>
            </div>

            {/* Main Image Dropzone */}
            <div 
              className="relative aspect-video md:aspect-[4/5] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 group cursor-pointer bg-black/40 mb-6 md:mb-8"
              onClick={() => fileInputRef.current.click()}
            >
              {previewImg ? (
                <img src={previewImg} alt="Suite" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 group-hover:text-sensual-red transition-colors">
                  <Camera size={40} strokeWidth={1} className="mb-4" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Upload Main Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
                  <Camera size={18} className="text-white/60" />
                </div>
              </div>
            </div>

            {/* Gallery Mini-Grid */}
            <div className="mt-auto">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Gallery ({galleryPreviews.length})</span>
                  <button onClick={() => galleryInputRef.current.click()} className="text-[9px] uppercase tracking-widest font-bold text-sensual-red hover:text-white transition-colors">Add More</button>
               </div>
               <div className="grid grid-cols-4 gap-2">
                 {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 overflow-hidden relative group/gal cursor-pointer">
                     {galleryPreviews[i] ? (
                       <>
                        <img src={galleryPreviews[i]} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/gal:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 size={12} className="text-white" onClick={(e) => {
                            e.stopPropagation();
                            setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
                          }} />
                        </div>
                       </>
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center text-white/10 hover:text-sensual-red/40" onClick={() => galleryInputRef.current.click()}>
                         <Plus size={16} />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </div>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
            <input type="file" ref={galleryInputRef} hidden multiple onChange={handleGalleryChange} accept="image/*" />
          </div>

          {/* Right Panel: Configuration */}
          <div className="flex-1 p-6 md:p-12 md:overflow-y-auto custom-scrollbar bg-black/20">
            <div className="flex justify-between items-start mb-8 md:mb-12">
              <div>
                <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-1 md:mb-2">{isEdit ? 'Refine' : 'New'} <span className="text-sensual-red">Suite</span></h3>
                <p className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold">System Configuration Architecture</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-sensual-red transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
              {/* Essential Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/20 ml-2">Designation</label>
                  <div className="relative group">
                    <Home className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs md:text-sm text-white placeholder:text-white/10"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Imperial Onyx Lounge"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/20 ml-2">Market Value ($)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                    <input 
                      type="number" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs md:text-sm text-white placeholder:text-white/10"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g. 2500"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/20 ml-2">Stay Capacity (Days)</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                    <input 
                      type="number" 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs md:text-sm text-white"
                      value={formData.maxDays}
                      onChange={(e) => setFormData({...formData, maxDays: e.target.value})}
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/20 ml-2">Visual Iconography</label>
                  <div className="flex space-x-2 md:space-x-3">
                    {icons.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({...formData, icon: item.name})}
                        className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border transition-all flex flex-col items-center justify-center space-y-1 md:space-y-2 ${
                          formData.icon === item.name 
                            ? 'bg-sensual-red border-sensual-red text-white shadow-[0_0_20px_rgba(196,30,58,0.4)]' 
                            : 'bg-white/5 border-white/5 text-white/20 hover:border-white/10 hover:text-white/40'
                        }`}
                      >
                        <item.icon size={16} md:size={18} />
                        <span className="text-[7px] md:text-[8px] uppercase tracking-tighter font-bold">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Matrix */}
              <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/20">Feature Matrix</label>
                </div>
                <div className="relative group">
                  <Sparkles className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-12 md:pl-14 pr-14 md:pr-16 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs md:text-sm text-white placeholder:text-white/10"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add luxury amenity..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button 
                    type="button"
                    onClick={addFeature}
                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-sensual-red text-white rounded-lg md:rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                  <AnimatePresence>
                    {formData.features.map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/60 font-bold uppercase tracking-widest hover:border-sensual-red/30 hover:text-white transition-all group"
                      >
                        <span>{feature}</span>
                        <X 
                          size={12} 
                          className="text-white/20 hover:text-sensual-red cursor-pointer" 
                          onClick={() => removeFeature(idx)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 md:pt-8">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-sensual-red text-white font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center space-x-3 md:space-x-4 shadow-[0_10px_40px_rgba(196,30,58,0.3)] hover:shadow-[0_10px_60px_rgba(196,30,58,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      <span className="text-[10px] md:text-xs">{isEdit ? 'Authorize Record Update' : 'Initialize New Suite'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default SuiteModal
