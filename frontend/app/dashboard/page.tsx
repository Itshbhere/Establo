'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the new wallet page
    router.push('/wallet');
  }, [router]);
  
  return (
    <div className="container py-12 flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-establo-purple border-t-transparent rounded-full"></div>
    </div>
  );
}