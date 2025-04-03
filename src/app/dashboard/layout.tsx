import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import SideNav from "../../components/SideNav"; // Adjust the import path as needed

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // Await the cookies() call
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect(
      "/login?error=unauthorized&message=Please login to access the dashboard"
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: "student" | "teacher";
      email: string;
    };

    // Validate the role
    if (!["student", "teacher"].includes(decoded.role)) {
      throw new Error("Invalid user role");
    }

    return (
      <div className="flex min-h-screen">
        <SideNav role={decoded.role} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    );
  } catch (error) {
    console.error("Authentication error:", error);
    redirect(
      "/login?error=invalid_token&message=Your session has expired"
    );
  }
}