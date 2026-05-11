import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  hover?: boolean
  className?: string
}

export default function Card({ children, hover = true, className = '', ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' } : {}}
      className={`bg-white rounded-2xl card-shadow p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
