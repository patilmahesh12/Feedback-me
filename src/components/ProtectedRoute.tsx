import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) {
      toast.error('You must be logged in to access this page');
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;