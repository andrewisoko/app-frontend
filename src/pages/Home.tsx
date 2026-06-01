import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { accountsService } from '@/services/accounts'
import { recipientsService, Recipient } from '@/services/recipients'
import { transactionsService, Transaction } from '@/services/transactions'
import PageTransition from '@/components/animations/PageTransition'
import { 
  Send, 
  FileText, 
  ArrowLeftRight, 
  Plus, 
  TrendingUp, 
  Eye, 
  Zap, 
  ArrowUpRight,
  ShoppingBag,
  Receipt,
  ChevronRight,
  DollarSign,
  CreditCard,
  Wallet,
  Home as HomeIcon
} from 'lucide-react'
import { motion } from 'framer-motion'

// Icon mapping for transaction categories
const getCategoryIcon = (category?: string) => {
  const categoryMap: Record<string, any> = {
    utilities: Zap,
    salary: ArrowUpRight,
    groceries: ShoppingBag,
    shopping: ShoppingBag,
    bills: Receipt,
    transfer: ArrowLeftRight,
    subscription: CreditCard,
    payment: DollarSign,
    deposit: Wallet,
    withdrawal: Wallet,
    default: HomeIcon,
  }
  return categoryMap[category?.toLowerCase() || 'default'] || categoryMap.default
}

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

// Format date for display
const formatTransactionDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

export default function Home() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch accounts to get total balance (available_balance)
        const accounts = await accountsService.getAccounts()
        if (accounts.length > 0) {
          // Sum all available balances across accounts
          const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
          setBalance(totalBalance)
        }

        // Fetch recipients
        const recipientsData = await recipientsService.getRecipients()
        setRecipients(recipientsData.slice(0, 5)) // Show only first 5

        // Fetch transactions
        const transactionsData = await transactionsService.getTransactions()
        setTransactions(transactionsData.slice(0, 5)) // Show only first 5 recent
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })

  return (
    <PageTransition>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-5 pb-4">
          <span className="text-white font-semibold text-base">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[3px]">
              <div className="w-[3px] h-2 bg-white rounded-sm"></div>
              <div className="w-[3px] h-3 bg-white rounded-sm"></div>
              <div className="w-[3px] h-4 bg-white rounded-sm"></div>
              <div className="w-[3px] h-[18px] bg-white/40 rounded-sm"></div>
            </div>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 border border-white/70 rounded-[3px] relative">
                <div className="absolute inset-[2px] right-[2px] bg-white rounded-[1px]"></div>
              </div>
              <div className="w-[2px] h-[6px] bg-white/70 rounded-r-sm"></div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-6 pb-4"
        >
          <h1 className="text-2xl font-bold text-white">
            Welcome, {user?.firstName || 'User'}
          </h1>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-4 mb-6 rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
        >
          {/* Glow orb */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: '#B15CFF' }}></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: '#5B4DFF' }}></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">Total Balance</span>
              <button className="text-white/70 hover:text-white transition-colors">
                <Eye size={18} />
              </button>
            </div>

            <h2 className="text-4xl font-bold text-white mb-2">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>

            <div className="flex items-center gap-1.5 mb-6">
              <TrendingUp size={14} style={{ color: '#00F5A0' }} />
              <span className="text-sm font-semibold" style={{ color: '#00F5A0' }}>+12.5%</span>
              <span className="text-white/60 text-sm">vs last month</span>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Send, label: 'Send' },
                { icon: FileText, label: 'Contract' },
                { icon: ArrowLeftRight, label: 'Transfer' },
                { icon: Plus, label: 'Top up' },
              ].map(({ icon: Icon, label }) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 transition-all"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <Icon size={20} className="text-white" />
                  <span className="text-white text-[11px] font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recipients */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-white">Recipients</h3>
            <button className="text-sm font-medium flex items-center gap-0.5 transition-opacity hover:opacity-70" style={{ color: '#B15CFF' }}>
              See All <ChevronRight size={15} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
            {/* Add */}
            <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border border-white/20" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Plus size={22} className="text-white" />
              </div>
              <span className="text-white/60 text-xs">Add</span>
            </motion.button>

            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                  <div className="w-12 h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                </div>
              ))
            ) : recipients.length > 0 ? (
              recipients.map((r) => {
                const initials = r.initials || getInitials(r.name)
                const bgColor = r.avatarColor || getAvatarColor(r.name)
                return (
                  <motion.button key={r.id} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base" style={{ background: bgColor }}>
                      {initials}
                    </div>
                    <span className="text-white/60 text-xs">{r.name.split(' ')[0]}</span>
                  </motion.button>
                )
              })
            ) : (
              <div className="text-white/60 text-sm py-4">No recipients found</div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-white">Recent Transactions</h3>
            <button className="text-sm font-medium flex items-center gap-0.5 transition-opacity hover:opacity-70" style={{ color: '#B15CFF' }}>
              View All <ChevronRight size={15} />
            </button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.07]"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                      <div className="w-16 h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
                    </div>
                  </div>
                  <div className="w-16 h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                </div>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((tx, i) => {
                const isPositive = tx.type === 'credit'
                const Icon = getCategoryIcon(tx.category)
                const displayName = tx.merchantName || tx.description || 'Transaction'
                const formattedDate = formatTransactionDate(tx.createdAt)

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.07]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: isPositive ? 'rgba(5,150,105,0.25)' : 'rgba(109,40,217,0.3)' }}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{displayName}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{formattedDate}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-sm" style={{ color: isPositive ? '#00F5A0' : '#FFFFFF' }}>
                      {isPositive ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="text-white/60 text-sm text-center py-8">No transactions found</div>
            )}
          </div>
        </div>

      </div>
    </PageTransition>
  )
}
