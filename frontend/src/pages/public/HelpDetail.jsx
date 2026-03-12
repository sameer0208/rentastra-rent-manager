import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../../components/SEO";

const HELP_CONTENT = {
  "add-a-guest": {
    title: "How to Add a Guest",
    steps: [
      "Go to the **Guests** page from the main navigation.",
      "In the **Add Guest** form, enter the guest's full name and a 10-digit mobile number.",
      "Select an available room from the dropdown (only unoccupied rooms are listed).",
      "The rent field will auto-fill from the selected room. Click **Add Guest** to save.",
      "The new guest will appear in the guests list and a rent record will be created for the current month.",
    ],
  },
  "track-rent-payments": {
    title: "How to Track Rent Payments",
    steps: [
      "Open the **Payments** page to see all rent entries for the selected month (use the month picker to change).",
      "Each row shows guest name, room, rent amount, amount paid, and pending amount.",
      "To record a payment: enter the amount paid and select the payment mode (e.g. Cash, UPI), then click **Apply**.",
      "You can make partial payments; the pending amount will update accordingly. When the full amount is paid, the status becomes **PAID**.",
      "Use **Print** on a paid row to generate a receipt. Payment history per guest is available from the **Payments** link on the Guests page.",
    ],
  },
  "mark-tenant-vacated": {
    title: "How to Mark Tenant as Vacated",
    steps: [
      "Go to the **Guests** page and find the guest you want to mark as vacated.",
      "Click **Vacate** (or similar action) for that guest. A vacate form will open.",
      "Enter the **exit date** and the **final settlement amount** (e.g. any refund or dues). Optionally add a reason.",
      "Submit the form. The guest will move to **Vacated** and the room will become available again.",
      "You can generate a final settlement receipt from the **Vacated Guests** page. Use **Undo Vacate** there if you need to restore the guest.",
    ],
  },
  "manage-family-members": {
    title: "How to Manage Family Members",
    steps: [
      "From the **Guests** page, click **Family** next to a guest to open that guest's family page.",
      "Use the **Add Member** form to add a family member: enter name, relation (e.g. Father, Spouse), and age if needed, then click **Add Member**.",
      "Each member's **Police Verification** status can be updated from the same table (e.g. VERIFIED, PENDING, SUBMITTED).",
      "To attach documents for a member, enter a document type and choose a file, then click **Upload** in that member's row.",
      "You can edit or delete family members using the actions in the table. Document links can be viewed or deleted as needed.",
    ],
  },
};

export default function HelpDetail() {
  const { slug } = useParams();
  const content = slug ? HELP_CONTENT[slug] : null;
  const title = content?.title || "Help";
  const description = content ? `${content.title} – Step-by-step guide for RentAstra.` : "RentAstra help and documentation.";

  if (!content) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <SEO title="Help" description={description} path="/help" noindex />
        <p className="text-slate-600 dark:text-slate-400">Guide not found.</p>
        <Link to="/help" className="mt-4 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Help
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <SEO title={title} description={description} path={`/help/${slug}`} />
      <Link to="/help" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Help
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{content.title}</h1>
      <ol className="space-y-6 list-decimal list-inside">
        {content.steps.map((step, i) => (
          <li key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {step.split(/\*\*(.*?)\*\*/g).map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-slate-800 dark:text-slate-200">{part}</strong> : part))}
          </li>
        ))}
      </ol>
    </div>
  );
}
