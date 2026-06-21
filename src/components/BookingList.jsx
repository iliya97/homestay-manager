import { useState } from 'react'
import BookingCard from './BookingCard'
import BookingModal from './BookingModal'
import { getStatus } from '../lib/utils'

const FILTERS = ['All', 'Upcoming', 'Active', 'Past', 'Cancelled']

export default function BookingList({ bookings, onDelete, onCancel, loading }) {
    const [filter, setFilter] = useState('All')
    const [selected, setSelected] = useState(null)

    const filtered = bookings.filter(b => {
        if (filter === 'Cancelled') return b.status === 'cancelled'
        if (filter === 'All') return b.status !== 'cancelled'
        return b.status !== 'cancelled' && getStatus(b.check_in, b.check_out) === filter.toLowerCase()
    })

    const sorted = [...filtered].sort((a, b) => a.check_in.localeCompare(b.check_in))

    return (
    <div className="mt-6">
      <h2 className="text-base font-medium text-gray-700 mb-3">All bookings</h2>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              filter === f
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading...</p>
      ) : sorted.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No bookings here yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map(b => (
            <BookingCard key={b.id} booking={b} onDelete={onDelete} onClick={() => setSelected(b)} />
          ))}
        </div>
      )}

      <BookingModal
        booking={selected}
        onClose={() => setSelected(null)}
        onDelete={onDelete}
        onCancel={onCancel}
      />
    </div>
  )
}