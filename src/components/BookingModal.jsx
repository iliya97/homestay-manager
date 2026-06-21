import { getStatus, formatDate, nightCount, initials } from '../lib/utils'

const statusConfig = {
  active: { label: 'Active now', className: 'bg-blue-50 text-blue-700' },
  upcoming: { label: 'Upcoming', className: 'bg-green-50 text-green-700' },
  past: { label: 'Past', className: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-500' },
}

export default function BookingModal({ booking, onClose, onDelete, onCancel }) {
  if (!booking) return null

  const isCancelled = booking.status === 'cancelled'
  const status = isCancelled ? 'cancelled' : getStatus(booking.check_in, booking.check_out)
  const { label, className } = statusConfig[status]
  const nights = nightCount(booking.check_in, booking.check_out)

  function handleDelete() {
    onDelete(booking.id)
    onClose()
  }

  async function handleCancel() {
    await onCancel(booking.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl flex flex-col max-h-[85vh] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-700">Booking details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-6 flex flex-col gap-6">
          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-medium text-xl">
              {initials(booking.guest_name)}
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">{booking.guest_name}</p>
              <span className={`text-xs font-medium px-3 py-1 rounded-full mt-1 inline-block ${className}`}>
                {label}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1">
            <Row label="Check-in" value={formatDate(booking.check_in)} />
            <Row label="Check-out" value={formatDate(booking.check_out)} />
            <Row label="Duration" value={`${nights} night${nights !== 1 ? 's' : ''}`} />
            <Row label="Phone" value={booking.phone_number} />
          </div>
        </div>

        {/* Actions */}
        {(status === 'upcoming' || status === 'past' || status === 'cancelled') && (
          <div className="px-5 pb-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
            {status === 'upcoming' && (
              <button
                onClick={handleCancel}
                className="w-full py-3.5 rounded-xl text-base font-medium text-orange-500 border border-orange-200 hover:bg-orange-50 transition-colors"
              >
                Cancel booking
              </button>
            )}
            {(status === 'past' || status === 'cancelled') && (
              <button
                onClick={handleDelete}
                className="w-full py-3.5 rounded-xl text-base font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
              >
                Delete booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
