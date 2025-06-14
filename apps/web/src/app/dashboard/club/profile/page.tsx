'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ClubProfile {
  id: string;
  name: string;
  description: string;
  events: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    approved: boolean;
  }[];
}

export default function ClubProfile() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ClubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/profile/club', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name,
        description: data.description
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/profile/club', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'user-id': user?.id || ''
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading profile...</div>;
  }

  if (error) {
    return <p className="text-red-500 mb-4">Error: {error}</p>;
  }

  if (!profile) {
    return <div className="text-gray-700">No profile found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <User className="h-8 w-8 mr-2 text-gray-700" /> Club Profile
        </h1>
        <p className="text-gray-600">Manage your club's information and view recent events</p>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="bg-gray-700 text-white hover:bg-gray-800"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-gray-700 mb-2">Club Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full"
              rows={4}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gray-700 text-white hover:bg-gray-800"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{profile.name}</h2>
            <p className="text-gray-600">{profile.description}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Events</h2>
            {profile.events && profile.events.length > 0 ? (
              <div className="space-y-4">
                {profile.events.map((event) => (
                  <div key={event.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        event.approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 mr-1 ml-4" />
                      <span>{event.startTime}-{event.endTime}</span>
                      <MapPin className="h-4 w-4 mr-1 ml-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No events found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


