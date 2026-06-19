import { getStatus } from '../lib/utils'

export default function StatsBar({ bookings}) {
    const active = bookings.filter(b => getStatus(b.check_in, b.check_out) === 'active').length
    const upcoming = bookings.filter(b => getStatus(b.check_in, b.check_out) === 'upcoming').length

    return (
        <div className="grid grid-cols-3 gap-3 mb-6">
            {[
                { label: 'Total', value: bookings.length },
                { label: 'Active now', value: active },
                { label: 'Upcoming', value: upcoming },
            ].map(stat => (
                <div key={stat.label} className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-medium mt-1">{stat.value}</p>
                </div>
            ))}
        </div>
    )
}
