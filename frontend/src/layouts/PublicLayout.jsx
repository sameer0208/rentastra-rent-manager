import LandingNavbar from "../components/LandingNavbar";
import PublicFooter from "../components/PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      <LandingNavbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
