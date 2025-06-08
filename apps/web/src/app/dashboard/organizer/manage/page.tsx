'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link'
import Image from 'next/image'

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
}

interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  attended: boolean;
}

export default function OrganizerManage() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const fetchRegistrations = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/registrations/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });

      if (!response.ok) throw new Error('Failed to fetch registrations');
      
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEventSelect = async (event: Event) => {
    setSelectedEvent(event);
    await fetchRegistrations(event.id);
  };

  const handleAttendanceUpdate = async (registrationId: string, attended: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attended })
      });

      if (!response.ok) throw new Error('Failed to update attendance');
      
      // Refresh registrations after update
      if (selectedEvent) {
        await fetchRegistrations(selectedEvent.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
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
        <h1 className="text-3xl font-bold text-white">Event Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events List */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Your Events</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-md cursor-pointer transition-colors ${
                  selectedEvent?.id === event.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
                onClick={() => handleEventSelect(event)}
              >
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm opacity-75">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details and Attendance */}
        {selectedEvent && (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Event Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white">{selectedEvent.title}</h3>
                <p className="text-white/70">{selectedEvent.description}</p>
                <p className="text-white/70">Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
                <p className="text-white/70">Location: {selectedEvent.location}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-4">Attendance</h3>
                <div className="space-y-2">
                  {registrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between bg-white/5 p-3 rounded-md"
                    >
                      <span className="text-white">User ID: {registration.userId}</span>
                      <button
                        onClick={() => handleAttendanceUpdate(registration.id, !registration.attended)}
                        className={`px-3 py-1 rounded-md ${
                          registration.attended
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        } text-white transition-colors`}
                      >
                        {registration.attended ? 'Present' : 'Absent'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
