import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Not authenticated");

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    name: string;
    email: string;
    role: "student" | "teacher";
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      {/* Dashboard Heading (Same as Feedback Overview) */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 flex items-center gap-2">
          <span className="text-black">🎯</span> Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome to your personalized dashboard.
        </p>
      </div>

      {/* User Card */}
      <div className="bg-white border border-purple-200 rounded-2xl shadow-2xl px-6 py-8 sm:p-10">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center sm:text-left">
          👤 User Information
        </h2>

        <div className="space-y-4">
          <UserDetail label="Name" value={decoded.name} />
          <UserDetail label="Email" value={decoded.email} />
          <UserDetail label="Role" value={decoded.role} highlight />
        </div>
      </div>
    </div>
  );
}

function UserDetail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl text-sm sm:text-base font-medium tracking-wide ${
        highlight
          ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      <span className="font-semibold text-gray-800">{label}:</span>{" "}
      <span className="ml-1">{value}</span>
    </div>
  );
}
