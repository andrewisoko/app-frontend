import { ContractForm } from '@/services/contracts'
import { FileText, X, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

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

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'Recent'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const formatAmount = (amount: number | undefined | null): string | null => {
  if (amount === undefined || amount === null) return null
  return `£${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'accepted':  return 'Accepted'
    case 'pending':
    case 'new':       return 'Pending'
    case 'declined':  return 'Declined'
    case 'expired':   return 'Expired'
    case 'completed': return 'Completed'
    case 'cancelled': return 'Cancelled'
    default:          return status
  }
}

// ── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string | undefined }) {
  if (!status) return null

  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending:   { bg: 'rgba(234,179,8,0.2)',    color: '#FCD34D', label: 'PENDING'   },
    new:       { bg: 'rgba(234,179,8,0.2)',    color: '#FCD34D', label: 'PENDING'   },
    accepted:  { bg: 'rgba(74,222,128,0.2)',   color: '#4ADE80', label: 'ACCEPTED'  },
    declined:  { bg: 'rgba(248,113,113,0.2)',  color: '#F87171', label: 'DECLINED'  },
    cancelled: { bg: 'rgba(248,113,113,0.2)',  color: '#F87171', label: 'CANCELLED' },
    expired:   { bg: 'rgba(156,163,175,0.2)',  color: '#9CA3AF', label: 'EXPIRED'   },
    completed: { bg: 'rgba(96,165,250,0.2)',   color: '#60A5FA', label: 'COMPLETED' },
  }

  const cfg = map[status]
  if (!cfg) return null

  return (
    <span
      className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

// ── Props ──────────────────────────────────────────────────────────────────

interface ContractDetailProps {
  contract: Partial<ContractForm>
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

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(177, 92, 255, 0.1)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(177, 92, 255, 0.3)' }}
          >
            <FileText className="text-primary-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {contract.all_usernames?.[0] || 'Unknown Sender'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={contract.contract_status} />
            </div>
          </div>
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Sender</span>
          <span className="text-white font-medium">
            {contract.all_usernames?.[0] || 'Unknown Sender'}
          </span>
        </div>

        {contract.receiver && contract.receiver.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Receivers</span>
            <span className="text-white font-medium">
              {contract.all_usernames?.slice(1).join(' • ')}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Status</span>
          <span className="text-white font-medium">
            {getStatusText(contract.contract_status || 'Pending')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Split Agreement</span>
          <span className="text-white font-medium">{contract.split_agreement || 'N/A'}</span>
        </div>

        {contract.time_agreement &&
          (() => {
            const parsed = parseTimeAgreementDates(contract.time_agreement as unknown as string)
            if (!parsed) return null
            return (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Time Agreement</span>
                <div className="flex flex-col gap-1 text-right">
                  <div className="flex gap-2 justify-end">
                    <span className="text-gray-400 text-sm w-10">Start:</span>
                    <span className="text-white font-medium text-sm">
                      {fmtDateTime(parsed.start)}
                    </span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <span className="text-gray-400 text-sm w-10">End:</span>
                    <span className="text-white font-medium text-sm">
                      {fmtDateTime(parsed.end)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })()}

        {contract.sender_percentage !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Sender Percentage</span>
            <span className="text-white font-medium">{contract.sender_percentage}%</span>
          </div>
        )}

        {contract.sender_amount !== undefined && contract.sender_amount !== null && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Sender Amount</span>
            <span className="text-white font-medium">{formatAmount(contract.sender_amount)}</span>
          </div>
        )}

        {contract.receiver_percentage && contract.receiver_percentage.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Receiver Percentages</span>
            <span className="text-white font-medium">
              {contract.receiver_percentage.join(', ')}%
            </span>
          </div>
        )}

        {contract.receiver_amount && contract.receiver_amount.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Receiver Amounts</span>
            <span className="text-white font-medium">
              {contract.receiver_amount.map((a) => formatAmount(a)).join(', ')}
            </span>
          </div>
        )}

        {contract.repayment_agreement && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Repayment</span>
            <span className="text-white font-medium">{contract.repayment_agreement}</span>
          </div>
        )}

        {contract.event_agreement && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Event</span>
            <span className="text-white font-medium">{contract.event_agreement}</span>
          </div>
        )}

        {contract.location_agreement && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Location</span>
            <span className="text-white font-medium">{contract.location_agreement}</span>
          </div>
        )}

        {contract.updatedAt && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Last Updated</span>
            <span className="text-white font-medium">{formatDate(contract.updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Accept / Decline — only shown in Inbox context */}
      {showActions && (
        <div className="flex gap-3 mt-5">
          <Button
            className="flex-1 py-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
            onClick={() => contract.id && onDecline?.(contract.id)}
            disabled={processingId === contract.id}
          >
            <X size={20} />
            Decline
          </Button>
          <Button
            variant="primary"
            className="flex-1 py-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #B15CFF 0%, #8B3FD9 100%)' }}
            onClick={() => contract.id && onAccept?.(contract.id)}
            isLoading={processingId === contract.id}
          >
            <Check size={20} />
            Accept
          </Button>
        </div>
      )}
    </div>
  )
}
