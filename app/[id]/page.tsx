'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState('');
  const id = params.id as string;

  useEffect(() => {
    const handleRedirect = async () => {
      // Check if link is cached in cookie
      const cachedLink = Cookies.get(`link_${id}`);
      
      if (cachedLink) {
        // Redirect immediately from cookie
        window.location.href = cachedLink;
        return;
      }

      // Fetch from database
      try {
        const response = await fetch(`/api/redirect/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Link not found');
          } else if (response.status === 410) {
            setError('Link has reached maximum clicks');
          } else {
            setError('An error occurred');
          }
          return;
        }

        const data = await response.json();
        
        if (data.originalLink) {
          // Store in cookie for 7 days
          Cookies.set(`link_${id}`, data.originalLink, { expires: 7 });
          
          // Redirect
          window.location.href = data.originalLink;
        }
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Failed to redirect');
      }
    };

    if (id) {
      handleRedirect();
    }
  }, [id, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 rounded-xl p-8 shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-8 shadow-2xl text-center">
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Redirecting...</h1>
        <p className="text-gray-300">Please wait while we redirect you</p>
      </div>
    </div>
  );
}