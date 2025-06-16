'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Calendar, Building2, MoreVertical, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';

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
          leaderId: selectedClubLeader?.id,
          status: 'active', // Explicitly setting status as 'active'
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
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <Building2 className="h-8 w-8 mr-2 text-gray-700" /> Clubs
        </h1>
        <p className="text-gray-600">Manage and view clubs in the system.</p>
      </div>

      <div className="mt-4 flex justify-between items-center mb-6">
        <div onClick={() => setShowCreateModal(true)} className="flex items-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
          <Plus className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">New Club</span>
        </div>
        <div className="relative flex items-center">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md w-full max-w-xs bg-white focus:outline-none focus:border-blue-500 placeholder-gray-400"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}>
            <SelectTrigger className="ml-4 w-[180px] bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-700">Loading clubs...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club) => (
              <div key={club.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Image 
                    src="/placeholder-club.png" 
                    alt={club.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{club.name}</h2>
                    <Badge className={`px-2 py-1 rounded text-sm ${
                      club.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {club.status}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">{club.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>{club.memberCount} Members</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>{club.eventCount} Events</span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <Button
                      onClick={() => router.push(`/dashboard/administrator/clubs/${club.id}`)}
                      className="text-sm text-gray-900 bg-transparent hover:bg-gray-100 transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-700">No clubs found.</div>
          )}
        </div>
      )}

      {/* Create Club Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-700/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Club</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newClub = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                contactEmail: formData.get('contactEmail') as string,
                contactPhone: formData.get('contactPhone') as string,
                location: formData.get('location') as string,
                status: 'active' as 'active' | 'inactive', // Explicitly cast to the correct literal type
              };
              await handleCreateClub(newClub);
              setShowCreateModal(false);
            }} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none bg-white text-gray-900"
                ></textarea>
              </div>
              <div>
                <label htmlFor="leader" className="block text-sm font-medium text-gray-700 mb-1">Club Leader (Optional)</label>
                <Select onValueChange={(value) => setSelectedClubLeader(users.find(u => u.id === value) || null)}>
                  <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:outline-none text-gray-800 bg-white">
                    <SelectValue placeholder="Select a club leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length > 0 ? (
                      users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>No club leaders available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Club Room/Location</label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Create Club
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}