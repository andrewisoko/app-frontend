import { useState, useEffect } from 'react'
import { cardsService, VirtualCard } from '@/services/cards'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import PageTransition from '@/components/animations/PageTransition'
import { CreditCard, Plus, MoreVertical, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Cards() {
  const [cards, setCards] = useState<VirtualCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const data = await cardsService.getCards()
      setCards(data)
    } catch (error) {
      console.error('Failed to fetch cards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCardVisibility = (cardId: string) => {
    setVisibleCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const maskCardNumber = (cardNumber: string, isVisible: boolean) => {
    if (isVisible) return cardNumber
    return cardNumber.replace(/(\d{4})/g, '•••• ').trim()
  }

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Virtual Cards</h1>
            <p className="text-gray-600 mt-1">Manage your payment cards</p>
          </div>
          <Button size="sm" className="flex items-center gap-2">
            <Plus size={16} />
            New Card
          </Button>
        </div>

        {/* Cards List */}
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : cards.length === 0 ? (
          <Card hover={false} className="text-center py-12">
            <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
            <p className="text-gray-600 mb-6">Create your first virtual card to get started</p>
            <Button className="mx-auto">Create Card</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${
                  card.type === 'main'
                    ? 'bg-gradient-to-br from-gray-900 to-gray-700'
                    : 'bg-gradient-to-br from-primary-600 to-secondary-600'
                } text-white`}>
                  {/* Card Type Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      {card.type === 'main' ? 'Main Card' : 'Temporary'}
                    </span>
                  </div>

                  {/* Card Icon */}
                  <CreditCard className="mb-8" size={32} />

                  {/* Card Number */}
                  <div className="mb-6">
                    <div className="text-xs text-white/70 mb-2">Card Number</div>
                    <div className="text-xl font-mono tracking-wider flex items-center justify-between">
                      <span>{maskCardNumber(card.cardNumber, visibleCards.has(card.id))}</span>
                      <button
                        onClick={() => toggleCardVisibility(card.id)}
                        className="ml-4 p-1 hover:bg-white/10 rounded"
                      >
                        {visibleCards.has(card.id) ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="flex justify-between items-end">
                    <div className="flex-1">
                      <div className="text-xs text-white/70 mb-1">Cardholder</div>
                      <div className="text-sm font-medium">{card.cardholderName}</div>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <div className="text-xs text-white/70 mb-1">Expires</div>
                        <div className="text-sm font-medium">{card.expiryDate}</div>
                      </div>
                      {visibleCards.has(card.id) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="text-xs text-white/70 mb-1">CVV</div>
                          <div className="text-sm font-medium">{card.cvv}</div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Card Status & Balance */}
                  <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-white/70 mb-1">Balance</div>
                      <div className="text-lg font-semibold">${card.balance.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        card.status === 'active'
                          ? 'bg-green-400/20 text-green-100'
                          : 'bg-red-400/20 text-red-100'
                      }`}>
                        {card.status}
                      </span>
                      <button className="p-1 hover:bg-white/10 rounded">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card hover={false} className="bg-primary-50 border border-primary-100">
          <h4 className="font-medium text-primary-900 mb-2">💡 About Temporary Cards</h4>
          <p className="text-sm text-primary-700">
            Create temporary cards for one-time purchases or subscriptions. They're automatically
            deleted after use or expiration, keeping your main card safe.
          </p>
        </Card>
      </div>
    </PageTransition>
  )
}
