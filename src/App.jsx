import { useBookings } from './hooks/useBookings'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import StatsBar from './components/StatsBar'

export default function App() {
  const { bookings, loading, addBooking, deleteBooking } = useBookings()

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-1">Rumah Acik</h1>
      <p className="text-gray-500 text-sm mb-6">Booking tracker</p>
      <StatsBar bookings={bookings} />
      <BookingForm onAdd={addBooking} bookings={bookings} />
      <BookingList bookings={bookings} onDelete={deleteBooking} loading={loading} />
    </div>
  )
}