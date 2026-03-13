export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage your Talaritel platform from here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600">Total Users</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
          <p className="text-xs text-gray-500 mt-2">Loading data...</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600">Active Users</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
          <p className="text-xs text-gray-500 mt-2">Last 24 hours</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600">Total Calls</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
          <p className="text-xs text-gray-500 mt-2">All-time volume</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-600">Revenue</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">ETB 0</div>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-3 text-gray-600">
          <p>✓ Admin panel is configured and connected to your database</p>
          <p>✓ Navigate using the menu to manage users, transactions, and analytics</p>
          <p>✓ Check the settings page to manage your profile and preferences</p>
        </div>
      </div>
    </div>
  )
}
