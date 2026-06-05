import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '@/components/animations/PageTransition'
import { ArrowLeft, Delete, CreditCard as CreditCardIcon, Building2, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'

type PaymentMethod = 'debit-card' | 'bank-transfer' | 'wallet'

export default function TopUp() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('0')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('debit-card')
  const [currentBalance] = useState(24680.42)

  const quickAmounts = [50, 100, 200, 500]

  const handleNumberClick = (num: string) => {
    if (amount === '0') {
      setAmount(num)
    } else {
      setAmount(amount + num)
    }
  }

  const handleDecimalClick = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.')
    }
  }

  const handleDeleteClick = () => {
    if (amount.length === 1) {
      setAmount('0')
    } else {
      setAmount(amount.slice(0, -1))
    }
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleTopUp = () => {
    // TODO: Implement top up logic
    console.log('Topping up', amount, 'using', selectedMethod)
  }

  const paymentMethods = [
    {
      id: 'debit-card' as PaymentMethod,
      icon: CreditCardIcon,
      label: 'Debit Card',
      detail: '•••• 8492',
    },
    {
      id: 'bank-transfer' as PaymentMethod,
      icon: Building2,
      label: 'Bank Transfer',
      detail: '',
    },
    {
      id: 'wallet' as PaymentMethod,
      icon: Wallet,
      label: 'Wallet Balance',
      detail: '',
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>
        
        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white">Top Up</h1>
        </div>

        {/* Amount Display */}
        <div className="text-center mb-2 mt-8">
          <div className="text-5xl font-bold text-white/90 mb-2">
            ${amount}
          </div>
          <div className="text-sm text-white/50">
            Current balance: ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="px-6 mb-6 flex gap-3 justify-center">
          {quickAmounts.map((value) => (
            <motion.button
              key={value}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAmount(value)}
              className={`px-6 py-2 rounded-2xl font-semibold text-sm transition-all ${
                amount === value.toString()
                  ? 'bg-purple-500 text-white'
                  : 'text-white/80'
              }`}
              style={{
                background: amount === value.toString()
                  ? 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)'
                  : 'rgba(255,255,255,0.08)'
              }}
            >
              ${value}
            </motion.button>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="px-6 mb-6">
          <div className="text-xs text-white/60 mb-3 uppercase">Payment Method</div>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedMethod === method.id
              
              return (
                <motion.button
                  key={method.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(138,0,255,0.2)' }}
                    >
                      <Icon size={18} className="text-purple-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{method.label}</div>
                      {method.detail && (
                        <div className="text-white/60 text-sm">{method.detail}</div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-purple-500' : 'border-white/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Number Pad */}
        <div className="px-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberClick(num.toString())}
                className="py-5 rounded-2xl text-white text-xl font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {num}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDecimalClick}
              className="py-5 rounded-2xl text-white text-xl font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              .
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick('0')}
              className="py-5 rounded-2xl text-white text-xl font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              0
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteClick}
              className="py-5 rounded-2xl text-white flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Delete size={24} />
            </motion.button>
          </div>

          {/* Top Up Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleTopUp}
            disabled={amount === '0'}
            className="w-full py-5 rounded-3xl text-white font-semibold text-lg disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            Top Up ${amount}
          </motion.button>
        </div>

      </div>
    </PageTransition>
  )
}
