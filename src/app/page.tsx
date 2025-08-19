"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  authType: string;
  samlAttributes?: Record<string, string | number | boolean>;
  createdAt: string;
  lastLogin: string | null;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to homepage to show logged out state
        window.location.href = "/";
      } else {
        console.error("Logout failed");
        // Fallback: reload page
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="flex flex-col gap-3 mt-8">
          <h1 className="text-2xl font-bold text-center mb-4">SSO Demo App</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // User is logged in
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="flex flex-col gap-6 mt-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-center mb-4">
            Welcome to SSO Demo App
          </h1>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              ✅ Authenticated Successfully!
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Auth Type:</strong>{" "}
                <span className="bg-blue-100 px-2 py-1 rounded">
                  {user.authType}
                </span>
              </p>
              {user.lastLogin && (
                <p>
                  <strong>Last Login:</strong>{" "}
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              )}

              {user.samlAttributes && (
                <div className="mt-4">
                  <p>
                    <strong>SAML Attributes:</strong>
                  </p>
                  <div className="bg-gray-50 p-3 rounded mt-2">
                    <pre className="text-xs">
                      {JSON.stringify(user.samlAttributes, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is not logged in
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col gap-3 mt-8">
        <h1 className="text-2xl font-bold text-center mb-4">SSO Demo App</h1>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          >
            Sign Up
          </a>
          <a
            href="/reset-password"
            className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600"
          >
            Reset Password
          </a>
        </div>
      </div>
    </div>
  );
}
