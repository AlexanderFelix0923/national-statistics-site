"use strict";
/* Hand-rolled SVG charts for Atlas in Numbers: horizontal bars and a
   population history line. No libraries, no network. */

function hbarChart(rows, opts) {
  /* rows: [{label, value, display, highlight}] — drawn proportional to max. */
  const w = 640, rowH = 30, gap = 8, labelW = 118, valW = 86;
  const max = Math.max(...rows.map((r) => r.value), 0.0001);
  const h = rows.length * (rowH + gap) + 6;
  let y = 4;
  let out = `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${esc(opts.title || "Bar chart")}">`;
  for (const r of rows) {
    const bw = Math.max(2, ((w - labelW - valW) * r.value) / max);
    out += `<text x="0" y="${y + rowH / 2 + 4}" class="chart-label">${esc(r.label)}</text>`;
    out += `<rect x="${labelW}" y="${y + 4}" width="${bw.toFixed(1)}" height="${rowH - 8}" rx="4" class="${r.highlight ? "bar bar-hi" : "bar"}"></rect>`;
    out += `<text x="${labelW + bw + 8}" y="${y + rowH / 2 + 4}" class="chart-value">${esc(r.display)}</text>`;
    y += rowH + gap;
  }
  return out + "</svg>";
}

function lineChart(years, values, opts) {
  /* Population history: values in millions. */
  const w = 640, h = 210, padL = 52, padR = 14, padT = 14, padB = 28;
  const min = Math.min(...values), max = Math.max(...values);
  const lo = Math.floor(min * 0.92), hi = Math.ceil(max * 1.03);
  const X = (i) => padL + (i * (w - padL - padR)) / (years.length - 1);
  const Y = (v) => padT + ((hi - v) * (h - padT - padB)) / (hi - lo || 1);
  let out = `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${esc(opts.title || "Line chart")}">`;
  for (let g = 0; g <= 3; g++) {
    const v = lo + ((hi - lo) * g) / 3, yy = Y(v);
    out += `<line x1="${padL}" y1="${yy}" x2="${w - padR}" y2="${yy}" class="grid"></line>`;
    out += `<text x="${padL - 6}" y="${yy + 4}" class="chart-axis" text-anchor="end">${fmtInt(v)}</text>`;
  }
  const pts = values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  out += `<polyline points="${pts}" class="line"></polyline>`;
  values.forEach((v, i) => {
    const anchor = i === 0 ? "start" : i === values.length - 1 ? "end" : "middle";
    out += `<circle cx="${X(i)}" cy="${Y(v)}" r="4" class="dot"></circle>`;
    out += `<text x="${X(i)}" y="${Y(v) - 10}" class="chart-value" text-anchor="${anchor}">${fmtInt(v)}M</text>`;
    out += `<text x="${X(i)}" y="${h - 8}" class="chart-axis" text-anchor="middle">${years[i]}</text>`;
  });
  return out + "</svg>";
}

/* Small paired bars: this country vs the average of all listed countries. */
function vsAverageBars(country, metricIds) {
  let out = '<div class="vs-list">';
  for (const id of metricIds) {
    const m = metricById(id);
    const mine = m.get(country), avg = worldAverage(m);
    const max = Math.max(mine, avg) * 1.08;
    out += `<div class="vs-row">
      <span class="vs-label">${esc(m.label)}</span>
      <div class="vs-bars">
        <div class="vs-bar mine" style="width:${((mine / max) * 100).toFixed(1)}%"></div>
        <div class="vs-bar avg" style="width:${((avg / max) * 100).toFixed(1)}%"></div>
      </div>
      <span class="vs-values">${esc(fmtMetric(m, country))} <span class="muted">vs avg ${esc(FORMATTERS[m.fmt](avg))}</span></span>
    </div>`;
  }
  return out + "</div>";
}
