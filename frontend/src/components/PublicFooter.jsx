import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { to: "/features", label: "Features" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Blog" },
    { to: "/help", label: "Help" },
  ],
  company: [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ],
  legal: [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">© {new Date().getFullYear()} RentAstra</p>
          <p>
            Developed by{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Sayyed Sameer Basir</span>
          </p>
          <p className="font-mono text-slate-600 dark:text-slate-300">v1.0.1-alpha</p>
        </div>
      </div>
    </footer>
  );
}
