import { useState, useEffect } from 'react'
import { inboxService, ReceivedContract } from '@/services/inbox'
import { contractsService } from '@/services/contracts'
import { useAuth } from '@/hooks/useAuth'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { Inbox as InboxIcon, Check, X, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Inbox() {
  const { user } = useAuth()
  const [receivedContracts, setReceivedContracts] = useState<ReceivedContract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchReceivedContracts()
  }, [])

  const fetchReceivedContracts = async () => {
    try {
      const data = await inboxService.getReceivedContracts()
      setReceivedContracts(data)
    } catch (error) {
      console.error('Failed to fetch received contracts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (id: string) => {
    if (!user?.id) return
    setProcessingId(id)
    try {
      await contractsService.contractReceivedOnInbox(id, user.id, true)
      setReceivedContracts((prev) => prev.filter((contract) => contract.id !== id))
    } catch (error) {
      console.error('Failed to accept contract:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDecline = async (id: string) => {
    if (!user?.id) return
    setProcessingId(id)
    try {
      await contractsService.contractReceivedOnInbox(id, user.id, false)
      setReceivedContracts((prev) => prev.filter((contract) => contract.id !== id))
    } catch (error) {
      console.error('Failed to decline contract:', error)
    } finally {
      setProcessingId(null)
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700'
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'declined':
        return 'bg-red-100 text-red-700'
      case 'expired':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-300">Inbox</h1>
          <p className="text-gray-600 mt-1">Contracts shared with you</p>
        </div>

        {/* Received Contracts */}
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : receivedContracts.length === 0 ? (
          <Card hover={false} className="text-center py-12">
            <InboxIcon className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts received</h3>
            <p className="text-gray-600">When someone shares a contract with you, it will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {receivedContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CreditCard className="text-primary-600" size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{contract.senderName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500">
                        Received {new Date(contract.receivedAt).toLocaleDateString()}
                      </div>

                      {contract.status === 'new' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAccept(contract.id)}
                            isLoading={processingId === contract.id}
                            className="flex items-center gap-1"
                          >
                            <Check size={16} />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecline(contract.id)}
                            disabled={processingId === contract.id}
                            className="flex items-center gap-1"
                          >
                            <X size={16} />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
