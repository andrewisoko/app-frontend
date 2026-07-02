import { useState, useEffect } from 'react'
import { Inbox, inboxService } from '@/services/inbox'
import { Contract, contractsService } from '@/services/contracts'
import { useAuth } from '@/hooks/useAuth'
// import { userService } from '@/services/user'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { Check, X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'



export default function InboxPage() {
  const { user, userProfile } = useAuth()
  const [inbox, setInbox] = useState<Inbox | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedContract, setSelectedContract] = useState<Partial<Contract> | null>(null)
  const [showMostRecent, setShowMostRecent] = useState(true)
  const [showHistory, setShowHistory] = useState(true)
 

  useEffect(() => {
    const fetchInbox = async () => {
      // console.log('=== INBOX FETCH DEBUG ===')
      // console.log('userProfile:', userProfile)
      // console.log('user:', user)
      
      // Extract inbox ID - handle both string and object
      let inboxId: string | undefined
      if (userProfile?.inbox) {
        if (typeof userProfile.inbox === 'string') {
          inboxId = userProfile.inbox
        } else if (typeof userProfile.inbox === 'object' && 'id' in userProfile.inbox) {
          inboxId = userProfile.inbox.id
        }
      }
      
      // Fallback to user ID if no inbox ID
      const fetchId = inboxId || user?.id
      
      // console.log('Extracted inbox ID:', inboxId)
      // console.log('Final fetch ID:', fetchId)
      
      if (!fetchId) {
        console.log('❌ No inbox or user ID found - cannot fetch')
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      try {
        const data = await inboxService.getInbox(fetchId)
        // console.log('✅ Making API call to:', `/api/inbox/${fetchId}`)
        // console.log('✅ Inbox data received:', data)
        // console.log('- mostRecent length:', data?.most_recent.length || 0)
        // console.log('- history length:', data?.history?.length || 0)
        // console.log('contract status' ,selectedContract?.contract_status)
       
        setInbox(data)
      } catch (error) {
        console.error('❌ Failed to fetch inbox:', error)
        if (error instanceof Error) {
          console.error('Error message:', error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchInbox()
  }, [userProfile?.inbox, user?.id])



  const handleAccept = async (id: string) => {
    if (!user?.id) return
    if(!selectedContract) return
    setProcessingId(id)
    try {
      const receiverAccountId:string =  selectedContract.receiver?.[0] ?? ''
      console.log('rec account accept', receiverAccountId )
      await contractsService.contractReceivedOnInbox(id, receiverAccountId , true)
      setInbox((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          mostRecent: prev.most_recent.filter((contract) => contract.id !== id) || [],
          history: prev.history?.filter((contract) => contract.id !== id) || [],
        }
      })
    } catch (error) {
      console.error('Failed to accept contract:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDecline = async (id: string) => {
    if (!user?.id) return
    if(!selectedContract) return
    setProcessingId(id)
    try {
      const receiverAccountId:string =  selectedContract.receiver?.[0] ?? ''
      console.log('rec account accept', receiverAccountId )

      await contractsService.contractReceivedOnInbox(id, receiverAccountId, false)
      console.log('user id', user.id)
      console.log('constract id', id)
      setInbox((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          mostRecent: prev.most_recent.filter((contract) => contract.id !== id) || [],
          history: prev.history?.filter((contract) => contract.id !== id) || [],
        }
      })
    } catch (error) {
      console.error('Failed to decline contract:', error)
    } finally {
      setProcessingId(null)
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-400'
      case 'pending':
      case 'new':
        return 'text-yellow-400'
      case 'declined':
        return 'text-red-400'
      case 'expired':
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted'
      case 'pending':
      case 'new':
        return 'Pending'
      case 'declined':
        return 'Declined'
      case 'expired':
        return 'Expired'
      default:
        return status
    }
  }

  const formatAmount = (amount: number | string | undefined) => {
    if (!amount) return '$0'
    const numAmount = typeof amount === 'number' ? amount : Number(amount)
    return `$${numAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Recent'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatTimeAgreement = (timeAgreement: any): string => {
    if (!timeAgreement) return ''
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof timeAgreement === 'string') {
      // Try to parse as JSON
      if (timeAgreement.startsWith('{') || timeAgreement.startsWith('[')) {
        try {
          const parsed = JSON.parse(timeAgreement)
          timeAgreement = parsed
        } catch {
          // Try to extract ISO date from the string
          const isoDateMatch = timeAgreement.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
          if (isoDateMatch) {
            const date = new Date(isoDateMatch[0])
            return date.toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
          return timeAgreement
        }
      } else {
        // Regular string, return as is
        return timeAgreement
      }
    }
    
    // If it's an array, format the first date
    if (Array.isArray(timeAgreement) && timeAgreement.length > 0) {
      try {
        const firstDate = new Date(timeAgreement[0])
        return firstDate.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch {
        return timeAgreement[0]
      }
    }
    
    // If it's an object, extract values and format the first date
    if (typeof timeAgreement === 'object') {
      const values = Object.values(timeAgreement).filter(v => v && typeof v === 'string')
      if (values.length > 0) {
        try {
          const firstDate = new Date(values[0] as string)
          return firstDate.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        } catch {
          return values[0] as string
        }
      }
    }
    
    return String(timeAgreement)
  }


  return (
    <PageTransition>
      <div className="p-6 space-y-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Contracts</h1>
        </div>

        {/* Contracts List */}
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (!inbox?.most_recent.length && !inbox?.history?.length) ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(177, 92, 255, 0.1)' }}>
              <FileText className="text-primary-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No contracts received</h3>
            <p className="text-gray-400 text-center">When someone shares a contract with you, it will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Most Recent Contracts */}
            {inbox?.most_recent && inbox.most_recent.length > 0 && (
              <div>
                <div
                  className="flex items-center justify-between mb-3 cursor-pointer"
                  onClick={() => setShowMostRecent(!showMostRecent)}
                >
                    <h2 className="text-lg font-semibold text-white">
                      Most Recent
                    </h2>

                    {showMostRecent ? (
                      <ChevronDown size={20} className="text-white" />
                    ) : (
                      <ChevronRight size={20} className="text-white" />
                    )}
                  </div>
                  {showMostRecent && (
                  <div className="space-y-3">
                  {inbox.most_recent.map((contract, index) => {
                   
                   
                    const senderUsername = contract.all_usernames?.[0]
                    const timeAgreement = formatTimeAgreement(contract.time_agreement)
                    
                    return (
                      <motion.div
                        key={contract.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedContract(contract)}
                        className="cursor-pointer"
                      >
                        <div 
                          className="rounded-2xl p-4 transition-all hover:scale-[1.02]"
                          style={{ 
                            background: 'rgba(100, 50, 150, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(177, 92, 255, 0.1)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(177, 92, 255, 0.2)' }}
                            >
                              <FileText className="text-primary-400" size={24} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate mb-1">
                                {senderUsername} — Contract
                              </h3>
                              <div className="flex items-center gap-3 text-sm flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(contract.contract_status || 'pending')}`} />
                                  <span className="text-gray-300">{getStatusText(contract.contract_status || 'pending')}</span>
                                </div>
                                {timeAgreement && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-400">{timeAgreement}</span>
                                  </>
                                )}
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">{formatDate(contract.updatedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                          )
                      })}
                    </div>

                      )}
                  </div>
                )}

            {/* History */}
            {inbox?.history.filter(Boolean) && inbox.history.length > 0 && (
              <div>
                <div
                    className="flex items-center justify-between mb-3 cursor-pointer"
                    onClick={() => setShowHistory(!showHistory)}
                      >
                      <h2 className="text-lg font-semibold text-white">
                        History
                      </h2>
                      {showHistory ? (
                        <ChevronDown size={20} className="text-white" />
                      ) : (
                        <ChevronRight size={20} className="text-white" />
                      )}
                    </div>
                  { showHistory &&(
                 <div className="space-y-3">
                    {inbox.history
                      .filter((c): c is Contract => c !== null && c !== undefined)
                      .map((contract, index) => {
                      // console.log('contracts:', inbox.history)
                      const senderUsername = contract.all_usernames?.[0]
                      // console.log('username', senderUsername)
                      const timeAgreement = formatTimeAgreement(contract.time_agreement)
                    
                    return (
                      <motion.div
                        key={contract.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedContract(contract)}
                        className="cursor-pointer"
                      >
                        <div 
                          className="rounded-2xl p-4 transition-all hover:scale-[1.02]"
                          style={{ 
                            background: 'rgba(100, 50, 150, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(177, 92, 255, 0.1)'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(177, 92, 255, 0.2)' }}
                            >
                              <FileText className="text-primary-400" size={24} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate mb-1">
                                {senderUsername} — {'Contract'} 
                              </h3>
                              <div className="flex items-center gap-3 text-sm flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(contract.contract_status || 'pending')}`} />
                                  <span className="text-gray-300">{getStatusText(contract.contract_status || 'pending')}</span>
                                </div>
                                {timeAgreement && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-400">{timeAgreement}</span>
                                  </>
                                )}
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">{formatDate(contract.updatedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                    
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 mb-20"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedContract(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(180deg, rgba(100, 50, 150, 0.4) 0%, rgba(50, 25, 75, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(177, 92, 255, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Contract Details</h2>
                  <p className="text-gray-400">Review and respond</p>
                </div>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Contract Info */}
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(177, 92, 255, 0.1)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(177, 92, 255, 0.3)' }}
                    >
                      <FileText className="text-primary-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedContract.all_usernames?.[0] || 'Unknown Sender'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {
                          selectedContract.contract_status === 'pending' ? (
                          <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.2)', color: '#FCD34D' }}>
                            {selectedContract.contract_status.toLocaleUpperCase() || 'PENDING'}
                          </span>
                        ): selectedContract.contract_status === 'accepted' ? (
                          <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.2)', color: '#4ADE80' }}>
                            {selectedContract.contract_status.toLocaleUpperCase() || 'ACCEPTED'}
                          </span>
                        ): selectedContract.contract_status === 'declined' ? (
                          <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.2)', color: '#F87171' }}>
                            {selectedContract.contract_status.toLocaleUpperCase() || 'DECLINED'}
                          </span>
                        ): selectedContract.contract_status === 'expired' ? (
                          <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.2)', color: '#9CA3AF' }}>
                            {selectedContract.contract_status.toLocaleUpperCase() || 'EXPIRED'}
                          </span>
                          ): null
                        }
                      </div>
                    </div>
                  </div>

                </div>

                {/* Full Contract Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sender</span>
                    <span className="text-white font-medium">{selectedContract.all_usernames?.[0] || 'Unknown Sender'}</span>
                  </div>
                  {selectedContract.receiver && selectedContract.receiver.length > 0 && (

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Receivers</span>
                      <span className="text-white font-medium">{selectedContract.all_usernames?.slice(1).join(' • ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span className="text-white font-medium">{getStatusText( selectedContract.contract_status || 'Pending')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Split Agreement</span>
                    <span className="text-white font-medium">{selectedContract.split_agreement || 'N/A'}</span>
                  </div>
                
                {selectedContract.time_agreement && (
                <div className="flex justify-between items-center" >
                  <span className="text-gray-400">Time Agreement</span>

                  {(() => {
                    const raw = selectedContract.time_agreement as unknown as string
                    const dates = raw
                      .replace(/^\{|\}$/g, '') 
                      .split(',')
                      .map(date => date.replace(/"/g, '').trim())

                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <span className="text-gray-400 text-sm w-10">
                            Start:
                          </span>
                          <span className="text-white font-medium text-sm">
                            {new Date(dates[0]).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-gray-400 text-sm w-10">
                            End:
                          </span>
                          <span className="text-white font-medium text-sm">
                            {new Date(dates[1]).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
                  {selectedContract.sender_percentage !== undefined &&(
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Sender Percentage</span>
                      <span className="text-white font-medium">{selectedContract.sender_percentage}%</span>
                    </div>
                  )}
                  {selectedContract.sender_amount !== undefined || selectedContract.sender_amount === 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Sender Amount</span>
                      <span className="text-white font-medium">{formatAmount(selectedContract.sender_amount)}</span>
                    </div>
                  )}
                  {selectedContract.receiver_percentage && selectedContract.receiver_percentage.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Receiver Percentages</span>
                      <span className="text-white font-medium">{selectedContract.receiver_percentage.join(', ')}%</span>
                    </div>
                  )}
                  {selectedContract.receiver_amount && selectedContract.receiver_amount.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Receiver Amounts</span>
                      <span className="text-white font-medium">
                        {selectedContract.receiver_amount.map(amt => formatAmount(amt)).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedContract.repayment_agreement && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Repayment</span>
                      <span className="text-white font-medium">{selectedContract.repayment_agreement}</span>
                    </div>
                  )}
                  {selectedContract.event_agreement && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Event</span>
                      <span className="text-white font-medium">{selectedContract.event_agreement}</span>
                    </div>
                  )}
                  {selectedContract.location_agreement && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white font-medium">{selectedContract.location_agreement}</span>
                    </div>
                  )}
                  {selectedContract.updatedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Last Updated</span>
                      <span className="text-white font-medium">{formatDate(selectedContract.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(!selectedContract.contract_status || selectedContract.contract_status === 'pending' || selectedContract.contract_status === 'new') && (
                <div className="flex gap-3 mt-5">
                  <Button
            
                    className="flex-1 py-3 rounded-xl"
                     style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'}}
                    onClick={() => {
                      if (selectedContract.id) {
                        handleDecline(selectedContract.id)
                        setSelectedContract(null)
                      }
                    }}
                    disabled={processingId === selectedContract.id}
                  >
                    <X size={20} />
                    Decline
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 py-3 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #B15CFF 0%, #8B3FD9 100%)' }}
                    onClick={() => {
                      if (selectedContract.id) {
                        handleAccept(selectedContract.id)
                        setSelectedContract(null)
                      }
                    }}
                    isLoading={processingId === selectedContract.id}
                  >
                    <Check size={20} />
                    Accept
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
