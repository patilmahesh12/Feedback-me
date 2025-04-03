"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Report {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
}

export default function SendFeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) {
      toast.error("Please select a report");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reportId: selectedReport,
          message: feedback,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit feedback");

      toast.success("Feedback submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit feedback"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Provide Feedback</h1>
      {isLoading && reports.length === 0 ? (
        <div className="text-center py-8">Loading reports...</div>
      ) : reports.length === 0 ? (
        <p className="text-center py-8">No reports available for feedback</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Select Student Report</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            >
              <option value="">Select a report</option>
              {reports.map((report) => (
                <option key={report._id} value={report._id}>
                  {report.studentId.name} - {report.message.substring(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          {selectedReport && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">Original Report:</h3>
              <p className="mt-2">
                {reports.find((r) => r._id === selectedReport)?.message}
              </p>
            </div>
          )}

          <div>
            <label className="block mb-2">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded"
              rows={5}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
