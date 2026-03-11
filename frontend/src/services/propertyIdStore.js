const STORAGE_KEY = "rent-manager-current-property-id";

let currentPropertyId =
  typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
if (currentPropertyId === "") currentPropertyId = null;

export function getCurrentPropertyId() {
  return currentPropertyId;
}

export function setCurrentPropertyId(id) {
  currentPropertyId = id || null;
  if (typeof localStorage !== "undefined") {
    if (currentPropertyId) localStorage.setItem(STORAGE_KEY, currentPropertyId);
    else localStorage.removeItem(STORAGE_KEY);
  }
}
