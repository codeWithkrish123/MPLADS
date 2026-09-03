import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// authApi and activityApi are now exported from services/api.ts
import { authApi, activityApi } from "../services/api";

interface ProperLoginPageProps {
  onLoginSuccess: (role: string) => void;
}

export const ProperLoginPage: React.FC<ProperLoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Starting login with email:", email);

      // Call backend login API
      const result = await authApi.login(email, password);
      console.log("✓ Login successful:", result);

      // Log the login activity to backend
      console.log("📝 Logging activity to backend...");
      const logResult = await activityApi.log("LOGIN", {
        email,
        role: "district",
        timestamp: new Date().toISOString(),
      });
      console.log("✓ Activity logged to backend:", logResult);

      // Call success callback
      onLoginSuccess("district");
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      setError(error.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Tricolor Stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      <div className="flex min-h-[calc(100vh-8px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">MPLADS Sentinel Portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">❌ {error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-800">Email: admin@example.com</p>
            <p className="text-xs text-blue-800">Password: any value (first login creates account)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
