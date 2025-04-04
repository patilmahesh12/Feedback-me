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
    <div className="max-w-3xl mx-auto mt-10 px-6 sm:px-10">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#D69ADE] to-[#AA60C8] text-transparent bg-clip-text">
        ✨ Provide Feedback
      </h1>

      {isLoading && reports.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Loading reports...</div>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No reports available for feedback
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6"
        >
          {/* Report Selection */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Select Student Report
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full border rounded-xl p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
              disabled={isLoading}
            >
              <option value="">-- Choose a report --</option>
              {reports.map((report) => (
                <option key={report._id} value={report._id}>
                  {report.studentId.name} - {report.message.slice(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          {/* Report Preview */}
          {selectedReport && (
            <div className="bg-gray-100 border border-purple-200 p-4 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-purple-700 mb-2">
                📝 Original Report
              </h3>
              <p className="text-gray-700">
                {reports.find((r) => r._id === selectedReport)?.message}
              </p>
            </div>
          )}

          {/* Feedback Input */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border rounded-xl p-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              rows={5}
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#AA60C8] to-[#D69ADE] text-white hover:opacity-90 shadow-lg"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
