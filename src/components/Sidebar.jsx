const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'bookings', label: 'Bookings', icon: '📋' },
  { key: 'customers', label: 'Customers', icon: '👤' },
  { key: 'expenses', label: 'Expenses', icon: '💸' },
]

export default function Sidebar({ open, onClose, activePage, onNavigate }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="px-6 pt-14 pb-6 border-b border-gray-100">
          <p className="text-lg font-semibold text-gray-900">Rumah Acik</p>
          <p className="text-sm text-gray-400">Booking tracker</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { onNavigate(key); onClose() }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-colors text-sm font-medium
                ${activePage === key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
