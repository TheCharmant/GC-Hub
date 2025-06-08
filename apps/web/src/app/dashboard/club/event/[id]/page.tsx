'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  club: {
    id: string;
    name: string;
  };
}

interface Registration {
  id: string;
  eventId: string;
  attended: boolean;
  hoursEarned: number | null;
}

export default function EventDetails({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/club');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:3001/api/events/${params.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-User-ID': user.id,
            'X-User-Role': user.role
          }
        });

        if (!eventResponse.ok) throw new Error('Failed to fetch event details');
        const eventData = await eventResponse.json();
        setEvent(eventData);

        // Fetch registration status
        const registrationsResponse = await fetch(`http://localhost:3001/api/registrations/user/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-User-ID': user.id,
            'X-User-Role': user.role
          }
        });

        if (!registrationsResponse.ok) throw new Error('Failed to fetch registration status');
        const registrationsData = await registrationsResponse.json();
        const userRegistration = registrationsData.find((reg: Registration) => reg.eventId === params.id);
        setRegistration(userRegistration || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [isAuthenticated, user, token, params.id]);

  const handleRegister = async () => {
    if (!isAuthenticated || !user || !token) return;
    
    setRegistering(true);
    try {
      const response = await fetch('http://localhost:3001/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Role': user.role
        },
        body: JSON.stringify({ eventId: params.id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register for event');
      }

      const registrationData = await response.json();
      setRegistration(registrationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="text-center text-white">Loading...</div>
    </div>;
  }

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="text-center text-white">Loading event details...</div>
    </div>;
  }

  if (error || !event) {
    return <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="text-center text-white">
        <p className="text-red-500 mb-4">{error || 'Event not found'}</p>
        <Link href="/dashboard/club/feed" className="text-purple-300 hover:text-purple-100">
          ← Back to Feed
        </Link>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/gc-hub-logo.svg" 
            alt="GC Hub Logo" 
            width={150} 
            height={60} 
            className="mx-auto mb-4"
          />
          <Link href="/dashboard/club/feed" className="text-purple-300 hover:text-purple-100 mb-4 inline-block">
            ← Back to Feed
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Event Details</h2>
                <div className="space-y-2 text-white/80">
                  <p>📅 Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>⏰ Time: {event.startTime} - {event.endTime}</p>
                  <p>📍 Location: {event.location}</p>
                  <p>👥 Organizer: {event.club.name}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Contact Information</h2>
                <div className="space-y-2 text-white/80">
                  <p>👤 Organizer: {event.createdBy.name}</p>
                  <p>📧 Email: {event.createdBy.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
              <p className="text-white/80">{event.description}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            {!registration ? (
              <button
                onClick={handleRegister}
                disabled={registering}
                className={`px-6 py-3 rounded-md transition-colors ${
                  registering
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white font-semibold`}
              >
                {registering ? 'Registering...' : 'Register for Event'}
              </button>
            ) : (
              <div className="text-center">
                <span className="text-green-400 text-lg font-semibold block mb-2">
                  ✓ You are registered for this event
                </span>
                {registration.attended && registration.hoursEarned && (
                  <span className="text-white/80">
                    Hours Earned: {registration.hoursEarned}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 