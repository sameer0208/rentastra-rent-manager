import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

const ARTICLES = [
  { slug: "manage-rental-properties-efficiently", title: "How to Manage Rental Properties Efficiently" },
  { slug: "first-time-landlords-tips", title: "10 Tips for First-Time Landlords" },
  { slug: "track-rent-payments-easily", title: "How to Track Rent Payments Easily" },
  { slug: "tenant-management-guide", title: "Tenant Management Guide" },
  { slug: "rental-agreement-basics", title: "Rental Agreement Basics" },
];

export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Blog & Articles</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10">Tips and guides for landlords and property managers.</p>

      <div className="space-y-4">
        {ARTICLES.map(({ slug, title }) => (
          <Link
            key={slug}
            to={`/blog/${slug}`}
            className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <span className="flex-1 font-medium text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </span>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
