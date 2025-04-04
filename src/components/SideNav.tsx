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

  const handleCloseNav = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Menu Button - Only show when sidebar is closed */}
      {!isOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-md"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-screen w-64 bg-gray-900 text-white p-5 transition-transform duration-300 ease-in-out z-40 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="relative">
            <h1 className="text-2xl text-[#aa5ac9] font-bold text-center">
              Feedback System
            </h1>

            {/* Close Button - shown only on mobile when open */}
            <button
              className="md:hidden absolute right-0 top-0 mt-1 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-3 mt-4">
            <NavItem
              href="/dashboard"
              pathname={pathname}
              icon={<LayoutDashboard size={18} />}
              text="Dashboard"
              onClick={handleCloseNav}
            />

            {role === "student" && (
              <>
                <NavItem
                  href="/dashboard/send-report"
                  pathname={pathname}
                  icon={<BookOpen size={18} />}
                  text="Send Report"
                  onClick={handleCloseNav}
                />
                <NavItem
                  href="/dashboard/my-feedback"
                  pathname={pathname}
                  icon={<MessageSquare size={18} />}
                  text="My Feedback"
                  onClick={handleCloseNav}
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
                  onClick={handleCloseNav}
                />
                <NavItem
                  href="/dashboard/reports"
                  pathname={pathname}
                  icon={<BookOpen size={18} />}
                  text="View Reports"
                  onClick={handleCloseNav}
                />
              </>
            )}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-3 bg-gradient-to-r from-[#D69ADE] to-[#aa5ac9] hover:opacity-90 transition text-white font-semibold rounded-lg shadow-md"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
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
  onClick,
}: {
  href: string;
  pathname: string;
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onClick}
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
