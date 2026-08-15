import { useState, useRef } from 'react'

const EMPTY = {
  guest_name: '',
  check_in: '',
  check_out: '',
  phone_number: '',
  no_of_adults: 1,
  no_of_children: 0,
  no_of_guests: 1
}

export default function BookingForm({ onAdd, bookings }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const checkInRef = useRef(null)
  const checkOutRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]

  function handleChange(e) {
    const { name, value } = e.target

    if ((name === 'check_in' || name === 'check_out') && value && value < today) return

    if (name === 'no_of_adults' || name === 'no_of_children') {
      const numericValue = value === '' ? '' : Number(value)
      setForm(prev => {
        const next = { ...prev, [name]: numericValue }
        const adults = Number(next.no_of_adults || 0)
        const children = Number(next.no_of_children || 0)
        next.no_of_guests = adults + children
        return next
      })
      setError('')
      return
    }

    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  function clearDate(name) {
    const ref = name === 'check_in' ? checkInRef : checkOutRef
    if (ref.current) ref.current.value = ''
    setForm(prev => ({ ...prev, [name]: '' }))
    setError('')
  }

  async function handleSubmit() {
    const { guest_name, check_in, check_out, phone_number, no_of_adults, no_of_children } = form
    const totalGuests = Number(no_of_adults || 0) + Number(no_of_children || 0)

    if (!guest_name || !check_in || !check_out || !phone_number || Number(no_of_adults || 0) < 1 || totalGuests < 1) {
      setError('Please fill in all fields with at least 1 adult.')
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
    const { error: saveError } = await onAdd({ ...form, no_of_guests: totalGuests })
    setSaving(false)

    if (saveError) {
      setError(saveError)
      return
    }

    if (checkInRef.current) checkInRef.current.value = ''
    if (checkOutRef.current) checkOutRef.current.value = ''
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

        <div className="flex flex-col gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-500">Check-in</label>
              {form.check_in && (
                <button type="button" onClick={() => clearDate('check_in')} className="text-sm text-gray-400 hover:text-gray-600">Clear</button>
              )}
            </div>
            <input
              ref={checkInRef}
              type="date"
              name="check_in"
              defaultValue=""
              min={today}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-500">Check-out</label>
              {form.check_out && (
                <button type="button" onClick={() => clearDate('check_out')} className="text-sm text-gray-400 hover:text-gray-600">Clear</button>
              )}
            </div>
            <input
              ref={checkOutRef}
              type="date"
              name="check_out"
              defaultValue=""
              min={form.check_in || today}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Phone number</label>
          <input
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="e.g. 0123456789"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Number of Guests</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Adults</label>
              <input
                type="number"
                name="no_of_adults"
                value={form.no_of_adults}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Children below 12</label>
              <input
                type="number"
                name="no_of_children"
                value={form.no_of_children}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Total guests: {Number(form.no_of_adults || 0) + Number(form.no_of_children || 0)}
          </p>
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