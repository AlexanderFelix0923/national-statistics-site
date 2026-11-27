"use strict";
/* Atlas in Numbers — hash router and the single delegated event handler. */

function route() {
  const hash = location.hash || "#/";
  const view = document.getElementById("view");
  let name = "overview";
  if (hash.startsWith("#/country/")) {
    view.innerHTML = viewCountry(decodeURIComponent(hash.slice("#/country/".length)));
    name = "explore";
  } else if (hash.startsWith("#/explore")) {
    view.innerHTML = viewExplore();
    name = "explore";
    const q = document.getElementById("explore-q");
    if (q && exploreState.q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  } else if (hash.startsWith("#/rankings")) {
    const metric = new URLSearchParams(hash.split("?")[1] || "").get("m") || "popM";
    view.innerHTML = viewRankings(metric);
    name = "rankings";
  } else if (hash.startsWith("#/compare")) {
    view.innerHTML = viewCompare();
    name = "compare";
  } else {
    view.innerHTML = viewOverview();
  }
  document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === name));
  window.scrollTo(0, 0);
}

document.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action, code = el.dataset.code;
  if (action === "fav") { toggleFavourite(code); route(); }
  else if (action === "compare") {
    const r = toggleCompare(code);
    if (r === "full") alert("The compare tray holds 3 countries. Remove one first.");
    route();
  }
  else if (action === "region") { exploreState.region = el.dataset.region; route(); }
  else if (action === "dir") { exploreState.dir *= -1; route(); }
  else if (action === "favs-only") { exploreState.favsOnly = !exploreState.favsOnly; route(); }
  else if (action === "rank-tab") { location.hash = "#/rankings?m=" + el.dataset.metric; }
  else if (action === "reset") { resetPrefs(); route(); }
});

document.addEventListener("input", (ev) => {
  if (ev.target.id === "explore-q") { exploreState.q = ev.target.value.toLowerCase(); route(); }
});

document.addEventListener("change", (ev) => {
  if (ev.target.id === "explore-sort") { exploreState.sort = ev.target.value; route(); }
  if (ev.target.dataset && ev.target.dataset.compareSlot !== undefined) {
    const slot = Number(ev.target.dataset.compareSlot);
    const val = ev.target.value;
    const next = [...prefs.compare];
    while (next.length < 3) next.push("");
    next[slot] = val;
    prefs.compare = next.filter((c, i) => c && next.indexOf(c) === i).slice(0, 3);
    savePrefs();
    route();
  }
});

window.addEventListener("hashchange", route);
route();
