import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs text-center"
      >
        <h1 className="text-3xl font-bold text-black mb-2">TransAct</h1>
        <p className="text-gray-400 text-lg mb-10">A million ways to share bills</p>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  )
}


