"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, Loader2, Menu, X} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image"; // Import the Image component

interface HeroPageProps {
  token?: string;
}

export default function HeroPage({ token }: HeroPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [buttonLoading, setButtonLoading] = useState<
    "login" | "register" | null
  >(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    if (!loading) setPageLoaded(true);
  }, [loading]);

  const handleLogin = () => {
    setButtonLoading("login");
    setTimeout(() => {
      router.push(token ? "/dashboard" : "/login");
    }, 1500);
  };

  const handleRegister = () => {
    setButtonLoading("register");
    setTimeout(() => {
      router.push(token ? "/dashboard" : "/register");
    }, 1500);
  };

  if (loading && !pageLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E6B2BA] to-[#D69ADE] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Image
            src="/logo.png"
            alt="ClarifyEd Logo"
            className="h-16 w-16 mx-auto animate-bounce"
            width={64}
            height={64}
          />
          <div className="text-[#2a1631] text-xl font-medium">
            ClarifyEd<span className="loading-dots"></span>
          </div>
          <div className="w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="w-1/2 h-full bg-white rounded-full animate-[gradient-x_1s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[#D69ADE] to-indigo-100 flex flex-col ${
        pageLoaded ? "fade-in" : ""
      }`}
    >
      {buttonLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-white animate-spin mx-auto" />
            <p className="text-white font-medium mt-2">Please Wait...</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur shadow-sm w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-[#2a1631] hover:text-[#693382] transition-all"
            >
            </button>
            <Image
              src="/logo.png"
              alt="ClarifyEd Logo"
              className="h-10 w-10"
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold text-[#2a1631]">ClarifyEd</span>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={handleRegister}
              className="flex items-center px-5 py-2 bg-[#693382] text-white rounded-lg hover:bg-[#814a9e] shadow-md transition-all"
              disabled={!!buttonLoading}
            >
              {buttonLoading === "register" ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <UserPlus className="h-5 w-5 mr-2" />
              )}
              Register
            </button>
            <button
              onClick={handleLogin}
              className="flex items-center px-5 py-2 rounded-lg text-[#693382] border border-[#693382] hover:bg-[#f3e8ff] transition-all shadow-sm"
              disabled={!!buttonLoading}
            >
              {buttonLoading === "login" ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              Login
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-[#2a1631] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden px-4 py-4 space-y-3 bg-white shadow-md rounded-b-lg">
            <button
              onClick={handleRegister}
              className="flex items-center w-full justify-center px-4 py-2 bg-[#693382] text-white rounded-md hover:bg-[#814a9e] transition-all"
              disabled={!!buttonLoading}
            >
              {buttonLoading === "register" ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <UserPlus className="h-5 w-5 mr-2" />
              )}
              Register
            </button>
            <button
              onClick={handleLogin}
              className="flex items-center w-full justify-center px-4 py-2 text-[#693382] border border-[#693382] rounded-md hover:bg-[#f3e8ff] transition-all"
              disabled={!!buttonLoading}
            >
              {buttonLoading === "login" ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2a1631] leading-tight">
              Elevate Learning with Personalized Feedback
            </h2>
            <p className="text-lg text-gray-800">
              ClarifyEd connects students and teachers, making education more
              interactive, personalized, and engaging than ever before.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Image
              src="/heropage.jpeg"
              alt="Education"
              className="w-full h-auto rounded-xl shadow-xl"
              width={800}
              height={600}
              priority // Important for above-the-fold images
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
