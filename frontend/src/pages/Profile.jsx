import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { User, Mail, Phone, Building2, MapPin, ArrowLeft, Pencil, Globe, MapPinned } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useProperty } from "../context/PropertyContext";
import { fetchCountries, fetchStatesByCountry } from "../services/countriesApi";
import PincodeInput from "../components/PincodeInput";

export default function Profile() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const { refreshProperties, currentPropertyId } = useProperty();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    propertyName: "",
    propertyAddress: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState([{ name: "India", code: "IN" }]);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/auth/me")
      .then((res) => {
        if (isMounted) {
          setUser(res.data);
          setEditForm({
            fullName: res.data.fullName || "",
            phone: res.data.phone || "",
            propertyName: res.data.propertyName || "",
            propertyAddress: res.data.propertyAddress || "",
            country: res.data.country || "",
            state: res.data.state || "",
            city: res.data.city || "",
            pincode: res.data.pincode || "",
          });
        }
      })
      .catch(() => {
        toast.error("Failed to load profile");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const startEdit = () => {
    setEditForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      propertyName: user?.propertyName || "",
      propertyAddress: user?.propertyAddress || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
    });
    setEditing(true);
  };

  useEffect(() => {
    fetchCountries()
      .then((list) => setCountries(Array.isArray(list) && list.length ? list : [{ name: "India", code: "IN" }]))
      .catch(() => setCountries([{ name: "India", code: "IN" }]));
  }, []);

  useEffect(() => {
    if (!editForm.country) {
      setStates([]);
      return;
    }
    if (!editing) return;
    setStatesLoading(true);
    fetchStatesByCountry(editForm.country)
      .then((list) => {
        setStates(list);
        setEditForm((f) => ({ ...f, state: list.includes(f.state) ? f.state : "" }));
      })
      .catch(() => setStates([]))
      .finally(() => setStatesLoading(false));
  }, [editForm.country, editing]);

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const phone = String(editForm.phone || "").replace(/\D/g, "");
    if (phone.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    setSaving(true);
    try {
      const country = typeof editForm.country === "string" ? editForm.country.trim() : "";
      const state = typeof editForm.state === "string" ? editForm.state.trim() : "";
      const city = typeof editForm.city === "string" ? editForm.city.trim() : "";
      const pincode = typeof editForm.pincode === "string" ? String(editForm.pincode).replace(/\D/g, "").slice(0, 10) : "";
      const res = await api.put("/auth/me", {
        fullName: editForm.fullName,
        phone: editForm.phone,
        propertyName: editForm.propertyName,
        propertyAddress: editForm.propertyAddress,
        country,
        state,
        city,
        pincode,
        propertyId: currentPropertyId || undefined,
      });
      setUser(res.data);
      refreshUser();
      await refreshProperties();
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
        <p className="text-slate-500 dark:text-slate-400">Could not load profile.</p>
      </div>
    );
  }

  const fields = [
    { label: "Full Name", value: user.fullName, icon: User },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Mobile Number", value: user.phone, icon: Phone },
    { label: "Property Name", value: user.propertyName, icon: Building2 },
    { label: "Property Address", value: user.propertyAddress || "Not provided", icon: MapPin },
    { label: "Country", value: user.country || "Not provided", icon: Globe },
    { label: "State", value: user.state || "Not provided", icon: MapPinned },
    { label: "City", value: user.city || "Not provided", icon: MapPinned },
    { label: "Pincode", value: user.pincode || "Not provided", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-4 py-5 sm:p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-none dark:border dark:border-slate-600 overflow-hidden transition-all duration-300 animate-slide-up">
          {/* Header with gradient + edit icon */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 px-6 sm:px-8 py-8 sm:py-10 text-white relative">
            {!editing && (
              <button
                type="button"
                onClick={startEdit}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur transition-colors"
                aria-label="Edit profile"
              >
                <Pencil className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur mb-4">
              <User className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {user.fullName}
            </h1>
            <p className="text-indigo-100 text-sm mt-1">Account profile</p>
          </div>

          {editing ? (
            <form onSubmit={saveProfile} className="p-4 sm:p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="mt-1 w-full border border-slate-300 dark:border-slate-500 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email (cannot be changed)</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    disabled
                    className="mt-1 w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Phone className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mobile (10 digits)</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, "") })}
                    className="mt-1 w-full border border-slate-300 dark:border-slate-500 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                    placeholder="10 digits"
                  />
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Building2 className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Property Name</label>
                  <input
                    type="text"
                    value={editForm.propertyName}
                    onChange={(e) => setEditForm({ ...editForm, propertyName: e.target.value })}
                    className="mt-1 w-full border border-slate-300 dark:border-slate-500 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Property Address</label>
                  <input
                    type="text"
                    value={editForm.propertyAddress}
                    onChange={(e) => setEditForm({ ...editForm, propertyAddress: e.target.value })}
                    className="mt-1 w-full border border-slate-300 dark:border-slate-500 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Globe className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country</label>
                  <select
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="mt-1 w-full border border-slate-300 dark:border-slate-500 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.code || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <MapPinned className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">State</label>
                  <select
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    disabled={!editForm.country || statesLoading}
                    className="mt-1 w-full border border-slate-300 dark:border-slate-500 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 disabled:opacity-60"
                  >
                    <option value="">Select state</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <MapPinned className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="mt-1 w-full border border-slate-300 dark:border-slate-500 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                    placeholder="City"
                  />
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pincode (6 digits)</label>
                  <div className="mt-1">
                    <PincodeInput
                      value={editForm.pincode}
                      onChange={(val) => setEditForm({ ...editForm, pincode: val })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="p-4 sm:p-8 space-y-6">
                {fields.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {label}
                      </dt>
                      <dd className="mt-1 text-slate-800 dark:text-slate-100 font-medium break-words">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 sm:px-8 pb-6 sm:pb-8">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                  Go Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
