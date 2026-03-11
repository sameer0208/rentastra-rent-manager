import { useEffect, useState } from "react";
import api from "../services/api";
import DatePicker from "react-datepicker";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [lateSummary, setLateSummary] = useState(null);
  const [showLateDetails, setShowLateDetails] = useState(false);
  const monthToString = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const summaryRes = await api.get(
          `/dashboard/summary?month=${selectedMonth}`,
        );

        const lateRes = await api.get("/dashboard/late-summary");

        if (isMounted) {
          setData(summaryRes.data);
          setLateSummary(lateRes.data);
        }
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [selectedMonth]);

  if (!data || !lateSummary) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Overview for {selectedMonth}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 stagger-children">
            <StatCard title="Total Guests" value={data.totalGuests} />

            <StatCard title="Rooms Occupied" value={data.roomsOccupied} />

            <StatCard
              title="Collected"
              value={`₹${data.totalCollected}`}
              color="green"
            />

            <StatCard
              title="Pending Amount"
              value={`₹${data.totalPending}`}
              color="yellow"
            />

            <StatCard
              title="Pending Guests"
              value={data.pendingCount}
              color="red"
            />

            <StatCard
              title="Late Amount"
              value={`₹${lateSummary.lateAmount}`}
              color="red"
              highlight
            />
          </div>

          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 p-5 transition-all duration-300">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
              Monthly Summary
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You have collected{" "}
              <span className="font-semibold text-green-600">
                ₹{data.totalCollected}
              </span>{" "}
              in {selectedMonth}.{" "}
              {data.pendingCount > 0 && (
                <>
                  <span className="font-semibold text-red-600">
                    {data.pendingCount}
                  </span>{" "}
                  guest(s) still have pending rent.
                </>
              )}
            </p>
          </div>

          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 p-5 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
                  Late Payments
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {lateSummary.lateCount} overdue payment(s)
                </p>
              </div>

              {lateSummary.lateCount > 0 && (
                <button
                  onClick={() => setShowLateDetails(!showLateDetails)}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  {showLateDetails ? "Hide details" : "View details"}
                </button>
              )}
            </div>

            {lateSummary.lateCount === 0 && (
              <p className="text-green-600 text-sm">🎉 No late payments</p>
            )}

            {showLateDetails && (
              <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
                <table className="w-full text-sm border-t border-slate-200 dark:border-slate-600 min-w-[400px]">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="p-3 text-left">Guest</th>
                      <th className="p-3">Room</th>
                      <th className="p-3">Month</th>
                      <th className="p-3">Remaining</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lateSummary.details.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-medium">{p.guestName}</td>
                        <td className="p-3">{p.roomNumber}</td>
                        <td className="p-3">{p.month}</td>
                        <td className="p-3 font-semibold">₹{p.remaining}</td>
                        <td className="p-3">
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- STAT CARD ---------------- */
function StatCard({ title, value, color, highlight }) {
  const colorMap = {
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
        highlight ? "border-2 border-red-300 dark:border-red-500/50" : ""
      }`}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p
        className={`text-2xl font-bold mt-1 ${colorMap[color] || "text-slate-800 dark:text-slate-100"}`}
      >
        {value}
      </p>
    </div>
  );
}
