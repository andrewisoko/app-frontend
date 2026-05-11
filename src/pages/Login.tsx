import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })
      login(response.token, response.user)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TransAct</h1>
          <p className="text-white/80">Sign in to continue</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-3xl p-8 card-shadow"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Forgot password?
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Sign up
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
