import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, CupSoda, DoorClosed, ShieldCheck } from 'lucide-react'

const Experience = () => {
  const features = [
    {
      title: "Four Curated Sessions",
      desc: "Tailored experiences designed to stimulate every sense, from ambient soundscapes to immersive visual journeys.",
      icon: Sparkles
    },
    {
      title: "Private Obsidian Room",
      desc: "Your own soundproof sanctuary finished in dark velvet and obsidian, offering absolute privacy and comfort.",
      icon: DoorClosed
    },
    {
      title: "Complimentary Signature",
      desc: "Begin your night with our master-crafted ruby cocktail, specifically balanced for the Fantasy Island atmosphere.",
      icon: CupSoda
    },
    {
      title: "Facility Protection",
      desc: "A premium environment maintained for the most discerning guests. We prioritize the preservation of our world-class facilities.",
      icon: ShieldCheck
    }
  ]

  return (
    <section id="experience" className="py-32 px-6 md:px-12 bg-dark-velvet/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl border border-white/5 bg-obsidian/40 hover:border-sensual-red/20 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sensual-red/10 flex items-center justify-center text-sensual-red mb-6 group-hover:bg-sensual-red group-hover:text-white transition-all">
                    <f.icon size={28} />
                  </div>
                  <h4 className="text-2xl font-display mb-3 text-white">{f.title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sensual-red uppercase tracking-[0.4em] text-xs font-bold mb-4 block">The Atmosphere</span>
              <h2 className="text-5xl md:text-7xl font-display mb-8 leading-tight">Beyond <br /><span className="text-gradient-red">Expectation</span></h2>
              <p className="text-white/60 text-lg font-light leading-relaxed mb-10">
                At Fantasy Island, every detail is engineered for exclusivity. 
                Our four-session journey is a proprietary experience that transitions 
                through different moods, ensuring your visit remains dynamic and unforgettable.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-obsidian overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Guest" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-white font-bold block">1,200+ Members</span>
                  <span className="text-white/40">Already experienced the island</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Experience
