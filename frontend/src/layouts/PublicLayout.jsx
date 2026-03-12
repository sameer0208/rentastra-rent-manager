import LandingNavbar from "../components/LandingNavbar";
import PublicFooter from "../components/PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <LandingNavbar />
      <main id="main-content" className="flex-1 pt-20" role="main">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
