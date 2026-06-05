import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { recipientsService, Recipient } from '@/services/recipients'
import PageTransition from '@/components/animations/PageTransition'
import { ArrowLeft, Delete } from 'lucide-react'
import { motion } from 'framer-motion'

// Generate initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Generate a consistent color based on string
const getAvatarColor = (str: string): string => {
  const colors = ['#7C3AED', '#2563EB', '#DB2777', '#059669', '#EA580C', '#DC2626', '#9333EA']
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export default function SendMoney() {
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [amount, setAmount] = useState('0')
  const [note, setNote] = useState('')
  const [availableBalance, setAvailableBalance] = useState(24680.42)

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const data = await recipientsService.getRecipients()
        setRecipients(data)
      } catch (error) {
        console.error('Failed to fetch recipients:', error)
        setRecipients([])
      }
    }

    fetchRecipients()
  }, [])

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

  const handleSend = () => {
    // TODO: Implement send money logic
    console.log('Sending', amount, 'to', selectedRecipient?.name, 'with note:', note)
  }

  return (
    <PageTransition>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>
        
        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white">Send Money</h1>
        </div>

        {/* Recipients */}
        {recipients.length > 0 && (
          <div className="px-6 mb-6">
            <div className="text-xs text-white/60 mb-3 uppercase">To</div>
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
              {recipients.map((recipient) => {
                const initials = recipient.initials || getInitials(recipient.name)
                const bgColor = recipient.avatarColor || getAvatarColor(recipient.name)
                const isSelected = selectedRecipient?.id === recipient.id

                return (
                  <motion.button
                    key={recipient.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRecipient(recipient)}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all ${
                        isSelected ? 'ring-4 ring-purple-500' : ''
                      }`}
                      style={{ background: bgColor }}
                    >
                      {initials}
                    </div>
                    <span className="text-white/80 text-sm">{recipient.name.split(' ')[0]}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Amount Display */}
        <div className="text-center mb-2">
          <div className="text-5xl font-bold text-white/90 mb-2">
            ${amount}
          </div>
          <div className="text-sm text-white/50">
            Available: ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Note Input */}
        <div className="px-6 mb-6">
          <input
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-6 py-4 rounded-3xl text-white placeholder-white/40 outline-none"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
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

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={amount === '0' || !selectedRecipient}
            className="w-full py-5 rounded-3xl text-white font-semibold text-lg disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            Send ${amount}
          </motion.button>
        </div>

      </div>
    </PageTransition>
  )
}
