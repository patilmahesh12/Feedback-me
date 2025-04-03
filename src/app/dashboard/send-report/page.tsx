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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Select Teacher</label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="w-full p-2 border rounded"
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
        <div>
          <label className="block mb-2">Report Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || teachers.length === 0}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
