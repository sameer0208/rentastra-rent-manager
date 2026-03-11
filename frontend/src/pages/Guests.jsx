import { useEffect, useState } from "react";
import api, { openFinalReceipt } from "../services/api";
import PaymentHistory from "../components/PaymentHistory";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import VacateGuestModal from "../components/VacateGuestModal";
import ConfirmModal from "../components/ConfirmModal";
import DocumentViewModal from "../components/DocumentViewModal";

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editingGuest, setEditingGuest] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const navigate = useNavigate();
  const [editingPoliceGuest, setEditingPoliceGuest] = useState(null);
  const [policeStatusInput, setPoliceStatusInput] = useState("");
  const [vacatingGuest, setVacatingGuest] = useState(null);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  const [docInputs, setDocInputs] = useState({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    roomId: "",
    rent: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    roomId: "",
  });

  /* ---------------- LOAD DATA ---------------- */
  const loadGuests = async () => {
    const res = await api.get("/guests/with-balance");
    setGuests(res.data);
  };

  const loadRooms = async () => {
    const res = await api.get("/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [guestsRes, roomsRes] = await Promise.all([
          api.get("/guests/with-balance"),
          api.get("/rooms"),
        ]);

        if (isMounted) {
          setGuests(guestsRes.data);
          setRooms(roomsRes.data);
        }
      } catch (err) {
        console.error("Failed to load guests or rooms", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------------- ADD GUEST ---------------- */
  const addGuest = async (e) => {
    e.preventDefault();
    const phone = String(form.phone || "").replace(/\D/g, "");
    if (phone.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    try {
      await api.post("/guests", {
        name: form.name,
        phone: form.phone.trim(),
        roomId: form.roomId,
      });

      toast.success("Guest added");
      setForm({ name: "", phone: "", roomId: "", rent: "" });
      loadGuests();
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add guest");
    }
  };

  /* ---------------- EDIT ---------------- */
  const startEdit = (g) => {
    setEditingGuest(g._id);
    setEditForm({
      name: g.name,
      phone: g.phone,
      roomId: g.room?._id,
    });
  };

  const cancelEdit = () => {
    setEditingGuest(null);
    setEditForm({ name: "", phone: "", roomId: "" });
  };

  const saveEdit = async (g) => {
    const phone = String(editForm.phone || "").replace(/\D/g, "");
    if (phone.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    try {
      await api.put(`/guests/${g._id}`, {
        name: editForm.name,
        phone: editForm.phone,
      });

      if (editForm.roomId !== g.room?._id) {
        await api.put(`/guests/${g._id}/change-room`, {
          roomId: editForm.roomId,
        });
      }

      toast.success("Guest updated");
      setEditingGuest(null);
      loadGuests();
      loadRooms();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteGuest = async () => {
    if (!guestToDelete) return;
    try {
      await api.delete(`/guests/${guestToDelete._id}`);
      toast.success(`Guest ${guestToDelete.name} deleted`);
      setGuestToDelete(null);
      loadGuests();
      loadRooms();
    } catch {
      toast.error("Failed to delete guest");
    }
  };

  /* ---------------- DOCUMENT UPLOAD ---------------- */
  const uploadDocument = async (guestId) => {
    const input = docInputs[guestId];

    if (!input?.file || !input?.name) {
      toast.error("Select file and document name");
      return;
    }

    const formData = new FormData();
    formData.append("document", input.file);
    formData.append("documentName", input.name);

    try {
      await api.post(`/documents/${guestId}`, formData);
      toast.success("Document uploaded");

      // clear only this guest's input
      setDocInputs((prev) => ({
        ...prev,
        [guestId]: { name: "", file: null },
      }));

      loadGuests();
    } catch {
      toast.error("Document upload failed");
    }
  };

  const deleteDocument = async () => {
    if (!docToDelete) return;
    try {
      await api.delete(`/documents/${docToDelete.guestId}`, {
        data: { url: docToDelete.url },
      });
      toast.success("Document deleted");
      setDocToDelete(null);
      loadGuests();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 ring-2 ring-green-400 dark:ring-green-500 shadow-green-400/50";
      case "PARTIAL":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 ring-2 ring-yellow-400 dark:ring-yellow-500 animate-pulse";
      case "PENDING":
      default:
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 ring-2 ring-red-400 dark:ring-red-500 animate-pulse";
    }
  };

  const guestPoliceVerificationStatusBadgeClass = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 ring-2 ring-green-400 dark:ring-green-500";
      case "SUBMITTED":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 ring-2 ring-yellow-400 dark:ring-yellow-500 animate-pulse";
      default:
        return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 ring-2 ring-red-400 dark:ring-red-500 animate-pulse";
    }
  };

  const updateGuestPoliceStatus = async (guestId) => {
    try {
      await api.put(`/guests/${guestId}/police-status`, {
        status: policeStatusInput,
      });

      toast.success("Guest police status updated");
      setEditingPoliceGuest(null);
      setPoliceStatusInput("");
      loadGuests();
    } catch {
      toast.error("Failed to update police status");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-4 py-5 sm:p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <form
            onSubmit={addGuest}
            className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 transition-all duration-300"
          >
            <input
              placeholder="Name"
              className="border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              placeholder="Phone (10 digits)"
              type="tel"
              maxLength={10}
              className="border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              required
            />

            <select
              className="border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              value={form.roomId}
              onChange={(e) => {
                const room = rooms.find((r) => r._id === e.target.value);
                setForm({
                  ...form,
                  roomId: room?._id || "",
                  rent: room?.rent || "",
                });
              }}
              required
            >
              <option value="">Select Room</option>
              {rooms
                .filter((r) => !r.isOccupied)
                .map((r) => (
                  <option key={r._id} value={r._id}>
                    Room {r.roomNumber} (₹{r.rent})
                  </option>
                ))}
            </select>

            <input
              className="border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-slate-100 read-only:opacity-90"
              value={form.rent ? `₹${form.rent}` : ""}
              readOnly
            />

            <button type="submit" className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
              Add Guest
            </button>
          </form>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 overflow-x-auto transition-all duration-300 -mx-4 sm:mx-0">
            <table className="w-full text-sm table-fixed min-w-[900px]">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Name</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Room</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Phone</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Rent</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Remaining</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Status</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Documents</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Upload</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Payment Status</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Police Verification</th>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                {guests.map((g) => (
                  <tr
                    key={g._id}
                    className={
                      editingGuest === g._id
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                    }
                  >
                    <td className="p-3 font-medium w-[180px] text-center align-top text-slate-800 dark:text-slate-100">
                      {editingGuest === g._id ? (
                        <input
                          className="border border-slate-300 dark:border-slate-500 p-1 w-full rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      ) : (
                        g.name
                      )}
                    </td>

                    <td
                      className="p-3 w-[180px] text-center align-top text-slate-800 dark:text-slate-100"
                      style={{ minWidth: "120px" }}
                    >
                      {editingGuest === g._id ? (
                        <select
                          className="border border-slate-300 dark:border-slate-500 p-1 w-full rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          value={editForm.roomId}
                          onChange={(e) =>
                            setEditForm({ ...editForm, roomId: e.target.value })
                          }
                        >
                          {rooms.map((r) => (
                            <option key={r._id} value={r._id}>
                              Room {r.roomNumber}
                            </option>
                          ))}
                        </select>
                      ) : (
                        `Room ${g.room?.roomNumber}`
                      )}
                    </td>

                    <td className="p-3 w-[180px] text-center align-top text-slate-800 dark:text-slate-100">
                      {editingGuest === g._id ? (
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10 digits"
                          className="border border-slate-300 dark:border-slate-500 p-1 w-full rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, "") })
                          }
                        />
                      ) : (
                        g.phone
                      )}
                    </td>

                    <td className="p-3 w-[180px] text-center align-top text-slate-800 dark:text-slate-100">
                      ₹{g.room?.rent}
                    </td>

                    <td className="p-3 font-semibold w-[180px] text-center align-top text-slate-800 dark:text-slate-100">
                      ₹{g.remaining}
                    </td>

                    <td className="p-3 w-[180px] text-center align-top">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusBadgeClass(
                          g.paymentStatus
                        )}`}
                      >
                        {g.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3 w-[180px] text-center align-top space-y-1 text-slate-800 dark:text-slate-100">
                      {g.documents?.map((doc, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1 items-center"
                        >
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {doc.name}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDocToDelete({ guestId: g._id, url: doc.url })
                            }
                            className="text-red-600 dark:text-red-400 text-xs hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </td>

                    {/* UPLOAD */}
                    <td className="p-3 w-[180px] text-center align-top">
                      {/* Doc name */}
                      <input
                        placeholder="Doc name"
                        className="border border-slate-300 dark:border-slate-500 p-1 w-full mb-1 text-xs rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                        value={docInputs[g._id]?.name || ""}
                        onChange={(e) =>
                          setDocInputs((prev) => ({
                            ...prev,
                            [g._id]: {
                              ...prev[g._id],
                              name: e.target.value,
                            },
                          }))
                        }
                      />

                      {/* Hidden file input */}
                      <input
                        type="file"
                        id={`file-${g._id}`}
                        className="hidden"
                        onChange={(e) =>
                          setDocInputs((prev) => ({
                            ...prev,
                            [g._id]: {
                              ...prev[g._id],
                              file: e.target.files[0],
                            },
                          }))
                        }
                      />

                      {/* Custom button */}
                      <label
                        htmlFor={`file-${g._id}`}
                        className="block w-full cursor-pointer bg-slate-200 dark:bg-slate-600 text-xs py-1 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500"
                      >
                        {docInputs[g._id]?.file
                          ? docInputs[g._id].file.name.slice(0, 15) + "…"
                          : "Choose file"}
                      </label>

                      {/* Upload button */}
                      <button
                        onClick={() => uploadDocument(g._id)}
                        className="bg-slate-800 dark:bg-slate-600 text-white text-xs px-2 py-1 rounded mt-1 w-full hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"
                      >
                        Upload
                      </button>
                    </td>

                    <td className="p-3 w-[180px] text-center align-top">
                      <button
                        type="button"
                        onClick={() => setSelectedGuest(g._id)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Payments
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/guests/${g._id}/family`)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                      >
                        Family
                      </button>
                    </td>

                    <td className="p-3 w-[180px] text-center align-top">
                      {editingPoliceGuest === g._id ? (
                        <div className="flex flex-col gap-1 items-center">
                          <select
                            className="border border-slate-300 dark:border-slate-500 p-1 rounded text-xs bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                            value={policeStatusInput}
                            onChange={(e) =>
                              setPoliceStatusInput(e.target.value)
                            }
                          >
                            <option value="PENDING">Pending</option>
                            <option value="SUBMITTED">Submitted</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                          </select>

                          <button
                            onClick={() => updateGuestPoliceStatus(g._id)}
                            className="text-green-600 dark:text-green-400 text-xs font-medium"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingPoliceGuest(null)}
                            className="text-slate-500 dark:text-slate-400 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 items-center">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${guestPoliceVerificationStatusBadgeClass(
                              g.policeVerification?.status || "PENDING"
                            )}`}
                          >
                            {g.policeVerification?.status || "PENDING"}
                          </span>

                          <button
                            onClick={() => {
                              setEditingPoliceGuest(g._id);
                              setPoliceStatusInput(
                                g.policeVerification?.status || "PENDING"
                              );
                            }}
                            className="text-indigo-600 dark:text-indigo-400 text-xs hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {g.exitInfo?.isExited ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                          Vacated
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-3 space-y-1">
                      {!g.exitInfo?.isExited ? (
                        editingGuest === g._id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(g)}
                              className="bg-green-600 dark:bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors block w-full font-medium"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm px-3 py-1.5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors block w-full"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(g)}
                            className="text-indigo-600 dark:text-indigo-400 block hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setGuestToDelete(g)}
                            className="text-red-600 dark:text-red-400 block hover:underline"
                          >
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={() => setVacatingGuest(g)}
                            className="text-red-700 dark:text-red-400 font-semibold block hover:underline"
                          >
                            Vacate
                          </button>
                        </>
                        )
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await openFinalReceipt(g._id);
                              } catch {
                                toast.error("Failed to open receipt");
                              }
                            }}
                            className="text-indigo-600 dark:text-indigo-400 text-xs underline hover:no-underline"
                          >
                            Download Final Receipt
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PAYMENT HISTORY */}
      {selectedGuest && (
        <PaymentHistory
          guestId={selectedGuest}
          onClose={() => setSelectedGuest(null)}
        />
      )}
      <DocumentViewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      <ConfirmModal
        open={!!guestToDelete}
        title="Delete guest"
        message={
          guestToDelete
            ? `Are you sure you want to delete ${guestToDelete.name}? This cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={deleteGuest}
        onCancel={() => setGuestToDelete(null)}
      />

      <ConfirmModal
        open={!!docToDelete}
        title="Delete document"
        message="Are you sure you want to delete this document?"
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={deleteDocument}
        onCancel={() => setDocToDelete(null)}
      />

      {vacatingGuest && (
        <VacateGuestModal
          guest={vacatingGuest}
          onClose={() => setVacatingGuest(null)}
          onSuccess={loadGuests}
        />
      )}
    </>
  );
}
