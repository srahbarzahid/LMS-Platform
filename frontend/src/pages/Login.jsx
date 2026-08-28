import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { setAuthSession, getLastVisitedPath } from "../utils/auth";
import apiClient, { getApiErrorMessage } from "../api/client";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSSO = () => {
    toast.error("Google Single Sign-On (SSO) integration is currently under construction.", {
      id: "google-sso-under-construction",
      duration: 4000,
      icon: "🚧"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save JWT token & User session to localStorage + Cookie
      setAuthSession(data.token || data.accessToken, data.user);

      // Redirect to last opened page or corresponding module dashboard
      const targetPath = getLastVisitedPath(data.user?.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to log in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="p-8">
          {/* Back to Home Black Arrow Icon at Top-Left of Card */}
          <div className="flex items-center justify-start mb-2">
            <Link
              to="/"
              title="Back to Home"
              className="text-heading hover:text-primary transition-colors cursor-pointer p-1"
            >
              <ArrowLeft className="w-6 h-6 text-black dark:text-white hover:text-primary transition-colors" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-heading">Welcome Back</h2>
            <p className="text-body mt-2">Log in to continue your learning journey.</p>
          </div>

          {/* Error Feedback Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={handleGoogleSSO}
              className="w-14 h-14 flex items-center justify-center bg-white border border-border rounded-full hover:bg-gray-50 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-caption font-medium">Or continue with</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-heading mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body bg-[#f8f9fa]"
                  placeholder="john@example.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-heading">Password</label>
                <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-secondary transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-caption w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body bg-[#f8f9fa]"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-heading transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-secondary transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Log In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-body">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-primary hover:text-secondary transition-colors">
              Sign up
            </Link>
          </div>
        </div>
        <div className="bg-gray-50 border-t border-border p-6 text-center text-xs text-caption">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Login;
