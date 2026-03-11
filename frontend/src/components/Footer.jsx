export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              RentAstra
            </span>
          </p>
          <p className="text-center">
            Developed & owned by{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Sayyed Sameer Basir
            </span>
          </p>
          <p className="text-center md:text-right font-mono">
            Version <span className="font-semibold text-slate-700 dark:text-slate-300">v1.0.1-alpha</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
