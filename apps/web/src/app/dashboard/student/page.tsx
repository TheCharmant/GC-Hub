'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image'

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/student/feed');
  }, [router]);

  return <div>Redirecting to feed...</div>;
}
