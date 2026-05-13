import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Welcome() {
  const [videoEnded, setVideoEnded] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setVideoEnded(true)
      // Show title immediately
      setShowTitle(true)
      // Show subtitle after 1.2s delay
      setTimeout(() => {
        setShowSubtitle(true)
      }, 1200)
    }

    video.addEventListener('ended', handleVideoEnd)
    return () => video.removeEventListener('ended', handleVideoEnd)
  }, [])

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showSubtitle || isTransitioning) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Get click position relative to viewport
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsTransitioning(true)

    // Create ripple effect
    createRippleEffect(canvas, x, y, () => {
      // Navigate after ripple completes
      setTimeout(() => {
        navigate('/onboarding')
      }, 300)
    })
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

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ripples = ripples.filter((ripple) => {
        // Expand ripple
        ripple.radius += 8
        ripple.opacity = Math.max(0, 1 - ripple.radius / ripple.maxRadius)

        // Draw ripple with gradient
        if (ripple.opacity > 0) {
          ctx.save()

          // Outer glow
          const gradient = ctx.createRadialGradient(
            ripple.x,
            ripple.y,
            ripple.radius - 30,
            ripple.x,
            ripple.y,
            ripple.radius + 30
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
        animationId = requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden cursor-pointer"
      onClick={handleScreenClick}
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Fullscreen Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/src/assets/Video.mov" type="video/quicktime" />
        <source src="/src/assets/Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

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
            className="absolute inset-0 flex items-center justify-center"
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
          >
            <p className="text-lg md:text-xl text-white/90 text-center px-6">
              Please click anywhere to start
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
