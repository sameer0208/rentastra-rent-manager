import { useEffect, useState } from "react";
import api, { openFinalReceipt } from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import DocumentViewModal from "../components/DocumentViewModal";

export default function VacatedGuests() {
  const [guests, setGuests] = useState([]);
  const [expandedGuest, setExpandedGuest] = useState(null);
  const [guestToUndo, setGuestToUndo] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const loadVacatedGuests = async () => {
    try {
      const res = await api.get("/guests/vacated");

      const enrichedGuests = await Promise.all(
        res.data.map(async (g) => {
          // ✅ Guest documents already exist in g.documents

          // 1️⃣ Family members
          const familyRes = await api.get(`/family/${g._id}`);

          // 2️⃣ Family documents per member
          const familyWithDocs = await Promise.all(
            familyRes.data.map(async (m) => {
              const famDocsRes = await api.get(`/family-documents/${m._id}`);
              return { ...m, documents: famDocsRes.data };
            })
          );

          return {
            ...g,
            documents: g.documents || [], // ✅ THIS IS THE FIX
            family: familyWithDocs,
          };
        })
      );

      setGuests(enrichedGuests);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vacated guests");
    }
  };

  const undoVacate = async () => {
    if (!guestToUndo) return;
    try {
      await api.put(`/guests/${guestToUndo}/undo-vacate`);
      toast.success("Guest restored");
      setGuestToUndo(null);
      loadVacatedGuests();
    } catch {
      toast.error("Undo failed");
    }
  };

  const toggleExpand = (guestId) => {
    setExpandedGuest(expandedGuest === guestId ? null : guestId);
  };

  useEffect(() => {
    loadVacatedGuests();
  }, []);

  return (
    <div className="px-4 py-5 sm:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-lg dark:shadow-none dark:border dark:border-slate-600 rounded-xl overflow-hidden transition-all duration-300">
        <h2 className="text-xl font-semibold p-4 border-b border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100">
          Vacated Guests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Room</th>
              <th className="p-3">Exit Date</th>
              <th className="p-3">Final Settlement</th>
              <th className="p-3">Receipt</th>
              <th className="p-3">Details</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
            {guests.map((g) => (
              <>
                <tr key={g._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-100">{g.name}</td>
                  <td className="p-3 text-center text-slate-800 dark:text-slate-100">
                    Room {g.room?.roomNumber || "—"}
                  </td>
                  <td className="p-3 text-center text-slate-800 dark:text-slate-100">
                    {new Date(g.exitInfo.exitDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center text-slate-800 dark:text-slate-100">
                    ₹{g.exitInfo.finalSettlementAmount}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await openFinalReceipt(g._id);
                        } catch {
                          toast.error("Failed to open receipt");
                        }
                      }}
                      className="text-indigo-600 dark:text-indigo-400 underline text-xs hover:no-underline"
                    >
                      Download
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleExpand(g._id)}
                      className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                    >
                      {expandedGuest === g._id ? "Hide" : "View"}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => setGuestToUndo(g._id)}
                      className="text-green-600 dark:text-green-400 text-xs hover:underline"
                    >
                      Undo Vacate
                    </button>
                  </td>
                </tr>

                {expandedGuest === g._id && (
                  <tr className="bg-slate-50 dark:bg-slate-700/30">
                    <td colSpan="7" className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1 text-slate-800 dark:text-slate-200">Guest Documents</h4>
                        {g.documents.length > 0 ? (
                          g.documents.map((d, i) => (
                            <div key={i} className="text-xs">
                              {d.name} —{" "}
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({ name: d.name, url: d.url })
                                }
                                className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
                              >
                                View
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-slate-500">No documents</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1 text-slate-800 dark:text-slate-200">Family Members</h4>

                        {g.family.length > 0 ? (
                          g.family.map((m) => (
                            <div
                              key={m._id}
                              className="border border-slate-200 dark:border-slate-600 rounded-lg p-2 mb-2 bg-white dark:bg-slate-700/30"
                            >
                              <div className="text-xs font-medium text-slate-800 dark:text-slate-100">
                                {m.name} ({m.relation})
                              </div>

                              <div className="text-xs text-slate-600 dark:text-slate-300">
                                Police Status:{" "}
                                <b>
                                  {m.policeVerification?.status || "PENDING"}
                                </b>
                              </div>

                              <div className="mt-1 text-xs">
                                {m.documents.length > 0 ? (
                                  m.documents.map((fd) => (
                                    <div key={fd._id}>
                                      {fd.documentType} —{" "}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setPreviewDoc({
                                            name: fd.documentType,
                                            url: fd.fileUrl,
                                          })
                                        }
                                        className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
                                      >
                                        View
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-slate-400 dark:text-slate-500">
                                    No documents
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            No family members
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <DocumentViewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      <ConfirmModal
        open={!!guestToUndo}
        title="Undo vacate"
        message="Restore this guest as active? They will be assigned back to their room."
        confirmText="Yes, restore"
        cancelText="Cancel"
        onConfirm={undoVacate}
        onCancel={() => setGuestToUndo(null)}
      />
    </div>
  );
}
