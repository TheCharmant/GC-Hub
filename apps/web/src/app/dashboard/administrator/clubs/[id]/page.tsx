'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, ArrowLeft } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  approved: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface Club {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  clubRoom: string;
  createdAt: string;
  updatedAt: string;
  leader: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ClubDetailsPage({ params }: { params: { id: string } }) {
  const { token } = useAuth();
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClub, setEditedClub] = useState<Partial<Club>>({});

  useEffect(() => {
    if (token) {
      fetchClubDetails();
      fetchClubEvents();
    }
  }, [token, params.id]);

  const fetchClubDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/clubs/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch club details');
      
      const data = await response.json();
      setClub(data);
      setEditedClub(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchClubEvents = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/events/club/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch club events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/clubs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedClub)
      });

      if (!response.ok) throw new Error('Failed to update club');
      
      const updatedClub = await response.json();
      setClub(updatedClub);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div className="text-gray-700">Loading club details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!club) return <div className="text-gray-700">Club not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 mr-2 text-gray-600 hover:bg-gray-100"
            onClick={() => router.push('/dashboard/administrator/clubs')}
            aria-label="Back to clubs"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Club Details</h1>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gray-700 text-white hover:bg-gray-800"
        >
          {isEditing ? 'Cancel' : 'Edit Club'}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
              <Input
                value={editedClub.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedClub({ ...editedClub, name: e.target.value })}
                className="bg-white text-gray-800 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                value={editedClub.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedClub({ ...editedClub, description: e.target.value })}
                className="bg-white text-gray-800 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <Input
                type="email"
                value={editedClub.contactEmail || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedClub({ ...editedClub, contactEmail: e.target.value })}
                className="bg-white text-gray-800 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <Input
                type="tel"
                value={editedClub.contactPhone || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedClub({ ...editedClub, contactPhone: e.target.value })}
                className="bg-white text-gray-800 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club Room</label>
              <Input
                value={editedClub.clubRoom || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedClub({ ...editedClub, clubRoom: e.target.value })}
                className="bg-white text-gray-800 border border-gray-300"
              />
            </div>
            <Button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-semibold text-gray-800">{club.name}</h2>
              <Badge variant="outline" className="border-gray-300 text-gray-700 bg-gray-50">
                {club.leader.name} (Leader)
              </Badge>
            </div>
            <p className="text-gray-700 text-base mb-4">{club.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{club.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{club.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{club.clubRoom}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              <p>Leader Email: {club.leader.email}</p>
              <p>Created: {new Date(club.createdAt).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(club.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-800">Club Events</h3>
          </div>
        </div>
        <div className="space-y-4">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                  <Badge variant={event.approved ? "success" : "warning"} className={event.approved ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"}>
                    {event.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-500">
                  <div>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Time: {event.startTime} - {event.endTime}</p>
                  </div>
                  <div>
                    <p>Location: {event.location}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No events for this club yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
