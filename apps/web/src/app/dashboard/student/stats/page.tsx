'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  LayoutGrid, // For Dashboard header
  Award, // For Total Hours badge
  Star, // For Events Attended stars
  FileText, // For Total Certificates
  Clock // For Upcoming Events
} from 'lucide-react';

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
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-700">Loading statistics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 bg-[#faf7ef]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <LayoutGrid className="h-8 w-8 mr-2 text-gray-700" /> Dasboard
        </h1>
        <p className="text-gray-600">Track your volunteer hours</p>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {stats && (
        <div className="space-y-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Hours Card */}
            <div className="bg-[#a8a4c5] p-6 rounded-lg shadow-md text-white flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">Total Hours</h3>
                <p className="text-5xl font-bold mb-2">{stats.totalHours} Hours</p>
                <div className="flex items-center text-sm mb-4">
                  <Award className="h-5 w-5 mr-1" />
                  <span>ROOKIE VOLUNTEER</span>
                </div>
              </div>
              <Link href="#" className="flex items-center justify-between text-white/80 hover:text-white transition-colors">
                <span>Completed</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Events Attended Card */}
            <div className="bg-[#a8a4c5] p-6 rounded-lg shadow-md text-white flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">Events Attended</h3>
                <p className="text-5xl font-bold mb-2">{stats.attendedEvents} Events</p>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.min(stats.attendedEvents, 5) ? 'text-yellow-400' : 'text-gray-300'} mr-1`} fill="currentColor" />
                  ))}
                </div>
              </div>
              <Link href="#" className="flex items-center justify-between text-white/80 hover:text-white transition-colors">
                <span>Completed</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Total Certificates Card */}
            <div className="bg-[#a8a4c5] p-6 rounded-lg shadow-md text-white flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">Total Certificates</h3>
                <p className="text-5xl font-bold mb-2">{stats.totalEvents} Certificates</p> {/* Assuming totalEvents can represent certificates for now */}
                <div className="flex items-center text-sm mb-4">
                  <FileText className="h-5 w-5 mr-1" />
                  <span>Certificates</span>
                </div>
              </div>
              <Link href="#" className="flex items-center justify-between text-white/80 hover:text-white transition-colors">
                <span>See all</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-[#a8a4c5] p-6 rounded-lg shadow-md text-white max-w-sm">
            <h3 className="text-lg font-medium mb-2">Upcoming Events</h3>
            <p className="text-3xl font-bold mb-2">CCS Week</p>
            <div className="flex items-center text-sm mb-4">
              <Clock className="h-5 w-5 mr-1" />
              <span>In 2 days at Room 305</span>
            </div>
            <Link href="#" className="flex items-center justify-between text-white/80 hover:text-white transition-colors">
              <span>More Events</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}