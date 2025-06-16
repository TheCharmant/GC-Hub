'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowLeft } from 'lucide-react';

interface Registration {
  id: string;
  userId: string;
  eventId: string;
  attended: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Event {
  id: string;
  title: string;
}

export default function EventParticipantsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && eventId) {
      fetchEventDetails();
      fetchRegistrations();
    }
  }, [token, eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch event details');
      }

      const data = await response.json();
      setEventDetails(data);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching event details');
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/registrations/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch registrations');
      }

      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceUpdate = async (registrationId: string, attended: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        },
        body: JSON.stringify({ attended })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update attendance');
      }

      // Optimistically update UI
      setRegistrations(prevRegistrations =>
        prevRegistrations.map(reg =>
          reg.id === registrationId ? { ...reg, attended } : reg
        )
      );
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating attendance');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading participants...</div>;
  }

  if (error) {
    return <p className="text-red-500 mb-4">Error: {error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <Button 
          onClick={() => router.push('/dashboard/organizer/manage')}
          className="text-gray-700 hover:text-gray-900 transition-colors bg-transparent p-0 mb-4 flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Manage Events
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          Participants for {eventDetails?.title || 'Event'}
        </h1>
        <p className="text-gray-600">View and manage attendance for this event.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {registrations.length > 0 ? (
          <div className="space-y-4">
            {registrations.map(registration => (
              <div key={registration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <p className="font-semibold text-gray-800">{registration.user.name}</p>
                  <p className="text-sm text-gray-600">{registration.user.email}</p>
                </div>
                <Button
                  onClick={() => handleAttendanceUpdate(registration.id, !registration.attended)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    registration.attended
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {registration.attended ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
                  {registration.attended ? 'Present' : 'Mark Present'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 py-8">No participants registered for this event yet.</div>
        )}
      </div>
    </div>
  );
} 