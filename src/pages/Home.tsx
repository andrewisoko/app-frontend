import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { transactionsService, Transaction } from '@/services/transactions'
import { accountsService, Account } from '@/services/accounts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send, Plus, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<number>(0)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accounts, transactions] = await Promise.all([
          accountsService.getAccounts(),
          transactionsService.getTransactions(),
        ])

        if (accounts.length > 0) {
          setBalance(accounts[0].balance)
        }

        setRecentTransactions(transactions.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">Here's your financial overview</p>
          </div>
        </div>

        {/* Balance Card */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <Card hover={false} className="bg-gradient-primary text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 text-sm">Total Balance</span>
              <TrendingUp className="text-white/80" size={20} />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-1">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-white/80 text-sm">Available balance</p>
            </motion.div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-4 card-shadow flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Send className="text-primary-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-900">Send</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-4 card-shadow flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <ArrowDownLeft className="text-secondary-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-900">Receive</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-4 card-shadow flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="text-green-600" size={20} />
            </div>
            <span className="text-sm font-medium text-gray-900">Top Up</span>
          </motion.button>
        </div>

        {/* Virtual Card Preview */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
          <div className="flex justify-between items-start mb-8">
            <CreditCard size={32} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">Main Card</span>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-white/80">Card Number</div>
            <div className="text-xl font-mono tracking-wider">•••• •••• •••• 4242</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-white/80 mb-1">Cardholder</div>
                <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
              </div>
              <div>
                <div className="text-xs text-white/80 mb-1">Expires</div>
                <div className="text-sm font-medium">12/26</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
              View All
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : recentTransactions.length === 0 ? (
            <Card hover={false} className="text-center py-8">
              <p className="text-gray-600">No transactions yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <Card key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="text-green-600" size={20} />
                      ) : (
                        <ArrowUpRight className="text-red-600" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
