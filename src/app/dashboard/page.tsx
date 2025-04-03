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
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-[#D69ADE] to-[#AA60C8] hover:opacity-90 transition text-white rounded-lg shadow-md">
        Dashboard
      </h1>

      <div className="bg-gray-900/80 backdrop-blur-lg shadow-lg p-6 rounded-xl text-white">
        <h2 className="text-2xl font-semibold mb-4 text-[#D69ADE]">
          User Information
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
    <p
      className={`p-3 rounded-lg ${
        highlight ? "bg-[#aa5ac9] text-white" : "bg-gray-800 text-gray-300"
      }`}
    >
      <span className="font-semibold">{label}:</span> {value}
    </p>
  );
}