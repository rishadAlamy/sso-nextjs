"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleEmailOnly(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Redirect to SSO or implement magic link
    window.location.href = "/api/sso";
  }

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess("Login successful!");
    } else {
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {/* Email-only login (SSO) */}
      <form onSubmit={handleEmailOnly} className="flex flex-col gap-4 mb-8">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          type="submit"
        >
          Continue with SSO
        </button>
      </form>

      <div className="text-center text-gray-500 mb-4">or</div>

      {/* Email + password login (Cognito) */}
      <form onSubmit={handleEmailPassword} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Login with Email & Password
        </button>
      </form>

      {error && <div className="text-red-600 mt-4">{error}</div>}
      {success && <div className="text-green-600 mt-4">{success}</div>}

      <div className="mt-6 text-center text-sm text-gray-500">
        <a href="/signup" className="text-blue-600 hover:underline">
          Don&apos;t have an account? Sign up
        </a>
        <br />
        <a href="/reset-password" className="text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>
    </div>
  );
}
