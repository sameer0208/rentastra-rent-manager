import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Building2, Users, CreditCard, LayoutGrid, BarChart3, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Shield, Zap, Quote } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import SEO from "../components/SEO";
import { SITE_URL } from "../config/seo";
import logoImage from "../assets/images/logo.jpg";

const CAROUSEL_SLIDES = [
  {
    icon: Zap,
    title: "Everything in one place",
    text: "Guests, rooms, payments, and documents—no more switching between spreadsheets and notes.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Stay compliant, stress-free",
    text: "Track police verification and family details so you're always ready for checks and audits.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Receipts in one click",
    text: "Generate and print professional rent receipts the moment payment is recorded.",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: Quote,
    title: "Built for landlords like you",
    text: "Designed to save time so you can focus on your property and your tenants.",
    accent: "from-indigo-500 to-blue-500",
  },
];

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

const CAROUSEL_INTERVAL_MS = 5000;

export default function Landing() {
  const [showIntro, setShowIntro] = useState(true);
  const [typedLength, setTypedLength] = useState(0);
  const [phase, setPhase] = useState("typing"); // 'typing' | 'logo' | 'fadeout' | 'done'
  const [introFadeOut, setIntroFadeOut] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselKey, setCarouselKey] = useState(0);

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

  // Carousel auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % CAROUSEL_SLIDES.length);
      setCarouselKey((k) => k + 1);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const goToSlide = useCallback((idx) => {
    setCarouselIndex(idx);
    setCarouselKey((k) => k + 1);
  }, []);

  const skipIntro = () => {
    setIntroFadeOut(true);
    setPhase("fadeout");
    setTimeout(() => setShowIntro(false), INTRO_FADEOUT_MS);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "RentAstra",
        description: "Rent management software for landlords and property managers. Track guests, rooms, payments, and receipts in one place.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "RentAstra",
        url: SITE_URL,
        description: "Rental property management software – guest management, rent tracking, receipts, and compliance for landlords.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SEO
        title="Rent Management Software for Landlords & Property Managers"
        description="Manage tenants, rent payments, receipts, and documents in one place. RentAstra helps landlords and property managers track guests, rooms, payments, and compliance. Free to start."
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
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
                src={logoImage}
                alt="RentAstra – Rent management software logo"
                className="max-h-[140px] sm:max-h-[200px] w-auto object-contain rounded-2xl shadow-2xl shadow-indigo-500/20 ring-2 ring-white/10"
              />
            </div>
          </div>
        </div>
      )}

      <LandingNavbar />

      <main id="main-content" aria-label="Main content">
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 overflow-hidden landing-hero-pattern"
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
          <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
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

      {/* Carousel */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10">
            Why landlords choose RentAstra
          </h2>
          <div className="relative rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col justify-center">
            {/* Slides */}
            {CAROUSEL_SLIDES.map((slide, idx) => {
              const Icon = slide.icon;
              const isActive = idx === carouselIndex;
              return (
                <div
                  key={`${idx}-${carouselKey}`}
                  className={`absolute inset-0 flex flex-col items-center justify-center px-8 py-12 sm:px-16 sm:py-14 text-center transition-opacity duration-500 ${
                    isActive ? "opacity-100 z-10 carousel-slide-enter" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${slide.accent} flex items-center justify-center shadow-lg mb-6`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{slide.title}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                    {slide.text}
                  </p>
                </div>
              );
            })}
            {/* Prev / Next */}
            <button
              type="button"
              onClick={() => {
                const prev = (carouselIndex - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
                goToSlide(prev);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide((carouselIndex + 1) % CAROUSEL_SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === carouselIndex
                      ? "bg-indigo-600 dark:bg-indigo-500 scale-125"
                      : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
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
                className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/30 dark:shadow-none hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-0.5 transition-all duration-300"
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
        <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-700 dark:to-violet-800 text-white shadow-2xl shadow-indigo-500/25 dark:shadow-indigo-900/30 ring-2 ring-white/10 hover:shadow-indigo-500/30 dark:hover:shadow-indigo-900/40 transition-shadow duration-300">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 text-sm">
            <Link to="/features" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Features</Link>
            <Link to="/pricing" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</Link>
            <Link to="/blog" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
            <Link to="/help" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Help</Link>
            <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">About</Link>
            <Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link>
            <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</Link>
            <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Terms</Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300">© {new Date().getFullYear()} RentAstra</p>
            <p>
              Developed by{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Sayyed Sameer Basir</span>
            </p>
            <p className="font-mono text-slate-600 dark:text-slate-300">v1.0.1-alpha</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
