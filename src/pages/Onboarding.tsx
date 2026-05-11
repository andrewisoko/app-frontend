import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import { ChevronRight, Shield, Zap, Lock, Star } from 'lucide-react'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to TransAct',
    description: 'Your modern financial companion. Manage cards, transactions, and contracts all in one place.',
    icon: <Star className="w-16 h-16 text-primary-500" />,
  },
  {
    id: 2,
    title: 'Secure & Fast',
    description: 'Bank-level security with lightning-fast transactions. Your money is safe with us.',
    icon: <Shield className="w-16 h-16 text-primary-500" />,
  },
  {
    id: 3,
    title: 'Virtual Cards',
    description: 'Create temporary cards for one-time use. Stay protected while shopping online.',
    icon: <Lock className="w-16 h-16 text-primary-500" />,
  },
  {
    id: 4,
    title: 'Ready to Start?',
    description: 'Join thousands of users who trust TransAct for their financial needs.',
    icon: <Zap className="w-16 h-16 text-primary-500" />,
  },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/login')
    }
  }

  const handleSkip = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
              }`}
              animate={{ width: index === currentStep ? 32 : 6 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative h-[400px]">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col items-center text-center text-white"
            >
              <div className="mb-8">{steps[currentStep].icon}</div>
              <h1 className="text-3xl font-bold mb-4">{steps[currentStep].title}</h1>
              <p className="text-lg text-white/90 leading-relaxed">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="mt-12 space-y-4">
          <Button
            variant="secondary"
            size="lg"
            className="w-full bg-white text-primary-600 hover:bg-white/90"
            onClick={handleContinue}
          >
            {currentStep < steps.length - 1 ? (
              <span className="flex items-center justify-center">
                Continue <ChevronRight className="ml-2" size={20} />
              </span>
            ) : (
              'Get Started'
            )}
          </Button>

          {currentStep < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className="w-full text-white/80 hover:text-white transition-colors py-2"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
