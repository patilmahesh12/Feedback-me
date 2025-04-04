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
    <div className="max-w-4xl mx-auto p-6 sm:p-10 mt-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D69ADE] to-[#AA60C8] drop-shadow-md">
          🎯 Dashboard
        </h1>
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
          ? "bg-gradient-to-r from-[#AA60C8] to-[#D69ADE] text-white shadow-md"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      <span className="font-semibold text-gray-800">{label}:</span>{" "}
      <span className="ml-1">{value}</span>
    </div>
  );
}
