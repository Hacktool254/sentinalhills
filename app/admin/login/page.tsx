"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin");
        router.refresh(); 
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] font-inter p-6">
      <div className="w-full max-w-md bg-[#111118] border border-[#2A2A3A] rounded-[16px] p-8 md:p-10 shadow-2xl">
        <h1 className="text-3xl font-syne font-bold text-[#F0F0FF] mb-2 text-center">
          SentinalHills
        </h1>
        <p className="text-[#9999BB] text-center mb-8">
          Sign in to manage leads and settings
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-[#EF4444] p-4 rounded-[8px] mb-6 text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[#F0F0FF] font-medium text-sm" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#111118] border border-[#2A2A3A] text-[#F0F0FF] rounded-[8px] px-4 py-3 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF] focus:ring-opacity-20 transition-all font-inter"
              placeholder="admin@sentinalhills.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#F0F0FF] font-medium text-sm" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#111118] border border-[#2A2A3A] text-[#F0F0FF] rounded-[8px] px-4 py-3 focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF] focus:ring-opacity-20 transition-all font-inter"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-[#6C63FF] hover:bg-[#8B85FF] text-white font-inter font-semibold py-3 px-4 rounded-[8px] transition-all hover:-translate-y-[1px] shadow-[0_8px_25px_rgba(108,99,255,0.25)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
