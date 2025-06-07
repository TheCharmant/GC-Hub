'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Participant {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  registeredAt: string;
  attended: boolean;
}

export default function EventParticipants({ params }: { params: { eventId: string } }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:3001/api/events/${params.eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-ID': user?.id || '',
            'X-User-Role': user?.role || ''
          }
        });
        
        if (!eventResponse.ok) throw new Error('Failed to fetch event details');
        const eventData = await eventResponse.json();
        setEventDetails(eventData);

        // Fetch participants
        const participantsResponse = await fetch(`http://localhost:3001/api/registrations/event/${params.eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-User-ID': user?.id || '',
            'X-User-Role': user?.role || ''
          }
        });
        
        if (!participantsResponse.ok) throw new Error('Failed to fetch participants');
        const participantsData = await participantsResponse.json();
        setParticipants(participantsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.eventId, token, user]);

  const handleMarkAttendance = async (participantId: string, attended: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/api/registrations/${participantId}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user?.id || '',
          'X-User-Role': user?.role || ''
        },
        body: JSON.stringify({ attended })
      });

      if (!response.ok) throw new Error('Failed to update attendance');

      // Update local state
      setParticipants(participants.map(p => 
        p.id === participantId ? { ...p, attended } : p
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-white">Loading participants...</div>;
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
          <h1 className="text-3xl font-bold text-white">Event Participants</h1>
          {eventDetails && (
            <p className="text-white/80 mt-2">
              {eventDetails.title} • {new Date(eventDetails.date).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="text-white hover:text-white/80"
        >
          ← Back to Events
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Registered On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {participants.map((participant) => (
                <tr key={participant.id} className="text-white">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participant.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participant.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(participant.registeredAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      participant.attended 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {participant.attended ? 'Attended' : 'Not Attended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleMarkAttendance(participant.id, !participant.attended)}
                      className={`text-sm ${
                        participant.attended
                          ? 'text-red-300 hover:text-red-100'
                          : 'text-green-300 hover:text-green-100'
                      }`}
                    >
                      {participant.attended ? 'Mark as Not Attended' : 'Mark as Attended'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}