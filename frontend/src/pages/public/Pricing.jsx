import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const freePlanFeatures = [
  "Unlimited guests",
  "Unlimited rooms",
  "Rent tracking & payment history",
  "Multiple properties",
  "Guest documents & police verification",
  "Family member tracking",
  "Receipt generation",
  "Dashboard & late payment summary",
];

export default function Pricing() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Pricing</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10">Simple, transparent pricing. Everything you need is free for now.</p>

      <div className="rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 overflow-hidden shadow-xl">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-700 dark:to-violet-800 px-8 py-10 text-white text-center">
          <h2 className="text-2xl font-bold">Free Plan</h2>
          <p className="mt-2 text-indigo-100">No credit card required</p>
          <div className="mt-6">
            <span className="text-4xl font-bold">₹0</span>
            <span className="text-indigo-200 ml-1">/ month</span>
          </div>
        </div>
        <div className="px-8 py-8">
          <ul className="space-y-4">
            {freePlanFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              to="/register"
              className="block w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold text-center hover:bg-indigo-700 transition-colors"
            >
              Start for free
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        We may introduce paid plans in the future. Existing free users will be notified before any change.
      </p>
    </div>
  );
}
