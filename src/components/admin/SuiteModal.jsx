import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, DollarSign, List, Camera, Save, Plus, Trash2, Star, Shield, Flame, Clock, Sparkles, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

const SuiteModal = ({ isOpen, onClose, suite, onSave, isSaving }) => {
  const isEdit = !!suite
  const fileInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  // State is initialized directly from props — the parent uses a `key` prop
  // to force a remount when `suite` changes, so initializers always run fresh.
  const [previewImg, setPreviewImg] = useState(suite?.img || null)
  const [galleryPreviews, setGalleryPreviews] = useState(suite?.gallery || [])
  const [existingGalleryUrls, setExistingGalleryUrls] = useState(suite?.gallery || [])
  const [activeTab, setActiveTab] = useState('details')
  
  const [formData, setFormData] = useState({
    title: suite?.title || '',
    price: suite?.price || '',
    features: suite?.features || [],
    icon: suite?.icon || 'Shield',
    img: null,
    gallery: [],
    maxDays: suite?.maxDays || 7
  })
  const [newFeature, setNewFeature] = useState('')

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, img: file })
      setPreviewImg(URL.createObjectURL(file))
      toast.success('Principal image updated')
    }
  }

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // Append new files to existing ones
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }))
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setGalleryPreviews(prev => [...prev, ...newPreviews])
      toast.success(`${files.length} images added to gallery`)
    }
    // Reset the input so the same file can be selected again
    e.target.value = ''
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

    // Send existing gallery URLs that should be kept
    data.append('existingGallery', JSON.stringify(existingGalleryUrls))
    
    onSave(suite?._id, data)
  }

  const icons = [
    { name: 'Shield', icon: Shield },
    { name: 'Star', icon: Star },
    { name: 'Flame', icon: Flame }
  ]

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">
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
          className="relative w-full max-w-5xl bg-[#0D0202] border border-white/5 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
        >
          {/* Left Panel: Visuals & Preview */}
          <div className="w-full md:w-[40%] bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 p-5 md:p-8 flex flex-col shrink-0">
            <div className="mb-4 md:mb-8">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-sensual-red mb-1 md:mb-2 block">Live Preview</span>
              <h4 className="text-xl md:text-3xl font-display font-bold text-white leading-tight">Refine <span className="text-white/20">Aesthetics</span></h4>
            </div>

            <div className="space-y-6">
              <div 
                className="aspect-video rounded-2xl md:rounded-[2rem] bg-black/40 border border-white/5 overflow-hidden relative group cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                {previewImg ? (
                  <img src={previewImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 group-hover:text-sensual-red/40 transition-colors">
                    <Camera size={32} strokeWidth={1} className="mb-2" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">Upload Principal Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
              </div>

              {/* Gallery Mini-Grid */}
              <div className="mt-auto">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Gallery ({galleryPreviews.length})</span>
                    <button onClick={() => galleryInputRef.current.click()} className="text-[9px] uppercase tracking-widest font-bold text-sensual-red hover:text-white transition-colors">Add More</button>
                 </div>
                 <div className="grid grid-cols-4 gap-2">
                   {galleryPreviews.map((preview, i) => (
                     <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 overflow-hidden relative group/gal cursor-pointer">
                       <img src={preview} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/gal:opacity-100 transition-opacity flex items-center justify-center">
                         <Trash2 size={12} className="text-white" onClick={(e) => {
                           e.stopPropagation();
                           const removedPreview = galleryPreviews[i];
                           setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
                           if (existingGalleryUrls.includes(removedPreview)) {
                             setExistingGalleryUrls(prev => prev.filter(url => url !== removedPreview));
                           } else {
                             const existingCount = existingGalleryUrls.filter(url => galleryPreviews.slice(0, i).includes(url)).length;
                             const newFileIndex = i - existingCount;
                             setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== newFileIndex) }));
                           }
                         }} />
                       </div>
                     </div>
                   ))}
                   {galleryPreviews.length < 6 && (
                     <div className="aspect-square rounded-xl bg-white/5 border border-white/5 overflow-hidden relative cursor-pointer" onClick={() => galleryInputRef.current.click()}>
                       <div className="absolute inset-0 flex items-center justify-center text-white/10 hover:text-sensual-red/40">
                         <Plus size={16} />
                       </div>
                     </div>
                   )}
                 </div>
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
              <input type="file" ref={galleryInputRef} multiple hidden onChange={handleGalleryChange} accept="image/*" />
            </div>
          </div>

          {/* Right Panel: Data Entry */}
          <div className="flex-1 p-6 md:p-12 md:max-h-[90vh] md:overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-8 md:mb-12">
              <div>
                <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-1 md:mb-2">{isEdit ? 'Modify' : 'Initialize'} <span className="text-sensual-red">Suite</span></h3>
                <p className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold">System synchronization protocol</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-sensual-red transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="flex space-x-8 md:space-x-12 border-b border-white/5 mb-8 md:mb-10">
              {['details', 'visuals'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${
                    activeTab === tab ? 'text-sensual-red' : 'text-white/20 hover:text-white/40'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sensual-red" />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              {activeTab === 'details' ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-white/30 px-1">Designation</label>
                      <div className="relative group">
                        <Home className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                        <input 
                          type="text" 
                          required
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs text-white placeholder:text-white/10"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Suite Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-white/30 px-1">Valuation (USD)</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                        <input 
                          type="number" 
                          required
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs text-white placeholder:text-white/10"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="Rate per Cycle"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-white/30 px-1">Icon Identification</label>
                    <div className="flex flex-wrap gap-4">
                      {icons.map(icon => (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => setFormData({...formData, icon: icon.name})}
                          className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center ${
                            formData.icon === icon.name 
                              ? 'bg-sensual-red/10 border-sensual-red text-sensual-red shadow-[0_0_20px_rgba(196,30,58,0.2)]' 
                              : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20'
                          }`}
                        >
                          <icon.icon size={20} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-white/30 px-1">Integrated Features</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.features.map((feature, idx) => (
                        <span key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] uppercase tracking-widest font-bold text-white flex items-center group">
                          {feature}
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, features: formData.features.filter((_, i) => i !== idx)})}
                            className="ml-2 text-white/20 group-hover:text-sensual-red transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      <div className="relative flex-1 group">
                        <List className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-sensual-red transition-colors" size={16} />
                        <input 
                          type="text" 
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-sensual-red/30 focus:bg-white/[0.08] transition-all text-xs text-white placeholder:text-white/10"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          placeholder="New Attribute"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={addFeature}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-sensual-red/20 transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center text-center group hover:border-sensual-red/30 transition-all cursor-pointer" onClick={() => galleryInputRef.current.click()}>
                    <ImageIcon size={48} strokeWidth={1} className="text-white/10 mb-6 group-hover:text-sensual-red/40 transition-all group-hover:scale-110" />
                    <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/40 group-hover:text-white/80">Select Multiple Media Files</p>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/10 mt-3 font-light">Hold Ctrl/Cmd to pick more than one</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="aspect-square rounded-2xl border border-white/5 overflow-hidden relative group">
                        <img src={preview} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => {
                              const removedPreview = galleryPreviews[idx];
                              setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
                              if (existingGalleryUrls.includes(removedPreview)) {
                                setExistingGalleryUrls(prev => prev.filter(url => url !== removedPreview));
                              } else {
                                const existingCount = existingGalleryUrls.filter(url => galleryPreviews.slice(0, idx).includes(url)).length;
                                const newFileIndex = idx - existingCount;
                                setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== newFileIndex) }));
                              }
                            }}
                            className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-5 rounded-[2rem] bg-sensual-red text-white font-bold uppercase tracking-[0.3em] flex items-center justify-center space-x-4 shadow-[0_10px_40px_rgba(196,30,58,0.3)] hover:shadow-[0_10px_60px_rgba(196,30,58,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      <span className="text-[10px] md:text-xs">{isEdit ? 'Authorize Record Update' : 'Initialize Suite Creation'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

export default SuiteModal
