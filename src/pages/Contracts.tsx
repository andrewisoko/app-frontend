import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContractForm } from '@/services/contracts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { FileText, Plus, CheckCircle, Clock, XCircle, MapPin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import ContractDetail from '@/components/contracts/ContractDetail'

export default function Contracts() {

  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [contracts, setContracts] = useState<ContractForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<ContractForm | null>(null)



////////////////// useEffects ////////////////////////////////////////////


  useEffect(() => {
    fetchUserCreatedContracts()
  }, [])

  const fetchUserCreatedContracts = async () => {
    if (!userProfile) return
    try {
      setIsLoading(true)
      const userCreatedContracts = userProfile.created_contract
      setContracts(userCreatedContracts)
    } catch (error) {
      console.error('Failed to fetch contracts:', error)
    } finally {
      setIsLoading(false)
    }
  }


  // ── Helpers ────────────────────────────────────────────────

  const getAgreementType = (contract: ContractForm): string => {
    if (contract.event_agreement) return 'Event agreement'
    if (contract.repayment_agreement) return 'Repayment'
    if (contract.location_agreement) return 'Location agreement'
    return 'Revenue split'
  }

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Recent'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { icon: Clock, color: 'bg-gray-100 text-gray-700', label: 'Draft' }
      case 'pending':
      case 'new':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' }
      case 'accepted':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Accepted' }
      case 'completed':
        return { icon: CheckCircle, color: 'bg-blue-100 text-blue-700', label: 'Completed' }
      case 'cancelled':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelled' }
      case 'declined':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Declined' }
      case 'expired':
        return { icon: Clock, color: 'bg-gray-100 text-gray-500', label: 'Expired' }
      default:
        return { icon: FileText, color: 'bg-gray-100 text-gray-700', label: status }
    }
  }

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Contracts</h1>
            <p className="text-gray-600 mt-1">Manage your agreements</p>
          </div>
          <Button
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate('/app/contracts/new')}
          >
            <Plus size={16} />
            Create
          </Button>
        </div>

        {/* Info Card */}
        <Card hover={false} className="bg-gradient-primary text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Interactive Contract Forms</h3>
              <p className="text-sm text-white/90">
                Fill out structured contracts like game quests. Each section guides you through the
                process step by step.
              </p>
            </div>
          </div>
        </Card>

        {/* Contracts List */}
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : contracts.length === 0 ? (
          <Card hover={false} className="text-center py-12">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts yet</h3>
            <p className="text-gray-600 mb-6">Create your first contract to get started</p>
            <Button className="mx-auto" onClick={() => navigate('/app/contracts/new')}>
              Create Contract
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract, index) => {
              const statusConfig = getStatusConfig(contract.contract_status || 'draft')
              const StatusIcon = statusConfig.icon
              const agreementType = getAgreementType(contract)
              const visibleUsers = contract.all_usernames.slice(0, 3)
              const overflow = contract.all_usernames.length - 3

              return (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:border-primary-200 border-2 border-transparent transition-colors"
                    onClick={() => setSelectedContract(contract)}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="text-primary-600" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                          {agreementType}
                        </p>
                        <p className="text-sm font-medium text-white truncate">
                          {contract.all_usernames.join(' · ')}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ${statusConfig.color}`}
                      >
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 pt-3 border-t border-white/10 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {visibleUsers.map((username, i) => (
                            <div
                              key={username}
                              title={username}
                              className="w-5 h-5 rounded-full bg-primary-100 border-2 border-gray-900 flex items-center justify-center text-[9px] font-medium text-primary-700"
                              style={{ marginLeft: i > 0 ? '-6px' : '0' }}
                            >
                              {username.slice(0, 2).toUpperCase()}
                            </div>
                          ))}
                          {overflow > 0 && (
                            <div
                              className="w-5 h-5 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-[9px] font-medium text-gray-400"
                              style={{ marginLeft: '-6px' }}
                            >
                              +{overflow}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {contract.all_usernames.length}{' '}
                          {contract.all_usernames.length === 1 ? 'party' : 'parties'}
                        </span>
                      </div>
                      {contract.location_agreement && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[140px]">
                          <MapPin size={12} />
                          {contract.location_agreement}
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Contract Detail Modal — identical to InboxPage pattern ── */}
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
                background:
                  'linear-gradient(180deg, rgba(100, 50, 150, 0.4) 0%, rgba(50, 25, 75, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(177, 92, 255, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
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

              <ContractDetail contract={selectedContract} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}