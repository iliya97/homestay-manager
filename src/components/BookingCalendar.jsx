import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const statusColors = {
  active: { bg: 'bg-blue-100', text: 'text-blue-700' },
  upcoming: { bg: 'bg-green-100', text: 'text-green-700' },
  past: { bg: 'bg-gray-100', text: 'text-gray-500' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-400' },
}

function getBookingStatus(booking) {
  if (booking.status === 'cancelled') return 'cancelled'
  const today = new Date().toISOString().split('T')[0]
  if (booking.check_out <= today) return 'past'
  if (booking.check_in <= today) return 'active'
  return 'upcoming'
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  // 0 = Mon ... 6 = Sun
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export default function BookingCalendar({ bookings }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState(null)

  const today = now.toISOString().split('T')[0]
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function toDateStr(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function getBookingsForDay(day) {
    const date = toDateStr(day)
    return bookings.filter(b =>
      b.status !== 'cancelled' && b.check_in <= date && b.check_out > date
    )
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-700">Calendar</h2>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="text-gray-400 hover:text-gray-700 text-lg px-1">‹</button>
          <span className="text-sm font-medium text-gray-700">{monthLabel}</span>
          <button onClick={nextMonth} className="text-gray-400 hover:text-gray-700 text-lg px-1">›</button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d[0]}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const dateStr = toDateStr(day)
          const isToday = dateStr === today
          const dayBookings = getBookingsForDay(day)
          const hasBooking = dayBookings.length > 0
          const firstBooking = dayBookings[0]
          const status = firstBooking ? getBookingStatus(firstBooking) : null
          const colors = status ? statusColors[status] : null

          return (
            <div
              key={day}
              onClick={() => hasBooking && setSelected(firstBooking)}
              className={`flex flex-col items-center py-1 rounded-xl ${hasBooking ? 'cursor-pointer' : ''}`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm
                ${isToday ? 'bg-gray-900 text-white font-medium' : 'text-gray-700'}
                ${hasBooking && !isToday ? `${colors.bg} ${colors.text} font-medium` : ''}
              `}>
                {day}
              </div>
              {hasBooking && (
                <div className={`w-1 h-1 rounded-full mt-0.5 ${colors.bg.replace('bg-', 'bg-').replace('-100', '-400').replace('-50', '-300')}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
        {[
          { label: 'Active', color: 'bg-blue-400' },
          { label: 'Upcoming', color: 'bg-green-400' },
          { label: 'Past', color: 'bg-gray-300' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Booking detail on tap */}
      {selected && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{selected.guest_name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(selected.check_in + 'T00:00:00').toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                {' → '}
                {new Date(selected.check_out + 'T00:00:00').toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg">✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
