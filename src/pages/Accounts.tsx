import { useState, useEffect } from 'react'
import { accountsService, Account } from '@/services/accounts'
import { useAuth } from '@/hooks/useAuth'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { Wallet, CheckCircle, XCircle, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Accounts() {
  const { userProfile } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userProfile) {
      fetchAccounts()
    }
  }, [userProfile])

  const fetchAccounts = async () => {
    if (!userProfile) return
    try {
      // Handles both JSON array ["id"] and PostgreSQL set {"id"} formats.
      const rawAccounts = userProfile.account?.trim() ?? ''
      let accountIds: string[] = []
      if (rawAccounts.startsWith('[')) {
        try { accountIds = JSON.parse(rawAccounts) } catch { accountIds = [] }
      } else if (rawAccounts.startsWith('{')) {
        accountIds = rawAccounts
          .slice(1, -1)
          .split(',')
          .map((id) => id.replace(/"/g, '').trim())
          .filter(Boolean)
      }

      const results = await Promise.all(
        accountIds.map((id) =>
          accountsService.findAccount(userProfile.user_name, id)
        )
      )
      setAccounts(results.map((r) => r.account))
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-700',
          label: 'Active',
        }
      case 'inactive':
        return {
          icon: XCircle,
          color: 'bg-gray-100 text-gray-700',
          label: 'Inactive',
        }
      case 'frozen':
        return {
          icon: Lock,
          color: 'bg-red-100 text-red-700',
          label: 'Frozen',
        }
      default:
        return {
          icon: Wallet,
          color: 'bg-gray-100 text-gray-700',
          label: status,
        }
    }
  }

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your financial accounts</p>
        </div>

        {/* Accounts List */}
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : accounts.length === 0 ? (
          <Card hover={false} className="text-center py-12">
            <Wallet className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
            <p className="text-gray-600 mb-6">Create your first account to get started</p>
            <Button className="mx-auto">Create Account</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {accounts.map((account, index) => {
              const statusConfig = getStatusConfig(account.status)
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={account._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-primary-500">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-100">
                          <Wallet className="text-primary-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{account.fullName}</h3>
                            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-mono">
                            {account.accountNumber}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            {userProfile?.main_bank ?? ''} Account
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-600 mb-1">Available Balance</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {account.available_balance.toLocaleString('en-GB', {
                          style: 'currency',
                          currency: account.currency,
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{account.currency}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        Opened {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Info Card */}
        <Card hover={false} className="bg-blue-50 border border-blue-100">
          <h4 className="font-medium text-blue-900 mb-2">💡 About Your Account</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Ledger balance:</strong> Total funds including pending transactions</li>
            <li>• <strong>Available balance:</strong> Funds available for immediate use</li>
          </ul>
        </Card>
      </div>
    </PageTransition>
  )
}
