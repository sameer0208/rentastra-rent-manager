import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Home } from "lucide-react";
import { fetchCountries, fetchStatesByCountry } from "../services/countriesApi";
import PincodeInput from "../components/PincodeInput";
import SEO from "../components/SEO";
import PublicFooter from "../components/PublicFooter";

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    password: "",
    propertyName: "",
    propertyAddress: "",
  });

  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([{ name: "India", code: "IN" }]);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);

  useEffect(() => {
    fetchCountries()
      .then((list) => setCountries(Array.isArray(list) && list.length ? list : [{ name: "India", code: "IN" }]))
      .catch(() => setCountries([{ name: "India", code: "IN" }]));
  }, []);

  useEffect(() => {
    if (!form.country) {
      setStates([]);
      return;
    }
    setStatesLoading(true);
    fetchStatesByCountry(form.country)
      .then((list) => {
        setStates(list);
        setForm((f) => ({ ...f, state: list.includes(f.state) ? f.state : "" }));
      })
      .catch(() => {
        setStates([]);
        toast.error("Could not load states");
      })
      .finally(() => setStatesLoading(false));
  }, [form.country]);

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
      const country = typeof form.country === "string" ? form.country.trim() : "";
      const state = typeof form.state === "string" ? form.state.trim() : "";
      const city = typeof form.city === "string" ? form.city.trim() : "";
      const pincode = typeof form.pincode === "string" ? String(form.pincode).replace(/\D/g, "").slice(0, 10) : "";
      await api.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone.trim(),
        password: form.password,
        propertyName: form.propertyName,
        propertyAddress: form.propertyAddress,
        country,
        state,
        city,
        pincode,
      });
      toast.success("Account created successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <SEO
        title="Create Account"
        description="Create your free RentAstra account. Manage multiple properties, guests, rent payments, and receipts in one place. No credit card required."
        path="/register"
      />
      <header className="flex-shrink-0 flex justify-between items-center p-4">
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
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-none dark:border dark:border-slate-600 rounded-2xl w-full p-6 sm:p-8 lg:p-10 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
              RentAstra
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create your account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Mobile Number</label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className="border border-slate-300 dark:border-slate-600 rounded-l-xl px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="+91">+91 (India)</option>
                  <option value="+1">+1 (USA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+971">+971 (UAE)</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, phone: value });
                    setPhoneError(value.length && value.length !== 10 ? "Mobile number must be exactly 10 digits" : "");
                  }}
                  maxLength={10}
                  className={`flex-1 border-t border-b border-r border-slate-300 dark:border-slate-600 rounded-r-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 min-w-0 ${
                    phoneError ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  placeholder="9876543210"
                />
              </div>
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.code || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  disabled={!form.country || statesLoading}
                  className={inputClass + " disabled:opacity-60 disabled:cursor-not-allowed"}
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className={labelClass}>Pincode (6 digits)</label>
                <PincodeInput
                  value={form.pincode}
                  onChange={(val) => setForm({ ...form, pincode: val })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Property Name</label>
                <input
                  type="text"
                  name="propertyName"
                  required
                  value={form.propertyName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. XYZ Towers, ABC Residency"
                />
              </div>
              <div>
                <label className={labelClass}>Property Address (Optional)</label>
                <input
                  type="text"
                  name="propertyAddress"
                  value={form.propertyAddress}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Full address"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="Min. 6 characters"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
