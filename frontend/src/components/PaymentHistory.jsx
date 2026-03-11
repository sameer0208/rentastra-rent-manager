import { useEffect, useState } from "react";
import api from "../services/api";

export default function PaymentHistory({ guestId, onClose }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api
      .get(`/payments/guest/${guestId}`)
      .then((res) => setPayments(res.data))
      .catch((err) => console.error(err));
  }, [guestId]);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative border border-slate-200 dark:border-slate-600 animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Payment History
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 text-xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Paid Date</th>
                <th className="p-3 text-left">Mode</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{p.month}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">₹{p.amount}</td>

                  <td className="p-3">
                    {p.status === "PAID" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium">
                        PAID
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 font-medium">
                        PENDING
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {p.paidDate
                      ? new Date(p.paidDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.paymentMode || "-"}</td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500 dark:text-slate-400">
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-600 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
