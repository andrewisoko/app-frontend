import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWaterRipple } from '../hooks/useWaterRipple'

const welcomeCard = '/src/assets/WelcomeCard.jpg.png'

export default function Welcome() {
  const [showImage, setShowImage] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  // Water ripple effect hook
  const { canvasRef: waterRippleCanvasRef, createRipple } = useWaterRipple({
    maxRipples: 15,
    rippleDuration: 2500,
    maxRadiusMultiplier: 0.7,
    rippleColor: [200, 215, 235], // Soft silver-white, blends naturally with background
    enableHiDPI: true,
  })

  useEffect(() => {
    // Trigger image entrance shortly after mount
    const t1 = setTimeout(() => setShowImage(true), 200)
    const t2 = setTimeout(() => setShowTitle(true), 900)
    const t3 = setTimeout(() => setShowSubtitle(true), 2100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  /**
   * Handle interactive water ripple effect
   * Creates ripples on every click/tap for visual feedback
   */
  const handleInteraction = (clientX: number, clientY: number) => {
    createRipple(clientX, clientY)
  }

  /**
   * Handle mouse click - creates water ripple and navigates
   */
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Always create water ripple
    handleInteraction(e.clientX, e.clientY)

    // Only navigate once the image has appeared and we're not already transitioning.
    // Using showImage (200ms) rather than showSubtitle (2100ms) so a first click
    // is never silently ignored when the user taps before the subtitle animates in.
    if (!showImage || isTransitioning) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Get click position relative to viewport
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsTransitioning(true)

    // Create navigation ripple effect
    createRippleEffect(canvas, x, y, () => {
      // Navigate after ripple completes
      setTimeout(() => {
        navigate('/onboarding')
      }, 300)
    })
  }

  /**
   * Handle touch events - creates water ripple on touch
   * Supports multi-touch for simultaneous ripples
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Create ripple for each touch point
    Array.from(e.touches).forEach((touch) => {
      handleInteraction(touch.clientX, touch.clientY)
    })

    // Trigger navigation only on single touch when ready
    if (showImage && !isTransitioning && e.touches.length === 1) {
      const canvas = canvasRef.current
      if (!canvas) return

      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setIsTransitioning(true)

      // Create navigation ripple effect
      createRippleEffect(canvas, x, y, () => {
        setTimeout(() => {
          navigate('/onboarding')
        }, 300)
      })
    }
  }

  const createRippleEffect = (
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    onComplete: () => void
  ) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to viewport
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let ripples: Array<{
      x: number
      y: number
      radius: number
      opacity: number
      maxRadius: number
    }> = []

    // Create multiple concentric ripples for water effect
    const numRipples = 3
    const rippleDelay = 100

    for (let i = 0; i < numRipples; i++) {
      setTimeout(() => {
        ripples.push({
          x,
          y,
          radius: 0,
          opacity: 1,
          maxRadius: Math.max(window.innerWidth, window.innerHeight) * 1.5,
        })
      }, i * rippleDelay)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ripples = ripples.filter((ripple) => {
        // Expand ripple
        ripple.radius += 8
        ripple.opacity = Math.max(0, 1 - ripple.radius / ripple.maxRadius)

        // Draw ripple with gradient
        if (ripple.opacity > 0) {
          ctx.save()

          // Outer glow - ensure radii are never negative
          const innerRadius = Math.max(0, ripple.radius - 30)
          const outerRadius = ripple.radius + 30
          
          const gradient = ctx.createRadialGradient(
            ripple.x,
            ripple.y,
            innerRadius,
            ripple.x,
            ripple.y,
            outerRadius
          )
          gradient.addColorStop(0, `rgba(255, 255, 255, 0)`)
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${ripple.opacity * 0.3})`)
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 60
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.stroke()

          ctx.restore()
        }

        return ripple.opacity > 0 && ripple.radius < ripple.maxRadius
      })

      if (ripples.length > 0) {
        requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden cursor-pointer"
      onClick={handleScreenClick}
      onTouchStart={handleTouchStart}
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Fullscreen Background Image with entrance animation */}
      <AnimatePresence>
        {showImage && (
          <motion.img
            src={welcomeCard}
            alt="Transact Card"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </AnimatePresence>

      {/* Optional Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Water Ripple Canvas - Interactive layer */}
      <canvas
        ref={waterRippleCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen', zIndex: 10 }}
      />

      {/* Animated Text Content */}
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1], // Cinematic easeOut
            }}
            className="absolute inset-0 flex items-start justify-center pt-10"
            style={{ zIndex: 20 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white text-center px-6 tracking-tight">
              Welcome to Transact
            </h1>
          </motion.div>
        )}

        {showSubtitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute bottom-20 left-0 right-0 flex justify-center"
            style={{ zIndex: 20 }}
          >
            <p className="text-lg md:text-xl text-white/90 text-center px-6">
              Please click anywhere to start
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Ripple Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen', zIndex: 30 }}
      />

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ zIndex: 40 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

