export function getStatus(checkIn, checkOut) {
    const today = new Date().toISOString().split('T')[0]
    if (checkOut <= today) return 'past'
    if (checkIn <= today) return 'active'
    return 'upcoming'
}

export function formatDate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function nightCount(checkIn, checkOut) {
    const a = new Date(checkIn)
    const b = new Date(checkOut)
    return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}