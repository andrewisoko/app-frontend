import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export default function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl card-shadow p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}
