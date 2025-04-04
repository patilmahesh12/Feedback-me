"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4 py-10 relative">
      {/* Back Icon */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition"
        title="Go back"
      >
        <ArrowLeft size={28} />
      </Link>

      {/* Form Card */}
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-md text-white p-8 rounded-2xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-[#D69ADE]">
          {type === "login" ? "Login" : "Register"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D69ADE]"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Role</label>
                <div className="flex gap-4">
                  {["student", "teacher"].map((roleOption) => (
                    <label key={roleOption} className="cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.role === roleOption}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            role: roleOption as "student" | "teacher",
                          })
                        }
                        className="hidden"
                      />
                      <span
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          formData.role === roleOption
                            ? roleOption === "student"
                              ? "bg-[#D69ADE] text-white"
                              : "bg-[#AA60C8] text-white"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {roleOption.charAt(0).toUpperCase() +
                          roleOption.slice(1)}
                      </span>
                    </label>
                  ))}
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
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D69ADE]"
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
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D69ADE]"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-[#D69ADE] to-[#AA60C8] hover:opacity-90 transition shadow-md"
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          {type === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#D69ADE] hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[#D69ADE] hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
