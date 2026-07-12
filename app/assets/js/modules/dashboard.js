/* =====================================================================
   Adil Business Solutions — Dashboard
   Sales windows, weekly summary, account balances, recent transactions,
   and two monthly trend charts.
   ===================================================================== */

Router.register("home", async (mount) => {
  const cfg = window.ABS_CONFIG;

  mount.innerHTML = `
    <div class="page-head"><h1>Dashboard</h1><div class="page-actions"><button class="btn btn--primary" id="dash-scan">▣ Scan Item</button></div></div>

    <div class="kpi-grid" id="sales-kpis">
      ${salesCard("today", "Today's Sales")}
      ${salesCard("this_week", "This Week Sales")}
      ${salesCard("last_week", "Last Week Sales")}
    </div>

    <div class="kpi-grid">
      ${kpiLink("Items", "0", "box", "items")}
      ${kpiLink("Customers", "0", "users", "customers")}
      ${kpiLink("Low Stock Alerts", "0", "alert", "inventory-alert")}
    </div>

    <div class="card no-pad" id="weekly-summary"></div>

    <div class="dash-two">
      <div class="card no-pad" id="acct-balances"></div>
      <div class="card no-pad" id="recent-tx"></div>
    </div>

    <div class="dash-two" id="dash-charts"></div>

    <div class="card">
      <div id="conn-status" class="conn-status"><span class="dot dot--wait"></span> Checking connection…</div>
    </div>`;

  // clickable KPI cards
  mount.querySelectorAll(".kpi[data-route]").forEach(c => c.onclick = () => Router.go(c.dataset.route));
  { const sb = mount.querySelector("#dash-scan"); if (sb) sb.onclick = () => (window.Scan ? Scan.itemMenu() : UI.toast("Scanner loading…")); }

  const status = mount.querySelector("#conn-status");
  if (!API.configured()) { status.innerHTML = `<span class="dot dot--bad"></span> Backend not configured`; return; }

  const ranges = {};
  try {
    await API.ping();
    status.innerHTML = `<span class="dot dot--ok"></span> Connected`;

    const d = await API.dashboard();
    ranges.today = d.ranges.today; ranges.this_week = d.ranges.this_week; ranges.last_week = d.ranges.last_week;
    setSales(mount, "today", d.today_sales, ranges.today);
    setSales(mount, "this_week", d.this_week_sales, ranges.this_week);
    setSales(mount, "last_week", d.last_week_sales, ranges.last_week);
    setKpiByLabel(mount, "Items", String(d.items_count || 0));
    setKpiByLabel(mount, "Customers", String(d.customers_count || 0));
    setKpiByLabel(mount, "Low Stock Alerts", String(d.low_stock_count || 0));

    mount.querySelectorAll(".sales-edit").forEach(btn => btn.onclick = () => {
      const key = btn.dataset.key;
      openRangeEditor(ranges[key], async (from, to) => {
        mount.querySelector(`.kpi[data-key="${key}"] .kpi-value`).textContent = "…";
        try { const r = await API.salesSummary(from, to); ranges[key] = { from, to }; setSales(mount, key, r.total, ranges[key]); }
        catch (e) { UI.toast(e.message, "error"); setSales(mount, key, 0, ranges[key]); }
      });
    });

    // weekly summary
    try {
      const w = await API.weeklySummary();
      const money = { "Customer Payments": 1, "Supplier Payments": 1 };
      mount.querySelector("#weekly-summary").innerHTML = `
        <div class="card-head" style="padding:14px 16px 0;"><h2>Weekly Transactions Summary</h2></div>
        <div class="table-wrap"><table class="data-table summary-table">
          <thead><tr><th>Title</th>${w.days.map((dd, i) => `<th class="num${i === w.days.length - 1 ? ' col-today' : ''}">${UI.escape(dd)}</th>`).join("")}</tr></thead>
          <tbody>${w.rows.map(r => `<tr><td><strong>${UI.escape(r.title)}</strong></td>${r.values.map((v, i) => `<td class="num${i === w.days.length - 1 ? ' col-today' : ''}">${money[r.title] || Number(v) ? UI.money(v) : 0}</td>`).join("")}</tr>`).join("")}</tbody>
        </table></div>`;
    } catch (e) { mount.querySelector("#weekly-summary").innerHTML = `<div class="empty"><p>Weekly summary unavailable.</p></div>`; }

    // account balances + recent transactions + charts
    try {
      const x = await API.dashboardExtra();

      mount.querySelector("#acct-balances").innerHTML = `
        <div class="card-head" style="padding:14px 16px 0;"><h2>Account Balances</h2></div>
        ${x.accounts.length
          ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Account</th><th>Type</th><th class="num">Balance</th></tr></thead>
            <tbody>${x.accounts.map(a => `<tr class="acct-bal-row" data-id="${UI.escape(a.id)}" data-name="${UI.escape(a.name)}" style="cursor:pointer">
              <td style="color:var(--accent)">${UI.escape(a.name)}</td>
              <td>${UI.escape(a.type)}</td>
              <td class="num" style="${a.balance < 0 ? 'color:var(--bad)' : ''}">${UI.money(a.balance)}</td>
            </tr>`).join("")}</tbody></table></div>
            <div id="acct-drill-panel" style="padding:0 16px 12px"></div>`
          : `<div class="empty"><p>No account activity yet.</p></div>`}`;

      // wire clickable account rows → account statement drill-down
      mount.querySelector("#acct-balances").querySelectorAll(".acct-bal-row").forEach(row => {
        row.onclick = async () => {
          const panel = mount.querySelector("#acct-drill-panel");
          if (!panel) return;
          panel.innerHTML = `<div class="empty" style="padding:12px 0"><p>Loading ${UI.escape(row.dataset.name)} transactions…</p></div>`;
          try {
            const today = new Date().toISOString().slice(0, 10);
            const firstOfMonth = today.slice(0, 7) + "-01";
            const d = await API.call("accountDrilldown", { account_id: row.dataset.id, from: firstOfMonth, to: today });
            panel.innerHTML = `<div style="margin-top:10px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <strong>${UI.escape(d.account)}</strong>
                <a class="link-btn" style="font-size:12px;padding:0" onclick="Router.go('report-account-statement')">Full Statement →</a>
              </div>
              <table class="data-table" style="font-size:12.5px">
                <thead><tr><th>Date</th><th>Memo</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
                <tbody>
                  <tr class="rpt-subtotal"><td colspan="4">Opening Balance</td><td class="num">${UI.money(d.opening)}</td></tr>
                  ${d.lines.map(r => `<tr>
                    <td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.memo)}</td>
                    <td class="num">${r.debit ? UI.money(r.debit) : ''}</td>
                    <td class="num">${r.credit ? UI.money(r.credit) : ''}</td>
                    <td class="num"><strong>${UI.money(r.balance)}</strong></td>
                  </tr>`).join("")}
                  ${!d.lines.length ? `<tr><td colspan="5" style="text-align:center;padding:10px;color:#94a3b8">No activity this month.</td></tr>` : ''}
                  <tr class="rpt-grand"><td colspan="4"><strong>Closing Balance</strong></td><td class="num"><strong>${UI.money(d.closing)}</strong></td></tr>
                </tbody>
              </table>
            </div>`;
          } catch(e) { if (panel) panel.innerHTML = `<p style="color:var(--bad);padding:8px 0">${UI.escape(e.message)}</p>`; }
        };
      });

      const rt = mount.querySelector("#recent-tx");
      rt.innerHTML = `
        <div class="card-head" style="padding:14px 16px 0;"><h2>Recent Transactions</h2></div>
        ${x.recent.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Type</th><th>No.</th><th>Name</th><th class="num">Amount</th></tr></thead>
          <tbody>${x.recent.map(t => `<tr class="rt-row" data-doc="${UI.escape(t.doc || '')}" data-id="${UI.escape(t.id)}"${t.doc ? ' style="cursor:pointer"' : ''}>
            <td>${UI.escape(UI.date(t.date))}</td><td>${UI.escape(t.type)}</td><td>${UI.escape(t.number || '')}</td><td>${UI.escape(t.name || '')}</td><td class="num">${UI.money(t.amount)}</td>
          </tr>`).join("")}</tbody></table></div>`
          : `<div class="empty"><p>No transactions yet.</p></div>`}`;
      rt.querySelectorAll(".rt-row[data-doc]").forEach(r => { if (r.dataset.doc) r.onclick = () => Router.go((r.dataset.doc === "receipt" ? "sales-receipt-detail" : "invoice-detail") + "?id=" + r.dataset.id); });

      const c = x.charts;
      mount.querySelector("#dash-charts").innerHTML =
        dashChartCard("dash-chart-sales", "Sales vs Receivables Collection") +
        dashChartCard("dash-chart-profit", "Gross Profit vs Net Income");
      renderDashCharts(mount, c);
    } catch (e) { mount.querySelector("#dash-charts").innerHTML = `<div class="card"><div class="empty"><p>Charts unavailable: ${UI.escape(e.message)}</p></div></div>`; }

  } catch (e) {
    status.innerHTML = `<span class="dot dot--bad"></span> Not connected`;
  }
});

/* ---- helpers ---- */
function salesCard(key, label) {
  return `<div class="kpi kpi--sales" data-key="${key}">
    <div class="kpi-icon">${UI.icon("file-text")}</div>
    <div class="kpi-body"><div class="kpi-value">${UI.money(0)}</div><div class="kpi-label">${label}</div><div class="kpi-range"></div></div>
    <button class="btn sales-edit" data-key="${key}" title="Change date range">Edit</button>
  </div>`;
}
function setSales(mount, key, value, range) {
  const card = mount.querySelector(`.kpi[data-key="${key}"]`); if (!card) return;
  card.querySelector(".kpi-value").textContent = UI.money(value || 0);
  const rEl = card.querySelector(".kpi-range");
  if (rEl && range) rEl.textContent = range.from === range.to ? UI.date(range.from) : `${UI.date(range.from)} → ${UI.date(range.to)}`;
}
function kpiLink(label, value, icon, route) {
  return `<div class="kpi kpi--link" data-route="${route}">
    <div class="kpi-icon">${UI.icon(icon)}</div>
    <div class="kpi-body"><div class="kpi-value">${value}</div><div class="kpi-label">${label}</div></div>
    <span class="kpi-go">${UI.icon("chevron-right") || "›"}</span>
  </div>`;
}
function setKpiByLabel(mount, label, value) {
  mount.querySelectorAll(".kpi").forEach(k => { const l = k.querySelector(".kpi-label"); if (l && l.textContent === label) k.querySelector(".kpi-value").textContent = value; });
}
function openRangeEditor(range, onApply) {
  const modal = UI.el(`<div class="modal-overlay"><div class="modal">
    <div class="modal-head"><h2>Date range</h2><button class="icon-btn modal-close">✕</button></div>
    <div class="modal-body">
      <label class="field"><span class="field-label">From</span><input type="date" id="rg-from" value="${UI.escape((range && range.from) || '')}"></label>
      <label class="field"><span class="field-label">To</span><input type="date" id="rg-to" value="${UI.escape((range && range.to) || '')}"></label>
    </div>
    <div class="modal-foot"><button class="btn modal-close">Cancel</button><button class="btn btn--primary" id="rg-apply">Apply</button></div>
  </div></div>`);
  document.body.appendChild(modal);
  const close = () => modal.remove();
  modal.querySelectorAll(".modal-close").forEach(b => b.onclick = close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  modal.querySelector("#rg-apply").onclick = () => {
    const from = modal.querySelector("#rg-from").value, to = modal.querySelector("#rg-to").value;
    if (!from || !to) { UI.toast("Pick both dates.", "error"); return; }
    if (from > to) { UI.toast("From must be before To.", "error"); return; }
    close(); onApply(from, to);
  };
}
/* ---- v7.24: Chart.js line charts (lazy-loaded from CDN) ---- */
let _chartJsPromise = null;
function loadChartJs() {
  if (window.Chart) return Promise.resolve();
  if (_chartJsPromise) return _chartJsPromise;
  _chartJsPromise = new Promise((res, rej) => {
    const sc = document.createElement("script");
    sc.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    sc.onload = () => res();
    sc.onerror = () => { _chartJsPromise = null; rej(new Error("Could not load the chart library. Check your internet connection.")); };
    document.head.appendChild(sc);
  });
  return _chartJsPromise;
}

function dashChartCard(id, title) {
  return `<div class="card no-pad">
    <div class="card-head" style="padding:14px 16px 0;"><h2>${UI.escape(title)}</h2></div>
    <div class="dash-chartjs"><canvas id="${id}"></canvas></div>
  </div>`;
}

function dashLine(name, color, values) {
  return {
    label: name, data: values,
    borderColor: color, backgroundColor: color,
    borderWidth: 2.5, tension: 0.35,
    pointRadius: 2.5, pointHoverRadius: 5, fill: false
  };
}

async function renderDashCharts(mount, c) {
  try { await loadChartJs(); }
  catch (e) {
    const holder = mount.querySelector("#dash-charts");
    if (holder) holder.innerHTML = `<div class="card"><div class="empty"><p>Charts unavailable: ${UI.escape(e.message)}</p></div></div>`;
    return;
  }
  // Expenses = Gross Profit − Net Income (fallback when the backend
  // doesn't return the series directly)
  const expenses = (c.expenses && c.expenses.length)
    ? c.expenses
    : (c.gross_profit || []).map((g, i) => Number(g || 0) - Number((c.net_income || [])[i] || 0));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top", labels: { boxWidth: 12, boxHeight: 12, usePointStyle: false } },
      tooltip: {
        mode: "index", intersect: false,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${UI.money(ctx.parsed.y)}` }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => v >= 1000000 ? (v / 1000000) + "M" : v >= 1000 ? (v / 1000) + "K" : v } },
      x: { ticks: { maxTicksLimit: 10, maxRotation: 0 } }
    }
  };

  const el1 = mount.querySelector("#dash-chart-sales");
  const el2 = mount.querySelector("#dash-chart-profit");
  if (!el1 || !el2) return; // user navigated away while the library loaded
  // destroy any previous Chart instances before re-creating on the same canvases
  window.__dashCharts = window.__dashCharts || [];
  window.__dashCharts.forEach(ch => { try { ch.destroy(); } catch (e) {} });
  window.__dashCharts = [];
  [el1, el2].forEach(el => { const prev = Chart.getChart(el); if (prev) { try { prev.destroy(); } catch (e) {} } });
  window.__dashCharts.push(new Chart(el1, {
    type: "line",
    data: { labels: c.labels, datasets: [
      dashLine("Sales", "#16a34a", c.sales),
      dashLine("Payments", "#2563eb", c.collection)
    ]},
    options
  }));
  window.__dashCharts.push(new Chart(el2, {
    type: "line",
    data: { labels: c.labels, datasets: [
      dashLine("Gross Profit", "#2563eb", c.gross_profit),
      dashLine("Expenses", "#dc2626", expenses),
      dashLine("Net Income", "#16a34a", c.net_income)
    ]},
    options
  }));
}
