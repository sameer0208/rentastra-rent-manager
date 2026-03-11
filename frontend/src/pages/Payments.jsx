import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import ConfirmModal from "../components/ConfirmModal";
import { useProperty } from "../context/PropertyContext";

<style>
  {`
@media print {
  body {
    margin: 0;
  }

  @page {
    size: A4;
    margin: 0;
  }

  .print\\:hidden {
    display: none !important;
  }
}
`}
</style>;

export default function Payments() {
  const { currentProperty } = useProperty();
  const [payments, setPayments] = useState([]);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [amountInputs, setAmountInputs] = useState({});
  const [modeInputs, setModeInputs] = useState({});
  const [receiptPayment, setReceiptPayment] = useState(null);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const monthToString = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  // ---------------- LOAD PAYMENTS ----------------
  const loadPayments = async () => {
    const url = selectedMonth
      ? `/payments?month=${selectedMonth}`
      : "/payments";

    const res = await api.get(url);
    setPayments(res.data);
  };

  //   useEffect(() => {
  //     setSelectedMonth(currentMonth);
  //   }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPayments = async () => {
      try {
        const url = selectedMonth
          ? `/payments?month=${selectedMonth}`
          : "/payments";

        const res = await api.get(url);

        if (isMounted) {
          setPayments(res.data);
        }
      } catch (err) {
        console.error("Failed to load payments", err);
      }
    };

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, [selectedMonth]);

  // ---------------- APPLY PAYMENT ----------------
  const applyPayment = async (payment) => {
    const amountPaid = Number(amountInputs[payment._id]);
    const mode = modeInputs[payment._id];

    const pendingAmount = payment.amount - (payment.amountPaid || 0);

    if (!amountPaid || amountPaid <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (amountPaid > pendingAmount) {
      toast.error(`Cannot pay more than pending amount (₹${pendingAmount})`);
      return;
    }

    if (!mode) {
      toast.error("Select payment mode");
      return;
    }

    try {
      await api.put(`/payments/${payment._id}/pay`, {
        amountPaid,
        paymentMode: mode,
      });

      toast.success(
        `₹${amountPaid} received via ${mode} from ${payment.guest?.name}`,
      );

      setAmountInputs({});
      setModeInputs({});
      loadPayments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply payment");
    }
  };

  const deletePayment = async () => {
    if (!paymentToDelete || paymentToDelete.status === "PAID") return;
    try {
      await api.delete(`/payments/${paymentToDelete._id}`);
      toast.success("Payment deleted permanently");
      setPaymentToDelete(null);
      loadPayments();
    } catch {
      toast.error("Failed to delete payment");
    }
  };

  // ---------------- LATE CHECK ----------------
  const isLate = (payment) => {
    if (payment.status === "PAID") return false;

    const [year, month] = payment.month.split("-");
    const dueDate = new Date(year, month - 1, 5);
    return new Date() > dueDate;
  };

  const sortedPayments = [...payments].sort((a, b) => {
    const priority = (status) => {
      if (status === "LATE") return 0;
      if (status === "PENDING") return 1;
      if (status === "PARTIAL") return 2;
      if (status === "PAID") return 3;
      return 4;
    };

    const statusDiff = priority(a.status) - priority(b.status);
    if (statusDiff !== 0) return statusDiff;

    // Same status → latest month first
    return b.month.localeCompare(a.month);
  });

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:p-6">
          {/* HEADER */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                Payments
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Track monthly rent payments
              </p>
            </div>

            <DatePicker
              selected={new Date(`${selectedMonth}-01`)}
              onChange={(date) => setSelectedMonth(monthToString(date))}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-3 py-2 mt-3 md:mt-0 cursor-pointer"
              calendarClassName="shadow-xl dark:!bg-slate-800 dark:!border-slate-600"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 overflow-x-auto overflow-hidden transition-all duration-300 -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-3 text-left">Guest</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Rent</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Pending</th>
                  <th className="p-3">Paid Breakdown</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Print</th>
                  <th className="p-3">Delete</th> {/* 👈 NEW */}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                {sortedPayments.map((p) => {
                  const pendingAmount = p.amount - (p.amountPaid || 0);

                  return (
                    <tr
                      key={p._id}
                      className={`transition ${
                        p.status === "PAID"
                          ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400"
                          : p.status === "PARTIAL"
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500"
                            : p.status === "PENDING"
                              ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500"
                              : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                      }`}
                    >
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                        {p.guest ? (
                          p.guest.name
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic">
                            Former Guest
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-slate-800 dark:text-slate-100">{p.guest?.room?.roomNumber}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-100">{p.month}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-100">₹{p.amount}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-100">₹{p.amountPaid || 0}</td>
                      <td className="p-3 text-red-600 dark:text-red-400 font-semibold">
                        ₹{pendingAmount}
                      </td>

                      <td className="p-3 text-xs text-slate-800 dark:text-slate-100">
                        {p.payments?.length > 0
                          ? p.payments.map((pay, i) => (
                              <div key={i}>
                                ₹{pay.amount} – {pay.mode}
                              </div>
                            ))
                          : "—"}
                      </td>

                      <td className="p-3">
                        {p.status === "PAID" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                            PAID
                          </span>
                        )}
                        {p.status === "PARTIAL" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 animate-pulse">
                            PARTIAL
                          </span>
                        )}
                        {p.status === "PENDING" && !isLate(p) && (
                          <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 animate-pulse">
                            PENDING
                          </span>
                        )}
                        {isLate(p) && (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 animate-pulse">
                            LATE
                          </span>
                        )}
                      </td>

                      {/* APPLY */}
                      <td className="p-3">
                        {p.status !== "PAID" ? (
                          <div className="flex flex-wrap gap-2">
                            <input
                              type="number"
                              min={1}
                              max={pendingAmount}
                              value={amountInputs[p._id] || ""}
                              onChange={(e) =>
                                setAmountInputs({
                                  ...amountInputs,
                                  [p._id]: e.target.value,
                                })
                              }
                              className="border border-slate-300 dark:border-slate-500 px-2 py-1 w-24 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                            />

                            <select
                              value={modeInputs[p._id] || ""}
                              onChange={(e) =>
                                setModeInputs({
                                  ...modeInputs,
                                  [p._id]: e.target.value,
                                })
                              }
                              className="border border-slate-300 dark:border-slate-500 px-2 py-1 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                            >
                              <option value="">Mode</option>
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI</option>
                              <option value="Net Banking">Net Banking</option>
                            </select>

                            <button
                            onClick={() => applyPayment(p)}
                            className="bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 dark:hover:bg-green-600"
                          >
                              Apply
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">Locked 🔒</span>
                        )}
                      </td>
                      {/* PRINT RECEIPT */}
                      <td className="p-3 text-center">
                        {p.status === "PAID" ? (
                          <button
                            type="button"
                            onClick={() => setReceiptPayment(p)}
                            title="Print Receipt"
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                          >
                            🖨️
                          </button>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>

                      {/* DELETE */}
                      <td className="p-3 text-center">
                        {p.status === "PAID" ? (
                          <span
                            className="text-slate-400 cursor-not-allowed"
                            title="Paid payments cannot be deleted"
                          >
                            <Trash2 size={16} />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPaymentToDelete(p)}
                            className="text-red-600 dark:text-red-400 hover:opacity-80"
                            title="Delete payment"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {payments.length === 0 && (
                  <tr>
                    <td colSpan="10" className="p-6 text-center text-slate-500 dark:text-slate-400">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!paymentToDelete}
        title="Delete payment"
        message={
          paymentToDelete
            ? `Delete payment for ${paymentToDelete.guest?.name || "Former Guest"} (${paymentToDelete.month})? This cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={deletePayment}
        onCancel={() => setPaymentToDelete(null)}
      />

      {/* ================= PROFESSIONAL RECEIPT MODAL ================= */}
      {receiptPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div
            className="relative bg-white shadow-lg print:shadow-none overflow-hidden animate-fadeInUp"
            style={{
              width: "210mm",
              height: "200mm",
              padding: "16mm",
              boxSizing: "border-box",
            }}
          >
            {/* WATERMARK */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  fontSize: "90px",
                  fontWeight: 700,
                  color: "#000",
                  opacity: 0.06,
                  transform: "rotate(-30deg)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                RENT&nbsp;MANAGER
              </div>
            </div>

            {/* HEADER */}
            <div className="relative z-10 border-b-2 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-center">RENT MANAGER</h1>
              {currentProperty?.name && (
                <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {currentProperty.name}
                </p>
              )}
              <p className="text-center text-sm tracking-wide mt-1">
                RENT PAYMENT RECEIPT
              </p>
            </div>

            {/* META */}
            <div className="relative z-10 flex justify-between text-sm mb-4">
              <div>
                <p>
                  <strong>Tenant Name:</strong> {receiptPayment.guest?.name}
                </p>
                <p>
                  <strong>Room No:</strong>{" "}
                  {receiptPayment.guest?.room?.roomNumber || "—"}
                </p>
                <p>
                  <strong>Rent Month:</strong> {receiptPayment.month}
                </p>
              </div>

              <div className="text-right">
                <p>
                  <strong>Date:</strong>{" "}
                  {receiptPayment.paidDate
                    ? new Date(receiptPayment.paidDate).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="font-semibold">PAID</span>
                </p>
              </div>
            </div>

            {/* PAYMENT TABLE */}
            <div className="relative z-10 border mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="border p-2 text-left">Payment Mode</th>
                    <th className="border p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptPayment.payments.map((pay, i) => (
                    <tr key={i}>
                      <td className="border p-2">{pay.mode}</td>
                      <td className="border p-2 text-right">₹{pay.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTALS */}
            <div className="relative z-10 mt-4 flex justify-end">
              <table className="text-sm">
                <tbody>
                  <tr>
                    <td className="pr-6 font-semibold">Total Rent:</td>
                    <td className="text-right">₹{receiptPayment.amount}</td>
                  </tr>
                  <tr>
                    <td className="pr-6 font-semibold">Amount Paid:</td>
                    <td className="text-right font-bold">
                      ₹{receiptPayment.amountPaid}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="relative z-10 mt-10 border-t pt-4 text-center text-xs">
              <p>This is a computer-generated receipt.</p>
              <p>No signature is required.</p>
              <p>RentAstra • v1.01-alpha</p>
            </div>

            {/* ACTIONS */}
            <div className="relative z-10 mt-6 flex justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-100"
              >
                Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setReceiptPayment(null)}
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
