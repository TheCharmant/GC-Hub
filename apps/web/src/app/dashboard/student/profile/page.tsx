'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  course: string;
  year: number;
  section: string;
  bio?: string;
  avatar?: string;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/student');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await fetch('http://localhost:3001/api/profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.course || !formData.year || !formData.section) {
        setError('Please fill in all required fields');
        return;
      }

      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const data = await response.json();
      setProfile(data);
      setFormData(data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="text-center text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image 
            src="/gc-hub-logo.svg" 
            alt="GC Hub Logo" 
            width={150} 
            height={60} 
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white">Welcome, {user.name}!</h2>
          <p className="text-white/80">Student ID: {user.id}</p>
        </div>

        <div className="mb-8 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setError(null);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          <p className="text-white/80">Manage your personal information</p>
        </div>

        {loading && <p className="text-white">Loading profile...</p>}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-md">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {profile && (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Student ID</label>
                    <input
                      type="text"
                      value={formData.studentId || ''}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Course *</label>
                    <input
                      type="text"
                      value={formData.course || ''}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Year *</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={formData.year || ''}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Section *</label>
                    <input
                      type="text"
                      value={formData.section || ''}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Bio</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/60">Full Name</p>
                    <p className="text-white text-lg">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Email</p>
                    <p className="text-white text-lg">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Student ID</p>
                    <p className="text-white text-lg">{profile.studentId || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Course</p>
                    <p className="text-white text-lg">{profile.course || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Year</p>
                    <p className="text-white text-lg">{profile.year || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Section</p>
                    <p className="text-white text-lg">{profile.section || 'Not set'}</p>
                  </div>
                </div>
                {profile.bio && (
                  <div>
                    <p className="text-white/60">Bio</p>
                    <p className="text-white">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
