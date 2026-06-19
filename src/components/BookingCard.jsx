import { getStatus, formatDate, nightCount, initials } from '../lib/utils'

const statusConfig = {
    active: { label: 'Active now', className: 'bg-blue-50 text-blue-700' },
    upcoming: { label: 'Upcoming', className: 'ng-green-50 text-green-700' },
    past: { label: 'Past', className: 'bg-gray-100 text-gray-500' },
}

export default function BookingCard({ booking, onDelete}) {
    const status = getStatus(booking.check_in, booking.check_out)
    const { label, className } = statusConfig[status]
    const nights = nightCount(booking.check_in, booking.check_out)

    return (
        <div className={`flex items-center gap-4 p-4 border border-gray-100 rounded-2xl ${status === 'past' ? 'opacity-50' : ''}`}>
            {/* Avatar */}
            <div className="w-11 h-11 min-w-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-medium text-sm">
                {initials(booking.guest_name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{booking.guest_name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                <span className="ml-1 text-gray-400">({nights} night{nights !== 1 ? 's' : ''})</span>
                </p>
                <p className="text-sm text-gray-500">{booking.phone_number}</p>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${className}`}>
                {label}
                </span>
                <button
                onClick={() => onDelete(booking.id)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg"
                aria-label="Delete booking"
                >
                ✕
                </button>
            </div>
        </div>
    )
}