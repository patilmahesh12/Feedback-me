"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  LogOut,
  LayoutDashboard,
  Send,
  Menu,
  X,
  BookOpen,
  MessageSquare,
} from "lucide-react";

export default function SideNav({ role }: { role: "student" | "teacher" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Logged out successfully");
        if (typeof window !== "undefined") {
          localStorage.clear();
          window.location.href = "/";
        }
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-gray-900 text-white p-5 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col z-40`}
      >
        <h1 className="text-2xl text-[#aa5ac9] font-bold mb-6 text-center">
          Feedback System
        </h1>

        <nav className="space-y-3 flex-grow">
          <NavItem
            href="/dashboard"
            pathname={pathname}
            icon={<LayoutDashboard size={18} />}
            text="Dashboard"
          />

          {/* Student-specific navigation */}
          {role === "student" && (
            <>
              <NavItem
                href="/dashboard/send-report"
                pathname={pathname}
                icon={<BookOpen size={18} />}
                text="Send Report"
              />
            </>
          )}

          {/* Teacher-specific navigation */}
          {role === "student" && (
            <>
              <NavItem
                href="/dashboard/my-feedback"
                pathname={pathname}
                icon={<MessageSquare size={18} />}
                text="My Feedback"
              />
            </>
          )}
          {role === "teacher" && (
            <>
              <NavItem
                href="/dashboard/send-feedback"
                pathname={pathname}
                icon={<Send size={18} />}
                text="Send Feedback"
              />
              <NavItem
                href="/dashboard/reports"
                pathname={pathname}
                icon={<BookOpen size={18} />}
                text="View Reports"
              />
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 mt-auto bg-gradient-to-r from-[#D69ADE] to-[#aa5ac9] hover:opacity-90 transition text-white font-semibold rounded-lg shadow-md cursor-pointer"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

function NavItem({
  href,
  pathname,
  icon,
  text,
}: {
  href: string;
  pathname: string;
  icon: React.ReactNode;
  text: string;
}) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition ${
        isActive
          ? "bg-gray-700 text-[#D69ADE]"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      {icon} {text}
    </Link>
  );
}
