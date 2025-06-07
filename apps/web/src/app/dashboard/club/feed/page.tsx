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
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  club?: Club;
}

export default function ClubFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/club');
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
            'X-User-ID': user.id,
            'X-User-Role': user.role
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

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="text-center text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/gc-hub-logo.svg" 
            alt="GC Hub Logo" 
            width={150} 
            height={60} 
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white">Welcome, {user.name}!</h2>
          <p className="text-white/80">Club ID: {user.id}</p>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2 text-white">Club Feed</h1>
          <p className="text-white/80">Browse all events from clubs and organizations</p>
        </div>

        {loading && <p className="text-white">Loading events...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-white/80 mb-2">
                {new Date(event.date).toLocaleDateString()} • {event.startTime}-{event.endTime}
              </p>
              <p className="text-white/90 mb-4">{event.description}</p>
              <p className="text-sm text-white/70">Location: {event.location}</p>
              <p className="text-sm text-white/70 mb-4">
                Organized by: {event.club?.name || 'Unknown'}
              </p>
              <Link href={`/dashboard/club/event/${event.id}`} className="text-purple-300 hover:text-purple-100">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





