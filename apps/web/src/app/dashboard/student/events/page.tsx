'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import {
  CalendarDays,
  Search,
  FileText
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  club: {
    id: string;
    name: string;
    description: string;
  } | null;
  createdAt?: string;
}

interface Registration {
  id: string;
  eventId: string;
  event: Event;
  attended: boolean;
  hoursEarned: number | null;
}

export default function StudentEvents() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/student');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await fetch(`http://localhost:3001/api/registrations/user/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user-id': user.id
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch registrations');
        
        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [isAuthenticated, user, token]);

  const filteredRegistrations = registrations.filter(reg =>
    reg.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.event.club?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRegistrationStatus = (registration: Registration) => {
    if (registration.attended) {
      return 'Registered';
    } else {
      // This implies pending if it's in the list but not attended
      return 'Pending'; 
    }
  };

  const getAttendanceStatus = (registration: Registration) => {
    if (registration.attended) {
      return 'Verified';
    } else {
      return 'Not yet verified';
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-700">Loading events...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 bg-[#faf7ef]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <CalendarDays className="h-8 w-8 mr-2 text-gray-700" /> My Event
        </h1>
        <p className="text-gray-600">List of your previous and upcoming events</p>
        <div className="mt-4 relative flex justify-end">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md w-full max-w-xs bg-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {filteredRegistrations.length === 0 && !loading && !error && (
        <p className="text-gray-700">No events found.</p>
      )}

      <div className="bg-[#7a8c9e] rounded-t-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-[3fr_1fr_1fr_0.5fr] gap-4 p-4 text-white font-semibold">
          <div>EVENT</div>
          <div className="text-center">REGISTRATION</div>
          <div className="text-center">ATTENDANCE</div>
          <div className="text-center">DETAILS</div>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
        {filteredRegistrations.map((registration) => (
          <div key={registration.id} className="grid grid-cols-[3fr_1fr_1fr_0.5fr] items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
            {/* Event Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{registration.event.title}</h3>
              <p className="text-sm text-gray-600">Date: {new Date(registration.event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} {new Date(`2000-01-01T${registration.event.startTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
              <p className="text-sm text-gray-600">Venue: {registration.event.location}</p>
            </div>

            {/* Registration Column */}
            <div className="text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getRegistrationStatus(registration) === 'Registered' ? 'bg-green-100 text-green-700' :
                getRegistrationStatus(registration) === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {getRegistrationStatus(registration)}
              </span>
            </div>

            {/* Attendance Column */}
            <div className="text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                getAttendanceStatus(registration) === 'Verified' ? 'bg-green-100 text-green-700' :
                getAttendanceStatus(registration) === 'Not yet verified' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {getAttendanceStatus(registration)}
              </span>
            </div>

            {/* Details Column */}
            <div className="text-center">
              <Link
                href={`/dashboard/student/events/${registration.event.id}`}
                className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" /> Event Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
