"use strict";
/*
 * State for Atlas in Numbers: the country index, derived aggregates (world
 * totals, ranks, region rollups) and the visitor's own favourites and
 * comparison tray, persisted in localStorage.
 */
const LS_KEY = "atlas-in-numbers-v1";

function byCode(code) {
  return COUNTRIES.find((c) => c.code === code) || null;
}

function metricById(id) {
  return METRICS.find((m) => m.id === id) || METRICS[0];
}

/* Rank of a country in a metric, 1 = highest (or lowest for lowIsGood). */
function rankOf(country, metric) {
  const sorted = [...COUNTRIES].sort((a, b) => (metric.lowIsGood ? metric.get(a) - metric.get(b) : metric.get(b) - metric.get(a)));
  return sorted.findIndex((c) => c.code === country.code) + 1;
}

function topBy(metric, n) {
  return [...COUNTRIES]
    .sort((a, b) => (metric.lowIsGood ? metric.get(a) - metric.get(b) : metric.get(b) - metric.get(a)))
    .slice(0, n);
}

function worldTotals() {
  const pop = COUNTRIES.reduce((s, c) => s + c.popM * 1e6, 0);
  const gdp = COUNTRIES.reduce((s, c) => s + c.gdpBn * 1e9, 0);
  const lifeAvg = COUNTRIES.reduce((s, c) => s + c.lifeExp * c.popM, 0) / COUNTRIES.reduce((s, c) => s + c.popM, 0);
  return { pop, gdp, lifeAvg, count: COUNTRIES.length };
}

function worldAverage(metric) {
  return COUNTRIES.reduce((s, c) => s + metric.get(c), 0) / COUNTRIES.length;
}

function regionRollup() {
  return REGIONS.map((region) => {
    const list = COUNTRIES.filter((c) => c.region === region);
    return {
      region,
      count: list.length,
      pop: list.reduce((s, c) => s + c.popM * 1e6, 0),
      gdp: list.reduce((s, c) => s + c.gdpBn * 1e9, 0),
      largest: list.reduce((a, b) => (b.popM > a.popM ? b : a))
    };
  }).sort((a, b) => b.pop - a.pop);
}

/* "Country of the day": deterministic from the date, so every visitor and
   every screenshot on the same day shows the same feature. */
function featuredCountry(dateStr) {
  let h = 0;
  for (const ch of dateStr) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return COUNTRIES[h % COUNTRIES.length];
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        favourites: Array.isArray(p.favourites) ? p.favourites.filter((c) => byCode(c)) : [],
        compare: Array.isArray(p.compare) ? p.compare.filter((c) => byCode(c)).slice(0, 3) : []
      };
    }
  } catch (e) { /* corrupted storage: start clean */ }
  return { favourites: [], compare: ["USA", "CHN", "JPN"] };
}

const prefs = loadPrefs();

function savePrefs() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(prefs)); } catch (e) { /* private mode */ }
}

function toggleFavourite(code) {
  const i = prefs.favourites.indexOf(code);
  if (i >= 0) prefs.favourites.splice(i, 1); else prefs.favourites.push(code);
  savePrefs();
}

function isFavourite(code) {
  return prefs.favourites.includes(code);
}

function toggleCompare(code) {
  const i = prefs.compare.indexOf(code);
  if (i >= 0) { prefs.compare.splice(i, 1); savePrefs(); return "removed"; }
  if (prefs.compare.length >= 3) return "full";
  prefs.compare.push(code);
  savePrefs();
  return "added";
}

function resetPrefs() {
  prefs.favourites = [];
  prefs.compare = ["USA", "CHN", "JPN"];
  savePrefs();
}
