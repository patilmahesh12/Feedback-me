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
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-purple-700">
          📋 Feedback Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Here’s a list of feedback you’ve received from your teachers.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-purple-500 text-lg">
          Loading feedback...
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          You haven't received any feedback yet
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {feedback.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-purple-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-purple-800">
                      {item.teacher.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {item.teacher.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium text-purple-700 mb-1 text-sm">
                    📝 Your Original Report:
                  </h3>
                  <div className="bg-purple-50 border border-purple-100 p-3 rounded-md text-gray-800 text-sm">
                    {item.report.message}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-purple-700 mb-1 text-sm">
                    💬 Teacher's Feedback:
                  </h3>
                  <p className="text-gray-800 whitespace-pre-wrap text-sm">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
