"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  // CHECK EXISTING LOGIN
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      router.push("/");
    }

  }, []);


  const loginUser = async (e) => {

    e.preventDefault();

    if (!email || !password) {

      toast.error("Please fill all fields");

      return;
    }


    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();


      if (!response.ok) {

        toast.error(data.detail);

        return;
      }


      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.access_token
      );

      toast.success("Login successful");

      router.push("/");

    } catch (error) {

      console.error(error);

      toast.error("Login failed");

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-slate-200 rounded-[30px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

        {/* HEADER */}
        <div className="mb-10 text-center">

          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            AssessPro
          </h1>

          <p className="text-slate-500">
            Faculty Authentication Portal
          </p>

        </div>


        {/* FORM */}
        <form
          onSubmit={loginUser}
          className="space-y-6"
        >

          {/* EMAIL */}
          <div>

            <label className="block text-sm font-semibold text-slate-600 mb-3">
              Email Address
            </label>

            <input
              type="email"
              placeholder="faculty@college.edu"
              className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          {/* PASSWORD */}
          <div>

            <label className="block text-sm font-semibold text-slate-600 mb-3">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-slate-200 bg-slate-50 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-white py-4 rounded-2xl font-semibold"
          >

            {loading
              ? "Signing In..."
              : "Sign In"}

          </button>

        </form>

      </div>

    </div>
  );
}