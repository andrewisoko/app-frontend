import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ContractDetail from '@/components/contracts/ContractDetail'
import { contractsService, ContractForm } from '@/services/contracts'
import PageTransition from '@/components/animations/PageTransition'

export default function QrCodeContract() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contract, setContract] = useState<ContractForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) {
        setError('No contract ID provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await contractsService.getContract(id)
        setContract(data)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch contract:', err)
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load contract. Please try again.'
        setError(`Error: ${errorMessage}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContract()
  }, [id])

  const handleAccept = (contractId: string) => {
    // TODO: Implement accept logic
    console.log('Accept contract:', contractId)
  }

  const handleDecline = (contractId: string) => {
    // TODO: Implement decline logic
    console.log('Decline contract:', contractId)
  }

  return (
    <PageTransition>
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="w-full max-w-lg rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
          style={{
            background: 'linear-gradient(180deg, rgba(100, 50, 150, 0.4) 0%, rgba(50, 25, 75, 0.4) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(177, 92, 255, 0.2)'
          }}
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Contract Details</h2>
              <p className="text-gray-400">Review and respond</p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-white text-lg">Loading contract...</div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
            </div>
          )}

          {/* Contract Details */}
          {contract && !isLoading && (
            <ContractDetail
              contract={contract}
              onAccept={handleAccept}
              onDecline={handleDecline}
              processingId={null}
            />
          )}
        </motion.div>
      </div>
    </PageTransition>
  )
}