'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Report {
  id: string;
  type: string;
  generatedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  url: string;
}

export default function ReportsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
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

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: reportType,
          filters: {
            startDate: dateRange.start,
            endDate: dateRange.end
          }
        })
      });

      if (!response.ok) throw new Error('Failed to generate report');
      
      // Refresh reports list
      await fetchReports();
      
      // Reset form
      setReportType('');
      setDateRange({ start: '', end: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Reports</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event_summary">Event Summary</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full bg-white/10 text-white border border-white/20 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full bg-white/10 text-white border border-white/20 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={!reportType || !dateRange.start || !dateRange.end}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Generate Report
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Report History</h2>
        {loading ? (
          <div className="text-white">Loading reports...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
                <h3 className="text-lg font-semibold mb-2">{report.type}</h3>
                <p className="text-white/80 mb-2">
                  Generated by: {report.generatedBy.name}
                </p>
                <p className="text-sm text-white/70 mb-4">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <Button
                  onClick={() => window.open(report.url, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Download Report
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
