import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchBookings()
    }, [])

    async function fetchBookings() {
        setLoading(true)
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('check_in', { ascending: true })

        if (error) {
            setError(error)
        } else {
            setBookings(data)
        }
        setLoading(false)
    }

    async function addBooking(booking) {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{ ...booking, status: 'active' }])
            .select()
            .single()

        if (error) return { error: error.message }
        setBookings(prev => [...prev, data])
        return { data }
    }

    async function deleteBooking(id) {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id)

        if (error) return { error: error.message }

        setBookings(prev => prev.filter(b => b.id !== id))
        return { data: { id } }
    }

    async function cancelBooking(id) {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single()

        if (error) return { error: error.message }

        setBookings(prev => prev.map(b => b.id === id ? data : b))
        return { data }
    }

    return { bookings, loading, error, addBooking, deleteBooking, cancelBooking, refetch: fetchBookings }
}