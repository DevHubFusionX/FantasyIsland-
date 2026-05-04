import React from 'react'
import { Heart, Camera, Share2, Mail, MapPin } from 'lucide-react'
import { useLocation } from '../hooks/useLocation'
import logoLady from '../assets/logo-lady.png'

const Footer = () => {
  const { location } = useLocation()
  return (
  <footer id="contact" className="py-24 px-8 md:px-16 bg-obsidian border-t border-white/5">
    <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-start gap-16 lg:gap-24 text-center lg:text-left">
      
      <div className="flex flex-col items-center lg:items-start">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 group-hover:border-sensual-red/30 transition-all duration-700">
            <img src={logoLady} alt="FI" className="w-full h-full object-cover opacity-90 scale-150" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-display font-bold text-white tracking-[0.1em]">
              FANTASY<span className="text-sensual-red">ISLAND</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.6em] text-white/30 font-medium">Private Sanctuary</span>
          </div>
        </div>
        <p className="text-white/30 text-[11px] uppercase tracking-[0.2em] max-w-xs leading-loose">
          The best private club in the world. 
          Reserved for those who want the best stay.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-24 w-full lg:w-auto">
        <div>
          <h5 className="text-white uppercase tracking-[0.4em] text-[10px] font-bold mb-8">Discover</h5>
          <ul className="space-y-5 text-white/30 text-[10px] uppercase tracking-[0.3em]">
            <li><a href="#experience" className="hover:text-white transition-colors">Experience</a></li>
            <li><a href="/rooms" className="hover:text-white transition-colors">Rooms</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white uppercase tracking-[0.4em] text-[10px] font-bold mb-8">Support</h5>
          <ul className="space-y-5 text-white/30 text-[10px] uppercase tracking-[0.3em]">
            <li><a href="/manage-booking" className="hover:text-white transition-colors">Booking</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Help</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div className="sm:col-span-2 md:col-span-1">
          <h5 className="text-white uppercase tracking-[0.4em] text-[10px] font-bold mb-8">Location</h5>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] leading-loose">
            Private Access Only<br />
            <span className="text-sensual-red/60 flex items-center justify-center lg:justify-start mt-2">
              <MapPin size={10} className="mr-2" /> {location}
            </span>
            <span className="block mt-2">fantasy@island.com</span>
          </p>
        </div>
      </div>

    </div>

    <div className="max-w-[1500px] mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex space-x-8 text-white/20">
        <a href="#" className="hover:text-sensual-red transition-colors"><Camera size={18} /></a>
        <a href="#" className="hover:text-sensual-red transition-colors"><Share2 size={18} /></a>
        <a href="#" className="hover:text-sensual-red transition-colors"><Mail size={18} /></a>
      </div>
      <p className="text-white/10 text-[9px] uppercase tracking-[0.6em] text-center md:text-right">
        &copy; 2026 Fantasy Island &bull; 21+ Only &bull; <Heart className="inline w-3 h-3 text-sensual-red/30 mx-1" />
      </p>
    </div>
  </footer>
  )
}

export default Footer
