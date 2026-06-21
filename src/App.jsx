import { useBookings } from './hooks/useBookings'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import StatsBar from './components/StatsBar'
import { Toast, useToast } from './components/Toast'

export default function App() {
  const { bookings, loading, addBooking, deleteBooking, cancelBooking } = useBookings()
  const { toast, show } = useToast()

  async function handleAdd(booking) {
    const result = await addBooking(booking)
    if (!result.error) show('Booking created')
    return result
  }

  async function handleDelete(id) {
    const result = await deleteBooking(id)
    if (!result.error) show('Booking deleted')
    return result
  }

  async function handleCancel(id) {
    const result = await cancelBooking(id)
    if (!result.error) show('Booking cancelled')
    return result
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-1">Rumah Acik</h1>
      <p className="text-gray-500 text-sm mb-6">Booking tracker</p>
      <StatsBar bookings={bookings} />
      <BookingForm onAdd={handleAdd} bookings={bookings} />
      <BookingList bookings={bookings} onDelete={handleDelete} onCancel={handleCancel} loading={loading} />
      <Toast message={toast} />
    </div>
  )
}