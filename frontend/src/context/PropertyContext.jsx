import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { isLoggedIn } from "../utils/auth";
import { setCurrentPropertyId } from "../services/propertyIdStore.js";

const PROPERTY_ID_KEY = "rent-manager-current-property-id";

const PropertyContext = createContext(null);

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [currentPropertyId, setCurrentPropertyIdState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setCurrent = (id) => {
    setCurrentPropertyIdState(id);
    setCurrentPropertyId(id);
    if (id) localStorage.setItem(PROPERTY_ID_KEY, id);
    else localStorage.removeItem(PROPERTY_ID_KEY);
  };

  const refreshProperties = async () => {
    if (!isLoggedIn()) {
      setProperties([]);
      setCurrent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/properties");
      const list = Array.isArray(res.data) ? res.data : [];
      setProperties(list);
      const saved = localStorage.getItem(PROPERTY_ID_KEY);
      const id = saved && list.some((p) => p._id === saved) ? saved : list[0]?._id || null;
      setCurrent(id);
    } catch {
      setProperties([]);
      setCurrent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      refreshProperties();
    } else {
      setProperties([]);
      setCurrentPropertyId(null);
      setCurrentPropertyIdState(null);
      setLoading(false);
    }
  }, []);

  const value = {
    properties,
    currentPropertyId,
    currentProperty: properties.find((p) => p._id === currentPropertyId) || null,
    setCurrentPropertyId: setCurrent,
    refreshProperties,
    loading,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useProperty must be used within PropertyProvider");
  return ctx;
}
