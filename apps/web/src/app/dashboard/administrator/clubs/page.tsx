'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Calendar, Building2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  clubLeaderId?: string; // Optional field for club leader
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ClubsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedClubLeader, setSelectedClubLeader] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchClubs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/clubs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch clubs');
      const data = await response.json();
      setClubs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const clubUsers = data.filter((user: User) => user.role === 'club');
      setUsers(clubUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateClub = async (clubData: Omit<Club, 'id' | 'memberCount' | 'eventCount' | 'createdAt'>) => {
    try {
      console.log('Token:', token);
      console.log('User ID:', user?.id);
      console.log('User Role:', user?.role);
      const response = await fetch('http://localhost:3001/api/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || '',
          'user-role': user?.role || ''
        },
        body: JSON.stringify({
          ...clubData,
          leaderId: selectedClubLeader?.id
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create club: ${errorData.message || response.statusText}`);
      }
      await fetchClubs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateClub = async (clubId: string, clubData: Partial<Club>) => {
    try {
      const response = await fetch(`http://localhost:3001/api/clubs/${clubId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clubData)
      });
      if (!response.ok) throw new Error('Failed to update club');
      await fetchClubs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleStatusChange = async (clubId: string, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/clubs/${clubId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update club status');
      
      // Refresh clubs list
      await fetchClubs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    // TODO: Implement club deletion logic
    console.log('Delete club:', clubId);
  };

  useEffect(() => {
    if (token) {
      fetchClubs();
      fetchUsers();
    }
  }, [token]);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || club.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Clubs</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create Club</Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-white">Loading clubs...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">{club.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">{club.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-white/50">
                    <p>Members: {club.memberCount}</p>
                    <p>Events: {club.eventCount}</p>
                  </div>
                  <Badge variant={club.status === 'active' ? "success" : "warning"}>
                    {club.status}
                  </Badge>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    onClick={() => router.push(`/dashboard/administrator/clubs/${club.id}`)}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/10">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleUpdateClub(club.id, { status: club.status === 'active' ? 'inactive' : 'active' })}>
                        {club.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClub(club.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div role="dialog" className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Club</h2>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateClub({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                contactEmail: formData.get('contactEmail') as string,
                contactPhone: formData.get('contactPhone') as string,
                location: formData.get('location') as string,
                status: 'active',
                clubLeaderId: formData.get('clubLeaderId') as string
              });
              setShowCreateModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name">Club Name</label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="contactEmail">Contact Email</label>
                  <Input id="contactEmail" name="contactEmail" type="email" required />
                </div>
                <div>
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <Input id="contactPhone" name="contactPhone" required />
                </div>
                <div>
                  <label htmlFor="location">Club Room</label>
                  <Input id="location" name="location" required />
                </div>
                <div>
                  <label htmlFor="clubLeaderId">Club Leader</label>
                  <Select
                    name="clubLeaderId"
                    required
                    onValueChange={(value) => {
                      const leader = users.find(u => u.id === value);
                      if (leader) {
                        setSelectedClubLeader(leader);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a club leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Create Club</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}