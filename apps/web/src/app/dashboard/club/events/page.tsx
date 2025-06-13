'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
}

interface ClubProfile {
  id: string;
  name: string;
  description: string;
}

export default function ClubEvents() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [clubProfile, setClubProfile] = useState<ClubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    if (user?.id) {
      fetchEvents();
      fetchClubProfile();
    }
  }, [user?.id]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
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

  const fetchClubProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/profile/club', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch club profile');
      
      const data = await response.json();
      setClubProfile(data);
    } catch (err) {
      console.error('Error fetching club profile:', err);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'approved') return event.approved;
    if (filter === 'pending') return !event.approved;
    return true;
  });

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Club Events</h1>
          {clubProfile && (
            <p className="text-white/80">Club: {clubProfile.name}</p>
          )}
        </div>
        <Link
          href="/dashboard/club/manage"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Manage Events
        </Link>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-md ${
            filter === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md ${
            filter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Pending
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
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
            <div className="flex justify-end">
              <Link
                href={`/dashboard/club/events/${event.id}`}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center text-white/70 py-8">
          No events found.
        </div>
      )}
    </div>
  );
} 