import { Link } from "react-router-dom";
import { Building2, Target, Users, Heart } from "lucide-react";
import SEO from "../../components/SEO";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <SEO
        title="About RentAstra"
        description="RentAstra is a rent and property management platform for landlords and property managers. Manage multiple properties, guests, rent payments, and compliance in one place."
        path="/about"
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">About RentAstra</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">Simplifying rental management for property owners and managers.</p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            What is RentAstra?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            RentAstra is a rent and property management platform built to help landlords and property managers run their rentals efficiently. You can manage multiple properties, track guests, record rent payments, store documents, and keep family member details in one place—all from a single dashboard.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-500" />
            Why We Built It
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We built RentAstra to solve the everyday chaos of managing rentals—scattered spreadsheets, missed payments, and lost documents. We wanted a simple, focused tool that respects your time and keeps everything in one place without unnecessary complexity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Who It Helps
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            RentAstra is for landlords, property managers, and anyone who rents out rooms or properties. Whether you manage a single building or multiple units, you can track guests, rents, payments, and compliance-related information (such as police verification and family details) in a structured way.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Our Mission
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Our mission is to make rental management straightforward and transparent. We aim to give you clear visibility over occupancy, payments, and documents so you can focus on your property and your tenants instead of paperwork.
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link to="/features" className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
          See Features
        </Link>
        <Link to="/contact" className="inline-flex items-center px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
