import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 200 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', moveCursor)
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-sensual-red rounded-full pointer-events-none z-[9999] mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
    >
      <div className="absolute inset-0 bg-sensual-red rounded-full blur-md opacity-50 animate-pulse" />
    </motion.div>
  )
}

export default CustomCursor
