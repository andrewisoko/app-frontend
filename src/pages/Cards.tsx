import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { cardsService, VirtualCard } from '@/services/cards'
import { accountsService } from '@/services/accounts'
import PageTransition from '@/components/animations/PageTransition'
import { CreditCard, Plus, X, QrCode, Info, Snowflake } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Cards() {
  const { user, userProfile } = useAuth()
  const [cards, setCards] = useState<VirtualCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showQR, setShowQR] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>()
  const [qrLoading, setQrLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [frozenCards, setFrozenCards] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userProfile || !user) return

    const fetchCards = async () => {
      setIsLoading(true)
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
          const allCards: VirtualCard[] = []
          for (const accountId of accountIds) {
            try {
              const { account } = await accountsService.findAccount(user.username, accountId)
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
    if (!cardNumber) return '•••• •••• •••• ••••'
    const lastFour = cardNumber.slice(-4)
    return `•••• •••• •••• ${lastFour}`
  }

  const formatExpiry = (expiry: string) => {
    if (!expiry) return 'N/A'
    if (expiry.includes('/')) return expiry
    if (expiry.length >= 4) {
      return `${expiry.slice(0, 2)}/${expiry.slice(-2)}`
    }
    return expiry
  }

    const formatPan = (pan?: string) => {
    if (!pan) return '•••• •••• •••• ••••'
    const digits = pan.replace(/\D/g, '')
    return digits.match(/.{1,4}/g)?.join(' ') ?? digits
  }


  const activeCard = cards[activeIndex]
  const isFrozen = activeCard ? frozenCards.has(activeCard.id) : false

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, offsetWidth } = scrollRef.current
    const cardWidth = offsetWidth * 0.82 + 12 // card width + gap
    const index = Math.round(scrollLeft / cardWidth)
    setActiveIndex(Math.min(index, cards.length - 1))
  }

 const handleShowQR = async () => {
    if (!activeCard) return

    try {
      setQrLoading(true)

      const qr = await cardsService.generateQRcode(activeCard.POS_token)

      setQrCode(qr)
      setShowQR(true)
    } catch (error) {
      console.error('Failed to generate QR code', error)
    } finally {
      setQrLoading(false)
    }
}

  const toggleFreeze = () => {
    if (!activeCard) return
    setFrozenCards(prev => {
      const next = new Set(prev)
      next.has(activeCard.id) ? next.delete(activeCard.id) : next.add(activeCard.id)
      return next
    })
  }

  const cardGradients = [
    'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)',
    'linear-gradient(135deg, #6B21A8 0%, #581C87 100%)',
    'linear-gradient(135deg, #1D4ED8 0%, #4F46E5 100%)',
    'linear-gradient(135deg, #0F766E 0%, #0891B2 100%)',
  ]

  return (
    <PageTransition>
      <div
        className="min-h-screen pb-24"
        style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h1 className="text-xl font-semibold text-white">My Cards</h1>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        {isLoading ? (
          /* Loading skeleton */
          <div className="px-6">
            <div
              className="rounded-3xl animate-pulse"
              style={{
                background: 'rgba(138,0,255,0.25)',
                height: '200px',
              }}
            />
            <div className="mt-6 flex justify-center gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full animate-pulse" style={{ background: 'rgba(138,0,255,0.3)' }} />
                  <div className="w-16 h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.15)' }} />
                </div>
              ))}
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16 px-6">
            <CreditCard className="mx-auto mb-4 text-white/40" size={48} />
            <h3 className="text-lg font-medium text-white mb-2">No cards yet</h3>
            <p className="text-white/60 text-sm">Create your first virtual card to get started</p>
          </div>
        ) : (
          <>
            {/* Horizontal scrolling card carousel */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto gap-3 pb-2"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              {cards.map((card, index) => {
                const frozen = frozenCards.has(card.id)
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="relative rounded-3xl p-6 overflow-hidden flex-shrink-0"
                    style={{
                      width: '82%',
                      minWidth: '280px',
                      scrollSnapAlign: 'center',
                      background: frozen
                        ? 'linear-gradient(135deg, #374151 0%, #1F2937 100%)'
                        : cardGradients[index % cardGradients.length],
                      transition: 'background 0.4s ease',
                    }}
                  >
                    {/* Decorative circles */}
                    <div
                      className="absolute -top-6 -left-6 w-24 h-24 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    />
                    <div
                      className="absolute -top-2 -left-2 w-16 h-16 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-32 h-32 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(30%, 30%)' }}
                    />

                    {/* Top row: chip + freeze indicator */}
                    <div className="relative flex items-start justify-between mb-8">
                      {/* EMV chip */}
                      <div
                        className="w-10 h-8 rounded-md"
                        style={{
                          background: 'linear-gradient(135deg, #d4af37 0%, #f5e28a 50%, #d4af37 100%)',
                          boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.2)',
                        }}
                      />
                      {frozen && (
                        <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                          <Snowflake size={12} className="text-blue-200" />
                          <span className="text-xs text-blue-100 font-medium">Frozen</span>
                        </div>
                      )}
                    </div>

                    {/* Card number */}
                    <div className="relative mb-6">
                      <div
                        className="text-lg font-medium text-white tracking-widest"
                        style={{ letterSpacing: '0.15em', filter: frozen ? 'blur(3px)' : 'none', transition: 'filter 0.3s' }}
                      >
                        {formatCardNumber(card.pan)}
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="relative flex justify-between items-end">
                      <div>
                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Type</div>
                        <div className="text-sm font-medium text-white capitalize">{card.card_type}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Expires</div>
                        <div className="text-sm font-medium text-white">{formatExpiry(card.expiry)}</div>
                      </div>
                      {/* Network logo placeholder */}
                      <div className="text-white font-bold text-sm italic opacity-80">VISA</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Dot indicators */}
            {cards.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {cards.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIndex ? '20px' : '6px',
                      height: '6px',
                      background: i === activeIndex ? '#8A00FF' : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Card name + last four */}
           

            {/* Action buttons */}
            <div className="flex  gap-8  ml-24 mt-6 mb-6">
              {/* QR Code */}
              <button
                onClick={handleShowQR}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95"
                  style={{ background: 'rgba(138,0,255,0.25)', border: '1px solid rgba(138,0,255,0.4)' }}
                >
                  <QrCode size={22} className="text-white" />
                </div>
                <span className="text-xs text-white/70 font-medium">QR Code</span>
              </button>

              {/* Card Details */}
              <button
                onClick={() => setShowDetails(true)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95"
                  style={{ background: 'rgba(138,0,255,0.25)', border: '1px solid rgba(138,0,255,0.4)' }}
                >
                  <Info size={22} className="text-white" />
                </div>
                <span className="text-xs text-white/70 font-medium">Card details</span>
              </button>

              {/* Freeze Card */}
              <button
                onClick={toggleFreeze}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95"
                  style={{
                    background: isFrozen ? 'rgba(59,130,246,0.35)' : 'rgba(138,0,255,0.25)',
                    border: isFrozen ? '1px solid rgba(96,165,250,0.6)' : '1px solid rgba(138,0,255,0.4)',
                  }}
                >
                  <Snowflake size={22} className={isFrozen ? 'text-blue-300' : 'text-white'} />
                </div>
                <span className="text-xs font-medium" style={{ color: isFrozen ? '#93c5fd' : 'rgba(255,255,255,0.7)' }}>
                  {isFrozen ? 'Unfreeze' : 'Freeze card'}
                </span>
              </button>
            </div>
          </>
        )}

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && activeCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6"
              style={{ background: 'rgba(0,0,0,0.7)' }}
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="w-full max-w-sm rounded-3xl px-6 pt-2 pb-6"
                style={{ background: '#1B012B' }}
                onClick={e => e.stopPropagation()}
              >


                {/* Drag handle */}
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-lg font-semibold">Pay with QR code</h2>
                  <button
                    onClick={() => setShowQR(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>

                {/* QR placeholder */}
                <div
                  className="mx-auto rounded-2xl flex flex-col items-center justify-center mb-5"
                  style={{ width: '220px', height: '220px', background: '#ffffff' }}
                >
                  {/* QR code image */}
                <div
                    className="mx-auto rounded-2xl flex items-center justify-center mb-5"
                    style={{ width: '220px', height: '220px', background: '#ffffff' }}
                  >
                    {qrLoading ? (
                      <span>Loading...</span>
                    ) : qrCode ? (
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-[180px] h-[180px]"
                      />
                    ) : (
                      <span>QR unavailable</span>
                    )}
                  </div>
                </div>

                <p className="text-center text-white/60 text-sm leading-relaxed px-2">
                  Show this QR code to the payment terminal. The merchant scans it to charge your card — no need to tap or swipe.
                </p>

                <div
                  className="mt-4 rounded-2xl px-4 py-3 text-center"
                  style={{ background: 'rgba(138,0,255,0.15)', border: '1px solid rgba(138,0,255,0.3)' }}
                >
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Charging card</p>
                  <p className="text-white text-sm font-medium">
                     {formatPan(activeCard.pan)} 
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Details Modal */}
        <AnimatePresence>
          {showDetails && activeCard && (
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6"
              style={{ background: 'rgba(0,0,0,0.7)' }}
              onClick={() => setShowDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="w-full max-w-sm rounded-3xl px-6 pt-6 pb-7"
                style={{ background: '#1B012B' }}
                onClick={e => e.stopPropagation()}
              >

                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-lg font-semibold">Card details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Card number', value: formatPan(activeCard.pan) },
                    { label: 'Expiry', value: formatExpiry(activeCard.expiry) },
                    { label: 'Type', value: activeCard.card_type },
                    { label: 'CVV', value: activeCard.CVC },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center px-4 py-3 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-white/50 text-sm">{label}</span>
                      <span className="text-white text-sm font-medium capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}