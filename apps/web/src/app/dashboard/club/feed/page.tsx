'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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

  if (loading) {
    return <div className="text-white">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Club Events</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <span className={`px-2 py-1 rounded text-sm ${
                event.approved 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {event.approved ? 'Approved' : 'Pending'}
              </span>
        </div>
              <p className="text-white/80 mb-2">
                {new Date(event.date).toLocaleDateString()} • {event.startTime}-{event.endTime}
              </p>
              <p className="text-white/90 mb-4">{event.description}</p>
              <p className="text-sm text-white/70">Location: {event.location}</p>
              <p className="text-sm text-white/70 mb-4">
              Capacity: {event.registrations || 0}/{event.capacity}
            </p>
            <p className="text-sm text-white/70 mb-4">
              Organizer: {event.club?.name || 'GC Student Council'}
              </p>
                <Link 
              href={`/dashboard/club/events/${event.id}`}
              className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
              View Details
                </Link>
            </div>
          ))}
      </div>
    </div>
  );
}





