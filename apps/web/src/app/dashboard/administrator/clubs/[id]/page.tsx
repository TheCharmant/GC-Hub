'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Building2, Mail, Phone, MapPin } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  eventCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  approved: boolean;
}

export default function ClubDetailsPage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/clubs/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch club details');
      
      const data = await response.json();
      setClub(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchClubMembers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/clubs/${params.id}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch club members');
      
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchClubEvents = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/clubs/${params.id}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch club events');
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClubDetails();
      fetchClubMembers();
      fetchClubEvents();
    }
  }, [token, params.id]);

  if (loading) {
    return <div className="text-white">Loading club details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!club) {
    return <div className="text-white">Club not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">{club.name}</h1>
          <p className="text-white/80 mt-2">{club.description}</p>
        </div>
        <Badge variant={club.status === 'active' ? "success" : "warning"}>
          {club.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Mail className="h-4 w-4" />
            Contact Email
          </div>
          <p className="text-white">{club.contactEmail}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Phone className="h-4 w-4" />
            Contact Phone
          </div>
          <p className="text-white">{club.contactPhone}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <MapPin className="h-4 w-4" />
            Location
          </div>
          <p className="text-white">{club.location}</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members ({club.memberCount})
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events ({club.eventCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <div className="grid gap-4">
            {members.map((member) => (
              <div key={member.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-white/70">{member.email}</p>
                  </div>
                  <Badge variant="outline" className="text-white">
                    {member.role}
                  </Badge>
                </div>
                <p className="text-sm text-white/50 mt-2">
                  Joined: {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <p className="text-white/70 mt-1">{event.description}</p>
                  </div>
                  <Badge variant={event.approved ? "success" : "warning"}>
                    {event.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-sm text-white/70">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-white/70">
                    Time: {event.startTime} - {event.endTime}
                  </div>
                  <div className="text-sm text-white/70">
                    Location: {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button
          onClick={() => router.push(`/dashboard/administrator/clubs/${params.id}/edit`)}
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Edit Club
        </Button>
        <Button
          onClick={() => router.push('/dashboard/administrator/clubs')}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          Back to Clubs
        </Button>
      </div>
    </div>
  );
}
