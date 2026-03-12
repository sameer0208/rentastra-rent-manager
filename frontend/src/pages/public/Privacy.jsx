import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <SEO
        title="Privacy Policy"
        description="RentAstra privacy policy: how we collect, use, and protect your data. Information we collect, cookies, and contact details."
        path="/privacy"
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Information We Collect</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            RentAstra collects information you provide when you register and use the service. This includes your name, email address, phone number, and property-related information such as property name and address. We also store data you create in the app: guest details, room information, payment records, and family member information where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">How We Use Data</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We use your data solely to provide and improve RentAstra. Your account and property data are used to display your dashboard, manage guests, track payments, and generate receipts. We do not sell your personal information. Data may be used in anonymized or aggregated form for improving our service and understanding usage patterns.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Cookies</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We use essential cookies and local storage to keep you signed in and to remember your preferences (such as theme and selected property). These are necessary for the app to function. We do not use third-party advertising or tracking cookies. You can clear local storage via your browser settings, which will log you out.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Login Information</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Your email and a securely hashed version of your password are stored to authenticate you. We use industry-standard practices to protect credentials. Session tokens are stored in your browser to maintain your login state and are invalidated when you log out.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Third-Party Services</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            RentAstra may use third-party services for hosting, database, and (where applicable) file storage. These providers process data on our behalf under agreements that require them to protect your data. We do not share your personal information with third parties for their own marketing or advertising.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Contact Information</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            For privacy-related questions or requests (e.g. access, correction, or deletion of your data), please contact us via the{" "}
            <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact</Link> page or the email address provided there.
          </p>
        </section>
      </div>
    </div>
  );
}
