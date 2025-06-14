'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart2, Users, Clock, Calendar } from 'lucide-react';

interface ClubStats {
  clubId: string;
  totalEvents: number;
  totalAttendees: number;
  totalHours: number;
}

interface EventStats {
  eventId: string;
  totalRegistered: number;
  totalAttended: number;
  totalHours: number;
  attendanceRate: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function ClubStats() {
  const { user, token } = useAuth();
  const [clubStats, setClubStats] = useState<ClubStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedEventStats, setSelectedEventStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchClubStats();
      fetchEvents();
    }
  }, [user?.id]);

  const fetchClubStats = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/stats/club/${user?.id}`, {
        headers: {
          'user-id': user?.id || '',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch club stats');
      
      const data = await response.json();
      setClubStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events/my', {
        headers: {
          'user-id': user?.id || '',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchEventStats = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/stats/event/${eventId}`, {
        headers: {
          'user-id': user?.id || '',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch event stats');
      
      const data = await response.json();
      setSelectedEventStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    if (eventId) {
      fetchEventStats(eventId);
    } else {
      setSelectedEventStats(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading statistics...</div>;
  }

  if (error) {
    return <p className="text-red-500 mb-4">Error: {error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <BarChart2 className="h-8 w-8 mr-2 text-gray-700" /> Club Statistics
        </h1>
        <p className="text-gray-600">View your club's performance metrics and event statistics</p>
      </div>

      {/* Club Overview */}
      {clubStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-gray-700 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Total Events</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{clubStats.totalEvents}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-gray-700 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Total Attendees</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{clubStats.totalAttendees}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-gray-700 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Total Hours</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{clubStats.totalHours}</p>
          </div>
        </div>
      )}

      {/* Event Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Statistics</h2>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({new Date(event.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* Event Details */}
        {selectedEventStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Registered</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedEventStats.totalRegistered}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Attended</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedEventStats.totalAttended}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedEventStats.attendanceRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedEventStats.totalHours}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


