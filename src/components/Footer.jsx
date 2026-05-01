import React from 'react'
import { Heart, Camera, Share2, Mail } from 'lucide-react'

const Footer = () => (
  <footer id="contact" className="py-20 px-6 md:px-12 bg-obsidian border-t border-white/5">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
      
      <div className="flex flex-col items-center md:items-start">
        <div className="text-2xl font-display font-bold text-white tracking-tighter mb-4">
          FANTASY<span className="text-sensual-red">ISLAND</span>
        </div>
        <p className="text-white/30 text-sm max-w-xs text-center md:text-left leading-relaxed">
          The world's most exclusive private club experience. 
          Reserved for those who seek the extraordinary.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
        <div>
          <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Explore</h5>
          <ul className="space-y-4 text-white/40 text-sm uppercase tracking-widest text-[10px]">
            <li><a href="#experience" className="hover:text-sensual-red transition-colors">Experience</a></li>
            <li><a href="#tiers" className="hover:text-sensual-red transition-colors">Tiers</a></li>
            <li><a href="#gallery" className="hover:text-sensual-red transition-colors">Gallery</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Connect</h5>
          <ul className="space-y-4 text-white/40 text-sm uppercase tracking-widest text-[10px]">
            <li><a href="#" className="hover:text-sensual-red transition-colors">Gallery</a></li>
            <li><a href="#" className="hover:text-sensual-red transition-colors">Updates</a></li>
            <li><a href="#" className="hover:text-sensual-red transition-colors">Contact</a></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Location</h5>
          <p className="text-white/40 text-sm uppercase tracking-widest text-[10px] leading-loose">
            Private Access Only<br />
            Secret Location, Norway<br />
            fantasy@island.com
          </p>
        </div>
      </div>

    </div>

    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex space-x-6 text-white/40">
        <a href="#" className="hover:text-sensual-red transition-colors"><Camera size={20} /></a>
        <a href="#" className="hover:text-sensual-red transition-colors"><Share2 size={20} /></a>
        <a href="#" className="hover:text-sensual-red transition-colors"><Mail size={20} /></a>
      </div>
      <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] text-center md:text-right">
        &copy; 2026 Fantasy Island &bull; Reserved for Adults 21+ &bull; <Heart className="inline w-3 h-3 text-sensual-red mx-1" />
      </p>
    </div>
  </footer>
)

export default Footer
