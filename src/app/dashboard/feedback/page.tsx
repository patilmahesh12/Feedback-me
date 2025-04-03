'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Feedback {
  _id: string;
  teacherId: {
    name: string;
    email: string;
  };
  message: string;
  createdAt: string;
}

export default function ViewFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback');
        const data = await response.json();
        if (response.ok) {
          setFeedback(data.feedback);
        } else {
          toast.error(data.message || 'Failed to fetch feedback');
        }
      } catch (error) {
        toast.error('Failed to load feedback');
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Feedback</h1>
      {feedback.length === 0 ? (
        <p>No feedback found</p>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.teacherId.name}</h3>
                  <p className="text-gray-600 text-sm">{item.teacherId.email}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}