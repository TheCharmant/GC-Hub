'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Report {
  id: string;
  eventId: string;
  eventTitle: string;
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  date: string;
}

export default function OrganizerStats() {
  const { user, token } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading reports...</div>;
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
      <h1 className="text-3xl font-bold text-white">Participation Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
            <h2 className="text-xl font-semibold mb-2">{report.eventTitle}</h2>
            <p className="text-white/70 mb-4">Date: {new Date(report.date).toLocaleDateString()}</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-md">
                  <p className="text-sm text-white/70">Total Registered</p>
                  <p className="text-2xl font-bold">{report.totalRegistered}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-md">
                  <p className="text-sm text-white/70">Total Attended</p>
                  <p className="text-2xl font-bold">{report.totalAttended}</p>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-md">
                <p className="text-sm text-white/70">Attendance Rate</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{report.attendanceRate}%</p>
                  <div className="ml-4 flex-1 h-2 bg-white/10 rounded-full">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${report.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 