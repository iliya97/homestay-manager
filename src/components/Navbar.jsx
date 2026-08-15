const PAGE_TITLES = {
  home: 'Home',
  bookings: 'Bookings',
  customers: 'Customers',
  expenses: 'Expenses',
}

export default function Navbar({ onMenuClick, activePage }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 flex items-center px-4 h-14">
      <button
        onClick={onMenuClick}
        className="w-9 h-9 flex flex-col justify-center gap-1.5 items-center rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-gray-700 rounded" />
        <span className="block w-5 h-0.5 bg-gray-700 rounded" />
        <span className="block w-3 h-0.5 bg-gray-700 rounded self-start ml-1" />
      </button>
      <h1 className="flex-1 text-center text-base font-semibold text-gray-900">
        {PAGE_TITLES[activePage]}
      </h1>
      {/* Spacer to balance the hamburger */}
      <div className="w-9" />
    </div>
  )
}
