import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleContinue = () => {
    setError('')
    if (step === 1 && !email) {
      setError('Please enter your email')
      return
    }
    if (step === 2 && !firstName) {
      setError('Please enter your first name')
      return
    }
    if (step === 3 && !lastName) {
      setError('Please enter your last name')
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setError('')
    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.register({ email, password, firstName, lastName })
      login(response.token, response.user)
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs"
      >
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">TransAct</h1>
          <p className="text-gray-400 text-lg">A million ways to share bills</p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <input
                  type="email"
                  placeholder="name@framer.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleContinue)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                <button
                  onClick={handleContinue}
                  className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors mb-1"
                >
                  <ChevronLeft size={16} />
                  <span className="text-sm">Back</span>
                </button>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleContinue)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                <button
                  onClick={handleContinue}
                  className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            ) : step === 3 ? (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors mb-1"
                >
                  <ChevronLeft size={16} />
                  <span className="text-sm">Back</span>
                </button>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleContinue)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                <button
                  onClick={handleContinue}
                  className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors mb-1"
                >
                  <ChevronLeft size={16} />
                  <span className="text-sm">Back</span>
                </button>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-60"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-black font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
