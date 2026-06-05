import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { accountsService, Account } from '@/services/accounts'
import PageTransition from '@/components/animations/PageTransition'
import { ArrowLeft, Delete, ArrowDownUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Transfer() {
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [fromAccount, setFromAccount] = useState<Account | null>(null)
  const [toAccount, setToAccount] = useState<Account | null>(null)
  const [amount, setAmount] = useState('0')

  useEffect(() => {
    if (!userProfile) return

    const fetchAccounts = async () => {
      try {
        const rawAccounts = userProfile.accounts?.trim() ?? ''
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

        if (accountIds.length > 0) {
          const results = await Promise.all(
            accountIds.map((id) =>
              accountsService.findAccount(userProfile.user_name, id)
            )
          )
          const accountList = results.map((r) => r.account)
          setAccounts(accountList)
          
          // Set default from account (first one)
          if (accountList.length > 0) {
            setFromAccount(accountList[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }

    fetchAccounts()
  }, [userProfile])

  const handleNumberClick = (num: string) => {
    if (amount === '0') {
      setAmount(num)
    } else {
      setAmount(amount + num)
    }
  }

  const handleDecimalClick = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.')
    }
  }

  const handleDeleteClick = () => {
    if (amount.length === 1) {
      setAmount('0')
    } else {
      setAmount(amount.slice(0, -1))
    }
  }

  const handleSwapAccounts = () => {
    const temp = fromAccount
    setFromAccount(toAccount)
    setToAccount(temp)
  }

  const handleTransfer = () => {
    // TODO: Implement transfer logic
    console.log('Transferring', amount, 'from', fromAccount?.accountNumber, 'to', toAccount?.accountNumber)
  }

  const getAccountLabel = (account: Account) => {
    // Simplified account type detection
    return account.fullName || 'Account'
  }

  return (
    <PageTransition>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>
        
        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white">Transfer</h1>
        </div>

        {/* From Account */}
        <div className="px-6 mb-4">
          <div className="text-xs text-white/60 mb-3 uppercase">From</div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {accounts.map((account) => {
              const isSelected = fromAccount?._id === account._id
              return (
                <motion.button
                  key={account._id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFromAccount(account)}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="text-white font-medium text-sm">{getAccountLabel(account)}</div>
                  <div className="text-white/60 text-xs mt-1">
                    ${account.available_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSwapAccounts}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            <ArrowDownUp size={20} className="text-white" />
          </motion.button>
        </div>

        {/* To Account */}
        <div className="px-6 mb-6">
          <div className="text-xs text-white/60 mb-3 uppercase">To</div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {accounts.filter(acc => acc._id !== fromAccount?._id).map((account) => {
              const isSelected = toAccount?._id === account._id
              return (
                <motion.button
                  key={account._id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setToAccount(account)}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="text-white font-medium text-sm">{getAccountLabel(account)}</div>
                  <div className="text-white/60 text-xs mt-1">
                    ${account.available_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Amount Display */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-white/90">
            ${amount}
          </div>
        </div>

        {/* Number Pad */}
        <div className="px-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberClick(num.toString())}
                className="py-5 rounded-2xl text-white text-xl font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {num}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDecimalClick}
              className="py-5 rounded-2xl text-white text-xl font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              .
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick('0')}
              className="py-5 rounded-2xl text-white text-xl font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              0
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteClick}
              className="py-5 rounded-2xl text-white flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Delete size={24} />
            </motion.button>
          </div>

          {/* Transfer Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleTransfer}
            disabled={amount === '0' || !fromAccount || !toAccount}
            className="w-full py-5 rounded-3xl text-white font-semibold text-lg disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            Transfer ${amount}
          </motion.button>
        </div>

      </div>
    </PageTransition>
  )
}
