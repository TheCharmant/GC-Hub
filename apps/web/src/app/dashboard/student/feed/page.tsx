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

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  club: {
    id: string;
    name: string;
    description: string;
  } | null;
  createdAt?: string;
}

export default function StudentFeed() {
  const [events, setEvents] = useState<Event[]>([]);
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
    const fetchEvents = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await fetch('http://localhost:3001/api/events', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user-id': user.id
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, user, token]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || !user) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-700">Loading events...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <FileText className="h-8 w-8 mr-2 text-gray-700" /> Feed
        </h1>
        <p className="text-gray-600">Stay updated with previous and upcoming events</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Globe className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{event.club?.name || 'GC Student Council'}</span>
                  <CalendarDays className="h-4 w-4 mr-1 ml-4 text-gray-400" />
                  <span>Date Posted: {new Date(event.createdAt || event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <p className="text-gray-700 mb-4 h-20 overflow-hidden text-ellipsis">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Pencil className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{event.createdBy.name} | {event.createdBy.email}</span>
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
                      <span className="ml-1 text-gray-600">10</span>{/* Placeholder for likes */}
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 p-0 h-auto transition-colors">
                        <ThumbsDown className="h-5 w-5" />
                      </Button>
                      <span className="ml-1 text-gray-600">0</span>{/* Placeholder for dislikes */}
                    </div>
                  </div>
                  <Link href={`/dashboard/student/events/${event.id}`} className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                    See more
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
