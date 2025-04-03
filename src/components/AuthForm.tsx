"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name?: string;
    role?: "student" | "teacher";
  }>({
    email: "",
    password: "",
    ...(type === "register" && {
      name: "",
      role: "student",
    }),
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/${type}`, {
        // Correct api route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `${type === "login" ? "Login" : "Registration"} successful`
        );
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {type === "login" ? "Login" : "Register"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === "register" && (
            <>
              <div>
                <label className="block mb-2 text-gray-300">Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#AA60C8]"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Role</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.role === "student"}
                      onChange={() =>
                        setFormData({ ...formData, role: "student" })
                      }
                      className="hidden"
                    />
                    <span
                      className={`px-4 py-2 rounded-lg ${
                        formData.role === "student"
                          ? "bg-[#D69ADE] text-white"
                          : "bg-gray-800 text-gray-400"
                      } transition cursor-pointer`}
                    >
                      Student
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.role === "teacher"}
                      onChange={() =>
                        setFormData({ ...formData, role: "teacher" })
                      }
                      className="hidden"
                    />
                    <span
                      className={`px-4 py-2 rounded-lg ${
                        formData.role === "teacher"
                          ? "bg-[#AA60C8] text-white"
                          : "bg-gray-800 text-gray-400"
                      } transition cursor-pointer`}
                    >
                      Teacher
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block mb-2 text-gray-300">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#AA60C8]"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#AA60C8]"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#D69ADE] to-[#AA60C8] hover:opacity-90 transition text-white font-semibold rounded-lg shadow-md cursor-pointer"
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          {type === "login" ? (
            <>
              Don't have an account?{" "}
              <Link href="/register" className="text-[#AA60C8] hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[#AA60C8] hover:underline">
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
