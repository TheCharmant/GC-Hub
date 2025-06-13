'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Globe,
  CalendarDays,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Calendar as CalendarIcon,
  MapPin,
  Clipboard,
  Upload,
  CheckCircle,
  PlusCircle,
  User,
  FileText
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  club: {
    id: string;
    name: string;
    description: string;
  } | null;
  createdAt?: string; // Added createdAt field
  // Assuming these fields will come from the API
  registrationStatus?: 'Open' | 'Closed';
  availableSlots?: number;
  certificateProvided?: boolean;
  volunteerHoursCredit?: number;
}

interface Registration {
  id: string;
  eventId: string;
  attended: boolean;
  hoursEarned: number | null;
}

export default function EventDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/student');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:3001/api/events/${resolvedParams.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user-id': user.id
          }
        });

        if (!eventResponse.ok) throw new Error('Failed to fetch event details');
        const eventData = await eventResponse.json();
        setEvent({
          ...eventData,
          // Add mock data for new fields if API doesn't provide them
          registrationStatus: 'Open',
          availableSlots: 100,
          certificateProvided: true,
          volunteerHoursCredit: 5,
          createdAt: eventData.createdAt || eventData.date // Fallback for createdAt
        });

        // Fetch registration status
        const registrationsResponse = await fetch(`http://localhost:3001/api/registrations/user/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user-id': user.id
          }
        });

        if (!registrationsResponse.ok) {
          if (registrationsResponse.status === 404) {
            setRegistration(null);
          } else {
            throw new Error('Failed to fetch registration status');
          }
        } else {
          const registrationsData = await registrationsResponse.json();
          const userRegistration = registrationsData.find((reg: Registration) => reg.eventId === resolvedParams.id);
          setRegistration(userRegistration || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [isAuthenticated, user, token, resolvedParams.id]);

  const handleRegister = async () => {
    if (!isAuthenticated || !user || !token) {
      setError('Please log in to register for events');
      return;
    }
    
    setRegistering(true);
    try {
      const response = await fetch('http://localhost:3001/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'user-id': user.id
        },
        body: JSON.stringify({ eventId: resolvedParams.id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for event');
      }

      setRegistration(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-700">Loading event details...</div>;
  }

  if (error || !event) {
    return <div className="text-red-500 text-center">{error || 'Event not found'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Event Overview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Globe className="h-4 w-4 mr-1 text-gray-400" />
            <span>{event.club?.name || 'GC Student Council'}</span>
            <CalendarDays className="h-4 w-4 mr-1 ml-4 text-gray-400" />
            <span>Date Posted: {new Date(event.createdAt || event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <p className="text-gray-700 mb-4 overflow-hidden text-ellipsis">{event.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Pencil className="h-4 w-4 mr-1 text-gray-400" />
            <span>{event.createdBy.name} | {event.createdBy.email}</span>
          </div>
          <div className="bg-gray-100 mb-4 flex items-center justify-center rounded-md overflow-hidden">
            <Image src="/placeholder-event.png" alt="Event Image" width={300} height={200} className="object-cover w-full h-full" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 p-0 h-auto">
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <span className="ml-1 text-gray-600">10</span>{/* Placeholder for likes */}
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 p-0 h-auto">
                  <ThumbsDown className="h-5 w-5" />
                </Button>
                <span className="ml-1 text-gray-600">0</span>{/* Placeholder for dislikes */}
              </div>
            </div>
            <Link href={`/dashboard/student/events/${event.id}`} className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
              See more
            </Link>
          </div>
        </div>

        {/* Right Column: Details, Attainable, Attendance */}
        <div className="space-y-6">
          {/* Event Details Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">EVENT DETAILS</h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center"><CalendarIcon className="h-4 w-4 mr-2 text-gray-500" /> Date: {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="flex items-center"><CalendarIcon className="h-4 w-4 mr-2 text-gray-500" /> Time: {event.startTime} - {event.endTime}</p>
              <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-500" /> Venue: {event.location}</p>
              <p className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-500" /> Registration: {event.registrationStatus}</p>
              <p className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-500" /> Available Slots: {event.availableSlots}</p>
            </div>
          </div>

          {/* Attainable Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">ATTAINABLE</h2>
            <div className="space-y-2 text-gray-700">
              <p>Certificate Provided: {event.certificateProvided ? 'Yes' : 'No'}</p>
              <p>Volunteer Hour Credit: {event.volunteerHoursCredit || 0} Hours</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4">
            <Button
              onClick={handleRegister}
              disabled={registering || !!registration}
              className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
                !registration
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-red-300 cursor-not-allowed text-white'
              }`}
            >
              {registering ? 'Adding...' : (registration ? 'ADDED TO MY EVENT' : 'ADD TO MY EVENT')}
            </Button>
            <Button
              variant="secondary"
              disabled={registering || !!registration}
              className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
                !registration
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-300 cursor-not-allowed text-white'
              }`}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              REGISTERED
            </Button>
          </div>

          {/* Attendance Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Clipboard className="h-5 w-5 mr-2" /> Attendance
              </h2>
              <span className="text-red-500 text-sm font-semibold">Not Yet Verified</span>
            </div>
            <h3 className="text-gray-700 font-semibold mb-2">Files Uploaded</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="flex items-center text-gray-800"><FileText className="h-4 w-4 mr-2 text-gray-500" /> CCS Week Day 1.png</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="flex items-center text-gray-800"><FileText className="h-4 w-4 mr-2 text-gray-500" /> CCS Week Day 2.png</span>
              </div>
            </div>
            <Button variant="outline" className="w-full flex items-center justify-center py-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50">
              <PlusCircle className="h-5 w-5 mr-2" /> Attach File
            </Button>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 mt-4">
              <CheckCircle className="h-5 w-5 mr-2" /> SUBMIT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 