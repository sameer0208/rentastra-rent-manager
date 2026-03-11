import { logout } from "../utils/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { UserCircle, Sun, Moon, Building2, ChevronDown, Plus, Pencil, Trash2, Menu, X } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { useProperty } from "../context/PropertyContext";
import { setCurrentPropertyId as clearPropertyStore } from "../services/propertyIdStore.js";
import logoImage from "../assets/images/logo.jpg";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const propertyDropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { user, clearUser } = useUser();
  const { properties, currentProperty, setCurrentPropertyId, refreshProperties, loading: propertyLoading } = useProperty();
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyAddress, setNewPropertyAddress] = useState("");
  const [addingProperty, setAddingProperty] = useState(false);

  const [editingProperty, setEditingProperty] = useState(null);
  const [editPropertyName, setEditPropertyName] = useState("");
  const [editPropertyAddress, setEditPropertyAddress] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(false);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(e.target)) {
        setShowPropertyDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
    }`;

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      clearPropertyStore(null);
      clearUser();
      logout();
      navigate("/");
    }, 700);
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    const name = newPropertyName.trim();
    if (!name) {
      toast.error("Property name is required");
      return;
    }
    setAddingProperty(true);
    try {
      const res = await api.post("/properties", { name: name, address: newPropertyAddress.trim() });
      await refreshProperties();
      setCurrentPropertyId(res.data._id);
      setNewPropertyName("");
      setNewPropertyAddress("");
      setShowAddProperty(false);
      toast.success("Property added");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add property");
    } finally {
      setAddingProperty(false);
    }
  };

  const openEditProperty = (p, e) => {
    e.stopPropagation();
    setEditingProperty(p);
    setEditPropertyName(p.name || "");
    setEditPropertyAddress(p.address || "");
    setShowPropertyDropdown(false);
  };

  const handleEditProperty = async (e) => {
    e.preventDefault();
    if (!editingProperty) return;
    const name = editPropertyName.trim();
    if (!name) {
      toast.error("Property name is required");
      return;
    }
    setSavingEdit(true);
    try {
      await api.put(`/properties/${editingProperty._id}`, { name, address: editPropertyAddress.trim() });
      await refreshProperties();
      setEditingProperty(null);
      toast.success("Property updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update property");
    } finally {
      setSavingEdit(false);
    }
  };

  const openDeleteProperty = (p, e) => {
    e.stopPropagation();
    setPropertyToDelete(p);
    setShowPropertyDropdown(false);
  };

  const handleConfirmDeleteProperty = async () => {
    if (!propertyToDelete) return;
    const idToDelete = propertyToDelete._id;
    const wasCurrent = currentProperty?._id === idToDelete;
    setDeletingProperty(true);
    try {
      await api.delete(`/properties/${idToDelete}`);
      setPropertyToDelete(null);
      toast.success("Property deleted");
      await refreshProperties();
      if (wasCurrent) {
        const remaining = properties.filter((pr) => pr._id !== idToDelete);
        setCurrentPropertyId(remaining[0]?._id || null);
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete property");
    } finally {
      setDeletingProperty(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Logo + property (desktop: full; mobile: logo only, property in drawer) */}
            <span className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 min-w-0">
              <img
                src={logoImage}
                alt="RentAstra Logo"
                className="inline-block w-8 h-8 sm:w-10 sm:h-10 -mt-1 flex-shrink-0"
              />
              <span className="flex flex-col items-start leading-tight min-w-0">
                <span className="truncate">RentAstra</span> 
                {currentProperty && (
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 truncate max-w-[100px] sm:max-w-[140px] md:max-w-[200px]" title={currentProperty.name}>
                    {currentProperty.name}
                  </span>
                )}
              </span>
            </span>

            {/* Property selector – desktop and tablet; hidden on small mobile (moved to drawer) */}
            {!propertyLoading && (
              <div className="relative hidden sm:block flex-shrink-0" ref={propertyDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowPropertyDropdown((p) => !p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors min-w-[140px] md:min-w-[160px] justify-between"
                  aria-label="Select property"
                  title="Switch or add property"
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate max-w-[100px] md:max-w-[140px]">
                      {currentProperty?.name || (properties.length === 0 ? "Add property" : "Select property")}
                    </span>
                  </span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </button>
                {showPropertyDropdown && (
                  <div className="absolute left-0 mt-1 w-56 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 z-50 animate-slide-up max-h-64 overflow-y-auto">
                    {properties.length > 0 ? (
                      properties.map((p) => (
                        <div
                          key={p._id}
                          className={`flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg group ${
                            currentProperty?._id === p._id
                              ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPropertyId(p._id);
                              setShowPropertyDropdown(false);
                              window.location.reload();
                            }}
                            className={`flex-1 text-left px-2 py-1.5 text-sm font-medium truncate min-w-0 ${
                              currentProperty?._id === p._id ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {p.name}
                          </button>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => openEditProperty(p, e)}
                              className="p-1.5 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                              title="Edit property"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => openDeleteProperty(p, e)}
                              className="p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete property"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">No properties yet</p>
                    )}
                    <div className="border-t border-slate-200 dark:border-slate-600 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPropertyDropdown(false);
                          setShowAddProperty(true);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                      >
                        <Plus className="w-4 h-4" /> Add new property
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {showAddProperty && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 animate-slide-up">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Add property</h3>
                  <form onSubmit={handleAddProperty} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={newPropertyName}
                        onChange={(e) => setNewPropertyName(e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="e.g. North Tower"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Address (optional)</label>
                      <input
                        type="text"
                        value={newPropertyAddress}
                        onChange={(e) => setNewPropertyAddress(e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="Full address"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={addingProperty}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg disabled:opacity-60"
                      >
                        {addingProperty ? "Adding..." : "Add"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddProperty(false); setNewPropertyName(""); setNewPropertyAddress(""); }}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {editingProperty && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 animate-slide-up">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Edit property</h3>
                  <form onSubmit={handleEditProperty} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={editPropertyName}
                        onChange={(e) => setEditPropertyName(e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="e.g. North Tower"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Address (optional)</label>
                      <input
                        type="text"
                        value={editPropertyAddress}
                        onChange={(e) => setEditPropertyAddress(e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        placeholder="Full address"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={savingEdit}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg disabled:opacity-60"
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingProperty(null); setEditPropertyName(""); setEditPropertyAddress(""); }}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {propertyToDelete && (
              <ConfirmModal
                open
                title="Delete property"
                message={`Are you sure you want to delete "${propertyToDelete.name}"? This cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                danger
                loading={deletingProperty}
                onCancel={() => !deletingProperty && setPropertyToDelete(null)}
                onConfirm={handleConfirmDeleteProperty}
              />
            )}

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/guests" className={linkClass("/guests")}>
                Guests
              </Link>
              <Link to="/payments" className={linkClass("/payments")}>
                Payments
              </Link>
              <Link to="/rooms" className={linkClass("/rooms")}>
                Rooms
              </Link>
              <Link
                to="/vacated-guests"
                className={linkClass("/vacated-guests")}
              >
                Vacated
              </Link>
            </div>

            {/* Right: theme + profile; on mobile also hamburger */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Hamburger – mobile only */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                  aria-label="Profile menu"
                >
                  <UserCircle className="w-8 h-8" strokeWidth={1.5} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 z-50 animate-slide-up">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowLogoutModal(true);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      <div
        role="presentation"
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] z-[60] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-xl transform transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main menu"
      >
        <div className="flex flex-col h-full pt-safe">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-800 dark:text-slate-100">Menu</span>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 touch-manipulation"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <Link to="/dashboard" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium ${linkClass("/dashboard")}`}>
              Dashboard
            </Link>
            <Link to="/guests" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium ${linkClass("/guests")}`}>
              Guests
            </Link>
            <Link to="/payments" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium ${linkClass("/payments")}`}>
              Payments
            </Link>
            <Link to="/rooms" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium ${linkClass("/rooms")}`}>
              Rooms
            </Link>
            <Link to="/vacated-guests" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium ${linkClass("/vacated-guests")}`}>
              Vacated
            </Link>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="px-4 mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Property</p>
              {!propertyLoading && (
                <div className="space-y-0.5">
                  {properties.length > 0 &&
                    properties.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => {
                          setCurrentPropertyId(p._id);
                          closeMobileMenu();
                          window.location.reload();
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
                          currentProperty?._id === p._id
                            ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  <button
                    type="button"
                    onClick={() => {
                      setShowPropertyDropdown(false);
                      setShowAddProperty(true);
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4" /> Add property
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">{theme === "dark" ? "Light" : "Dark"} mode</span>
            </div>
            <Link to="/profile" onClick={closeMobileMenu} className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
              Profile
            </Link>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                setShowLogoutModal(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>

      <ConfirmModal
        open={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        danger
        loading={isLoggingOut}
        onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
