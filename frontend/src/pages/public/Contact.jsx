import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../../components/SEO";

const SUPPORT_EMAIL = "support@rentastra.com";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setSending(true);
    // Client-side only: show success (no backend endpoint for contact form yet)
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message received. We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <SEO
        title="Contact Us"
        description="Get in touch with RentAstra for support, general inquiries, or feedback. We typically respond within 24–48 hours."
        path="/contact"
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Contact Us</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10">Get in touch for support or general inquiries.</p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Mail className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Email</h3>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-indigo-600 dark:text-indigo-400 hover:underline break-all">
                {SUPPORT_EMAIL}
              </a>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We typically respond within 24–48 hours.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Support</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                For help using RentAstra, check our <Link to="/help" className="text-indigo-600 dark:text-indigo-400 hover:underline">Help & Documentation</Link> page first. For account or technical issues, use the form or email above.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            Send a message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-2"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-2"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-2"
                placeholder="Brief subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-2 resize-none"
                placeholder="Your message..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {sending ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
