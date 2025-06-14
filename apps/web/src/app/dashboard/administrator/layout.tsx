'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Building2, Users, Calendar, BarChart2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push('/login/administrator');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login/administrator');
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard/administrator',
      icon: Building2
    },
    {
      name: 'Users',
      href: '/dashboard/administrator/users',
      icon: Users
    },
    {
      name: 'Clubs',
      href: '/dashboard/administrator/clubs',
      icon: Users
    },
    {
      name: 'Events',
      href: '/dashboard/administrator/events',
      icon: Calendar
    },
    {
      name: 'Reports',
      href: '/dashboard/administrator/reports',
      icon: BarChart2
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf7ef]">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-gray-700" />
                <span className="ml-2 text-xl font-semibold text-gray-800">Admin Portal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        pathname === item.href
                          ? 'text-gray-900 border-b-2 border-gray-900'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleLogout}
                className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}