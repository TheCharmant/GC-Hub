export default function OrganizerDashboard() {
  return (
    <div className="min-h-screen bg-[#faf7ef] p-8">
      <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>
      <p className="mb-4">Welcome to your event organizer dashboard!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Events</h2>
          <p className="text-gray-600">Create and manage campus-wide events</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Manage Events
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <p className="text-gray-600">Track attendance for your events</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            View Attendance
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Reports</h2>
          <p className="text-gray-600">Generate reports for events and participation</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}