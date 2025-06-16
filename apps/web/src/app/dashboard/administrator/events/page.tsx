'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CalendarDays, Speaker, Globe } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  approved: boolean;
  club: {
    id: string;
    name: string;
  } | null;
}

export default function EventsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string, approved: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/events/${eventId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approved })
      });

      if (!response.ok) throw new Error('Failed to update event approval status');
      
      // Refresh events list
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.club?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'approved' && event.approved) ||
      (statusFilter === 'pending' && !event.approved);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <CalendarDays className="h-8 w-8 mr-2 text-gray-700" /> Manage Events
        </h1>
        <p className="text-gray-600">Review and manage all events in the system</p>
        <div className="mt-4 relative flex justify-end">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md w-full max-w-xs bg-white focus:outline-none focus:border-blue-500 placeholder-gray-400"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'approved' | 'pending')}>
            <SelectTrigger className="ml-4 w-40 bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 text-base py-2 px-3">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-800 text-base py-1">
              <SelectItem key="all" value="all" className="py-2 px-3 data-[state=checked]:bg-gray-100 [&>svg]:hidden">All Events</SelectItem>
              <SelectItem key="approved" value="approved" className="py-2 px-3 data-[state=checked]:bg-gray-100 [&>svg]:hidden">Approved</SelectItem>
              <SelectItem key="pending" value="pending" className="py-2 px-3 data-[state=checked]:bg-gray-100 [&>svg]:hidden">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <p className="text-red-500 mb-4">Error: {error}</p>
      )}

      {loading ? (
        <div className="text-center text-gray-700">Loading events...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                    <Badge className={`px-2 py-1 rounded text-sm ${
                      event.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Globe className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{event.club?.name || 'No Club'}</span>
                    <CalendarDays className="h-4 w-4 mr-1 ml-4 text-gray-400" />
                    <span>Date: {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <p className="text-gray-700 mb-4 h-20 overflow-hidden text-ellipsis">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Speaker className="h-4 w-4 mr-1 text-gray-400" />
                    <span>Location: {event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                    <span>Time: {event.startTime} - {event.endTime}</span>
                  </div>
                  {!event.approved && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={() => handleApprove(event.id, true)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No events found.</p>
          )}
        </div>
      )}
    </div>
  );
}
