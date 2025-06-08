'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  userId: string;
  totalEvents: number;
  registeredEvents: number;
  attendedEvents: number;
  upcomingEvents: number;
  totalHours: number;
  favoriteClubs: string[];
  recentActivity: {
    eventId: string;
    eventTitle: string;
    date: string;
    status: 'registered' | 'attended';
    hoursEarned: number;
  }[];
}

export default function StudentStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/student');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await fetch(`http://localhost:3001/api/stats/user/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-User-ID': user.id,
            'X-User-Role': user.role
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user, token]);

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
          <h1 className="text-3xl font-bold text-white mb-2">My Statistics</h1>
          <p className="text-white/80">Track your participation and achievements</p>
        </div>

        {loading && <p className="text-white">Loading statistics...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Total Events</h3>
                <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Registered Events</h3>
                <p className="text-3xl font-bold text-white">{stats.registeredEvents}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Attended Events</h3>
                <p className="text-3xl font-bold text-white">{stats.attendedEvents}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Upcoming Events</h3>
                <p className="text-3xl font-bold text-white">{stats.upcomingEvents}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">Favorite Clubs</h3>
                {stats.favoriteClubs.length > 0 ? (
                  <ul className="space-y-2">
                    {stats.favoriteClubs.map((clubId) => (
                      <li key={clubId} className="text-white/80">
                        {clubId}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/60">No favorite clubs yet</p>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                {stats.recentActivity.length > 0 ? (
                  <ul className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                      <li key={activity.eventId} className="text-white/80">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{activity.eventTitle}</p>
                            <p className="text-sm text-white/60">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            activity.status === 'registered' 
                              ? 'bg-yellow-500/20 text-yellow-300' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                        </div>
                        {activity.hoursEarned > 0 && (
                          <p className="text-sm text-white/60 mt-1">
                            Hours Earned: {activity.hoursEarned}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/60">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
