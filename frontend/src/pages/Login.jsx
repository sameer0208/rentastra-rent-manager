import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Home } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Link
          to="/"
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
          aria-label="Back to home"
        >
          <Home className="w-5 h-5" />
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl w-full max-w-md p-5 sm:p-8 border border-slate-200 dark:border-slate-600 animate-slide-up mx-2 sm:mx-0">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            RentAstra
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Are you a new user?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register here
          </Link>
        </p>

        <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} RentAstra
        </div>
      </div>
    </div>
  );
}
