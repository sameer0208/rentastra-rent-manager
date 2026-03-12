import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { PropertyProvider } from "./context/PropertyContext";
import "react-datepicker/dist/react-datepicker.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <UserProvider>
          <PropertyProvider>
            <App />
          </PropertyProvider>
        </UserProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            className: "dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600",
            style: {
              borderRadius: "12px",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
            },
          }}
        />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
);
