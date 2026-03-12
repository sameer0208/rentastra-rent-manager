/**
 * Countries and states: fetches from Countries Now API with static fallback (CORS-safe).
 * India is default and always available; states load for the selected country.
 */

const COUNTRIES_URL = "https://countriesnow.space/api/v0.1/countries";
const STATES_URL = "https://countriesnow.space/api/v0.1/countries/states";

let countriesCache = null;
let statesCache = null;

/** Static fallback: India first, then common countries (used when API fails or CORS blocks) */
const STATIC_COUNTRIES = [
  "India", "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium",
  "Brazil", "Canada", "China", "Colombia", "Egypt", "France", "Germany", "Indonesia", "Iran", "Iraq", "Italy",
  "Japan", "Kenya", "Malaysia", "Mexico", "Nepal", "Netherlands", "Nigeria", "Pakistan", "Philippines", "Poland",
  "Russia", "Saudi Arabia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Thailand", "Turkey", "Uganda",
  "United Arab Emirates", "United Kingdom", "United States", "Vietnam",
].map((name) => ({ name, code: name.slice(0, 2).toUpperCase() }));

/** Indian states fallback when states API fails */
const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

function normalizeList(list) {
  const hasIndia = list.some((c) => String(c.name).toLowerCase() === "india");
  const rest = list.filter((c) => String(c.name).toLowerCase() !== "india").sort((a, b) => a.name.localeCompare(b.name));
  const india = list.find((c) => String(c.name).toLowerCase() === "india") || { name: "India", code: "IN" };
  return hasIndia ? [india, ...rest] : [{ name: "India", code: "IN" }, ...rest];
}

export async function fetchCountries() {
  if (countriesCache) return countriesCache;
  try {
    const res = await fetch(COUNTRIES_URL);
    const json = await res.json();
    const data = json?.data;
    if (res.ok && Array.isArray(data) && data.length > 0) {
      const list = data
        .map((c) => ({ name: c.name || c.country, code: c.iso2 || c.iso3 || (c.name && c.name.slice(0, 2).toUpperCase()) }))
        .filter((c) => c.name);
      countriesCache = normalizeList(list);
      return countriesCache;
    }
  } catch (_) {
    /* use fallback */
  }
  countriesCache = normalizeList(STATIC_COUNTRIES);
  return countriesCache;
}

export async function fetchStatesByCountry(countryName) {
  if (!countryName || !String(countryName).trim()) return [];
  const name = String(countryName).trim();
  const isIndia = name.toLowerCase() === "india";

  if (!statesCache) {
    try {
      const res = await fetch(STATES_URL);
      const json = await res.json();
      const data = json?.data;
      if (res.ok && Array.isArray(data)) statesCache = data;
    } catch (_) {
      statesCache = [];
    }
  }

  if (Array.isArray(statesCache) && statesCache.length > 0) {
    const country = statesCache.find((c) => String(c.name).toLowerCase() === name.toLowerCase());
    if (country && country.states) {
      const stateNames = country.states.map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean);
      stateNames.sort((a, b) => a.localeCompare(b));
      return stateNames;
    }
  }

  if (isIndia) return [...INDIA_STATES].sort((a, b) => a.localeCompare(b));
  return [];
}
