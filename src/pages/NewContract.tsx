import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { recipientsService, Recipient } from '@/services/recipients'
import PageTransition from '@/components/animations/PageTransition'
import { ArrowLeft, Send, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { contractsService } from '@/services/contracts'

type ContractType = 'existing-user' | 'new-user' | 'external'
type SplitType = 'amount' | 'percentage'

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

export default function NewContract() {
  const navigate = useNavigate()
  const { user, userProfile } = useAuth()
  const [contractType, setContractType] = useState<ContractType>('existing-user')
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [selectedReceivers, setSelectedReceivers] = useState<Recipient[]>([])
  const [splitType, setSplitType] = useState<SplitType>('percentage')
  const [senderPercentage, setSenderPercentage] = useState('50')
  const [receiverPercentage, setReceiverPercentage] = useState('50')
  const [senderAmount, setSenderAmount] = useState('')
  const [receiverAmount, setReceiverAmount] = useState('')
  const [receiver, setReceiver] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!userProfile) return
      try {
        const data = await recipientsService.getRecipients(userProfile.id?.trim() ?? '')
        setRecipients(data)
      } catch (error) {
        console.error('Failed to fetch recipients:', error)
        setRecipients([])
      }
    }

    fetchRecipients()
  }, [])



  const handleSendContract = async () => {
    // Validate required fields
    if (selectedReceivers.length === 0 && !receiver.trim()) {
      console.error('Please select or add at least one receiver')
      alert('Please select or add at least one receiver')
      return
    }

    if (!startDateTime || !endDateTime) {
      console.error('Please set both start and end dates')
      alert('Please set both start and end dates for the time agreement')
      return
    }

    setIsLoading(true)

    try {
      // Build the time agreement array as ISO strings
      const timeAgreement: string[] = [
        new Date(startDateTime).toISOString(),
        new Date(endDateTime).toISOString()
      ]

      // Extract receiver IDs - include selected receivers and manual input
      const receiverArray = [
        ...selectedReceivers.map((r) => r),
        ...(receiver.trim() ? [receiver.trim()] : [])
      ]

      // Build receiver percentages/amounts arrays for all receivers
      const totalReceivers = receiverArray.length
      const receiverPercentages = Array(totalReceivers).fill(
        splitType === 'percentage' ? parseFloat(receiverPercentage) || [] : []
      )
      const receiverAmounts = Array(totalReceivers).fill(
        splitType === 'amount' ? parseFloat(receiverAmount) || [] : []
      )

      const requestData = {
        sender: userProfile?.user_name || '',
        receiver: [receiver],
        all_usernames:[userProfile?.user_name || '', receiver],
        sender_percentage: splitType === 'percentage' ? parseFloat(senderPercentage) || null : null,
        sender_amount: splitType === 'amount' ? parseFloat(senderAmount) || null : null,
        time_agreement: timeAgreement,
        receiver_percentage: receiverPercentages,
        receiver_amount: receiverAmounts,
        split_agreement: splitType,
      }


      

      await contractsService.sendContract(requestData)
      navigate('/app/contracts')
      alert("Contract sent")
    } catch (error) {
      console.error('Failed to send contract:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }

  const userName = userProfile?.user_name || user?.username || 'User'
  const userInitials = getInitials(userName)

  return (
    <PageTransition>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold text-white">New Contract</h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.2)', color: '#FCD34D' }}>
            PENDING
          </span>
        </div>

        <div className="px-6 space-y-6">
          {/* Contract Type */}
          <div>
            <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Contract Type</div>
            <div className="flex gap-3">
              {[
                { value: 'existing-user' as ContractType, label: 'Existing User' },
                { value: 'new-user' as ContractType, label: 'New User' },
                
              ].map((type) => (
                <motion.button
                  key={type.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setContractType(type.value)}
                  className={`flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2 ${
                    contractType === type.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70'
                  }`}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sender */}
          <div>
            <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Sender</div>
            <div 
              className="flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
                >
                  {userInitials}
                </div>
                <span className="text-white font-medium">{userName}</span>
              </div>
              <span className="text-white/60 text-sm">You</span>
            </div>
          </div>

          {/* Receivers */}
            <div>
                <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">
                  Receivers
                </div>

                {/* Available recipients */}
                {recipients.length > 0 && (
                  <div className="flex gap-3 mb-4 overflow-x-auto pb-1 scrollbar-none">
                    {recipients.map((recipient) => {
                      const initials =
                        recipient.initials || getInitials(recipient.name)

                      const bgColor =
                        recipient.avatarColor || getAvatarColor(recipient.name)

                      const isSelected = selectedReceivers.some(
                        (r) => r.id === recipient.id
                      )

                      return (
                        <motion.button
                          key={recipient.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setReceiver(recipient.name)}
                          className={`flex flex-col items-center gap-2 flex-shrink-0 ${
                            isSelected ? 'opacity-50' : ''
                          }`}
                        >
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base transition-all ${
                              isSelected ? 'ring-4 ring-purple-500' : ''
                            }`}
                            style={{ background: bgColor }}
                          >
                            {initials}
                          </div>
                          <span className="text-white/80 text-xs">
                            {recipient.name.split(' ')[0]}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* Add receiver input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add receiver by username"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-2xl text-white placeholder-white/40 outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />
                  <button
                    type="button"
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)',
                    }}
                  >
                    <UserPlus size={20} className="text-white" />
                  </button>
                </div>
              </div>

          {/* Split Agreement */}
          <div>
            <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Split Agreement</div>
            <div className="flex gap-3">
              {[
                { value: 'amount' as SplitType, label: 'By Amount' },
                { value: 'percentage' as SplitType, label: 'By Percentage' },
              ].map((type) => (
                <motion.button
                  key={type.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSplitType(type.value)}
                  className={`flex-1 px-6 py-3 rounded-2xl text-sm font-medium transition-all border-2 ${
                    splitType === type.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70'
                  }`}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Receiver split amount */}
          {splitType === 'amount' && (
            <>
            <div>
              <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Sender amount</div>
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-white/60 text-lg">£</span>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={ senderAmount}
                  onChange={(e) => setSenderAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                />
              </div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Receiver Amount</div>
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-white/60 text-lg">£</span>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={ receiverAmount}
                  onChange={(e) => setReceiverAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                />
              </div>
            </div>
            </>
          )}

          {/* sender split percentage */}
          {splitType === 'percentage' && (
            <>
            <div>
              <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Sender percentage Split</div>
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <input
                  type="text"
                  placeholder="Your percentage"
                  value={senderPercentage}
                  onChange={(e) => setSenderPercentage(e.target.value.replace(/[^0-9]/g, ''))}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                />
                <span className="text-white/60 text-lg">%</span>
              </div>
              {selectedReceivers.length > 0 && (
                <div className="text-xs text-white/50 mt-2 text-center">
                  Add receivers to set percentages
                </div>
              )}
            </div>
              {/* Receiver split percentage */}
            <div>
              <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Receiver percentage Split</div>
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <input
                  type="text"
                  placeholder="Your percentage"
                  value={ receiverPercentage }
                  onChange={(e) => setReceiverPercentage(e.target.value.replace(/[^0-9]/g, ''))}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                />
                <span className="text-white/60 text-lg">%</span>
              </div>
              {selectedReceivers.length > 0 && (
                <div className="text-xs text-white/50 mt-2 text-center">
                  Add receivers to set percentages
                </div>
              )}
            </div>

            </>
            
          )}

          {/* Time Agreement */}
          <div>
            <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Time Agreement</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-white/50 mb-2">Start</div>
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-white outline-none"
                  style={{ 
                    background: 'rgba(255,255,255,0.08)',
                    colorScheme: 'dark'
                  }}
                />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-2">End</div>
                <input
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-white outline-none"
                  style={{ 
                    background: 'rgba(255,255,255,0.08)',
                    colorScheme: 'dark'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Send Contract Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSendContract}
            disabled={(selectedReceivers.length === 0 && !receiver.trim()) || !startDateTime || !endDateTime || isLoading}
            className="w-full py-5 rounded-3xl text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            <Send size={20} />
            {isLoading ? 'Sending...' : 'Send Contract'}
          </motion.button>
        </div>

      </div>
    </PageTransition>
  )
}
