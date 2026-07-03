(function () {
  const { fields, events } = window.FRONTIER_DATA;

  /* ---------- theme handling ---------- */
  // NOTE: intentionally NOT named `chart` — the canvas below has id="chart",
  // and browsers auto-expose elements with an id as window.<id>, which would
  // shadow/collide with a chart variable of the same name.
  let chartInstance = null;
  const themeBtn = document.getElementById("theme-toggle");
  let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (localStorage.getItem("theme")) {
    isDark = localStorage.getItem("theme") === "dark";
  }

  function applyTheme() {
    if (isDark) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
    if (chartInstance) {
      chartInstance.options.scales.x.grid.color = cssGrid();
      chartInstance.options.scales.y.grid.color = cssGrid();
      chartInstance.options.scales.x.ticks.color = cssInk3();
      chartInstance.options.scales.y.ticks.color = cssInk3();
      chartInstance.update();
    }
  }
  applyTheme();

  themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme();
  });

  /* ---------- date helpers ---------- */
  const parseDate = (s) => {
    const [y, q] = s.split("-Q");
    return parseInt(y, 10) + (parseInt(q, 10) - 1) * 0.25;
  };
  const fmtQ = (v) => {
    const y = Math.floor(v + 1e-6);
    const qn = Math.round((v - y) * 4) + 1;
    return y + " Q" + qn;
  };
  const NEW_WINDOW_DAYS = 10;
  const isNew = (e) => {
    if (!e.added) return false;
    const days = (Date.now() - new Date(e.added).getTime()) / 86400000;
    return days >= 0 && days <= NEW_WINDOW_DAYS;
  };
  const slug = (e) => e.field + "-" + e.date;

  /* ---------- build indexed event list with deltas ---------- */
  const all = events
    .map((e, i) => ({ ...e, x: parseDate(e.date), links: e.links || [], _i: i }))
    .sort((a, b) => a.x - b.x || a.field.localeCompare(b.field));

  const lastScore = {};
  for (const e of all) {
    e.delta = lastScore[e.field] == null ? null : e.score - lastScore[e.field];
    lastScore[e.field] = e.score;
  }

  const eventsByField = {};
  for (const key of Object.keys(fields)) eventsByField[key] = [];
  for (const e of all) {
    eventsByField[e.field].push({
      x: e.x, y: e.score, date: e.date, title: e.title,
      desc: e.desc, links: e.links, delta: e.delta, slug: slug(e), added: e.added, score: e.score
    });
  }

  const bySlug = {};
  for (const e of all) bySlug[slug(e)] = e;

  /* ---------- css var readers ---------- */
  const cssVar = (name, fallback) => getComputedStyle(document.body).getPropertyValue(name).trim() || fallback;
  const cssPaper = () => cssVar("--paper", "#F7F5F0");
  const cssInk3 = () => cssVar("--ink-3", "#898781");
  const cssGrid = () => cssVar("--grid", "#E4E1D8");

  const activeFields = new Set(Object.keys(fields));

  function buildDatasets() {
    return Object.keys(fields)
      .filter((k) => activeFields.has(k))
      .map((k) => {
        const f = fields[k];
        return {
          label: f.label,
          data: eventsByField[k],
          borderColor: f.color,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return f.color + "33"; 
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, f.color + '40'); // 25% opacity
            gradient.addColorStop(1, f.color + '00'); // Transparent
            return gradient;
          },
          fill: true, // Smooth gradients below the line
          pointBackgroundColor: f.color,
          pointBorderColor: cssPaper(),
          pointBorderWidth: 1.5,
          pointRadius: 5,
          pointHoverRadius: 9,
          borderWidth: 2.5,
          tension: 0.35, // Smoother curve
          fieldKey: k
        };
      });
  }

  /* ---------- selection state ---------- */
  let pinned = false;
  let selectedSlug = null;

  chartInstance = new Chart(document.getElementById("chart"), {
    type: "line",
    data: { datasets: buildDatasets() },
    options: {
      responsive: true, maintainAspectRatio: false, parsing: false,
      interaction: { mode: "nearest", intersect: false, axis: "xy" },
      layout: { padding: { top: 12, right: 12, bottom: 4, left: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(20,20,16,0.9)",
          titleFont: { family: "IBM Plex Mono, monospace", size: 11, weight: "500" },
          bodyFont: { family: "Inter, sans-serif", size: 13 },
          titleColor: "#F0EDE3", bodyColor: "#A8A69B",
          displayColors: false, padding: 12, cornerRadius: 6,
          callbacks: {
            title: (items) => {
              const r = items[0].raw;
              const d = r.delta == null ? "" : "  ·  " + (r.delta >= 0 ? "+" : "") + r.delta;
              return fmtQ(r.x) + "  ·  signal " + r.y + d;
            },
            label: (item) => item.raw.title
          }
        },
        zoom: {
          zoom: { drag: { enabled: true, backgroundColor: "rgba(42,120,214,0.1)", borderColor: "rgba(42,120,214,0.5)", borderWidth: 1 }, mode: "x" },
          pan: { enabled: true, mode: "x" }
        }
      },
      scales: {
        x: {
          type: "linear", min: 2018.75, max: 2026.75,
          grid: { color: cssGrid(), drawTicks: false }, border: { display: false },
          ticks: { stepSize: 1, color: cssInk3(), font: { family: "IBM Plex Mono, monospace", size: 11 }, callback: (v) => (Number.isInteger(v) ? String(v) : "") }
        },
        y: {
          min: 0, max: 100,
          grid: { color: cssGrid(), drawTicks: false }, border: { display: false },
          ticks: { color: cssInk3(), font: { family: "IBM Plex Mono, monospace", size: 11 }, stepSize: 25, callback: (v) => String(v).padStart(3, " ") }
        }
      },
      onHover: (evt, elements, chartRef) => {
        if (pinned) return;
        if (elements.length > 0) {
          const el = elements[0];
          const ds = chartRef.data.datasets[el.datasetIndex];
          updatePanel(ds.fieldKey, ds.data[el.index]);
        }
      },
      onClick: (evt, elements, chartRef) => {
        if (elements.length > 0) {
          const el = elements[0];
          const ds = chartRef.data.datasets[el.datasetIndex];
          selectSignal(ds.data[el.index].slug, { scrollFeed: true });
        } else { pinned = false; }
      }
    }
  });

  /* ---------- event panel ---------- */
  const panel = document.getElementById("event-panel");
  const epField = document.getElementById("ep-field");
  const epDate = document.getElementById("ep-date");
  const epScore = document.getElementById("ep-score");
  const epTitle = document.getElementById("ep-title");
  const epDesc = document.getElementById("ep-desc");
  const epLinks = document.getElementById("ep-links");
  const LINK_ICONS = { video: "▶", paper: "¶", post: "✎", code: "⌘" };

  function updatePanel(fieldKey, point) {
    const f = fields[fieldKey];
    panel.style.borderLeftColor = f.color;
    epField.textContent = f.label;
    epField.style.color = f.text;
    const d = point.delta == null ? "" : " (" + (point.delta >= 0 ? "+" : "") + point.delta + ")";
    epDate.textContent = fmtQ(point.x);
    epScore.innerHTML = `<span class="v">${point.y}</span>${d}`;
    epTitle.textContent = point.title;
    epDesc.textContent = point.desc;
    epLinks.innerHTML = point.links
      .map((l) => {
        const icon = l.type && LINK_ICONS[l.type] ? LINK_ICONS[l.type] + " " : "";
        return `<a href="${l.url}" target="_blank" rel="noopener">${icon}${l.label} ↗</a>`;
      }).join("");
  }

  /* ---------- central selection ---------- */
  function selectSignal(sl, opts = {}) {
    const e = bySlug[sl];
    if (!e) return;
    selectedSlug = sl;
    pinned = true;
    updatePanel(e.field, eventsByField[e.field].find((p) => p.slug === sl));

    if (history.replaceState) history.replaceState(null, "", "#" + sl);

    const dsIndex = chartInstance.data.datasets.findIndex((d) => d.fieldKey === e.field);
    if (dsIndex >= 0) {
      const ptIndex = chartInstance.data.datasets[dsIndex].data.findIndex((p) => p.slug === sl);
      if (ptIndex >= 0) {
        chartInstance.setActiveElements([{ datasetIndex: dsIndex, index: ptIndex }]);
        chartInstance.tooltip.setActiveElements([{ datasetIndex: dsIndex, index: ptIndex }], { x: 0, y: 0 });
        chartInstance.update();
      }
    }

    document.querySelectorAll(".feed-row").forEach((r) => {
      const sel = r.dataset.slug === sl;
      r.classList.toggle("selected", sel);
      if (sel && opts.scrollFeed) r.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    if (opts.scrollPanel) panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  /* ---------- copy link ---------- */
  const copyBtn = document.getElementById("copy-link");
  function copyLink() {
    if (!selectedSlug) return;
    const url = location.origin + location.pathname + "#" + selectedSlug;
    navigator.clipboard.writeText(url).then(() => {
      const prev = copyBtn.textContent;
      copyBtn.textContent = "copied ✓";
      setTimeout(() => (copyBtn.textContent = prev), 1400);
    });
  }
  copyBtn.addEventListener("click", copyLink);
  copyBtn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") copyLink(); });

  /* ---------- keyboard nav ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const sortMode = document.getElementById("feed-sort").value;
    const visible = all.filter((ev) => activeFields.has(ev.field));
    if (!visible.length) return;
    
    // Default keyboard nav is chronological regardless of sort dropdown, 
    // to keep arrow keys matched to the chart's X-axis
    let idx = visible.findIndex((ev) => slug(ev) === selectedSlug);
    if (idx === -1) idx = visible.length - 1;
    else idx += e.key === "ArrowRight" ? 1 : -1;
    idx = Math.max(0, Math.min(visible.length - 1, idx));
    selectSignal(slug(visible[idx]), { scrollFeed: true });
    e.preventDefault();
  });

  /* ---------- filter chips ---------- */
  const filtersEl = document.getElementById("filters");
  const allChip = document.createElement("button");
  allChip.className = "chip active";
  allChip.textContent = "All fields";
  allChip.dataset.field = "__all";
  filtersEl.appendChild(allChip);

  for (const key of Object.keys(fields)) {
    const f = fields[key];
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.dataset.field = key;
    chip.innerHTML = `<span class="dot" style="background:${f.color}"></span>${f.label}`;
    filtersEl.appendChild(chip);
  }

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const key = btn.dataset.field;

    if (key === "__all") {
      activeFields.clear();
      Object.keys(fields).forEach((k) => activeFields.add(k));
    } else {
      const allActive = activeFields.size === Object.keys(fields).length;
      if (allActive) {
        activeFields.clear();
        activeFields.add(key);
      } else {
        if (activeFields.has(key)) activeFields.delete(key);
        else activeFields.add(key);
        if (activeFields.size === 0) Object.keys(fields).forEach((k) => activeFields.add(k));
      }
    }

    filtersEl.querySelectorAll(".chip").forEach((c) => {
      const k = c.dataset.field;
      if (k === "__all") c.classList.toggle("active", activeFields.size === Object.keys(fields).length);
      else c.classList.toggle("active", activeFields.has(k));
    });

    chartInstance.data.datasets = buildDatasets();
    chartInstance.update();
    renderFeed();
  });

  /* ---------- range buttons ---------- */
  const rangeReadout = document.getElementById("range-readout");
  function updateRangeReadout() {
    const xs = chartInstance.options.scales.x;
    rangeReadout.textContent = Math.floor(xs.min) + " → " + Math.ceil(xs.max);
  }

  document.querySelectorAll(".range-btn[data-range]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".range-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const r = btn.dataset.range;
      const xs = chartInstance.options.scales.x;
      if (r === "1y") { xs.min = 2025.5; xs.max = 2026.75; }
      else if (r === "3y") { xs.min = 2023.5; xs.max = 2026.75; }
      else { xs.min = 2018.75; xs.max = 2026.75; }
      chartInstance.update();
      updateRangeReadout();
    });
  });

  document.getElementById("reset-zoom").addEventListener("click", () => {
    chartInstance.resetZoom();
    const xs = chartInstance.options.scales.x;
    xs.min = 2018.75;
    xs.max = 2026.75;
    document.querySelectorAll(".range-btn").forEach((b) => b.classList.remove("active"));
    document.querySelector('.range-btn[data-range="all"]').classList.add("active");
    chartInstance.update();
    updateRangeReadout();
  });

  /* ---------- signal feed ---------- */
  const feedList = document.getElementById("feed-list");
  const feedCount = document.getElementById("feed-count");
  const feedNew = document.getElementById("feed-new");
  const feedSearch = document.getElementById("feed-search");
  const feedSort = document.getElementById("feed-sort");
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function renderFeedNew() {
    const newCount = all.filter((e) => activeFields.has(e.field) && isNew(e)).length;
    feedNew.innerHTML = newCount
      ? `<span class="dot-pulse"></span> ${newCount} new signal${newCount === 1 ? "" : "s"} this week`
      : "no new signals in the last " + NEW_WINDOW_DAYS + " days";
  }

  function renderFeed() {
    const q = feedSearch.value.trim().toLowerCase();
    const sortMode = feedSort.value;

    const rows = all
      .filter((e) => activeFields.has(e.field))
      .filter((e) => !q || (e.title + " " + e.desc + " " + fields[e.field].label).toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortMode === "newest") return b.x - a.x;
        if (sortMode === "oldest") return a.x - b.x;
        if (sortMode === "highest") return b.score - a.score;
      });

    feedCount.textContent = rows.length + " signal" + (rows.length === 1 ? "" : "s");
    renderFeedNew();

    if (!rows.length) {
      feedList.innerHTML = `<div class="feed-empty">no signals match “${esc(feedSearch.value.trim())}” — <span class="btn-quiet" id="feed-clear" role="button" tabindex="0">clear search</span></div>`;
      const clearBtn = document.getElementById("feed-clear");
      const clear = () => { feedSearch.value = ""; renderFeed(); feedSearch.focus(); };
      clearBtn.addEventListener("click", clear);
      return;
    }

    let html = "";
    let year = null;
    for (const e of rows) {
      const y = Math.floor(e.x);
      // Only show year headers if sorting chronologically
      if (y !== year && (sortMode === "newest" || sortMode === "oldest")) { 
        year = y; 
        html += `<div class="feed-year">${y}</div>`; 
      }
      
      const f = fields[e.field];
      const nw = isNew(e) ? `<span class="new-chip">new</span>` : "";
      html += `
        <div class="feed-row${slug(e) === selectedSlug ? " selected" : ""}" data-slug="${slug(e)}" tabindex="0" role="button" aria-label="${esc(e.title)}">
          <span class="fr-date">${fmtQ(e.x)}</span>
          <span class="fr-field" style="color:${f.text}"><span class="dot" style="background:${f.color}"></span>${f.short}</span>
          <span class="fr-title">${esc(e.title)}${nw}</span>
        </div>`;
    }
    feedList.innerHTML = html;
  }

  feedList.addEventListener("click", (e) => {
    const row = e.target.closest(".feed-row");
    if (row) selectSignal(row.dataset.slug, { scrollPanel: true });
  });
  feedList.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target.closest(".feed-row");
    if (row) { selectSignal(row.dataset.slug, { scrollPanel: true }); e.preventDefault(); }
  });
  feedSearch.addEventListener("input", renderFeed);
  feedSort.addEventListener("change", renderFeed);

  /* ---------- init ---------- */
  document.getElementById("signal-count").textContent = String(events.length).padStart(3, "0");
  renderFeed();

  const hashSlug = location.hash.replace(/^#/, "");
  if (hashSlug && bySlug[hashSlug]) {
    selectSignal(hashSlug, { scrollFeed: true });
  } else {
    const latest = all[all.length - 1];
    updatePanel(latest.field, eventsByField[latest.field].find((p) => p.slug === slug(latest)));
    selectedSlug = slug(latest);
    pinned = false;
  }
})();
