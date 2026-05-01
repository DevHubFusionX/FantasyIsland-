import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, Clock, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react'

const CheckoutDrawer = ({ isOpen, onClose, room }) => {
  const [step, setStep] = useState(1) // 1: Info, 2: Personal, 3: Stay, 4: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    duration: '1'
  })

  if (!room && step !== 4) return null

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const steps = [
    { title: 'Details', icon: Clock },
    { title: 'Contact', icon: User },
    { title: 'Stay', icon: Calendar }
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
              <div className="flex justify-between items-center mb-12">
                <div className="text-xl font-display font-bold text-white tracking-tighter">
                  RESERVE<span className="text-sensual-red">SUITE</span>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {step < 4 && (
                <>
                  {/* Step Indicator */}
                  <div className="flex items-center justify-between mb-12">
                    {steps.map((s, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                          step >= i + 1 ? 'bg-sensual-red text-white red-shadow' : 'bg-white/5 text-white/20'
                        }`}>
                          <s.icon size={18} />
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${
                          step >= i + 1 ? 'text-white' : 'text-white/20'
                        }`}>{s.title}</span>
                        {i < 2 && (
                          <div className={`absolute top-5 -right-1/2 w-full h-[1px] ${
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
                          <img src={room.img} alt={room.title} className="w-full h-48 object-cover rounded-3xl mb-8 border border-white/10" />
                          <h3 className="text-3xl font-display mb-4">{room.title}</h3>
                          <div className="text-2xl font-bold text-sensual-red mb-6">${room.price} <span className="text-white/20 text-sm font-light uppercase tracking-widest">/ Night</span></div>
                          <p className="text-white/50 text-sm leading-relaxed mb-8">
                            Experience absolute privacy in our most sought-after obsidian finished sanctuary. 
                            Includes all standard luxury amenities and personal concierge support.
                          </p>
                          <div className="space-y-3 mb-10">
                            {room.features.map((f, i) => (
                              <div key={i} className="flex items-center text-white/70 text-xs">
                                <div className="w-1.5 h-1.5 bg-sensual-red rounded-full mr-3" />
                                {f}
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
                                {[1,2,3,4,5,6,7].map(n => (
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
                    <button 
                      onClick={step === 3 ? handleNext : handleNext}
                      className="flex-[2] py-4 rounded-2xl bg-sensual-red text-white font-bold uppercase tracking-widest flex items-center justify-center space-x-2 red-shadow hover:scale-105 transition-all"
                    >
                      <span>{step === 3 ? 'Confirm Booking' : 'Continue'}</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              )}

              {/* Success/Receipt State */}
              {step === 4 && (
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
                    <p className="text-white/40 text-xs uppercase tracking-widest mt-2">ID: FI-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>

                  {/* Receipt Card */}
                  <div className="bg-white text-obsidian p-8 rounded-3xl relative overflow-hidden shadow-2xl">
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
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Service Fee</span>
                        <span className="font-bold">$50</span>
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
                      onClick={() => window.print()}
                      className="w-full py-4 rounded-2xl bg-obsidian border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
                    >
                      <CreditCard size={18} />
                      <span>Download Receipt</span>
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
