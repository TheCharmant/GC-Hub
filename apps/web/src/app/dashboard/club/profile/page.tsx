'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ClubProfile {
  id: string;
  name: string;
  description: string;
  events: Array<{
    id: string;
    title: string;
    date: string;
  }>;
}

export default function ClubProfile() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ClubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ClubProfile>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/club');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch('http://localhost:3001/api/profile/club', {
        headers: {
          'user-id': user.id,
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Club not found. Please ensure you are a club leader.');
        }
        throw new Error('Failed to fetch club profile');
      }
      
      const data = await response.json();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const response = await fetch('http://localhost:3001/api/profile/club', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Club not found. Please ensure you are a club leader.');
        }
        throw new Error('Failed to update club profile');
      }
      
      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated || !user) {
    return <div className="text-white">Loading...</div>;
  }

  if (loading) {
    return <div className="text-white">Loading profile...</div>;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Club Profile</h1>
          <p className="text-white/80">Club ID: {user.id}</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {profile && (
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-white">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Club Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Club Name</h3>
                <p className="text-white/90">{profile.name}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-white/90">{profile.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Events</h3>
                <div className="space-y-2">
                  {profile.events.map(event => (
                    <div key={event.id} className="flex justify-between items-center">
                      <span className="text-white/90">{event.title}</span>
                      <span className="text-white/70">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


