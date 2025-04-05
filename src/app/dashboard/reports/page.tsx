"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

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
        const res = await fetch("/api/reports", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load reports");

        const data = await res.json();
        setReports(data.reports || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load reports"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Heading Positioned at the Top Left */}
      <div className="mb-8 text-left">
        <h1 className="text-4xl font-extrabold text-[#5D5FEF] mb-2">
          📑 Student Reports
        </h1>
        <p className="text-gray-600">
          Review all submitted student reports here.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-lg text-gray-500 animate-pulse">
          ⏳ Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-600">🚫 No reports found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    👤 {report.studentId.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    📧 {report.studentId.email}
                  </p>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  🕒 {new Date(report.date).toLocaleString()}
                </div>
              </div>
              <div className="text-gray-700 text-sm whitespace-pre-wrap">
                📝 {report.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
