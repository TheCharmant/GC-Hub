'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  club?: {
    id: string;
    name: string;
  };
}

interface Registration {
  id: string;
  event: Event;
  attended: boolean;
  hoursEarned: number | null;
}

export default function StudentEvents() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'registered' | 'attended'>('registered');
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/student');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await fetch(`http://localhost:3001/api/registrations/user/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-User-ID': user.id,
            'X-User-Role': user.role
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch registrations');
        
        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [isAuthenticated, user, token]);

  const filteredRegistrations = registrations.filter(reg => 
    filter === 'registered' ? !reg.attended : reg.attended
  );

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="text-center text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/gc-hub-logo.svg" 
            alt="GC Hub Logo" 
            width={150} 
            height={60} 
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white">Welcome, {user.name}!</h2>
          <p className="text-white/80">Student ID: {user.id}</p>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
              <p className="text-white/80">Track your event registrations and attendance</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('registered')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'registered'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                Registered
              </button>
              <button
                onClick={() => setFilter('attended')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'attended'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                Attended
              </button>
            </div>
          </div>
        </div>

        {loading && <p className="text-white">Loading events...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((registration) => (
            <div key={registration.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">{registration.event.title}</h3>
              <p className="text-white/80 mb-4">{registration.event.description}</p>
              <div className="space-y-2 text-white/60">
                <p>📅 {new Date(registration.event.date).toLocaleDateString()}</p>
                <p>⏰ {registration.event.startTime} - {registration.event.endTime}</p>
                <p>📍 {registration.event.location}</p>
                <p>👥 Organizer: {registration.event.club?.name || 'Unknown Club'}</p>
                {registration.attended && registration.hoursEarned && (
                  <p>⏱️ Hours Earned: {registration.hoursEarned}</p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Link 
                  href={`/dashboard/student/events/${registration.event.id}`}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
