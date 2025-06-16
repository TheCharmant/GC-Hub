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
import { FileText, CalendarDays } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <FileText className="h-8 w-8 mr-2 text-gray-700" /> Reports
        </h1>
        <p className="text-gray-600">Generate and view system reports</p>
      </div>
      
      {error && (
        <p className="text-red-500 mb-4">Error: {error}</p>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate New Report</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={!reportType || !dateRange.start || !dateRange.end}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Generate Report
          </Button>
          </div>
        </div>
        
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Report History</h2>
        {loading ? (
          <div className="text-center text-gray-700">Loading reports...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{report.type} Report</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                      <span>Generated: {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Generated by: {report.generatedBy.name}
                    </p>
                    <Button
                      onClick={() => window.open(report.url, '_blank')}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
                    >
                      Download Report
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No reports generated yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
