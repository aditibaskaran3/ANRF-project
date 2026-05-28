"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Registration failed");
        return;
      }

      toast.success("Registration successful");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center px-4">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-5">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-slate-900">
            Create Your Account
          </h1>

          <p className="text-slate-500 mt-1">
            Join AssessPro and get started
          </p>
        </div>

        {/* ROLE SECTION */}
        <div className="mb-5">

          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Select Your Role
          </h2>

          <p className="text-slate-500 text-sm mb-3">
            Choose the role that best describes you
          </p>

          <div className="grid grid-cols-3 gap-4">

            {/* STUDENT */}
            <div
              onClick={() => setRole("student")}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 text-center hover:scale-105
              ${
                role === "student"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200"
              }`}
            >
              <div className="text-5xl mb-2">🎓</div>

              <h3 className="text-xl font-bold text-blue-600">
                Student
              </h3>

              <p className="text-xs text-slate-600 mt-1">
                Access courses & assessments
              </p>
            </div>

            {/* FACULTY */}
            <div
              onClick={() => setRole("faculty")}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 text-center hover:scale-105
              ${
                role === "faculty"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-slate-200"
              }`}
            >
              <div className="text-5xl mb-2">🧑‍🏫</div>

              <h3 className="text-xl font-bold text-yellow-600">
                Faculty
              </h3>

              <p className="text-xs text-slate-600 mt-1">
                Create & manage assessments
              </p>
            </div>

            {/* ADMIN */}
            <div
              onClick={() => setRole("admin")}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 text-center hover:scale-105
              ${
                role === "admin"
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200"
              }`}
            >
              <div className="text-5xl mb-2">🧑‍💼</div>

              <h3 className="text-xl font-bold text-green-600">
                Admin
              </h3>

              <p className="text-xs text-slate-600 mt-1">
                Manage users & reports
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={registerUser}
          className="space-y-3"
        >

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
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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
                type={
                  showPassword ? "text" : "password"
                }
                placeholder="Create password"
                className="w-full border border-slate-300 py-3 pl-11 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-slate-500"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm password"
                className="w-full border border-slate-300 py-3 pl-11 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-slate-500"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition-all"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-slate-600 text-sm">
            Already have an account?

            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 font-semibold cursor-pointer ml-2 hover:underline"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}