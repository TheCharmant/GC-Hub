'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    return <div className="text-center text-gray-700">Loading event details...</div>;
  }

  if (error) {
    return <p className="text-red-500 mb-4">Error: {error}</p>;
  }

  if (!event) {
    return <div className="text-gray-700">Event not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Calendar className="h-8 w-8 mr-2 text-gray-700" /> {event.title}
          </h1>
          <Link href="/dashboard/club/feed">
            <Button variant="outline" className="text-gray-700 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <Clock className="h-4 w-4 mr-1 ml-4" />
          <span>{event.startTime}-{event.endTime}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span>Date: {new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span>Time: {event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span>Location: {event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                <span>Capacity: {event.registrations || 0}/{event.capacity}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className={`px-2 py-1 rounded text-sm ${
                event.approved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {event.approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Organizer</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <p className="text-gray-700"><span className="font-medium">Club:</span> {clubProfile?.name || 'Loading...'}</p>
                <p className="text-gray-700"><span className="font-medium">Club ID:</span> {clubProfile?.id || 'Loading...'}</p>
                {clubProfile?.description && (
                  <p className="text-gray-700"><span className="font-medium">About:</span> {clubProfile.description}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrations</h3>
            {registrations.length > 0 ? (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div key={registration.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">User ID: {registration.userId}</p>
                        <p className="text-sm text-gray-500">
                          Registered on: {new Date(registration.registeredAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {registration.attended ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        )}
                        <span className={`px-2 py-1 rounded text-sm ${
                          registration.attended 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.attended ? 'Attended' : 'Not Attended'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No registrations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 