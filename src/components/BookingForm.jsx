import { useState } from 'react'

const EMPTY = { guest_name: '', check_in: '', check_out: '', phone_number: '' }

export default function BookingForm({ onAdd, bookings }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  function handleChange(e) {
    const { name, value } = e.target
    if ((name === 'check_in' || name === 'check_out') && value && value < today) return
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  function handleDateBlur(e) {
    const { name, value } = e.target
    if (value !== form[name]) {
      setForm(prev => ({ ...prev, [name]: value }))
      setError('')
    }
  }

  async function handleSubmit() {
    const { guest_name, check_in, check_out, phone_number } = form

    if (!guest_name || !check_in || !check_out || !phone_number) {
      setError('Please fill in all fields.')
      return
    }
    if (check_out <= check_in) {
      setError('Check-out must be after check-in.')
      return
    }

    // Overlap check
    const conflict = bookings.find(
      b => b.check_in < check_out && b.check_out > check_in
    )
    if (conflict) {
      setError(`Dates overlap with ${conflict.guest_name}'s booking.`)
      return
    }

    setSaving(true)
    const { error: saveError } = await onAdd(form)
    setSaving(false)

    if (saveError) {
      setError(saveError)
      return
    }

    setForm(EMPTY)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
      <h2 className="text-base font-medium text-gray-700 mb-4">Add new booking</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Guest name</label>
          <input
            name="guest_name"
            value={form.guest_name}
            onChange={handleChange}
            placeholder="e.g. Ahmad bin Razak"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Check-in</label>
            <input
              type="date"
              name="check_in"
              value={form.check_in}
              min={today}
              onChange={handleChange}
              onBlur={handleDateBlur}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Check-out</label>
            <input
              type="date"
              name="check_out"
              value={form.check_out}
              min={form.check_in || today}
              onChange={handleChange}
              onBlur={handleDateBlur}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">phone_number number</label>
          <input
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="e.g. 0123456789"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-gray-900 text-white rounded-xl py-3.5 text-base font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save booking'}
        </button>
      </div>
    </div>
  )
}