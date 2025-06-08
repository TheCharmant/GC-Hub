'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
}

export default function OrganizerFeed() {
  const { user, token } = useAuth();
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

      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
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
      <h1 className="text-3xl font-bold text-white">All Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-white/70 mb-4">{event.description}</p>
            <div className="space-y-2">
              <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Location:</span> {event.location}</p>
              <p><span className="font-medium">Status:</span> {event.status}</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                View Details
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
