import { Users, CreditCard, LayoutGrid, History, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Guest Management",
    description: "Add and manage guests, assign rooms, store contact details, and track police verification status. Keep all tenant information in one place with optional document uploads.",
  },
  {
    icon: CreditCard,
    title: "Rent Tracking",
    description: "Track monthly rent for each guest, record payments (full or partial), and see pending amounts at a glance. Support for multiple payment modes including cash and UPI.",
  },
  {
    icon: LayoutGrid,
    title: "Room Management",
    description: "Define rooms with floor and rent. See occupancy status and quickly assign or reassign guests. Manage multiple properties from a single account.",
  },
  {
    icon: History,
    title: "Payment History",
    description: "View payment history per guest and per month. Generate and print receipts for paid rent. Track paid breakdown and payment modes for your records.",
  },
  {
    icon: UsersRound,
    title: "Family Details Tracking",
    description: "Store family member details for each guest, including relation and age. Track police verification status per member and attach documents where needed.",
  },
];

export default function Features() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">Features</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-12">Everything you need to manage rentals in one place.</p>

      <div className="space-y-8">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/register" className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
          Get started free
        </Link>
      </div>
    </div>
  );
}
