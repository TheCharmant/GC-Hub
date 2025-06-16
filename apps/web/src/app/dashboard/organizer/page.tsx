import { Building2, CalendarDays, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrganizerDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <Building2 className="h-8 w-8 mr-2 text-gray-700" /> Organizer Dashboard
        </h1>
        <p className="text-gray-600">Welcome to your event management dashboard!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Events Feed</h2>
            <p className="text-gray-700 mb-4">View and manage all events</p>
            <Link href="/dashboard/organizer/feed">
              <Button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                View Events
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Event Management</h2>
            <p className="text-gray-700 mb-4">Create and manage events, track attendance</p>
            <Link href="/dashboard/organizer/manage">
              <Button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                Manage Events
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Reports</h2>
            <p className="text-gray-700 mb-4">View participation logs and statistics</p>
            <Link href="/dashboard/organizer/reports">
              <Button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}