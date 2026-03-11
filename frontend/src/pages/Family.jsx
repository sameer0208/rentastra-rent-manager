import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import DocumentViewModal from "../components/DocumentViewModal";

export default function Family() {
  const { guestId } = useParams();

  const [guest, setGuest] = useState(null);
  const [family, setFamily] = useState([]);
  const [editingPoliceStatus, setEditingPoliceStatus] = useState(null);
  const [policeStatusInput, setPoliceStatusInput] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  const [form, setForm] = useState({
    name: "",
    relation: "",
    age: "",
  });

  const [docInputs, setDocInputs] = useState({});

  /* ---------------- LOAD DATA ---------------- */
  const loadGuest = async () => {
    const res = await api.get(`/guests/${guestId}`);
    setGuest(res.data);
  };

  const loadFamily = async () => {
    const res = await api.get(`/family/${guestId}`);
    setFamily(res.data);
  };

  /* ---------------- ADD FAMILY MEMBER ---------------- */
  const addFamilyMember = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/family/${guestId}`, form);
      toast.success("Family member added");
      setForm({ name: "", relation: "", age: "" });
      loadFamily();
    } catch {
      toast.error("Failed to add family member");
    }
  };

  const loadFamilyWithDocs = async () => {
    const membersRes = await api.get(`/family/${guestId}`);
    const members = membersRes.data;

    const membersWithDocs = await Promise.all(
      members.map(async (m) => {
        const docsRes = await api.get(`/family-documents/${m._id}`);
        return { ...m, documents: docsRes.data };
      })
    );

    setFamily(membersWithDocs);
  };

  /* ---------------- UPLOAD DOCUMENT ---------------- */
  const uploadDocument = async (memberId) => {
    const input = docInputs[memberId];

    if (!input?.file || !input?.type) {
      toast.error("Select document type and file");
      return;
    }

    const formData = new FormData();
    formData.append("document", input.file);
    formData.append("documentType", input.type); // ✅ FIXED
    formData.append("documentNumber", input.number || "");

    try {
      await api.post(`/family-documents/${memberId}`, formData);

      toast.success("Document uploaded");

      setDocInputs((prev) => ({
        ...prev,
        [memberId]: {},
      }));

      loadFamilyWithDocs(); // 👈 IMPORTANT
    } catch {
      toast.error("Document upload failed");
    }
  };

  useEffect(() => {
    loadGuest();
    loadFamilyWithDocs();
  }, [guestId]);

  const deleteDocument = async () => {
    if (!docToDelete) return;
    try {
      await api.delete(`/family-documents/${docToDelete}`);
      toast.success("Document deleted");
      setDocToDelete(null);
      loadFamily();
      loadFamilyWithDocs();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  /* ---------------- STATUS BADGE ---------------- */
  const statusBadgeClass = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 ring-2 ring-green-400 dark:ring-green-500";
      case "SUBMITTED":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 ring-2 ring-yellow-400 dark:ring-yellow-500 animate-pulse";
      default:
        return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 ring-2 ring-red-400 dark:ring-red-500 animate-pulse";
    }
  };
  const updatePoliceStatus = async (memberId) => {
    try {
      await api.put(`/family/member/${memberId}/police-status`, {
        status: policeStatusInput,
      });

      toast.success("Police status updated");
      setEditingPoliceStatus(null);
      setPoliceStatusInput("");
      loadFamilyWithDocs();
    } catch {
      toast.error("Failed to update police status");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-4 py-5 sm:p-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Family Details
            </h2>
            {guest && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Guest: <span className="font-medium text-slate-700 dark:text-slate-300">{guest.name}</span> | Room{" "}
                {guest.room?.roomNumber}
              </p>
            )}
          </div>

          <form
            onSubmit={addFamilyMember}
            className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 transition-all duration-300"
          >
            <input
              placeholder="Name"
              className="border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <select
              className="border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
              required
            >
              <option value="">Relation</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Spouse">Spouse</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Daughter">Brother</option>
              <option value="Daughter">Sister</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              placeholder="Age"
              className="border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />

            <button type="submit" className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
              Add Member
            </button>
          </form>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 overflow-x-auto overflow-hidden transition-all duration-300">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="p-3 text-left text-slate-700 dark:text-slate-200 font-medium">Name</th>
                  <th className="p-3 text-slate-700 dark:text-slate-200 font-medium">Relation</th>
                  <th className="p-3 text-slate-700 dark:text-slate-200 font-medium">Age</th>
                  <th className="p-3 text-slate-700 dark:text-slate-200 font-medium">Police Verification</th>
                  <th className="p-3 text-slate-700 dark:text-slate-200 font-medium">Documents</th>
                  <th className="p-3 text-slate-700 dark:text-slate-200 font-medium">Upload</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                {family.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-100">{m.name}</td>
                    <td className="p-3 text-slate-800 dark:text-slate-100">{m.relation}</td>
                    <td className="p-3 text-slate-800 dark:text-slate-100">{m.age || "—"}</td>

                    <td className="p-3">
                      {editingPoliceStatus === m._id ? (
                        <div className="flex gap-2 items-center">
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
                            type="button"
                            onClick={() => updatePoliceStatus(m._id)}
                            className="text-green-600 dark:text-green-400 text-xs font-medium"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingPoliceStatus(null)}
                            className="text-slate-500 dark:text-slate-400 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadgeClass(
                              m.policeVerification?.status || "PENDING"
                            )}`}
                          >
                            {m.policeVerification?.status || "PENDING"}
                          </span>

                          <button
                            onClick={() => {
                              setEditingPoliceStatus(m._id);
                              setPoliceStatusInput(
                                m.policeVerification?.status || "PENDING"
                              );
                            }}
                            className="text-indigo-600 text-xs hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </td>

                    {/* DOCUMENT LIST */}
                    <td className="p-3 text-xs space-y-2">
                      {m.documents?.length > 0 ? (
                        m.documents.map((d) => (
                          <div
                            key={d._id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {d.documentType}
                              </span>{" "}
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDoc({
                                    name: d.documentType,
                                    url: d.fileUrl,
                                  })
                                }
                                className="text-indigo-600 dark:text-indigo-400 underline ml-1 hover:no-underline"
                              >
                                View
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => setDocToDelete(d._id)}
                              className="text-red-600 dark:text-red-400 text-xs hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">No documents</span>
                      )}
                    </td>

                    {/* UPLOAD */}
                    <td className="p-3">
                      <select
                        className="border border-slate-300 dark:border-slate-500 p-1 w-full mb-1 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        value={docInputs[m._id]?.type || ""}
                        onChange={(e) =>
                          setDocInputs((prev) => ({
                            ...prev,
                            [m._id]: {
                              ...prev[m._id],
                              type: e.target.value,
                            },
                          }))
                        }
                      >
                        <option value="">Doc Type</option>
                        <option value="AADHAAR">Aadhaar</option>
                        <option value="PAN">PAN</option>
                        <option value="PHOTOGRAPH">Photograph</option>
                        <option value="PASSPORT">Passport</option>
                      </select>

                      <input
                        type="file"
                        onChange={(e) =>
                          setDocInputs((prev) => ({
                            ...prev,
                            [m._id]: {
                              ...prev[m._id],
                              file: e.target.files[0],
                            },
                          }))
                        }
                      />

                      <button
                        type="button"
                        onClick={() => uploadDocument(m._id)}
                        className="bg-slate-800 dark:bg-slate-600 text-white text-xs px-2 py-1 rounded mt-1 w-full hover:bg-slate-700 dark:hover:bg-slate-500"
                      >
                        Upload
                      </button>
                    </td>
                  </tr>
                ))}

                {family.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500 dark:text-slate-400">
                      No family members added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DocumentViewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      <ConfirmModal
        open={!!docToDelete}
        title="Delete document"
        message="Delete this document permanently? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={deleteDocument}
        onCancel={() => setDocToDelete(null)}
      />
    </>
  );
}
