import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, Clock, CreditCard, ChevronRight, ChevronLeft, CheckCircle2, Landmark, Send, Bitcoin, Copy, ExternalLink, Download, Maximize2 } from 'lucide-react'
import { API } from '../config/api'
import { PayPalButtons } from "@paypal/react-paypal-js"
import logoLady from '../assets/logo-lady.png'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const CheckoutDrawer = ({ isOpen, onClose, room, prefillData }) => {
  const receiptRef = useRef(null)
  const [activeImg, setActiveImg] = useState(0)
  const [step, setStep] = useState(1) // 1: Info, 2: Personal, 3: Stay, 4: Payment, 5: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    duration: '1',
    paymentMethod: 'Bank Transfer'
  })

  // Handle pre-filled data from Hero
  useEffect(() => {
    if (prefillData && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: prefillData.name || prev.name,
        email: prefillData.email || prev.email,
        date: prefillData.date || prev.date,
        duration: prefillData.duration || prev.duration,
      }))
      // If we have name/email/date/duration, jump to step 4 (Payment)
      // but we still need phone, so jump to step 2 (Personal)
      setStep(2)
    }
  }, [prefillData, isOpen])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetch(API.settings)
        .then(res => res.json())
        .then(data => setSettings(data.data))
        .catch(err => console.error('Error fetching settings:', err))
    }
  }, [isOpen])

  const handleNext = () => {
    if (step === 3 && !formData.date) {
      alert('Please select a check-in date.')
      return
    }
    setStep(step + 1)
  }
  const handleBack = () => setStep(step - 1)

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)
    try {
      const bookingData = {
        guestName: formData.name,
        email: formData.email,
        phone: formData.phone,
        suiteTitle: room.title,
        suitePrice: room.price,
        checkInDate: formData.date,
        duration: parseInt(formData.duration),
        totalAmount: (room.price * parseInt(formData.duration)) + 50,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'PayPal' ? 'Completed' : 'Pending'
      }

      const response = await fetch(API.bookings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()
      if (data.success) {
        setBookingResult(data.data)
        setStep(5)
      } else {
        alert('Booking failed: ' + data.message)
      }
    } catch (error) {
      console.error('Error confirming booking:', error)
      alert('An error occurred while confirming your booking.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const [isDownloading, setIsDownloading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState(0) // -1 left, 1 right

  // Early return AFTER all hooks are declared (Rules of Hooks)
  if (!room && step !== 5) return null

  const images = (room?.gallery && room.gallery.length > 0) ? room.gallery : (room?.img ? [room.img] : [])
  const totalImages = images.length

  const goToImage = (index) => {
    if (index === activeImg) return
    setSlideDirection(index > activeImg ? 1 : -1)
    setActiveImg(index)
  }
  const nextImage = () => {
    if (totalImages <= 1) return
    setSlideDirection(1)
    setActiveImg((prev) => (prev + 1) % totalImages)
  }
  const prevImage = () => {
    if (totalImages <= 1) return
    setSlideDirection(-1)
    setActiveImg((prev) => (prev - 1 + totalImages) % totalImages)
  }

  const handleSwipe = (e, info) => {
    const threshold = 50
    if (info.offset.x < -threshold) nextImage()
    else if (info.offset.x > threshold) prevImage()
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 })
  }

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return
    setIsDownloading(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save(`FantasyIsland-Receipt-${bookingResult?._id || 'booking'}.pdf`)
    } catch (err) {
      console.error('PDF Generation Error:', err)
      alert('Failed to generate PDF. Please try printing instead.')
    } finally {
      setIsDownloading(false)
    }
  }

  const steps = [
    { title: 'Details', icon: Clock },
    { title: 'Contact', icon: User },
    { title: 'Stay', icon: Calendar },
    { title: 'Payment', icon: CreditCard }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-lg bg-obsidian border-r border-sensual-red/20 z-[101] overflow-y-auto"
          >
            <div className="p-8 md:p-12 min-h-full flex flex-col">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-sensual-red/20">
                    <img src={logoLady} alt="Fantasy Island Logo" className="w-full h-full object-cover scale-150" />
                  </div>
                  <div className="text-lg md:text-xl font-display font-bold text-white tracking-tighter">
                    RESERVE<span className="text-sensual-red">SUITE</span>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {step < 5 && (
                <>
                  {/* Step Indicator */}
                  <div className="flex items-center justify-between mb-8 md:mb-12">
                    {steps.map((s, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1.5 md:mb-2 transition-all duration-500 ${
                          step >= i + 1 ? 'bg-sensual-red text-white red-shadow' : 'bg-white/5 text-white/20'
                        }`}>
                          <s.icon size={14} md:size={18} />
                        </div>
                        <span className={`text-[8px] md:text-[10px] uppercase tracking-widest font-bold ${
                          step >= i + 1 ? 'text-white' : 'text-white/20'
                        }`}>{s.title}</span>
                        {i < 3 && (
                          <div className={`absolute top-4 md:top-5 -right-1/2 w-full h-[1px] ${
                            step > i + 1 ? 'bg-sensual-red' : 'bg-white/10'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          {/* Image Carousel */}
                          <div className="relative mb-6 md:mb-8 group">
                            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 h-40 md:h-48">
                              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                                <motion.img
                                  key={activeImg}
                                  custom={slideDirection}
                                  variants={slideVariants}
                                  initial="enter"
                                  animate="center"
                                  exit="exit"
                                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                  drag="x"
                                  dragConstraints={{ left: 0, right: 0 }}
                                  dragElastic={0.7}
                                  onDragEnd={handleSwipe}
                                  src={images[activeImg]}
                                  alt={room.title}
                                  className="w-full h-full object-cover absolute inset-0 cursor-grab active:cursor-grabbing"
                                />
                              </AnimatePresence>

                              {/* Expand / Lightbox Button */}
                              <button
                                onClick={() => setLightboxOpen(true)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
                              >
                                <Maximize2 size={14} />
                              </button>

                              {/* Left Arrow */}
                              {totalImages > 1 && (
                                <button
                                  onClick={prevImage}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                              )}

                              {/* Right Arrow */}
                              {totalImages > 1 && (
                                <button
                                  onClick={nextImage}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              )}

                              {/* Image Counter */}
                              {totalImages > 1 && (
                                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 text-[10px] text-white/70 font-bold tracking-wider z-10">
                                  {activeImg + 1}/{totalImages}
                                </div>
                              )}
                            </div>

                            {/* Dot Indicators */}
                            {totalImages > 1 && (
                              <div className="flex justify-center space-x-1.5 mt-3">
                                {images.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => goToImage(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      activeImg === i ? 'bg-sensual-red w-5' : 'bg-white/15 w-1.5 hover:bg-white/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Lightbox Overlay */}
                          <AnimatePresence>
                            {lightboxOpen && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4"
                                onClick={() => setLightboxOpen(false)}
                              >
                                {/* Close Button */}
                                <button
                                  onClick={() => setLightboxOpen(false)}
                                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
                                >
                                  <X size={20} />
                                </button>

                                {/* Lightbox Image */}
                                <div className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                  <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                                    <motion.img
                                      key={`lb-${activeImg}`}
                                      custom={slideDirection}
                                      variants={slideVariants}
                                      initial="enter"
                                      animate="center"
                                      exit="exit"
                                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                      drag="x"
                                      dragConstraints={{ left: 0, right: 0 }}
                                      dragElastic={0.7}
                                      onDragEnd={handleSwipe}
                                      src={images[activeImg]}
                                      alt={room.title}
                                      className="max-w-full max-h-[85vh] object-contain rounded-2xl cursor-grab active:cursor-grabbing"
                                    />
                                  </AnimatePresence>

                                  {/* Lightbox Arrows */}
                                  {totalImages > 1 && (
                                    <>
                                      <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                                      >
                                        <ChevronLeft size={20} />
                                      </button>
                                      <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                                      >
                                        <ChevronRight size={20} />
                                      </button>
                                    </>
                                  )}

                                  {/* Lightbox Counter */}
                                  {totalImages > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-xs text-white/70 font-bold tracking-wider">
                                      {activeImg + 1} / {totalImages}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <h3 className="text-2xl md:text-3xl font-display mb-2 md:mb-4">{room.title}</h3>
                          <div className="text-xl md:text-2xl font-bold text-sensual-red mb-4 md:mb-6">${room.price} <span className="text-white/20 text-[10px] md:text-sm font-light uppercase tracking-widest">/ Night</span></div>
                          <p className="text-white/50 text-[11px] md:text-sm leading-relaxed mb-6 md:mb-8">
                            Experience absolute privacy in our most sought-after obsidian finished sanctuary. 
                            Includes all standard luxury amenities and personal concierge support.
                          </p>
                          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-8 md:mb-10">
                            {room.features.map((f, i) => (
                              <div key={i} className="flex items-center text-white/70 text-[9px] md:text-xs bg-white/5 p-2 rounded-lg border border-white/5">
                                <div className="w-1.5 h-1.5 bg-sensual-red rounded-full mr-2 shrink-0" />
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <h3 className="text-2xl font-display mb-8">Personal Information</h3>
                          <div className="space-y-4">
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                              <input 
                                required
                                type="text" 
                                placeholder="Full Name"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                              />
                            </div>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                              <input 
                                required
                                type="email" 
                                placeholder="Email Address"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                              />
                            </div>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                              <input 
                                required
                                type="tel" 
                                placeholder="Phone Number"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <h3 className="text-2xl font-display mb-8">Stay Details</h3>
                          <div className="space-y-4">
                            <div className="relative group">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                              <input 
                                required
                                type="date" 
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm [color-scheme:dark]"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                              />
                            </div>
                            <div className="relative group">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sensual-red transition-colors" size={18} />
                              <select 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all text-sm appearance-none cursor-pointer"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                              >
                                {Array.from({ length: room.maxDays || 7 }, (_, i) => i + 1).map(n => (
                                  <option key={n} value={n} className="bg-obsidian">{n} Night{n > 1 ? 's' : ''}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="mt-8 p-6 rounded-2xl bg-sensual-red/10 border border-sensual-red/20">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/40 text-xs uppercase tracking-widest">Subtotal</span>
                              <span className="text-white font-bold">${room.price * formData.duration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/40 text-xs uppercase tracking-widest">Service Fee</span>
                              <span className="text-white font-bold">$50</span>
                            </div>
                            <div className="h-px bg-white/10 my-4" />
                            <div className="flex justify-between items-center">
                              <span className="text-white uppercase tracking-widest text-sm font-bold">Total</span>
                              <span className="text-sensual-red text-xl font-bold">${(room.price * formData.duration) + 50}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {step === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <h3 className="text-2xl font-display mb-8">Payment Method</h3>
                          <div className="space-y-4 mb-10">
                            {[
                              { id: 'Bank Transfer', icon: Landmark, desc: 'Direct secure transfer' },
                              { id: 'PayPal', icon: Send, desc: 'Fast digital checkout' },
                              { id: 'Bitcoin', icon: Bitcoin, desc: 'Request for tags' }
                            ].map((m) => (
                              <button
                                key={m.id}
                                onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                                className={`w-full p-6 rounded-2xl border transition-all duration-300 text-left flex items-center group ${
                                  formData.paymentMethod === m.id 
                                    ? 'bg-sensual-red/10 border-sensual-red red-shadow' 
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-6 transition-colors ${
                                  formData.paymentMethod === m.id ? 'bg-sensual-red text-white' : 'bg-white/5 text-white/40'
                                }`}>
                                  <m.icon size={24} />
                                </div>
                                <div>
                                  <div className={`font-bold uppercase tracking-widest text-sm ${
                                    formData.paymentMethod === m.id ? 'text-white' : 'text-white/60'
                                  }`}>{m.id}</div>
                                  <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{m.desc}</div>
                                </div>
                                {formData.paymentMethod === m.id && (
                                  <div className="ml-auto w-2 h-2 rounded-full bg-sensual-red animate-pulse" />
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Payment Specific Content */}
                          <AnimatePresence mode="wait">
                            {formData.paymentMethod === 'PayPal' && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-6 rounded-3xl bg-white/5 border border-white/10"
                              >
                                <PayPalButtons 
                                  style={{ layout: "vertical", color: "blue", shape: "pill", label: "pay" }}
                                  createOrder={(data, actions) => {
                                    return actions.order.create({
                                      purchase_units: [{
                                        amount: { value: ((room.price * formData.duration) + 50).toString() }
                                      }]
                                    });
                                  }}
                                  onApprove={(data, actions) => {
                                    return actions.order.capture().then(() => {
                                      handleConfirmBooking();
                                    });
                                  }}
                                />
                              </motion.div>
                            )}

                            {formData.paymentMethod === 'Bank Transfer' && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Bank Name</span>
                                  <span className="text-sm font-bold">{settings?.bank_name || 'Obsidian Global Bank'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Account Name</span>
                                  <span className="text-sm font-bold">{settings?.account_name || 'Fantasy Island LTD'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                  <div>
                                    <span className="text-[8px] text-white/20 uppercase tracking-widest block">Account Number</span>
                                    <span className="text-sm font-mono tracking-tighter">{settings?.account_number || '0000 0000 0000 0000'}</span>
                                  </div>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(settings?.account_number || '')}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-sensual-red"
                                  >
                                    <Copy size={16} />
                                  </button>
                                </div>
                              </motion.div>
                            )}

                            {formData.paymentMethod === 'Bitcoin' && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-8 rounded-3xl bg-sensual-red/5 border border-sensual-red/20 text-center"
                              >
                                <Bitcoin className="mx-auto text-sensual-red mb-4" size={40} />
                                <h4 className="text-lg font-display mb-2">Crypto Payment</h4>
                                <p className="text-[10px] text-white/40 leading-relaxed mb-6 uppercase tracking-widest">
                                  Please send the total amount to the address below. 
                                  Your booking will be confirmed after 2 confirmations.
                                </p>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between mb-6">
                                  <span className="text-[10px] font-mono text-white/60 truncate mr-4">{settings?.bitcoin_address || 'bc1q...'}</span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(settings?.bitcoin_address || '')}
                                    className="p-2 bg-sensual-red text-white rounded-lg"
                                  >
                                    <Copy size={14} />
                                  </button>
                                </div>
                                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-white/10 transition-all">
                                  <span>Verify Transaction</span>
                                  <ExternalLink size={14} />
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <p className="text-[10px] text-white/20 text-center uppercase tracking-widest mt-8">
                            Absolute confidentiality guaranteed &bull; Secure gateway
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex space-x-4 mt-12">
                    {step > 1 && (
                      <button 
                        onClick={handleBack}
                        className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        Back
                      </button>
                    )}
                    {step !== 4 || formData.paymentMethod !== 'PayPal' ? (
                      <button 
                        onClick={step === 4 ? handleConfirmBooking : handleNext}
                        disabled={isSubmitting}
                        className="flex-[2] py-4 rounded-2xl bg-sensual-red text-white font-bold uppercase tracking-widest flex items-center justify-center space-x-2 red-shadow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{isSubmitting ? 'Processing...' : (step === 4 ? 'Confirm Booking' : 'Continue')}</span>
                        {!isSubmitting && <ChevronRight size={18} />}
                      </button>
                    ) : null}
                  </div>
                </>
              )}

              {/* Success/Receipt State */}
              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-grow flex flex-col h-full"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-sensual-red rounded-full flex items-center justify-center mb-4 mx-auto red-shadow">
                      <CheckCircle2 className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-display">Booking Confirmed</h2>
                    <p className="text-white/40 text-xs uppercase tracking-widest mt-2">ID: {bookingResult?._id || 'FI-TEMP'}</p>
                  </div>

                  {/* Receipt Card */}
                  <div ref={receiptRef} className="bg-white text-obsidian p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                    {/* Decorative Cutouts */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-obsidian rounded-full -translate-y-1/2" />
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-obsidian rounded-full -translate-y-1/2" />
                    <div className="absolute top-1/2 left-6 right-6 border-t border-dashed border-obsidian/10 -translate-y-1/2" />

                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 mb-1">Guest</div>
                        <div className="font-bold text-lg">{formData.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 mb-1">Date</div>
                        <div className="font-bold text-sm">{formData.date}</div>
                      </div>
                    </div>

                    <div className="mb-12">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 mb-2">Reservation Details</div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">{room.title}</span>
                        <span className="font-bold">${room.price} x {formData.duration}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Service Fee</span>
                        <span className="font-bold">$50</span>
                      </div>
                      <div className="flex justify-between items-center text-sensual-red">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Method</span>
                        <span className="font-bold text-xs uppercase tracking-widest">{formData.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="pt-8">
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40">Total Paid</div>
                        <div className="text-3xl font-display font-bold text-sensual-red">${(room.price * formData.duration) + 50}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-4">
                    <button 
                      onClick={handleDownloadReceipt}
                      disabled={isDownloading}
                      className="w-full py-4 rounded-2xl bg-obsidian border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download size={18} />
                      )}
                      <span>{isDownloading ? 'Generating PDF...' : 'Download Receipt'}</span>
                    </button>
                    <button 
                      onClick={onClose}
                      className="w-full py-4 rounded-2xl bg-sensual-red text-white font-bold uppercase tracking-widest red-shadow hover:scale-105 transition-all"
                    >
                      Return to Suites
                    </button>
                  </div>

                  <p className="mt-auto text-center text-white/20 text-[8px] uppercase tracking-[0.5em] pt-8">
                    Fantasy Island Confidential &bull; Digital Signature Verified
                  </p>
                </motion.div>
              )}

              {/* Footer */}
              <div className="mt-auto pt-12 text-center">
                <p className="text-white/10 text-[10px] uppercase tracking-[0.4em]">
                  Fantasy Island &bull; Absolute Confidentiality Guaranteed
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CheckoutDrawer
