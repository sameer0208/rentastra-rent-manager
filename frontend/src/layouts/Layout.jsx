import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-100 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 pt-safe">
        <Navbar />
      </header>

      <main
        className="flex-1 overflow-y-auto overflow-x-hidden transition-colors duration-300 w-full"
        style={{
          paddingTop: "calc(3.5rem + env(safe-area-inset-top, 0px))",
          paddingBottom: "calc(3rem + env(safe-area-inset-bottom, 0px))",
          minHeight: "100vh",
          minHeight: "100dvh",
        }}
      >
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 h-12 pb-safe">
        <Footer />
      </footer>
    </div>
  );
}
