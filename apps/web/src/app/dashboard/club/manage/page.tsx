'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

export default function ManageEvents() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userClub, setUserClub] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 0,
    clubId: ''
  });

  useEffect(() => {
    fetchUserClub();
    fetchEvents();
  }, []);

  const fetchUserClub = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/profile/club', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user?.id || '',
          'X-User-Role': user?.role || ''
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch club');
      
      const data = await response.json();
      setUserClub(data);
      setFormData(prev => ({ ...prev, clubId: data.id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user?.id || '',
          'X-User-Role': user?.role || ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userClub) {
      setError('You must be a club leader to create events');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = selectedEvent 
        ? `http://localhost:3001/api/events/${selectedEvent.id}`
        : 'http://localhost:3001/api/events';
      
      const eventData = {
        ...formData,
        clubId: userClub.id
      };

      console.log('Submitting event data:', eventData);
      
      const response = await fetch(url, {
        method: selectedEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user?.id || '',
          'X-User-Role': user?.role || ''
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save event');
      }
      
      const savedEvent = await response.json();
      console.log('Saved event:', savedEvent);
      
      await fetchEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        capacity: 0,
        clubId: userClub.id
      });
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    if (!userClub) {
      setError('You must be a club leader to delete events');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user?.id || '',
          'X-User-Role': user?.role || ''
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }
      
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (event: Event) => {
    if (!userClub || event.clubId !== userClub.id) {
      setError('You can only edit events for your club');
      return;
    }
    setSelectedEvent(event);
    setFormData(event);
    setIsModalOpen(true);
  };

  const handleViewParticipants = (eventId: string) => {
    router.push(`/dashboard/club/manage/participants/${eventId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Events</h1>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setFormData({
              title: '',
              description: '',
              date: '',
              startTime: '',
              endTime: '',
              location: '',
              capacity: 0,
              clubId: userClub?.id || ''
            });
            setIsModalOpen(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Create New Event
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-white">Loading events...</div>
      ) : (
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
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-purple-300 hover:text-purple-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-300 hover:text-red-100"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewParticipants(event.id)}
                  className="text-blue-300 hover:text-blue-100"
                >
                  View Participants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            {userClub && (
              <p className="text-purple-300 mb-4">
                Creating event for: <span className="font-semibold">{userClub.name}</span>
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 text-white hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-800"
                >
                  {loading ? 'Saving...' : selectedEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

