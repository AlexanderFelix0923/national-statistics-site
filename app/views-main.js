"use strict";
/* Atlas in Numbers — overview, rankings and compare views. */

function starBtn(code) {
  const on = isFavourite(code);
  return `<button class="star ${on ? "on" : ""}" data-action="fav" data-code="${code}" title="${on ? "Remove from favourites" : "Add to favourites"}" aria-label="Toggle favourite">${on ? "★" : "☆"}</button>`;
}

function viewOverview() {
  const t = worldTotals();
  const popMetric = metricById("popM");
  const top8 = topBy(popMetric, 8);
  const featured = featuredCountry(new Date().toISOString().slice(0, 10));
  const densest = topBy(metricById("density"), 1)[0];
  const longestLived = topBy(metricById("lifeExp"), 1)[0];
  const richest = topBy(metricById("gdpPc"), 1)[0];
  const regions = regionRollup();

  const cards = `
    <div class="cards">
      <div class="card"><span class="card-label">People covered</span><strong>${fmtPop(t.pop)}</strong><span class="card-sub">across ${t.count} countries</span></div>
      <div class="card"><span class="card-label">Combined GDP</span><strong>${fmtMoney(t.gdp)}</strong><span class="card-sub">current USD, ~2024</span></div>
      <div class="card"><span class="card-label">Avg life expectancy</span><strong>${t.lifeAvg.toFixed(1)} yrs</strong><span class="card-sub">population-weighted</span></div>
      <div class="card"><span class="card-label">Your favourites</span><strong>${prefs.favourites.length}</strong><span class="card-sub">${prefs.favourites.length ? esc(prefs.favourites.map((c) => byCode(c).name).join(", ")) : "star a country to pin it here"}</span></div>
    </div>`;

  const extremes = `
    <div class="panel">
      <h2>Extremes in the data</h2>
      <ul class="facts">
        <li><strong>Most crowded:</strong> ${esc(densest.name)} packs ${fmtDensity(metricById("density").get(densest))} people into each km².</li>
        <li><strong>Longest lives:</strong> ${esc(longestLived.name)}, ${longestLived.lifeExp.toFixed(1)} years on average.</li>
        <li><strong>Richest per person:</strong> ${esc(richest.name)} at ${fmtMoney0(richest.gdpPc)} GDP per capita.</li>
        <li><strong>Youngest country:</strong> ${esc(topBy(metricById("medianAge"), 99).slice(-1)[0].name)} — half its people are under ${topBy(metricById("medianAge"), 99).slice(-1)[0].medianAge}.</li>
      </ul>
    </div>`;

  const featuredPanel = `
    <div class="panel featured">
      <h2>Country of the day: ${esc(featured.name)}</h2>
      <p class="muted">${esc(featured.capital)} · ${esc(featured.region)} · #${rankOf(featured, popMetric)} by population</p>
      <div class="mini-stats">
        <span>Population <strong>${fmtPop(featured.popM * 1e6)}</strong></span>
        <span>GDP <strong>${fmtMoney(featured.gdpBn * 1e9)}</strong></span>
        <span>Life expectancy <strong>${featured.lifeExp.toFixed(1)} yrs</strong></span>
        <span>Internet <strong>${featured.internet}%</strong></span>
      </div>
      <p><a class="btn" href="#/country/${featured.code}">Open ${esc(featured.name)}'s page</a>
      <button class="btn ghost" data-action="compare" data-code="${featured.code}">${prefs.compare.includes(featured.code) ? "In compare tray" : "Add to compare"}</button></p>
    </div>`;

  const regionRows = regions.map((r) => `<tr>
      <td>${esc(r.region)}</td><td>${r.count}</td><td>${fmtPop(r.pop)}</td><td>${fmtMoney(r.gdp)}</td><td><a href="#/country/${r.largest.code}">${esc(r.largest.name)}</a></td>
    </tr>`).join("");

  return `
    <section class="hero">
      <h1>The world, measured.</h1>
      <p>Population, wealth, health and connectivity for ${t.count} countries — every figure on one screen, every chart drawn from the same dataset. Start with the giants, then go exploring.</p>
    </section>
    ${cards}
    <div class="grid-2">
      <div class="panel">
        <h2>The population giants</h2>
        ${hbarChart(top8.map((c) => ({ label: c.name, value: c.popM, display: fmtPop(c.popM * 1e6) })), { title: "Top 8 countries by population" })}
        <p class="muted">India passed China in 2023 and keeps growing; China and Japan are now shrinking slowly.</p>
      </div>
      <div>${extremes}${featuredPanel}</div>
    </div>
    <div class="panel">
      <h2>Regions at a glance</h2>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Region</th><th>Countries</th><th>Population</th><th>Combined GDP</th><th>Largest country</th></tr></thead>
        <tbody>${regionRows}</tbody>
      </table></div>
    </div>
    <div class="panel about">
      <h2>About these numbers</h2>
      <p>Figures are rounded public statistics for ~2024, of the kind published by the World Bank, the UN Population Division and the IMF — population to the nearest 0.1M, GDP to the nearest billion. Treat them as orientation, not as an official statistical release; national statistical offices remain the source of record. Everything on this site is computed locally from the bundled dataset: no network, no tracking.</p>
    </div>`;
}

function viewRankings(metricId) {
  const m = metricById(metricId || "popM");
  const top10 = topBy(m, 10);
  const tabs = METRICS.map((x) => `<button class="chip ${x.id === m.id ? "active" : ""}" data-action="rank-tab" data-metric="${x.id}">${esc(x.label)}</button>`).join("");
  const favs = prefs.favourites.length ? `<p class="muted">Your favourites: ${prefs.favourites.map((code) => { const c = byCode(code); return `${esc(c.name)} is #${rankOf(c, m)}`; }).join(" · ")}</p>` : "";
  return `
    <section class="page-head"><h1>Rankings</h1><p>Top 10 of ${COUNTRIES.length} countries by ${esc(m.label.toLowerCase())}${m.lowIsGood ? " (lowest first — for this measure, less is better)" : ""}.</p></section>
    <div class="chips">${tabs}</div>
    <div class="panel">
      ${hbarChart(top10.map((c, i) => ({ label: `${i + 1}. ${c.name}`, value: m.get(c), display: fmtMetric(m, c), highlight: isFavourite(c.code) })), { title: `Top 10 by ${m.label}` })}
      ${favs}
      <p class="muted">Open the full table on the <a href="#/explore">Explore</a> page to sort by any measure.</p>
    </div>`;
}

function viewCompare() {
  const chosen = prefs.compare.map(byCode).filter(Boolean);
  const options = (selected) => COUNTRIES.map((c) => `<option value="${c.code}" ${c.code === selected ? "selected" : ""}>${esc(c.name)}</option>`).join("");
  const pickers = [0, 1, 2].map((i) => `
    <label class="picker">Country ${i + 1}
      <select data-compare-slot="${i}">
        <option value="">— none —</option>
        ${options(chosen[i] ? chosen[i].code : "")}
      </select>
    </label>`).join("");

  let body;
  if (chosen.length < 2) {
    body = `<p class="empty">Pick at least two countries above to see them side by side. Your picks are remembered on this device.</p>`;
  } else {
    const head = chosen.map((c) => `<th><a href="#/country/${c.code}">${esc(c.name)}</a><br><span class="muted">${esc(c.capital)}</span></th>`).join("");
    const rows = METRICS.map((m) => {
      const vals = chosen.map((c) => m.get(c));
      const best = m.lowIsGood ? Math.min(...vals) : Math.max(...vals);
      const cells = chosen.map((c, i) => `<td class="${vals[i] === best ? "best" : ""}">${esc(fmtMetric(m, c))}</td>`).join("");
      return `<tr><td class="row-label">${esc(m.label)}</td>${cells}</tr>`;
    }).join("");
    const popRows = chosen.map((c) => ({ label: c.name, value: c.popM, display: fmtPop(c.popM * 1e6), highlight: true }));
    body = `
      <div class="table-wrap"><table class="data-table compare-table">
        <thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody>
      </table></div>
      <h3>Population, head to head</h3>
      ${hbarChart(popRows, { title: "Population comparison" })}
      <p class="muted">Bold cells mark the leader in each row — for unemployment and CO₂ per capita, the leader is the lowest value.</p>`;
  }
  return `
    <section class="page-head"><h1>Compare countries</h1><p>Three at a time, twelve measures, no cherry-picking.</p></section>
    <div class="panel"><div class="pickers">${pickers}</div>${body}</div>`;
}
