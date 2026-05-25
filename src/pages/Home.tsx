import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { accountsService } from '@/services/accounts'
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
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'

const recipients = [
  { id: 1, name: 'Sarah', initials: 'SK', bg: '#7C3AED' },
  { id: 2, name: 'Marcus', initials: 'ML', bg: '#2563EB' },
  { id: 3, name: 'Priya', initials: 'PS', bg: '#DB2777' },
  { id: 4, name: 'Tom', initials: 'TB', bg: '#059669' },
  { id: 5, name: 'Ana', initials: 'AC', bg: '#EA580C' },
]

const mockTransactions = [
  { id: 1, name: 'Apple Inc.', date: 'Today, 10:30 AM', amount: -9.99, icon: Zap, positive: false },
  { id: 2, name: 'Salary Deposit', date: 'Yesterday, 9:00 AM', amount: 5420.00, icon: ArrowUpRight, positive: true },
  { id: 3, name: 'Whole Foods', date: 'Yesterday, 2:45 PM', amount: -156.24, icon: ShoppingBag, positive: false },
  { id: 4, name: 'Electric Co.', date: 'Dec 28', amount: -89.50, icon: Receipt, positive: false },
  { id: 5, name: 'From Savings', date: 'Dec 27', amount: 500.00, icon: ArrowLeftRight, positive: true },
]

export default function Home() {
  useAuth()
  const [balance, setBalance] = useState<number>(199031.37)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    accountsService.getAccounts()
      .then(accounts => { if (accounts.length > 0) setBalance(accounts[0].balance) })
      .catch(() => {})
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

            {recipients.map((r) => (
              <motion.button key={r.id} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base" style={{ background: r.bg }}>
                  {r.initials}
                </div>
                <span className="text-white/60 text-xs">{r.name}</span>
              </motion.button>
            ))}
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
            {mockTransactions.map((tx, i) => {
              const Icon = tx.icon
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
                      style={{ background: tx.positive ? 'rgba(5,150,105,0.25)' : 'rgba(109,40,217,0.3)' }}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{tx.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{tx.date}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-sm" style={{ color: tx.positive ? '#00F5A0' : '#FFFFFF' }}>
                    {tx.positive ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  )
}
