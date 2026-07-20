import { Contract } from '@/services/contracts';
import { X, Check } from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────────────

const parseTimeAgreementDates = (
  raw: string | string[]
): { start: string; end: string } | null => {
  try {
    let dates: string[] = []
    if (Array.isArray(raw)) {
      dates = raw
    } else {
      dates = (raw as string)
        .replace(/^\{|\}$/g, '')
        .split(',')
        .map((d) => d.replace(/"/g, '').trim())
    }
    if (dates.length < 2) return null
    return { start: dates[0], end: dates[1] }
  } catch {
    return null
  }
}

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatAmount = (amount: number | undefined | null): string | null => {
  if (amount === undefined || amount === null) return null
  return `£${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// ── Props ──────────────────────────────────────────────────────────────────

interface ContractDetailProps {
  contract: Partial<Contract>
  /** If provided, Accept / Decline buttons are shown when status is pending/new */
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  processingId?: string | null
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ContractDetail({
  contract,
  onAccept,
  onDecline,
  processingId,
}: ContractDetailProps) {
  const showActions =
    (onAccept || onDecline) &&
    (!contract.contract_status ||
      contract.contract_status === 'pending' ||
      contract.contract_status === 'new')

  const parsed = contract.transaction_type === "with-time-agreement" 
    ? parseTimeAgreementDates(contract.time_agreement as unknown as string)
    : null

  return (
    <div 
      className="p-6 rounded-2xl space-y-6"
      style={{ background: 'rgba(88, 28, 135, 0.3)', border: '1px solid rgba(139, 92, 246, 0.3)' }}
    >
      {/* Contract Details */}
      <div 
        className="p-5 rounded-xl space-y-4"
        style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(75, 85, 99, 0.3)' }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 font-mono">Participants</span>
          <span className="text-white font-medium">
            {contract.participants || 'N/A'}
          </span>
        </div>

        {contract.contract_type && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-mono">Contract Type</span>
            <span className="text-white font-medium">{contract.contract_type}</span>
          </div>
        )}

        {contract.transaction_type && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-mono">Transaction Type</span>
            <span className="text-white font-medium">
              {contract.transaction_type === 'with-time-agreement' ? 'With Time Agreement' : contract.transaction_type}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 font-mono">Sender</span>
          <span className="text-white font-medium">
            {contract.all_usernames?.[0] || 'Unknown Sender'}
          </span>
        </div>

        {contract.split_agreement && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-mono">Split Agreement</span>
            <span className="text-purple-300 font-medium">{contract.split_agreement}</span>
          </div>
        )}

        {contract.sender_percentage !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-mono">Sender Percentage</span>
            <span className="text-white font-medium">{contract.sender_percentage}%</span>
          </div>
        )}

        {contract.sender_amount !== undefined && contract.sender_amount !== null && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 font-mono">Sender Amount</span>
            <span className="text-white font-medium">{formatAmount(contract.sender_amount)}</span>
          </div>
        )}
      </div>

      {/* Time Agreement Section */}
      {parsed && (
        <div 
          className="p-5 rounded-xl space-y-4"
          style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(75, 85, 99, 0.3)' }}
        >
          <span className="text-xs font-bold text-neutral-300 font-mono block">Time Agreement</span>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400 font-mono block mb-1">Start</span>
              <span className="text-sm text-white font-medium">
                {fmtDateTime(parsed.start)}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-mono block mb-1">End</span>
              <span className="text-sm text-white font-medium">
                {fmtDateTime(parsed.end)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Receiver Section */}
      {contract.receiver && contract.receiver.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-neutral-300 font-mono block">
            Receiver
          </span>

          <div className="space-y-2">
            {contract.receiver.map((recUsername, idx) => {
              const recPercentage = (contract.receiver_percentage && contract.receiver_percentage[idx]) ?? 0;
              const recAmount = (contract.receiver_amount && contract.receiver_amount[idx]) ?? 0;

              return (
                <div 
                  key={idx}
                  className="p-4 rounded-xl flex items-center justify-between gap-4"
                  style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(75, 85, 99, 0.3)' }}
                >
                  <div>
                    <span className="text-base font-bold text-white">{recUsername}</span>
                  </div>

                  <div className="text-right">
                    {contract.split_agreement === 'percentage' ? (
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 font-mono block">Receiver Percentage</span>
                        <span className="text-lg font-bold text-purple-300">{recPercentage}%</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 font-mono block">Receiver Amount</span>
                        <span className="text-lg font-bold text-emerald-300">{formatAmount(recAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accept / Decline Buttons */}
      {showActions && (
        <div className="flex gap-3 pt-2">
          <button
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-red-300 border-2 border-red-500/50 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => contract.id && onDecline?.(contract.id)}
            disabled={processingId === contract.id}
          >
            <X className='ml-5' size={20} />
            Decline Contract
          </button>
          <button
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)' }}
            onClick={() => contract.id && onAccept?.(contract.id)}
            disabled={processingId === contract.id}
          >
            <Check className='ml-5' size={20} />
            Accept Contract
          </button>
        </div>
      )}
    </div>
  )
}
