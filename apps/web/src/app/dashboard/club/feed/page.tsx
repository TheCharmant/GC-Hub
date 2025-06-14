'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Speaker,
  CalendarDays,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Globe,
  FileText
} from 'lucide-react';

interface Club {
  name: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  registrations?: number;
  approved: boolean;
  clubId: string;
  club: {
    id: string;
    name: string;
  };
}

interface Registration {
  id: string;
  eventId: string;
  attended: boolean;
}

export default function ClubFeed() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center text-gray-700">Loading events...</div>;
  }

  if (error) {
    return <p className="text-red-500 mb-4">Error: {error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <FileText className="h-8 w-8 mr-2 text-gray-700" /> Club Events
        </h1>
        <p className="text-gray-600">Manage and view your club's events</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                  <span className={`px-2 py-1 rounded text-sm ${
                    event.approved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Globe className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{event.club?.name || 'GC Student Council'}</span>
                  <CalendarDays className="h-4 w-4 mr-1 ml-4 text-gray-400" />
                  <span>Date: {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <p className="text-gray-700 mb-4 h-20 overflow-hidden text-ellipsis">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Speaker className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Location: {event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Time: {event.startTime} - {event.endTime}</span>
                </div>
                <div className="h-48 bg-gray-100 mb-4 flex items-center justify-center rounded-md overflow-hidden">
                  <Image src="/placeholder-event.png" alt="Event Image" width={200} height={150} className="object-cover w-full h-full" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 p-0 h-auto transition-colors">
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                      <span className="ml-1 text-gray-600">{event.registrations || 0}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Capacity: {event.registrations || 0}/{event.capacity}
                    </div>
                  </div>
                  <Link href={`/dashboard/club/events/${event.id}`} className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                    Manage Event
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No events found.</p>
        )}
      </div>
    </div>
  );
}





