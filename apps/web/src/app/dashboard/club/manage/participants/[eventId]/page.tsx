'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCheck, XCircle } from 'lucide-react';

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
    return (
      <div className="max-w-7xl mx-auto py-6">
        <div className="text-center text-gray-700">Loading participants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button
            onClick={() => router.back()}
            className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
              <UserCheck className="h-8 w-8 mr-2 text-gray-700" /> Event Participants
            </h1>
            {eventDetails && (
              <p className="text-gray-600">
                {eventDetails.title} • {new Date(eventDetails.date).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button
            onClick={() => router.back()}
            className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {participant.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(participant.registeredAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      participant.attended 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {participant.attended ? 'Attended' : 'Not Attended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      onClick={() => handleMarkAttendance(participant.id, !participant.attended)}
                      className={`${
                        participant.attended
                          ? 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
                          : 'bg-white text-green-600 hover:bg-green-50 border border-green-200'
                      }`}
                    >
                      {participant.attended ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Mark as Not Attended
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Mark as Attended
                        </>
                      )}
                    </Button>
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