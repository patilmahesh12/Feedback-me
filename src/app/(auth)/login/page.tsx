'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
    }
    const error = params.get('error');
    const message = params.get('message');
    const success = params.get('success');
    
    if (error && message) {
      toast.error(message);
    } else if (success === 'registered') {
      toast.success('Registration successful! Please login');
    }

    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (res.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
      }
    };
    
    verifyAuth();
  }, [params, router]);

  return <AuthForm type="login" />;
}