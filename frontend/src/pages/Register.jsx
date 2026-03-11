import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Home } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    propertyName: "",
    propertyAddress: "",
  });

  const [phoneError, setPhoneError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const phoneDigits = String(form.phone || "").replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setPhoneError("Mobile number must be exactly 10 digits");
      return;
    }
    setLoading(true);

    try {
      await api.post("/auth/register", { ...form, phone: form.phone.trim() });
      toast.success("Account created successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
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

      <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-none dark:border dark:border-slate-600 rounded-2xl w-full max-w-md p-5 sm:p-8 animate-slide-up mx-2 sm:mx-0">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            RentAstra
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create your account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Mobile Number
            </label>

            <div className="flex">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="border border-slate-300 dark:border-slate-600 rounded-l-xl px-2 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (UAE)</option>
              </select>

              {/* Phone Input */}
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // numbers only
                  setForm({ ...form, phone: value });

                  if (value.length !== 10) {
                    setPhoneError("Mobile number must be exactly 10 digits");
                  } else {
                    setPhoneError("");
                  }
                }}
                maxLength={10}
                className={`w-full border-t border-b border-r border-slate-300 dark:border-slate-600 rounded-r-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 ${
                  phoneError ? "border-red-500 dark:border-red-400" : ""
                }`}
                placeholder="9876543210"
              />
            </div>

            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Property Name
            </label>
            <input
              type="text"
              name="propertyName"
              required
              value={form.propertyName}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
              placeholder="XYZ Towers, ABC Residency, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Property Address (Optional)
            </label>
            <input
              type="text"
              name="propertyAddress"
              value={form.propertyAddress}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-70 disabled:cursor-not-allowed ${
              loading ? "" : ""
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Login
          </button>
        </div>

        {/* FOOTER */}
        <div className="mt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} RentAstra
        </div>
      </div>
    </div>
  );
}
