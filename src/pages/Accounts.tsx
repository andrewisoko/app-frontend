import { useState, useEffect } from 'react'
import { accountsService, Account } from '@/services/accounts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { Wallet, CheckCircle, XCircle, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [switchingId, setSwitchingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const data = await accountsService.getAccounts()
      setAccounts(data)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchAccount = async (id: string) => {
    setSwitchingId(id)
    try {
      await accountsService.switchAccount(id)
      // Refresh accounts to update active status
      await fetchAccounts()
    } catch (error) {
      console.error('Failed to switch account:', error)
    } finally {
      setSwitchingId(null)
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
              const isActiveAccount = index === 0 // Simplified - first account is active

              return (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${
                    isActiveAccount ? 'border-2 border-primary-500' : 'border-2 border-transparent'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          account.type === 'checking'
                            ? 'bg-primary-100'
                            : 'bg-secondary-100'
                        }`}>
                          <Wallet
                            className={account.type === 'checking' ? 'text-primary-600' : 'text-secondary-600'}
                            size={24}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{account.accountName}</h3>
                            {isActiveAccount && (
                              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-mono">
                            {account.accountNumber}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            {account.type} Account
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
                        ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{account.currency}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        Opened {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                      
                      {!isActiveAccount && account.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary-600"
                          onClick={() => handleSwitchAccount(account.id)}
                          isLoading={switchingId === account.id}
                        >
                          Switch to this account
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Info Card */}
        <Card hover={false} className="bg-blue-50 border border-blue-100">
          <h4 className="font-medium text-blue-900 mb-2">💡 About Account Types</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Checking:</strong> For daily transactions and expenses</li>
            <li>• <strong>Savings:</strong> For storing money and earning interest</li>
          </ul>
        </Card>
      </div>
    </PageTransition>
  )
}
