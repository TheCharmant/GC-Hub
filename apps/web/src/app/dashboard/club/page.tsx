export default function ClubDashboard() {
  return (
    <div className="min-h-screen bg-[#faf7ef] p-8">
      <h1 className="text-3xl font-bold mb-6">Club Dashboard</h1>
      <p className="mb-4">Welcome to your club management dashboard!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <p className="text-gray-600">Manage your club members and roles</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            View Members
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Events</h2>
          <p className="text-gray-600">Create and manage club events</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Manage Events
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Club Profile</h2>
          <p className="text-gray-600">Update your club information and settings</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}