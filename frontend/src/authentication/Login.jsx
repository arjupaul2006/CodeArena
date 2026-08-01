import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Code2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { UserDataContext } from "../context/UserContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { setUser } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/login",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setIsLoading(false);
      const data = response.data;

      if (response.status === 200) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setSuccess(true);
        navigate("/dashboard");
      } else {
        console.error("Login failed:", response);
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      const data = error.response?.data;

      if (data?.message) {
        setError(data.message);
      } else if (data?.errors?.length > 0) {
        setError(data.errors[0].msg);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#12080a] text-slate-300 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Code<span className="text-rose-500">Arena</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-[#1c0d12] border border-rose-950/80 px-3.5 py-1.5 rounded-xl"
        >
          Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-6">
        <div className="w-full max-w-md bg-[#1c0d12]/90 rounded-3xl border border-rose-950/80 shadow-2xl overflow-hidden backdrop-blur-xl shadow-rose-950/20">
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Log In to Code<span className="text-rose-500">Arena</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Continue to your workspace and pick up where you left off.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Authentication successful! Redirecting to Dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    placeholder="alex@codearena.io"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#12080a] border border-rose-950/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset feature coming soon!");
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#12080a] border border-rose-950/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#12080a] border-rose-950 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full mt-2 py-3 px-4 bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f1422] px-3 text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("GitHub sign-in coming soon!")}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0b0f19] hover:bg-gray-800/80 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Google sign-in coming soon!")}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0b0f19] hover:bg-gray-800/80 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300 transition-all cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.7-.5-1.5-.5-2.3z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-gray-400">
              Don't have an account yet?{" "}
              <Link to="/signin" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-gray-600 z-10">
        CodeArena Platform • Enterprise Grade Competitive Coding Environment
      </footer>
    </div>
  );
};

export default Login;
