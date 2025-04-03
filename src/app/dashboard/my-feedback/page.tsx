"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Feedback {
  _id: string;
  message: string;
  teacher: {
    name: string;
    email: string;
  };
  report: {
    message: string;
  };
  createdAt: string;
}

export default function MyFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/feedback/student", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load feedback");

        const data = await res.json();
        setFeedback(data.feedback || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load feedback"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Feedback Received</h1>

      {isLoading ? (
        <div className="text-center py-8">Loading feedback...</div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't received any feedback yet
        </div>
      ) : (
        <div className="space-y-6">
          {feedback.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{item.teacher.name}</h2>
                  <p className="text-gray-600">{item.teacher.email}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">
                  Your Original Report:
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p>{item.report.message}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-1">
                  Teacher's Feedback:
                </h3>
                <p className="whitespace-pre-wrap">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
