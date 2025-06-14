'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Calendar, Users, MapPin, Clock, Plus, Edit2, Trash2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
  leaderId: string;
}

export default function ManageEvents() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userClub, setUserClub] = useState<ClubProfile | null>(null);
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
    if (!user) {
      router.push('/login');
      return;
    }
    fetchUserClub();
  }, [user]);

  const fetchUserClub = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/profile/club', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch club');
      }
      
      const data = await response.json();
      setUserClub(data);
      setFormData(prev => ({ ...prev, clubId: data.id }));
      
      // Only fetch events if we have the club data
      if (data.leaderId === user?.id) {
        fetchEvents();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching club:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events/my', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userClub || userClub.leaderId !== user?.id) {
      setError('You must be a club leader to create events');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = selectedEvent 
        ? `http://localhost:3001/api/events/${selectedEvent.id}`
        : 'http://localhost:3001/api/events';
      
      // Only send the necessary data for update/create
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        capacity: formData.capacity,
        clubId: userClub.id // Always use the current club's ID
      };

      console.log('Submitting event data:', eventData);
      console.log('User ID:', user?.id);
      console.log('Club ID:', userClub.id);
      console.log('Event ID:', selectedEvent?.id);
      
      const response = await fetch(url, {
        method: selectedEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
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
    if (!userClub || userClub.leaderId !== user?.id) {
      setError('You must be a club leader to delete events');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
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
    if (!userClub || userClub.leaderId !== user?.id) {
      setError('You must be a club leader to edit events');
      return;
    }

    // Verify the event belongs to the user's club
    if (event.clubId !== userClub.id) {
      setError('You can only edit events for your club');
      return;
    }

    console.log('Editing event:', event);
    console.log('User club:', userClub);
    console.log('User ID:', user?.id);

    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      capacity: event.capacity,
      clubId: userClub.id // Always use the current club's ID
    });
    setIsModalOpen(true);
  };

  const handleViewParticipants = (eventId: string) => {
    router.push(`/dashboard/club/manage/participants/${eventId}`);
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <p className="text-red-500 mb-4">Error: {error}</p>;
  }

  if (!userClub) {
    return (
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Club Found</h1>
          <p className="text-gray-600">You need to be part of a club to manage events.</p>
        </div>
      </div>
    );
  }

  if (userClub.leaderId !== user?.id) {
    return (
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be a club leader to manage events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <Calendar className="h-8 w-8 mr-2 text-gray-700" /> Manage Events
        </h1>
        <p className="text-gray-600">Create and manage your club's events</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
        <Button
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
              clubId: userClub.id
            });
            setIsModalOpen(true);
          }}
          className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{typeof event.registrations === 'number' ? event.registrations : 0} / {event.capacity} participants</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setSelectedEvent(event);
                    setFormData(event);
                    setIsModalOpen(true);
                  }}
                  className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(event.id)}
                  className="bg-white text-red-600 hover:bg-red-50 border border-red-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  onClick={() => handleViewParticipants(event.id)}
                  className="bg-white text-gray-700 hover:bg-gray-50 border border-blue-200"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  View Participants
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedEvent ? 'Edit Event' : 'Create Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                    min="1"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                >
                  {selectedEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

