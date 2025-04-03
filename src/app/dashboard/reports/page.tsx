'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Report {
  _id: string;
  message: string;
  date: string;
  studentId: {
    name: string;
    email: string;
  };
}

export default function ViewReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports', {
          credentials: 'include',
          cache: 'no-store'
        });

        if (!res.ok) throw new Error('Failed to load reports');
        
        const data = await res.json();
        setReports(data.reports || []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Reports</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Loading reports...</div>
      ) : reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{report.studentId.name}</h3>
                  <p className="text-gray-600 text-sm">{report.studentId.email}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(report.date).toLocaleString()}
                </span>
              </div>
              <p className="mt-2">{report.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}