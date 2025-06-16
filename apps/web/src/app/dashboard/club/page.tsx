import { Building2, CalendarDays, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClubDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <Building2 className="h-8 w-8 mr-2 text-gray-700" /> Club Dashboard
        </h1>
        <p className="text-gray-600">Welcome to your club management dashboard!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Members</h2>
            <p className="text-gray-700 mb-4">Manage your club members and roles</p>
            <Link href="/dashboard/club/manage/members">
              <Button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                View Members
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Events</h2>
            <p className="text-gray-700 mb-4">Create and manage club events</p>
            <Link href="/dashboard/club/manage">
              <Button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                Manage Events
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Club Profile</h2>
            <p className="text-gray-700 mb-4">Update your club information and settings</p>
            <Link href="/dashboard/club/profile">
              <Button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}