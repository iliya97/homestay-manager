import { useState } from 'react'
import { useBookings } from './hooks/useBookings'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import BookingCalendar from './components/BookingCalendar'
import { Toast, useToast } from './components/Toast'

export default function App() {
  const { bookings, loading, addBooking, deleteBooking, cancelBooking } = useBookings()
  const { toast, show } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, setPage] = useState('home')

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
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} activePage={page} />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={page}
        onNavigate={setPage}
      />

      <main className="max-w-lg mx-auto px-4 pt-20 pb-10">
        {page === 'home' && (
          <>
            <Dashboard bookings={bookings} onNavigate={setPage} />
            <BookingCalendar bookings={bookings} />
          </>
        )}

        {page === 'bookings' && (
          <>
            <BookingCalendar bookings={bookings} />
            <BookingForm onAdd={handleAdd} bookings={bookings} />
            <BookingList bookings={bookings} onDelete={handleDelete} onCancel={handleCancel} loading={loading} />
          </>
        )}

        {page === 'customers' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl mb-4">👤</p>
            <p className="text-gray-500 text-sm">Customers — coming soon</p>
          </div>
        )}

        {page === 'expenses' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl mb-4">💸</p>
            <p className="text-gray-500 text-sm">Expenses — coming soon</p>
          </div>
        )}
      </main>

      <Toast message={toast} />
    </div>
  )
}
