"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

export default function SendReportPage() {
  const [message, setMessage] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/teachers", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load teachers");

        const data = await res.json();
        setTeachers(data.teachers || []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load teachers"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) {
      toast.error("Please select a teacher");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teacherId, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit report");

      toast.success("Report submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit report"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      {/* Title positioned above the form, aligned like Feedback Overview */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-purple-700">✍️ Submit Report</h1>
        <p className="text-gray-500 mt-2">
          Provide details about your report and submit it to the respective
          teacher.
        </p>
      </div>

      {/* Main form container */}
      <div className="bg-white border border-purple-200 rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Teacher */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Select Teacher
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full border text-black border-purple-300 rounded-lg p-3 text-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={isLoading || teachers.length === 0}
            >
              <option value="">
                {teachers.length === 0
                  ? "No teachers available"
                  : "Select a teacher"}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name} ({teacher.email})
                </option>
              ))}
            </select>
          </div>

          {/* Report Message */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Report Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-black text-md border border-purple-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={5}
              placeholder="Write your report here..."
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || teachers.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-300 disabled:bg-gray-400 cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
