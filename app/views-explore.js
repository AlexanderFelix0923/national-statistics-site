"use strict";
/* Atlas in Numbers — explore table and country detail views. */

const exploreState = { q: "", region: "All", sort: "popM", dir: -1, favsOnly: false };

function viewExplore() {
  const regionChips = ["All", ...REGIONS].map((r) =>
    `<button class="chip ${exploreState.region === r ? "active" : ""}" data-action="region" data-region="${r}">${r}</button>`).join("");
  const sortOptions = METRICS.map((m) =>
    `<option value="${m.id}" ${exploreState.sort === m.id ? "selected" : ""}>${esc(m.label)}</option>`).join("");

  const m = metricById(exploreState.sort);
  const list = COUNTRIES.filter((c) =>
    (exploreState.region === "All" || c.region === exploreState.region) &&
    (!exploreState.favsOnly || isFavourite(c.code)) &&
    (exploreState.q === "" || c.name.toLowerCase().includes(exploreState.q) || c.capital.toLowerCase().includes(exploreState.q)));
  /* dir -1 = largest first, dir 1 = smallest first */
  list.sort((a, b) => (m.get(b) - m.get(a)) * (exploreState.dir === -1 ? 1 : -1));

  const rows = list.map((c) => `<tr>
      <td>${starBtn(c.code)}</td>
      <td><a href="#/country/${c.code}"><strong>${esc(c.name)}</strong></a><br><span class="muted">${esc(c.capital)}</span></td>
      <td>${esc(c.region)}</td>
      <td>${fmtPop(c.popM * 1e6)}</td>
      <td>${fmtMoney(c.gdpBn * 1e9)}</td>
      <td>${fmtMoney0(c.gdpPc)}</td>
      <td>${c.lifeExp.toFixed(1)}</td>
      <td>${fmtDensity((c.popM * 1e6) / c.areaKm2)}</td>
      <td><button class="btn small" data-action="compare" data-code="${c.code}">${prefs.compare.includes(c.code) ? "✓ Compare" : "+ Compare"}</button></td>
    </tr>`).join("");

  return `
    <section class="page-head"><h1>Explore countries</h1><p>Search, filter and sort all ${COUNTRIES.length} countries. Click a name for its full page.</p></section>
    <div class="panel">
      <div class="controls">
        <input type="search" id="explore-q" placeholder="Search country or capital…" value="${esc(exploreState.q)}">
        <label>Sort by <select id="explore-sort">${sortOptions}</select></label>
        <button class="chip" data-action="dir">${exploreState.dir === -1 ? "Largest first ↓" : "Smallest first ↑"}</button>
        <button class="chip ${exploreState.favsOnly ? "active" : ""}" data-action="favs-only">★ Favourites only</button>
      </div>
      <div class="chips">${regionChips}</div>
      <p class="muted">${list.length} of ${COUNTRIES.length} countries shown, sorted by ${esc(m.label.toLowerCase())}.</p>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th></th><th>Country</th><th>Region</th><th>Population</th><th>GDP</th><th>GDP / capita</th><th>Life exp.</th><th>Density /km²</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="9" class="empty">No country matches — try clearing the search or the favourites filter.</td></tr>`}</tbody>
      </table></div>
    </div>`;
}

function viewCountry(code) {
  const c = byCode(code);
  if (!c) return `<section class="page-head"><h1>Not found</h1><p>No country with code ${esc(code)}.</p></section>`;
  const density = (c.popM * 1e6) / c.areaKm2;
  const popChange = ((c.popHist[4] - c.popHist[0]) / c.popHist[0]) * 100;
  const peakIdx = c.popHist.indexOf(Math.max(...c.popHist));
  const histNote = `1990: ${c.popHist[0]}M → 2024: ${c.popHist[4]}M (${popChange >= 0 ? "+" : ""}${popChange.toFixed(0)}%), peaking at ${c.popHist[peakIdx]}M in ${HIST_YEARS[peakIdx]}.`;
  const worldPopShare = (c.popM / COUNTRIES.reduce((s, x) => s + x.popM, 0)) * 100;
  const regionPeers = COUNTRIES.filter((x) => x.region === c.region && x.code !== c.code)
    .sort((a, b) => b.popM - a.popM).slice(0, 5);

  const statCards = [
    ["Population", fmtPop(c.popM * 1e6), `#${rankOf(c, metricById("popM"))} of ${COUNTRIES.length}`],
    ["GDP", fmtMoney(c.gdpBn * 1e9), `#${rankOf(c, metricById("gdpBn"))} of ${COUNTRIES.length}`],
    ["GDP per capita", fmtMoney0(c.gdpPc), `#${rankOf(c, metricById("gdpPc"))} of ${COUNTRIES.length}`],
    ["Life expectancy", c.lifeExp.toFixed(1) + " yrs", `#${rankOf(c, metricById("lifeExp"))} of ${COUNTRIES.length}`],
    ["Median age", c.medianAge.toFixed(1) + " yrs", ""],
    ["Urban population", c.urbanPct + "%", ""],
    ["Land area", fmtArea(c.areaKm2), `#${rankOf(c, metricById("areaKm2"))} of ${COUNTRIES.length}`],
    ["Density", fmtDensity(density) + " / km²", `#${rankOf(c, metricById("density"))} of ${COUNTRIES.length}`],
    ["Unemployment", c.unempPct.toFixed(1) + "%", ""],
    ["Adult literacy", c.literacy + "%", ""],
    ["Internet users", c.internet + "%", ""],
    ["CO₂ per capita", c.co2Pc.toFixed(1) + " t", ""]
  ].map(([label, value, sub]) => `<div class="stat"><span>${label}</span><strong>${value}</strong>${sub ? `<span class="muted">${sub}</span>` : ""}</div>`).join("");

  return `
    <section class="page-head country-head">
      <div>
        <h1>${esc(c.name)} ${starBtn(c.code)}</h1>
        <p>${esc(c.capital)} · ${esc(c.region)} · ${worldPopShare.toFixed(1)}% of the population covered by this atlas</p>
      </div>
      <button class="btn" data-action="compare" data-code="${c.code}">${prefs.compare.includes(c.code) ? "✓ In compare tray" : "Add to compare"}</button>
    </section>
    <div class="stat-grid">${statCards}</div>
    <div class="grid-2">
      <div class="panel">
        <h2>Population since 1990</h2>
        ${lineChart(HIST_YEARS, c.popHist, { title: `Population history of ${c.name}` })}
        <p class="muted">${histNote}</p>
      </div>
      <div class="panel">
        <h2>${esc(c.name)} vs the average country</h2>
        ${vsAverageBars(c, ["gdpPc", "lifeExp", "internet", "urbanPct"])}
        <p class="muted">Teal is ${esc(c.name)}; grey is the simple average across the ${COUNTRIES.length} countries in this atlas.</p>
      </div>
    </div>
    <div class="panel">
      <h2>More in ${esc(c.region)}</h2>
      <p class="peer-links">${regionPeers.map((p) => `<a class="btn ghost" href="#/country/${p.code}">${esc(p.name)} · ${fmtPop(p.popM * 1e6)}</a>`).join(" ")}</p>
    </div>`;
}
