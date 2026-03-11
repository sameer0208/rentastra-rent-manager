import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ARTICLES = {
  "manage-rental-properties-efficiently": {
    title: "How to Manage Rental Properties Efficiently",
    content: [
      "Managing rental properties doesn't have to mean piles of paperwork and missed payments. Start by centralising your data: use one system (like RentAstra) for all properties, guests, and payments so you can see occupancy and dues at a glance.",
      "Set a monthly routine: review the dashboard at the start of each month, follow up on pending rent by the 5th, and issue receipts as soon as payments are received. Keep guest and family details up to date, including documents and police verification status, so you're always compliance-ready.",
      "Finally, automate what you can—monthly rent generation, payment tracking, and receipt printing—so you spend less time on admin and more on maintaining your property and relationships with tenants.",
    ],
  },
  "first-time-landlords-tips": {
    title: "10 Tips for First-Time Landlords",
    content: [
      "1. Screen tenants properly: verify identity, income, and references before signing.",
      "2. Use a clear rental agreement and keep a signed copy; both parties should understand terms and notice periods.",
      "3. Set rent and due dates clearly; stick to one date (e.g. 1st of the month) for consistency.",
      "4. Maintain a record of all payments and issue receipts so there's no dispute later.",
      "5. Keep the property in good condition and respond to repairs in a reasonable time.",
      "6. Document the condition at move-in (and move-out) with photos or a checklist.",
      "7. Know your local laws: security deposits, notice periods, and eviction rules vary by region.",
      "8. Track expenses and income for tax and planning; use a simple dashboard or spreadsheet.",
      "9. Communicate in writing for important matters (rent reminders, notices) so you have a record.",
      "10. Use a dedicated tool for rent and tenant management so you don't miss payments or lose documents.",
    ],
  },
  "track-rent-payments-easily": {
    title: "How to Track Rent Payments Easily",
    content: [
      "The key to stress-free rent collection is having one place where you can see who has paid, who hasn't, and how much is pending. A rent management app lets you record each payment (full or partial) against the correct month and guest, and automatically updates pending amounts.",
      "Choose a fixed rent due date (e.g. 5th of every month) and use your dashboard to list pending and late payments. Send gentle reminders before the due date and follow up immediately after for any defaulters. Always issue a receipt when you receive money—it builds trust and keeps records clear.",
      "At the end of the month, run a quick summary: total collected, total pending, and any late fees if applicable. This habit, supported by a simple tracking tool, keeps your cash flow visible and reduces disputes.",
    ],
  },
  "tenant-management-guide": {
    title: "Tenant Management Guide",
    content: [
      "Good tenant management starts before move-in: collect basic details (name, phone, ID), sign an agreement, and note the condition of the room. Store documents and police verification status in one place so you can retrieve them when needed.",
      "During the tenancy, keep a single list of all tenants, their rooms, and rent status. Record every payment and issue receipts. If you allow family members or dependants, maintain their details and documents too. Update records as soon as someone vacates so the room shows as available and you can generate a final settlement receipt.",
      "Communicate clearly and in writing for rent reminders, notices, and policy changes. When issues arise, refer to your records and agreement. A consistent, documented approach keeps relationships professional and protects both you and the tenant.",
    ],
  },
  "rental-agreement-basics": {
    title: "Rental Agreement Basics",
    content: [
      "A rental agreement is a contract between you (the landlord) and the tenant. It should state the parties' names, the property and room, the rent amount and due date, the security deposit (if any), and the duration (e.g. 11 months, monthly). Include notice period for termination and any rules (e.g. no subletting, maintenance responsibilities).",
      "Both parties should sign and keep a copy. In India, agreements are often stamped and registered depending on state rules; consult a local expert for compliance. Update the agreement if rent or terms change, and get a fresh signature.",
      "Use your rent management app to store a scan of the signed agreement and to track the tenant's payment history. When the tenant vacates, the agreement and payment records help you settle the deposit and close the tenancy cleanly.",
    ],
  },
};

export default function BlogArticle() {
  const { slug } = useParams();
  const article = slug ? ARTICLES[slug] : null;

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-slate-600 dark:text-slate-400">Article not found.</p>
        <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>
      <article>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{article.title}</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
