import { useRef, useEffect, useCallback } from 'react'

interface Ripple {
  x: number
  y: number
  startTime: number
  // Wave properties
  frequency: number
  amplitude: number
  speed: number
  // Visual properties
  maxRadius: number
  duration: number
}

interface UseWaterRippleOptions {
  /** Maximum number of simultaneous ripples */
  maxRipples?: number
  /** Duration of each ripple in milliseconds */
  rippleDuration?: number
  /** Maximum radius a ripple can expand to (relative to screen diagonal) */
  maxRadiusMultiplier?: number
  /** Base color for ripples (RGB) */
  rippleColor?: [number, number, number]
  /** Enable high-DPI scaling */
  enableHiDPI?: boolean
}

/**
 * Custom hook for creating realistic water ripple effects on a canvas.
 * 
 * Simulates water physics with:
 * - Expanding circular waves
 * - Fading opacity over time
 * - Subtle distortion effects
 * - Multiple simultaneous ripples
 * 
 * @param options Configuration options for the ripple effect
 * @returns Canvas ref to attach to a canvas element
 */
export const useWaterRipple = (options: UseWaterRippleOptions = {}) => {
  const {
    maxRipples = 10,
    rippleDuration = 2000,
    maxRadiusMultiplier = 0.8,
    rippleColor = [255, 255, 255],
    enableHiDPI = true,
  } = options

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const animationFrameRef = useRef<number>()
  const pixelRatioRef = useRef<number>(1)

  /**
   * Initialize canvas with proper dimensions and high-DPI support
   */
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Use window dimensions for full viewport coverage
    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = enableHiDPI ? window.devicePixelRatio || 1 : 1
    pixelRatioRef.current = pixelRatio

    // Set display size (CSS pixels)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Set actual size in memory (scaled for high-DPI)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio

    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Scale all drawing operations by pixel ratio
      ctx.scale(pixelRatio, pixelRatio)
    }
  }, [enableHiDPI])

  /**
   * Create a new ripple at the specified position
   */
  const createRipple = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      // Calculate maximum possible radius (diagonal of viewport)
      const maxRadius =
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * maxRadiusMultiplier

      // Create new ripple with randomized physics for natural variation
      const newRipple: Ripple = {
        x,
        y,
        startTime: Date.now(),
        // Slight randomization for natural effect
        frequency: 0.02 + Math.random() * 0.01,
        amplitude: 5 + Math.random() * 3,
        speed: 200 + Math.random() * 50,
        maxRadius,
        duration: rippleDuration,
      }

      // Add ripple and maintain max limit
      ripplesRef.current.push(newRipple)
      if (ripplesRef.current.length > maxRipples) {
        ripplesRef.current.shift()
      }

      // Start animation if not already running
      if (!animationFrameRef.current) {
        animate()
      }
    },
    [maxRipples, maxRadiusMultiplier, rippleDuration]
  )

  /**
   * Main animation loop - renders all active ripples at 60 FPS
   */
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const now = Date.now()
    
    // Get display dimensions (the canvas has been scaled by pixelRatio internally)
    const displayWidth = canvas.width / pixelRatioRef.current
    const displayHeight = canvas.height / pixelRatioRef.current

    // Clear canvas using display dimensions (context is already scaled)
    ctx.clearRect(0, 0, displayWidth, displayHeight)

    // Filter out expired ripples
    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      const elapsed = now - ripple.startTime
      return elapsed < ripple.duration
    })

    // Draw each active ripple
    ripplesRef.current.forEach((ripple) => {
      const elapsed = now - ripple.startTime
      const progress = elapsed / ripple.duration

      // Calculate current radius based on speed and time
      const currentRadius = ripple.speed * (elapsed / 1000)

      // Don't render if too large
      if (currentRadius > ripple.maxRadius) return

      // Calculate opacity with easing for natural fade
      // Uses exponential decay for realistic water dissipation
      const opacity = Math.pow(1 - progress, 2)

      if (opacity <= 0.01) return

      // Draw ripple with multiple waves for realistic water effect
      drawWaterRipple(ctx, ripple, currentRadius, opacity, rippleColor)
    })

    // Continue animation if ripples exist
    if (ripplesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      animationFrameRef.current = undefined
    }
  }, [rippleColor])

  /**
   * Draw a single water ripple with realistic wave patterns
   */
  const drawWaterRipple = (
    ctx: CanvasRenderingContext2D,
    ripple: Ripple,
    radius: number,
    opacity: number,
    color: [number, number, number]
  ) => {
    const [r, g, b] = color

    // Draw multiple concentric rings for depth
    const rings = 3
    for (let i = 0; i < rings; i++) {
      const ringRadius = radius - i * 15
      if (ringRadius <= 15) continue // Skip if too small for gradient

      // Calculate ring opacity (outer rings fade faster)
      const ringOpacity = opacity * (1 - i * 0.2)

      ctx.save()

      // Create radial gradient for smooth edges
      // Ensure inner radius is never negative
      const innerRadius = Math.max(0, ringRadius - 10)
      const outerRadius = ringRadius + 10
      
      const gradient = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        innerRadius,
        ripple.x,
        ripple.y,
        outerRadius
      )

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
      gradient.addColorStop(
        0.5,
        `rgba(${r}, ${g}, ${b}, ${ringOpacity * 0.6})`
      )
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      // Draw ring
      ctx.strokeStyle = gradient
      ctx.lineWidth = 20 - i * 5
      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Add inner glow for refraction effect
      if (i === 0 && ringRadius > 5) {
        const innerGlowRadius = ringRadius * 0.3
        const innerGradient = ctx.createRadialGradient(
          ripple.x,
          ripple.y,
          0,
          ripple.x,
          ripple.y,
          innerGlowRadius
        )

        innerGradient.addColorStop(
          0,
          `rgba(${r}, ${g}, ${b}, ${ringOpacity * 0.3})`
        )
        innerGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = innerGradient
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, innerGlowRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }
  }

  /**
   * Handle window resize - reinitialize canvas
   */
  useEffect(() => {
    initializeCanvas()

    const handleResize = () => {
      initializeCanvas()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [initializeCanvas])

  /**
   * Cleanup animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    canvasRef,
    createRipple,
  }
}
