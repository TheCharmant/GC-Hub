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
  club?: {
    id: string;
    name: string;
    description: string;
  };
}

interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
  attended: boolean;
}

interface ClubProfile {
  id: string;
  name: string;
  description: string;
}

export default function EventDetails({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [clubProfile, setClubProfile] = useState<ClubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchEventData();
      fetchClubProfile();
    }
  }, [user?.id, params.id]);

  const fetchEventData = async () => {
    try {
      // Fetch event details
      const eventResponse = await fetch(`http://localhost:3001/api/events/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });
      
      if (!eventResponse.ok) throw new Error('Failed to fetch event details');
      const eventData = await eventResponse.json();
      setEvent(eventData);

      // Fetch registrations
      const registrationsResponse = await fetch(`http://localhost:3001/api/registrations/event/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });
      
      if (!registrationsResponse.ok) throw new Error('Failed to fetch registrations');
      const registrationsData = await registrationsResponse.json();
      setRegistrations(registrationsData);
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

  if (loading) {
    return <div className="text-white">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!event) {
    return <div className="text-white">Event not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          <p className="text-white/80">
            {new Date(event.date).toLocaleDateString()} • {event.startTime}-{event.endTime}
          </p>
        </div>
        <Link
          href="/dashboard/club/events"
          className="text-white hover:text-white/80"
        >
          ← Back to Events
        </Link>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Event Details</h3>
            <div className="space-y-2 text-white/90">
              <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {event.startTime} - {event.endTime}</p>
              <p><span className="font-medium">Location:</span> {event.location}</p>
              <p><span className="font-medium">Capacity:</span> {event.registrations || 0}/{event.capacity}</p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className={`px-2 py-1 rounded text-sm ${
                  event.approved 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {event.approved ? 'Approved' : 'Pending'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-white/90">{event.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Organizer</h3>
            <div className="space-y-2 text-white/90">
              <p><span className="font-medium">Club:</span> {clubProfile?.name || 'Loading...'}</p>
              <p><span className="font-medium">Club ID:</span> {clubProfile?.id || 'Loading...'}</p>
              {clubProfile?.description && (
                <p><span className="font-medium">About:</span> {clubProfile.description}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Registrations</h3>
            {registrations.length > 0 ? (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div key={registration.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">User ID: {registration.userId}</p>
                        <p className="text-sm text-white/70">
                          Registered on: {new Date(registration.registeredAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        registration.attended 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {registration.attended ? 'Attended' : 'Not Attended'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70">No registrations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 