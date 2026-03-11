import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

const guides = [
  {
    title: "How to Add a Guest",
    slug: "add-a-guest",
    summary: "Add a new tenant, assign a room, and set up their record in a few steps.",
  },
  {
    title: "How to Track Rent Payments",
    slug: "track-rent-payments",
    summary: "Record payments, mark rent as paid or partial, and view payment history.",
  },
  {
    title: "How to Mark Tenant as Vacated",
    slug: "mark-tenant-vacated",
    summary: "Process a tenant's move-out, record final settlement, and generate a receipt.",
  },
  {
    title: "How to Manage Family Members",
    slug: "manage-family-members",
    summary: "Add family members for a guest, track police verification, and upload documents.",
  },
];

export default function Help() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Help & Documentation</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10">Step-by-step guides to get the most out of RentAstra.</p>

      <div className="space-y-4">
        {guides.map(({ title, slug, summary }) => (
          <Link
            key={slug}
            to={`/help/${slug}`}
            className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{summary}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 flex-shrink-0 mt-1" />
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400">
          Need more help? <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Contact us</Link> and we’ll get back to you.
        </p>
      </div>
    </div>
  );
}
