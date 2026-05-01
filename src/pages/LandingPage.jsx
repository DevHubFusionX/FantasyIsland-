import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Experience from '../components/Experience'
import Tiers from '../components/Tiers'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <main className="bg-obsidian">
      {/* Global Navigation */}
      <Navbar />

      {/* Section 1: The Intro (Hero) */}
      <Hero />

      {/* Section 2: The Core Amenities (Experience) */}
      <Experience />

      {/* Section 3: The Pricing & Booking (Tiers) */}
      <Tiers />

      {/* Global Footer */}
      <Footer />
    </main>
  )
}

export default LandingPage
