import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Users, CreditCard, LayoutGrid, BarChart3, ArrowRight } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";

const INTRO_TYPING_TEXT = "RentAstra: The Ultimate Rent Manager";
const TYPING_INTERVAL_MS = 70;
const LOGO_REVEAL_DELAY_MS = 600;
const INTRO_HOLD_AFTER_LOGO_MS = 2200;
const INTRO_FADEOUT_MS = 800;

const features = [
  {
    icon: Users,
    title: "Guest Management",
    description: "Add guests, assign rooms, track documents and police verification in one place.",
  },
  {
    icon: LayoutGrid,
    title: "Rooms & Inventory",
    description: "Manage multiple properties and rooms with rent and occupancy at a glance.",
  },
  {
    icon: CreditCard,
    title: "Payments & Receipts",
    description: "Record rent payments, partial payments, and generate receipts instantly.",
  },
  {
    icon: BarChart3,
    title: "Dashboard & Reports",
    description: "Monthly summaries, pending amounts, and late payment tracking.",
  },
];

export default function Landing() {
  const [showIntro, setShowIntro] = useState(true);
  const [typedLength, setTypedLength] = useState(0);
  const [phase, setPhase] = useState("typing"); // 'typing' | 'logo' | 'fadeout' | 'done'
  const [introFadeOut, setIntroFadeOut] = useState(false);

  // Typing effect
  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLength >= INTRO_TYPING_TEXT.length) {
      const t = setTimeout(() => setPhase("logo"), LOGO_REVEAL_DELAY_MS);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setTypedLength((n) => Math.min(n + 1, INTRO_TYPING_TEXT.length));
    }, TYPING_INTERVAL_MS);
    return () => clearInterval(id);
  }, [phase, typedLength]);

  // After logo phase: hold then fade out and hide intro
  useEffect(() => {
    if (phase !== "logo") return;
    const holdTimer = setTimeout(() => {
      setIntroFadeOut(true);
      setPhase("fadeout");
    }, INTRO_HOLD_AFTER_LOGO_MS);
    return () => clearTimeout(holdTimer);
  }, [phase]);

  useEffect(() => {
    if (!introFadeOut) return;
    const hideTimer = setTimeout(() => {
      setShowIntro(false);
    }, INTRO_FADEOUT_MS);
    return () => clearTimeout(hideTimer);
  }, [introFadeOut]);

  const skipIntro = () => {
    setIntroFadeOut(true);
    setPhase("fadeout");
    setTimeout(() => setShowIntro(false), INTRO_FADEOUT_MS);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Intro overlay: typing + cinematic logo */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950/95 to-slate-950 transition-opacity duration-700 ${
            introFadeOut ? "animate-intro-fadeout" : ""
          }`}
          style={{ transitionProperty: introFadeOut ? "opacity, visibility" : "none" }}
        >
          <button
            type="button"
            onClick={skipIntro}
            className="absolute top-6 right-6 z-10 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Skip intro
          </button>

          <div className="flex flex-col items-center justify-center px-6 text-center">
            {/* Typing text */}
            <div
              className={`min-h-[4rem] sm:min-h-[5rem] text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight transition-opacity duration-500 ${
                phase === "logo" ? "opacity-0 absolute pointer-events-none" : "opacity-100"
              }`}
            >
              <span>{INTRO_TYPING_TEXT.slice(0, typedLength)}</span>
              <span className="intro-cursor ml-0.5 text-indigo-400">|</span>
            </div>

            {/* Cinematic logo */}
            <div
              className={`mt-6 flex items-center justify-center ${
                phase === "typing" ? "opacity-0 pointer-events-none absolute" : ""
              } ${phase === "logo" ? "animate-intro-logo" : ""}`}
            >
              <img
                src="/src/assets/images/logo.jpg"
                alt="RentAstra"
                className="max-h-[140px] sm:max-h-[200px] w-auto object-contain rounded-2xl shadow-2xl shadow-indigo-500/20 ring-2 ring-white/10"
              />
            </div>
          </div>
        </div>
      )}

      <LandingNavbar />

      {/* Hero */}
      <section
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Decorative hero illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-600 dark:to-violet-700 shadow-xl shadow-indigo-500/30 flex items-center justify-center">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-white/90" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur border border-white/30" />
              <div className="absolute -top-1 -left-1 w-8 h-8 rounded-lg bg-amber-400/90 dark:bg-amber-500/80" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            <span>Rental property management, simplified</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manage rent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              smarter
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            RentAstra helps property owners and managers track guests, rooms, payments, and documents—all in one clean dashboard.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Visual / trust strip */}
      <section className="py-12 px-4 sm:px-6 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-slate-500 dark:text-slate-400 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">Multi-property support</span>
          <span>•</span>
          <span>Guest & family records</span>
          <span>•</span>
          <span>Payment tracking</span>
          <span>•</span>
          <span>Receipts & documents</span>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Everything you need to run rentals
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              One platform for guests, rooms, payments, and compliance.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-700 dark:to-violet-800 text-white shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to simplify your rentals?</h2>
          <p className="mt-4 text-indigo-100">
            Create your account in minutes. No credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Join RentAstra
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/80 hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">© {new Date().getFullYear()} RentAstra</p>
          <p>
            Developed by{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Sayyed Sameer Basir</span>
          </p>
          <p className="font-mono text-slate-600 dark:text-slate-300">v1.0.1-alpha</p>
        </div>
      </footer>
    </div>
  );
}
