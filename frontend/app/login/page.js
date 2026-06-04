"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Clear any previous session so login is always required
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("department");
    localStorage.removeItem("year");
    localStorage.removeItem("registerNumber");
  }, []);

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("department", data.department);
      localStorage.setItem("year", data.year);
      localStorage.setItem("registerNumber", data.register_number);

      toast.success("Login successful");

      if (data.role === "student") {
        router.push("/student/dashboard");
      } else if (data.role === "faculty") {
        router.push("/");
      } else if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🔐</div>
          <h1 className="text-4xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to continue to AssessPro</p>
        </div>

        {/* FORM */}
        <form onSubmit={loginUser} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-slate-300 py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-slate-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full border border-slate-300 py-3 pl-11 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition-all"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>


        </form>
      </div>
    </div>
  );
}