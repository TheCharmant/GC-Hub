'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

export default function ClubStats() {
  const { user, token } = useAuth();
  const [clubStats, setClubStats] = useState<ClubStats | null>(null);
  const [selectedEventStats, setSelectedEventStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchClubStats();
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

  if (loading) {
    return <div className="text-white">Loading statistics...</div>;
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
      <h1 className="text-3xl font-bold text-white">Club Statistics</h1>

      {/* Club Overview */}
      {clubStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
            <h3 className="text-lg font-semibold mb-2">Total Events</h3>
            <p className="text-3xl font-bold">{clubStats.totalEvents}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
            <h3 className="text-lg font-semibold mb-2">Total Attendees</h3>
            <p className="text-3xl font-bold">{clubStats.totalAttendees}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
            <h3 className="text-lg font-semibold mb-2">Total Hours</h3>
            <p className="text-3xl font-bold">{clubStats.totalHours}</p>
          </div>
        </div>
      )}

      {/* Event Details */}
      {selectedEventStats && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Event Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
              <h3 className="text-lg font-semibold mb-4">Registration Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70">Total Registered</p>
                  <p className="text-2xl font-bold">{selectedEventStats.totalRegistered}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Attended</p>
                  <p className="text-2xl font-bold">{selectedEventStats.totalAttended}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Attendance Rate</p>
                  <p className="text-2xl font-bold">{selectedEventStats.attendanceRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Hours</p>
                  <p className="text-2xl font-bold">{selectedEventStats.totalHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


