
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { userService } from '@/services/user'
import { useAuth } from '@/hooks/useAuth'

export default function UpdateDefault() {

const {user,userProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [ mobileNumber, setmobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {

  if(!userProfile) return;
  })
  
  const handleContinue = () => {
    setError('')
    if (step === 1 && !email) {
      setError('Please enter your email')
      return
    }
    if (step === 2 && !name) {
      setError('Please enter your first name')
      console.log(step)
      return
    }
    if (step === 3 && !surname) {
      setError('Please enter your last name')
      return
    }
    if (step === 4 && !mobileNumber){
      setError('Please enter your mobile number')
    }
    if (step === 5 && !password){
      setError('Please set password')
    }
    setStep(step + 1)
  }

  

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setError('')
    if (!confirmPassword || confirmPassword !== password) {
      setError('incorrect password')
      return
    }

    setIsLoading(true)
        if(!userProfile) return
    try {
      await userService.updateProfile(userProfile.id,{ name, surname, mobileNumber, email, password, confirmPassword })
       navigate("/")
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">Update Profile</h1>
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
                  placeholder="name@Transact.com"
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
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
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
            ) : step === 4 ? (
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
                  type="text"
                  placeholder="Mobile number"
                  value={mobileNumber}
                  onChange={(e) => setmobileNumber(e.target.value)}
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

            ): step === 5 ? (
              <motion.div
                key="step5"
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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            ):(
              <motion.div
                key="step6"
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
                  type="password2"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
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
      </motion.div>
      <div className="mt-12 text-center text-xs text-neutral-400 select-none">
        <p>© 2026 TransAct Inc. Authorised and Regulated by the Financial Conduct Authority (FCA).</p>
      </div>
    </div>
  )
}

