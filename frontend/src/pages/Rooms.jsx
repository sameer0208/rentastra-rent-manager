import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import { trackEvent } from "../utils/analytics";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomNumber: "",
    floor: "",
    rent: "",
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [roomToDelete, setRoomToDelete] = useState(null);

  // LOAD ROOMS
  const loadRooms = async () => {
    const res = await api.get("/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms");
        if (isMounted) {
          setRooms(res.data);
        }
      } catch (err) {
        console.error("Failed to load rooms", err);
      }
    };

    fetchRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  // ADD ROOM
  const addRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms", form);
      trackEvent("room_added");
      toast.success(`Room ${form.roomNumber} added`);
      setForm({ roomNumber: "", floor: "", rent: "" });
      loadRooms();
    } catch {
      toast.error("Failed to add room");
    }
  };

  // EDIT
  const startEdit = (room) => {
    setEditingRoom(room._id);
    setEditForm({
      roomNumber: room.roomNumber,
      floor: room.floor,
      rent: room.rent,
    });
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setEditForm({});
  };

  const saveEdit = async (roomId) => {
    try {
      await api.put(`/rooms/${roomId}`, editForm);
      toast.success("Room updated");
      cancelEdit();
      loadRooms();
    } catch {
      toast.error("Failed to update room");
    }
  };

  const deleteRoom = async () => {
    if (!roomToDelete) return;
    try {
      await api.delete(`/rooms/${roomToDelete._id}`);
      toast.success(`Room ${roomToDelete.roomNumber} deleted`);
      setRoomToDelete(null);
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot delete occupied room");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Rooms
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage room inventory and rent
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 p-5 mb-6 transition-all duration-300">
            <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-100">Add Room</h3>

            <form
              onSubmit={addRoom}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <input
                className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Room No"
                value={form.roomNumber}
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
                required
              />
              <input
                type="number"
                className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Floor"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                required
              />
              <input
                type="number"
                className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Rent"
                value={form.rent}
                onChange={(e) => setForm({ ...form, rent: e.target.value })}
                required
              />
              <button type="submit" className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
                Add Room
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-slate-600 overflow-x-auto overflow-hidden transition-all duration-300">
            <table className="w-full text-sm min-w-[400px]">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-3 text-left">Room</th>
                  <th className="p-3 text-left">Floor</th>
                  <th className="p-3 text-left">Rent</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                {rooms.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-100">
                      {editingRoom === r._id ? (
                        <input
                          className="border border-slate-300 dark:border-slate-500 rounded px-2 py-1 w-full bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          value={editForm.roomNumber}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              roomNumber: e.target.value,
                            })
                          }
                        />
                      ) : (
                        r.roomNumber
                      )}
                    </td>

                    <td className="p-3 text-slate-800 dark:text-slate-100">
                      {editingRoom === r._id ? (
                        <input
                          type="number"
                          className="border border-slate-300 dark:border-slate-500 rounded px-2 py-1 w-full bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          value={editForm.floor}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              floor: e.target.value,
                            })
                          }
                        />
                      ) : (
                        r.floor
                      )}
                    </td>

                    <td className="p-3 text-slate-800 dark:text-slate-100">
                      {editingRoom === r._id ? (
                        <input
                          type="number"
                          className="border border-slate-300 dark:border-slate-500 rounded px-2 py-1 w-full bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          value={editForm.rent}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              rent: e.target.value,
                            })
                          }
                        />
                      ) : (
                        `₹${r.rent}`
                      )}
                    </td>

                    <td className="p-3">
                      {r.isOccupied ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                          Occupied
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                          Vacant
                        </span>
                      )}
                    </td>

                    <td className="p-3 space-x-2">
                      {editingRoom === r._id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveEdit(r._id)}
                            className="bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-slate-300 dark:bg-slate-600 px-3 py-1 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-400 dark:hover:bg-slate-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(r)}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setRoomToDelete(r)}
                            className="text-red-600 dark:text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {rooms.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-500 dark:text-slate-400">
                      No rooms added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!roomToDelete}
        title="Delete room"
        message={
          roomToDelete
            ? `Are you sure you want to delete Room ${roomToDelete.roomNumber}?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={deleteRoom}
        onCancel={() => setRoomToDelete(null)}
      />
    </>
  );
}
