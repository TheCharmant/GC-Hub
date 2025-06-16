'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Users as UsersIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <UsersIcon className="h-8 w-8 mr-2 text-gray-700" /> Manage Users
        </h1>
        <p className="text-gray-600">View and manage all user accounts</p>
      </div>

      <div className="mt-4 relative flex justify-end mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4 pr-10 py-2 border border-gray-300 rounded-md w-full max-w-xs bg-white focus:outline-none focus:border-blue-500 placeholder-gray-400"
        />
      </div>

      {error && (
        <p className="text-red-500 mb-4">Error: {error}</p>
      )}

      {loading ? (
        <div className="text-center text-gray-700">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-700">No users found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#7a8c9e] grid grid-cols-[2fr_2fr_1fr_1.5fr] gap-4 p-4 text-white font-semibold">
            <div>NAME</div>
            <div>EMAIL</div>
            <div className="text-center">ROLE</div>
            <div className="text-center">JOINED DATE</div>
          </div>
          <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-[2fr_2fr_1fr_1.5fr] items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
                <div className="text-gray-800 font-medium">{user.name}</div>
                <div className="text-gray-600">{user.email}</div>
                <div className="text-center">
                  <Badge variant="default" className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </Badge>
                </div>
                <div className="text-center text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

