import { useState } from "react";
import Modal from "./Modal";
import api from "../services/api";
import toast from "react-hot-toast";

export default function VacateGuestModal({ guest, onClose, onSuccess }) {
  const [exitDate, setExitDate] = useState("");
  const [reason, setReason] = useState("");
  const [finalPayment, setFinalPayment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVacate = async () => {
    if (!exitDate || !finalPayment) {
      toast.error("Exit date and final amount are required");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/guests/${guest._id}/vacate`, {
        exitDate,
        reason,
        finalPayment: Number(finalPayment),
      });

      toast.success("Guest vacated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to vacate guest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Vacate ${guest.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Exit Date</label>
          <input
            type="date"
            className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded-lg w-full mt-1"
            value={exitDate}
            onChange={(e) => setExitDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Reason (optional)</label>
          <textarea
            className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded-lg w-full mt-1"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Leaving PG, shifting, etc."
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Final Settlement Amount
          </label>
          <input
            type="number"
            className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 p-2 rounded-lg w-full mt-1"
            value={finalPayment}
            onChange={(e) => setFinalPayment(e.target.value)}
            placeholder="₹ Amount"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleVacate}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Vacating..." : "Confirm Vacate"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
