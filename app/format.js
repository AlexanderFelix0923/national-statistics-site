"use strict";
/* Formatting helpers for Atlas in Numbers. */

function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function fmtInt(n) {
  return Math.round(n).toLocaleString("en-US");
}

/* 1,451,000,000 -> "1.45B"; 340,100,000 -> "340.1M"; 6,000,000 -> "6.0M" */
function fmtPop(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  return fmtInt(n);
}

/* $29,168,000,000,000 -> "$29.17T"; $375B stays "$375B" */
function fmtMoney(n) {
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(n >= 1e11 ? 0 : 1) + "B";
  return "$" + fmtInt(n);
}

function fmtMoney0(n) {
  return "$" + fmtInt(n);
}

function fmtYears(n) {
  return n.toFixed(1) + " yrs";
}

function fmtDensity(n) {
  return n >= 100 ? fmtInt(n) : n.toFixed(1);
}

function fmtArea(n) {
  return fmtInt(n) + " km²";
}

function fmtPct(n) {
  return (Number.isInteger(n) ? n : n.toFixed(1)) + "%";
}

function fmtCo2(n) {
  return n.toFixed(1) + " t";
}

const FORMATTERS = { pop: fmtPop, money: fmtMoney, money0: fmtMoney0, years: fmtYears, density: fmtDensity, area: fmtArea, pct: fmtPct, co2: fmtCo2 };

function fmtMetric(metric, country) {
  return FORMATTERS[metric.fmt](metric.get(country));
}
