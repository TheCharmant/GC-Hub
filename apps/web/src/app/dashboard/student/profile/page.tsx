'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  User as UserIcon,
  UploadCloud,
  Trash2
} from 'lucide-react';

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
  firstName?: string;
  lastName?: string;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const [firstName, ...lastNameParts] = (data.name || '').split(' ');
        const lastName = lastNameParts.join(' ');

        setProfile(data);
        setFormData({ 
          ...data, 
          firstName: firstName || '', 
          lastName: lastName || '' 
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;

    try {
      const dataToSubmit = {
        ...formData,
        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
      };

      if (!dataToSubmit.name || !dataToSubmit.email || !dataToSubmit.course || !dataToSubmit.year || !dataToSubmit.section) {
        setError('Please fill in all required fields');
        return;
      }

      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const data = await response.json();
      const [firstName, ...lastNameParts] = (data.name || '').split(' ');
      const lastName = lastNameParts.join(' ');

      setProfile(data);
      setFormData({ 
        ...data, 
        firstName: firstName || '', 
        lastName: lastName || '' 
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-700">Loading profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 bg-[#faf7ef]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <UserIcon className="h-8 w-8 mr-2 text-gray-700" /> Profile
        </h1>
        <p className="text-gray-600">See your profile information</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      {profile && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">PERSONAL INFORMATION</h2>
            
            <div className="flex items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                {profile.avatar ? (
                  <Image src={profile.avatar} alt="Profile Picture" width={96} height={96} className="object-cover" />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Profile picture</p>
                <p className="text-sm text-gray-500 mb-2">PNG, JPEG under 15MB</p>
                <div className="flex space-x-2">
                  <button type="button" className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                    <UploadCloud className="h-4 w-4 mr-1" /> Upload new picture
                  </button>
                  <button type="button" className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student Number</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address (Domain)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">EDUCATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">College</label>
                <input
                  type="text"
                  id="college"
                  name="course"
                  value={formData.course || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={profile.course || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
                <input
                  type="number"
                  id="yearLevel"
                  name="year"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                <input
                  type="text"
                  id="block"
                  name="section"
                  value={formData.section || ''}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-[#a8a4c5] text-white font-semibold rounded-md hover:bg-[#8e8aab] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}