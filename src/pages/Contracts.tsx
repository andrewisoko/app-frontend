import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Contract } from '@/services/contracts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { FileText, Plus, CheckCircle, Clock, XCircle, MapPin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function Contracts() {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

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

  const getAgreementType = (contract: Contract): string => {
    if (contract.event_agreement) return 'Event agreement'
    if (contract.repayment_agreement) return 'Repayment'
    if (contract.location_agreement) return 'Location agreement'
    return 'Revenue split'
  }

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Recent'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatAmount = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return '$0'
    return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { icon: Clock, color: 'bg-gray-100 text-gray-700', label: 'Draft' }
      case 'pending':
      case 'new':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' }
      case 'active':
      case 'accepted':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Active' }
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

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
      case 'accepted': return 'Active'
      case 'pending':
      case 'new': return 'Pending'
      case 'declined': return 'Declined'
      case 'expired': return 'Expired'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  // Exactly mirrors the InboxPage parseTimeAgreement + formatting
  const parseTimeAgreementDates = (raw: string | string[]): { start: string; end: string } | null => {
    try {
      let dates: string[] = []
      if (Array.isArray(raw)) {
        dates = raw
      } else {
        dates = (raw as string)
          .replace(/^\{|\}$/g, '')
          .split(',')
          .map((d) => d.replace(/"/g, '').trim())
      }
      if (dates.length < 2) return null
      return { start: dates[0], end: dates[1] }
    } catch {
      return null
    }
  }

  const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

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

                      {contract.updatedAt && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(contract.updatedAt)}
                        </span>
                      )}

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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
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

              {/* Contract Info — hero + status badge */}
              <div className="space-y-4 mb-6">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(177, 92, 255, 0.1)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(177, 92, 255, 0.3)' }}
                    >
                      <FileText className="text-primary-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedContract.all_usernames?.[0] || 'Unknown Sender'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedContract.contract_status === 'pending' || selectedContract.contract_status === 'new' ? (
                          <span
                            className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: 'rgba(234,179,8,0.2)', color: '#FCD34D' }}
                          >
                            {selectedContract.contract_status.toUpperCase()}
                          </span>
                        ) : selectedContract.contract_status === 'accepted' || selectedContract.contract_status === 'active' ? (
                          <span
                            className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: 'rgba(74,222,128,0.2)', color: '#4ADE80' }}
                          >
                            {selectedContract.contract_status.toUpperCase()}
                          </span>
                        ) : selectedContract.contract_status === 'declined' || selectedContract.contract_status === 'cancelled' ? (
                          <span
                            className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: 'rgba(248,113,113,0.2)', color: '#F87171' }}
                          >
                            {selectedContract.contract_status.toUpperCase()}
                          </span>
                        ) : selectedContract.contract_status === 'expired' ? (
                          <span
                            className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: 'rgba(156,163,175,0.2)', color: '#9CA3AF' }}
                          >
                            {selectedContract.contract_status.toUpperCase()}
                          </span>
                        ) : selectedContract.contract_status === 'completed' ? (
                          <span
                            className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: 'rgba(96,165,250,0.2)', color: '#60A5FA' }}
                          >
                            {selectedContract.contract_status.toUpperCase()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail rows */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sender</span>
                    <span className="text-white font-medium">
                      {selectedContract.all_usernames?.[0] || 'Unknown Sender'}
                    </span>
                  </div>

                  {selectedContract.receiver && selectedContract.receiver.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Receivers</span>
                      <span className="text-white font-medium">
                        {selectedContract.all_usernames?.slice(1).join(' • ')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span className="text-white font-medium">
                      {getStatusText(selectedContract.contract_status || 'Pending')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Split Agreement</span>
                    <span className="text-white font-medium">
                      {selectedContract.split_agreement || 'N/A'}
                    </span>
                  </div>

                  {selectedContract.time_agreement && (() => {
                    const parsed = parseTimeAgreementDates(selectedContract.time_agreement)
                    if (!parsed) return null
                    return (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Time Agreement</span>
                        <div className="flex flex-col gap-1 text-right">
                          <div className="flex gap-2 justify-end">
                            <span className="text-gray-400 text-sm w-10">Start:</span>
                            <span className="text-white font-medium text-sm">
                              {fmtDateTime(parsed.start)}
                            </span>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <span className="text-gray-400 text-sm w-10">End:</span>
                            <span className="text-white font-medium text-sm">
                              {fmtDateTime(parsed.end)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {selectedContract.sender_percentage !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Sender Percentage</span>
                      <span className="text-white font-medium">
                        {selectedContract.sender_percentage}%
                      </span>
                    </div>
                  )}

                  {(selectedContract.sender_amount !== undefined ||
                    selectedContract.sender_amount === 0) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Sender Amount</span>
                      <span className="text-white font-medium">
                        {formatAmount(selectedContract.sender_amount)}
                      </span>
                    </div>
                  )}

                  {selectedContract.receiver_percentage &&
                    selectedContract.receiver_percentage.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Receiver Percentages</span>
                        <span className="text-white font-medium">
                          {selectedContract.receiver_percentage.join(', ')}%
                        </span>
                      </div>
                    )}

                  {selectedContract.receiver_amount &&
                    selectedContract.receiver_amount.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Receiver Amounts</span>
                        <span className="text-white font-medium">
                          {selectedContract.receiver_amount.map((a) => formatAmount(a)).join(', ')}
                        </span>
                      </div>
                    )}

                  {selectedContract.repayment_agreement && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Repayment</span>
                      <span className="text-white font-medium">
                        {selectedContract.repayment_agreement}
                      </span>
                    </div>
                  )}

                  {selectedContract.event_agreement && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Event</span>
                      <span className="text-white font-medium">
                        {selectedContract.event_agreement}
                      </span>
                    </div>
                  )}

                  {selectedContract.location_agreement && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white font-medium">
                        {selectedContract.location_agreement}
                      </span>
                    </div>
                  )}

                  {selectedContract.updatedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Last Updated</span>
                      <span className="text-white font-medium">
                        {formatDate(selectedContract.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}