import { getStatus, formatDate, nightCount, initials } from '../lib/utils'

const statusConfig = {
  active: { label: 'Active', dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-700' },
  upcoming: { label: 'Upcoming', dot: 'bg-green-400', badge: 'bg-green-50 text-green-700' },
  past: { label: 'Past', dot: 'bg-gray-300', badge: 'bg-gray-100 text-gray-500' },
}

const avatarColors = [
  'bg-blue-50 text-blue-700',
  'bg-green-50 text-green-700',
  'bg-purple-50 text-purple-700',
  'bg-orange-50 text-orange-700',
  'bg-pink-50 text-pink-700',
]

function avatarColor(name) {
  let hash = 0
  for (const c of name) hash += c.charCodeAt(0)
  return avatarColors[hash % avatarColors.length]
}

function getMonthNights(bookings) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`

  let total = 0
  for (const b of bookings) {
    if (b.status === 'cancelled') continue
    const start = b.check_in < firstDay ? firstDay : b.check_in
    const end = b.check_out > lastDay ? lastDay : b.check_out
    if (start < end) {
      const nights = Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
      total += nights
    }
  }
  return total
}

function OccupancyBar({ bookings }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const nights = getMonthNights(bookings)
  const pct = Math.min(100, Math.round((nights / daysInMonth) * 100))

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500">Occupancy this month</p>
          <p className="text-2xl font-semibold text-gray-900 mt-0.5">{pct}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Nights booked</p>
          <p className="text-2xl font-semibold text-gray-900 mt-0.5">{nights}<span className="text-sm font-normal text-gray-400"> / {daysInMonth}</span></p>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function StatCard({ label, value, dark }) {
  return (
    <div className={`rounded-2xl p-4 ${dark ? 'bg-gray-900' : 'bg-white border border-gray-100'} shadow-sm`}>
      <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-3xl font-semibold mt-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}

function RecentBookings({ bookings, onNavigate }) {
  const recent = bookings
    .filter(b => b.status !== 'cancelled' && getStatus(b.check_in, b.check_out) !== 'past')
    .sort((a, b) => a.check_in.localeCompare(b.check_in))
    .slice(0, 3)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-700">Upcoming bookings</h3>
        <button
          onClick={() => onNavigate('bookings')}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          See all →
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No upcoming bookings</p>
      ) : (
        <div className="flex flex-col gap-3">
          {recent.map(b => {
            const status = getStatus(b.check_in, b.check_out)
            const { badge } = statusConfig[status]
            const nights = nightCount(b.check_in, b.check_out)
            const color = avatarColor(b.guest_name)

            return (
              <div key={b.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 min-w-10 rounded-full flex items-center justify-center text-xs font-semibold ${color}`}>
                  {initials(b.guest_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.guest_name}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(b.check_in)} · {nights} night{nights !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge}`}>
                  {statusConfig[status].label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ActiveGuest({ bookings }) {
  const active = bookings.find(b => b.status !== 'cancelled' && getStatus(b.check_in, b.check_out) === 'active')
  if (!active) return null

  const nights = nightCount(active.check_in, active.check_out)
  const color = avatarColor(active.guest_name)

  return (
    <div className="bg-gray-900 rounded-2xl p-5 mb-4 shadow-sm">
      <p className="text-xs text-gray-400 mb-3">Currently staying</p>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 min-w-12 rounded-full flex items-center justify-center text-sm font-semibold ${color}`}>
          {initials(active.guest_name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-white truncate">{active.guest_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Checks out {formatDate(active.check_out)} · {nights} nights
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ bookings, onNavigate }) {
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const dateLabel = now.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' })

  const nonCancelled = bookings.filter(b => b.status !== 'cancelled')
  const active = nonCancelled.filter(b => getStatus(b.check_in, b.check_out) === 'active').length
  const upcoming = nonCancelled.filter(b => getStatus(b.check_in, b.check_out) === 'upcoming').length
  const total = nonCancelled.length

  return (
    <div>
      {/* Greeting */}
      <div className="mb-5">
        <p className="text-xl font-semibold text-gray-900">{greeting} 👋</p>
        <p className="text-sm text-gray-400 mt-0.5">{dateLabel}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Total" value={total} />
        <StatCard label="Active now" value={active} dark />
        <StatCard label="Upcoming" value={upcoming} />
      </div>

      {/* Active guest card */}
      <ActiveGuest bookings={bookings} />

      {/* Occupancy */}
      <OccupancyBar bookings={bookings} />

      {/* Recent bookings */}
      <RecentBookings bookings={bookings} onNavigate={onNavigate} />
    </div>
  )
}
