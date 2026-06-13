import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { cardsService, VirtualCard } from '@/services/cards'
import { accountsService } from '@/services/accounts'
import PageTransition from '@/components/animations/PageTransition'
import { CreditCard, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Cards() {
  const { user, userProfile } = useAuth()
  const [cards, setCards] = useState<VirtualCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userProfile || !user) return

    const fetchCards = async () => {
      setIsLoading(true)
      try {
        // Parse account IDs from user profile
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

        console.log('Parsed account IDs:', accountIds)

        // Fetch account details to get account numbers
        if (accountIds.length > 0) {
          const allCards: VirtualCard[] = []
          for (const accountId of accountIds) {
            try {
              // Fetch account to get the account number
              const { account } = await accountsService.findAccount(user.username, accountId)
              console.log(`Account ${accountId} has account number:`, account.accountNumber)
              
              // Now fetch cards using the account number
              const accountCards = await cardsService.getCardsByAccountNumber(account.accountNumber.toString())
              allCards.push(...accountCards)
            } catch (error) {
              console.error(`Failed to fetch cards for account ${accountId}:`, error)
            }
          }
          setCards(allCards)
        }
      } catch (error) {
        console.error('Failed to fetch cards:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCards()
  }, [userProfile, user])

  const formatCardNumber = (cardNumber: string) => {
    // Format as: •••• •••• •••• 8492
    if (!cardNumber) return '•••• •••• •••• ••••'
    const lastFour = cardNumber.slice(-4)
    return `•••• •••• •••• ${lastFour}`
  }

  const formatExpiry = (expiry: string) => {
    // Format as MM/YY
    if (!expiry) return 'N/A'
    if (expiry.includes('/')) return expiry
    if (expiry.length >= 4) {
      const month = expiry.slice(0, 2)
      const year = expiry.slice(-2)
      return `${month}/${year}`
    }
    return expiry
  }

  return (
    <PageTransition>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h1 className="text-xl font-semibold text-white">My Cards</h1>
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        {/* Cards List */}
        <div className="px-4 space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 animate-pulse"
                style={{ 
                  background: i === 0 
                    ? 'linear-gradient(135deg, rgba(138,0,255,0.3) 0%, rgba(91,77,255,0.3) 100%)'
                    : 'rgba(138,0,255,0.2)',
                  height: '180px'
                }}
              ></div>
            ))
          ) : cards.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="mx-auto mb-4 text-white/40" size={48} />
              <h3 className="text-lg font-medium text-white mb-2">No cards yet</h3>
              <p className="text-white/60">Create your first virtual card to get started</p>
            </div>
          ) : (
            cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl p-6 relative overflow-hidden"
                style={{ 
                  background: card.card_type === 'main' 
                    ? 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)'
                    : 'linear-gradient(135deg, #6B21A8 0%, #581C87 100%)'
                }}
              >
                {/* Decorative circles */}
                <div 
                  className="absolute top-6 left-6 w-12 h-12 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                ></div>
                <div 
                  className="absolute top-8 left-8 w-12 h-12 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                ></div>

                {/* Card icon */}
                <div className="absolute top-6 right-6">
                  <CreditCard size={24} className="text-white" />
                </div>

                {/* Card Number */}
                <div className="mt-16 mb-6">
                  <div className="text-xl font-medium text-white tracking-wider">
                    {formatCardNumber(card.card_number)}
                  </div>
                </div>

                {/* Card Details */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-white/60 mb-1 uppercase">Type</div>
                    <div className="text-sm font-medium text-white capitalize">
                      {card.card_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1 uppercase">Expires</div>
                    <div className="text-sm font-medium text-white">
                      {formatExpiry(card.expiry)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </PageTransition>
  )
}
