import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { contractsService, Contract } from '@/services/contracts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { FileText, Plus, CheckCircle, Clock, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Contracts() {
  const navigate = useNavigate()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const data = await contractsService.getContracts()
      setContracts(data)
    } catch (error) {
      console.error('Failed to fetch contracts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-700',
          label: 'Draft',
        }
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-700',
          label: 'Pending',
        }
      case 'active':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-700',
          label: 'Active',
        }
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-blue-100 text-blue-700',
          label: 'Completed',
        }
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-700',
          label: 'Cancelled',
        }
      default:
        return {
          icon: FileText,
          color: 'bg-gray-100 text-gray-700',
          label: status,
        }
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
          <Button size="sm" className="flex items-center gap-2" onClick={() => navigate('/app/contracts/new')}>
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
                Fill out structured contracts like game quests. Each section guides you through
                the process step by step.
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
            <Button className="mx-auto" onClick={() => navigate('/app/contracts/new')} >Create Contract</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract, index) => {
              const statusConfig = getStatusConfig(contract.status || contract.contractStatus || 'draft')
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:border-primary-200 border-2 border-transparent transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="text-primary-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{contract.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{contract.description}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        {contract.fields?.length || 0} fields • Updated{' '}
                        {contract.updatedAt ? new Date(contract.updatedAt).toLocaleDateString() : 'Recently'}
                      </div>
                      
                      {(contract.status || contract.contractStatus) === 'draft' && (
                        <Button size="sm" variant="ghost" className="text-primary-600">
                          Continue Editing →
                        </Button>
                      )}
                    </div>

                    {/* Progress Bar for drafts */}
                    {(contract.status || contract.contractStatus) === 'draft' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>3 of {contract.fields?.length || 0} completed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${contract.fields?.length ? (3 / contract.fields.length) * 100 : 0}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-gradient-primary h-2 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
