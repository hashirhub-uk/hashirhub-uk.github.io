/* =====================================================================
   Adil Business Solutions — Reports  v7.8
   All Reports directory, category pages, report screens for
   Company & Financial, Receivables, Payables, Accounts, and Inventory.
   ===================================================================== */

const REPORT_TREE = [
  { category: "Company & Financial", route: "reports-company-financial", reports: [
    { name: "Profit and Loss Standard",   route: "report-pl" },
    { name: "Balance Sheet Standard",     route: "report-balance-sheet" },
    { name: "Trial Balance",              route: "report-trial-balance" },
    { name: "Income By Customer Summary", route: "report-income-customer" },
    { name: "Transactions Summary",       route: "report-transactions-summary" }
  ]},
  { category: "Receivables", route: "reports-receivables", reports: [
    { name: "Customer Balance Summary",   route: "report-customer-balances" },
    { name: "Payment Collection Summary", route: "report-payment-collection" },
    { name: "Customer Statement",         route: "report-customer-statement" },
    { name: "Account Statement",          route: "report-account-statement" }
  ]},
  { category: "Payables", route: "reports-payables", reports: [
    { name: "Supplier Balance Summary",   route: "report-supplier-balances" },
    { name: "Supplier Statement",         route: "report-supplier-statement" }
  ]},
  { category: "Accounts", route: "reports-accounts", reports: [
    { name: "Journal",         route: "report-journal" },
    { name: "General Ledger",  route: "report-general-ledger" }
  ]},
  { category: "Inventory", route: "reports-inventory", reports: [
    { name: "Items List",                       route: "items" },
    { name: "Quantity On-hand by Warehouse",    route: "report-inv-onhand" },
    { name: "Inventory Valuation by Warehouse", route: "report-inv-valuation" },
    { name: "Damaged/Expired Inventory",        route: "report-inv-damaged" },
    { name: "Inventory Movement Summary",       route: "report-inv-movement" },
    { name: "Stock Status by Vendor",           route: "report-inv-vendor" },
    { name: "Physical Inventory Worksheet",     route: "report-inv-worksheet" }
  ]},
  { category: "Purchases", route: "reports-purchases", reports: [
    { name: "Purchases by Suppliers Summary", route: "report-purchases-suppliers" }
  ]},
  { category: "Discounts", route: "reports-discounts", reports: [
    { name: "Customers Discounts Summary", route: "report-customer-discounts" },
    { name: "Items Discounts Summary",     route: "report-item-discounts" }
  ]},
  { category: "Sales Orders", route: "reports-sales-orders", reports: [
    { name: "Sales Orders Summary", route: "report-sales-orders-summary" },
    { name: "Open Orders Summary",  route: "report-open-orders" }
  ]},
  { category: "Misc.", route: "reports-misc", reports: [
    { name: "Deleted Transactions", route: "report-deleted-transactions" },
    { name: "Updated Transactions", route: "report-updated-transactions" }
  ]},
  { category: "Sales", route: "reports-sales", reports: [
    { name: "Sales by Category Summary",                       route: "report-sales-category" },
    { name: "Sales by Items Summary",                          route: "report-sales-items" },
    { name: "Invoices Summary",                                route: "report-invoices-summary" },
    { name: "Sales by Customers Summary",                      route: "report-sales-customers" },
    { name: "Sales By Representative Summary",                 route: "report-sales-rep" },
    { name: "Return Stock By Representative Summary",          route: "report-return-stock-rep" },
    { name: "Sales By Salesman Summary",                       route: "report-sales-salesman" },
    { name: "Financial Recovery and Sales Performance Summary",route: "report-financial-recovery" },
    { name: "Invoice Items Summary",                           route: "report-invoice-items" },
    { name: "Invoice Batch Print",                             route: "report-invoice-batch-print" },
    { name: "Customers Items Sales Summary",                   route: "report-customers-items-sales" }
  ]}
];

/* v7.24 — clickable document numbers / entity names inside reports.
   Renders an anchor that the hash router resolves; falls back to plain
   text when the target route or id is missing. */
const DOC_DETAIL_ROUTES = { invoice: 'invoice-detail', receipt: 'sales-receipt-detail', 'credit-memo': 'edit-credit-memo', bill: 'edit-bill' };
function docLink(route, id, label) {
  const text = UI.escape(label == null ? '' : label);
  if (!route || !id || !text) return text;
  return `<a class="doc-link" href="#${route}?id=${encodeURIComponent(id)}">${text}</a>`;
}
function navLink(route, label) {
  const text = UI.escape(label == null ? '' : label);
  if (!route || !text) return text;
  return `<a class="doc-link" href="#${route}">${text}</a>`;
}
const TX_ROUTES = { 'Invoices':'invoices', 'Sales Receipts':'sales-receipts', 'Credit Memos':'credit-memos', 'Sales Orders':'sales-orders', 'Quotations':'quotations', 'Bills':'bills', 'Purchase Returns':'bills', 'Purchase Orders':'purchase-orders', 'Expenses':'expenses' };

function reportChips(cat) {
  return `<div class="report-chips">${cat.reports.map(r => r.route
    ? `<button class="report-chip" data-route="${UI.escape(r.route)}">${UI.escape(r.name)}</button>`
    : `<span class="report-chip report-chip--soon">${UI.escape(r.name)}<em>soon</em></span>`).join("")}</div>`;
}

Router.register("all-reports", (mount) => {
  mount.innerHTML = `<div class="page-head"><h1>All Reports</h1></div>
    <div class="reports-grid">${REPORT_TREE.map(cat => `
      <div class="card"><div class="card-head"><h2>${UI.escape(cat.category)}</h2>
        ${cat.route ? `<button class="link-btn" data-route="${cat.route}">View all</button>` : ""}
      </div>${reportChips(cat)}</div>`).join("")}
    </div>`;
  mount.querySelectorAll(".report-chip[data-route]").forEach(b => b.onclick = () => Router.go(b.dataset.route));
  mount.querySelectorAll(".link-btn[data-route]").forEach(b => b.onclick = () => Router.go(b.dataset.route));
});

function reportCategoryPage(mount, categoryName) {
  const cat = REPORT_TREE.find(c => c.category === categoryName);
  if (!cat) { mount.innerHTML = `<div class="empty"><p>Category not found.</p></div>`; return; }
  mount.innerHTML = `<div class="page-head"><h1>${UI.escape(cat.category)} Reports</h1>
    <div class="page-actions"><button class="btn" id="back-btn">← All Reports</button></div></div>
    <div class="card">${reportChips(cat)}</div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("all-reports");
  mount.querySelectorAll(".report-chip[data-route]").forEach(b => b.onclick = () => Router.go(b.dataset.route));
}

Router.register("reports-company-financial", (m) => reportCategoryPage(m, "Company & Financial"));
Router.register("reports-receivables",       (m) => reportCategoryPage(m, "Receivables"));
Router.register("reports-payables",          (m) => reportCategoryPage(m, "Payables"));
Router.register("reports-accounts",          (m) => reportCategoryPage(m, "Accounts"));
Router.register("reports-inventory",         (m) => reportCategoryPage(m, "Inventory"));

/* ---- Shared report screen helper ---- */
const DATE_PRESETS = ["All","Today","This Week","This Month","This Month-to-date","This Quarter","This Year","Last Week","Last Month","Last Quarter","Last Year","Custom"];

function todayStr() { const d = new Date(); return d.toISOString().slice(0,10); }
function monthStart() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`; }
function presetDates(preset) {
  const today = new Date(), y = today.getFullYear(), m = today.getMonth();
  const fmt = d => d.toISOString().slice(0,10);
  if (preset === "Today") return { from: fmt(today), to: fmt(today) };
  if (preset === "This Month" || preset === "This Month-to-date") return { from: `${y}-${String(m+1).padStart(2,'0')}-01`, to: fmt(today) };
  if (preset === "This Year") return { from: `${y}-01-01`, to: fmt(today) };
  if (preset === "Last Month") { const d = new Date(y,m,0); const s = new Date(y,m-1,1); return { from: fmt(s), to: fmt(d) }; }
  if (preset === "This Week") { const d = new Date(today); d.setDate(today.getDate()-today.getDay()); return { from: fmt(d), to: fmt(today) }; }
  return { from: monthStart(), to: fmt(today) };
}

function reportScreen(mount, cfg, params) {
  const co = window.ABS_CONFIG.COMPANY || {};
  const isRange = cfg.mode !== "asof";
  const def = presetDates("This Month-to-date");
  let from = def.from, to = def.to;

  mount.innerHTML = `
    <div class="page-head"><h1>${UI.escape(cfg.title)}</h1>
      <div class="page-actions">
        <button class="btn" id="rpt-back">← Reports</button>
        <button class="btn no-print" id="rpt-print" style="display:none">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print" id="rpt-filter">
      <div class="form-grid">
        <label class="field"><span class="field-label">Date Preset</span>
          <select id="rpt-preset">${DATE_PRESETS.map(p=>`<option>${p}</option>`).join("")}</select>
        </label>
        ${isRange ? `
        <div></div>
        <label class="field"><span class="field-label">From Date</span><input type="date" id="rpt-from" value="${from}"></label>
        <label class="field"><span class="field-label">To Date</span><input type="date" id="rpt-to" value="${to}"></label>
        ` : `<label class="field"><span class="field-label">As of Date</span><input type="date" id="rpt-asof" value="${to}"></label>`}
        ${cfg.extraFilters || ""}
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="rpt-run">View</button></div>
    </div>
    <div id="rpt-out"></div>`;

  mount.querySelector("#rpt-back").onclick = () => Router.go(cfg.backRoute || "all-reports");
  mount.querySelector("#rpt-preset").value = "This Month-to-date";
  mount.querySelector("#rpt-preset").onchange = function() {
    if (this.value === "Custom") return;
    if (this.value === "All") {
      if (isRange) { mount.querySelector("#rpt-from").value = ''; mount.querySelector("#rpt-to").value = ''; }
      else { mount.querySelector("#rpt-asof").value = ''; }
      return;
    }
    const d = presetDates(this.value);
    if (isRange) { mount.querySelector("#rpt-from").value = d.from; mount.querySelector("#rpt-to").value = d.to; }
    else { mount.querySelector("#rpt-asof").value = d.to; }
  };
  if (cfg.init) { cfg.init(mount, params || {}).catch(e => UI.toast(e.message, "error")); }

  async function run() {
    if (isRange) { from = mount.querySelector("#rpt-from").value; to = mount.querySelector("#rpt-to").value; }
    else { to = mount.querySelector("#rpt-asof").value; from = to; }
    const extra = cfg.gatherExtra ? cfg.gatherExtra(mount) : {};
    UI.loading(true, "Generating report…");
    try {
      const data = await API.call(cfg.action, Object.assign({ from, to }, extra));
      mount.querySelector("#rpt-print").style.display = "";
      const html = cfg.render(data, { from, to, co, extra });
      mount.querySelector("#rpt-out").innerHTML = html;
      if (cfg.afterRender) cfg.afterRender(mount, data, { from, to, co, extra });
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  }
  mount.querySelector("#rpt-run").onclick = run;
  mount.querySelector("#rpt-print").onclick = () => window.print();
  run();
}

/* ===================================================================
   COMPANY & FINANCIAL REPORTS
   =================================================================== */
Router.register("report-pl", (m) => reportScreen(m, {
  title: "Profit and Loss Standard", action: "reportProfitLoss", mode: "range",
  render(data, {from, to, co}) {
    const drill = (id, label) => id
      ? `<a class="pl-link" data-id="${UI.escape(id)}" data-from="${UI.escape(from)}" data-to="${UI.escape(to)}" style="color:var(--accent);cursor:pointer;text-decoration:none">${UI.escape(label)}</a>`
      : UI.escape(label);

    const section = (label, sec) => {
      if (!sec || !sec.lines) return '';
      return `
        <tr class="rpt-section"><td colspan="2"><strong>${UI.escape(label)}</strong></td></tr>
        ${sec.lines.map(r => `<tr class="pl-row"><td style="padding-left:28px">${drill(r.id, r.account)}</td>
          <td class="num" style="${r.amount !== 0 ? '' : 'color:#94a3b8'}">${UI.money(r.amount)}</td></tr>`).join('')}
        <tr class="rpt-subtotal"><td>Total ${UI.escape(label)}</td><td class="num">${UI.money(sec.total)}</td></tr>`;
    };

    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||'')}</div>
        <div class="report-title">Profit and Loss Standard</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div>
        <div class="report-sub" style="font-size:11px;color:#94a3b8;margin-top:2px">Click any account name to see its transactions</div>
      </div>
      <table class="data-table report-table" style="max-width:600px;margin:auto">
        <thead><tr><th>Account</th><th class="num">Amount</th></tr></thead>
        <tbody>
          <tr class="rpt-section"><td colspan="2">Ordinary Income/Expense</td></tr>
          <tr class="rpt-section"><td style="padding-left:14px"><em>Income</em></td><td></td></tr>
          ${section('', data.income).replace('<tr class="rpt-section"><td colspan="2"><strong></strong></td></tr>', '')}
          <tr class="rpt-section"><td style="padding-left:14px"><em>Cost of Goods Sold</em></td><td></td></tr>
          ${section('', data.cogs).replace('<tr class="rpt-section"><td colspan="2"><strong></strong></td></tr>', '')}
          <tr class="rpt-total"><td><strong>Gross Profit</strong></td><td class="num"><strong>${UI.money(data.gross_profit||0)}</strong></td></tr>
          <tr class="rpt-section"><td style="padding-left:14px"><em>Expenses</em></td><td></td></tr>
          ${section('', data.expense).replace('<tr class="rpt-section"><td colspan="2"><strong></strong></td></tr>', '')}
          <tr class="rpt-total"><td>Net Ordinary Income</td><td class="num">${UI.money(data.net_income||0)}</td></tr>
          <tr class="rpt-grand"><td><strong>Net Income</strong></td><td class="num"><strong>${UI.money(data.net_income||0)}</strong></td></tr>
        </tbody>
      </table>
      <div id="pl-drilldown" style="margin-top:24px"></div>
    </div>`;
  },
  afterRender(mount, data, ctx) {
    mount.querySelectorAll('.pl-link').forEach(a => {
      a.onclick = async () => {
        const panel = mount.querySelector('#pl-drilldown');
        const name = a.textContent;
        panel.innerHTML = `<div class="empty"><p>Loading ${UI.escape(name)} transactions…</p></div>`;
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
          const d = await API.call('accountDrilldown', { account_id: a.dataset.id, from: a.dataset.from, to: a.dataset.to });
          panel.innerHTML = `<div class="card no-print-card">
            <div class="card-head"><h2>${UI.escape(d.account)}</h2>
              <span class="page-sub">${UI.date(d.from)} — ${UI.date(d.to)}</span></div>
            <div class="table-wrap"><table class="data-table report-table">
              <thead><tr><th>Type</th><th>Date</th><th>Num</th><th>Name</th><th>Memo</th>
                <th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
              <tbody>
                <tr class="rpt-subtotal"><td colspan="7">Opening Balance</td><td class="num">${UI.money(d.opening)}</td></tr>
                ${d.lines.map(r => `<tr>
                  <td>${UI.escape(r.type)}</td><td>${UI.escape(UI.date(r.date))}</td>
                  <td>${UI.escape(r.number)}</td><td>${UI.escape(r.name)}</td><td>${UI.escape(r.memo)}</td>
                  <td class="num">${r.debit ? UI.money(r.debit) : ''}</td>
                  <td class="num">${r.credit ? UI.money(r.credit) : ''}</td>
                  <td class="num">${UI.money(r.balance)}</td>
                </tr>`).join('')}
                ${!d.lines.length ? `<tr><td colspan="8" style="text-align:center;padding:20px;color:#94a3b8">No transactions in this period.</td></tr>` : ''}
                <tr class="rpt-grand"><td colspan="7"><strong>Closing Balance</strong></td><td class="num"><strong>${UI.money(d.closing)}</strong></td></tr>
              </tbody>
            </table></div></div>`;
        } catch(e) { panel.innerHTML = `<div class="card"><div class="empty"><p>${UI.escape(e.message)}</p></div></div>`; }
      };
    });
  }
}));

Router.register("report-balance-sheet", (m) => reportScreen(m, {
  title: "Balance Sheet Standard", action: "reportBalanceSheet", mode: "asof",
  render(data, {to, co}) {
    const drill = (id, label) => id
      ? `<a class="bs-link" data-id="${UI.escape(id)}" data-to="${UI.escape(to)}" style="color:var(--accent);cursor:pointer">${UI.escape(label)}</a>`
      : UI.escape(label);
    const section = (label, sec) => sec && sec.lines && sec.lines.length ? `
      <tr class="rpt-section"><td colspan="2">${UI.escape(label)}</td></tr>
      ${sec.lines.map(r=>`<tr><td style="padding-left:28px">${drill(r.id, r.account)}</td><td class="num" style="${r.amount===0?'color:#94a3b8':''}">${UI.money(r.amount)}</td></tr>`).join('')}
      <tr class="rpt-subtotal"><td>Total ${UI.escape(label)}</td><td class="num">${UI.money(sec.total)}</td></tr>` : '';
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||'')}</div>
        <div class="report-title">Balance Sheet</div><div class="report-period">As of ${UI.date(to)}</div>
        <div class="report-sub" style="font-size:11px;color:#94a3b8;margin-top:2px">Click any account name to see its transactions</div>
      </div>
      <table class="data-table report-table" style="max-width:520px;margin:auto">
        <thead><tr><th>Account</th><th class="num">Balance</th></tr></thead>
        <tbody>
          <tr class="rpt-section"><td colspan="2"><strong>Assets</strong></td></tr>
          ${section("Current Assets", data.current_assets)}
          ${section("Fixed Assets", data.fixed_assets)}
          ${section("Other Assets", data.other_assets)}
          <tr class="rpt-total"><td><strong>Total Assets</strong></td><td class="num"><strong>${UI.money(data.total_assets||0)}</strong></td></tr>
          <tr class="rpt-section"><td colspan="2"><strong>Liabilities &amp; Equity</strong></td></tr>
          ${section("Current Liabilities", data.current_liab)}
          ${section("Long-term Liabilities", data.longterm_liab)}
          ${section("Equity", data.equity)}
          <tr class="rpt-grand"><td><strong>Total Liabilities &amp; Equity</strong></td><td class="num"><strong>${UI.money(data.total_liab_equity||0)}</strong></td></tr>
        </tbody>
      </table>
      <div id="bs-drilldown" style="margin-top:24px"></div>
    </div>`;
  },
  afterRender(mount, data, ctx) {
    mount.querySelectorAll('.bs-link').forEach(a => {
      a.onclick = async () => {
        const panel = mount.querySelector('#bs-drilldown');
        panel.innerHTML = `<div class="empty"><p>Loading ${UI.escape(a.textContent)} transactions…</p></div>`;
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
          const d = await API.call('accountDrilldown', { account_id: a.dataset.id, to: a.dataset.to });
          panel.innerHTML = `<div class="card no-print-card">
            <div class="card-head"><h2>${UI.escape(d.account)}</h2>
              <span class="page-sub">As of ${UI.date(ctx.to)}</span></div>
            <div class="table-wrap"><table class="data-table report-table">
              <thead><tr><th>Type</th><th>Date</th><th>Num</th><th>Name</th><th>Memo</th>
                <th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
              <tbody>
                ${d.lines.map(r=>`<tr>
                  <td>${UI.escape(r.type)}</td><td>${UI.escape(UI.date(r.date))}</td>
                  <td>${UI.escape(r.number)}</td><td>${UI.escape(r.name)}</td><td>${UI.escape(r.memo)}</td>
                  <td class="num">${r.debit?UI.money(r.debit):''}</td>
                  <td class="num">${r.credit?UI.money(r.credit):''}</td>
                  <td class="num">${UI.money(r.balance)}</td></tr>`).join('')}
                ${!d.lines.length?`<tr><td colspan="8" style="text-align:center;padding:20px;color:#94a3b8">No transactions found.</td></tr>`:''}
                <tr class="rpt-grand"><td colspan="7"><strong>Balance</strong></td><td class="num"><strong>${UI.money(d.closing)}</strong></td></tr>
              </tbody></table></div></div>`;
        } catch(e) { panel.innerHTML = `<div class="card"><div class="empty"><p>${UI.escape(e.message)}</p></div></div>`; }
      };
    });
  }
}));

Router.register("report-trial-balance", (m) => reportScreen(m, {
  title: "Trial Balance", action: "reportTrialBalance", mode: "asof",
  render(data, {to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Trial Balance</div><div class="report-period">As of ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Account</th><th>Type</th><th class="num">Debit</th><th class="num">Credit</th></tr></thead>
        <tbody>
          ${(data.lines||[]).map(r=>`<tr><td>${docLink("report-general-ledger", r.account_id, r.account)}</td><td>${UI.escape(r.type)}</td>
            <td class="num">${r.debit?UI.money(r.debit):""}</td><td class="num">${r.credit?UI.money(r.credit):""}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="4" style="text-align:center;padding:28px">No account activity found.</td></tr>`:""}
          <tr class="rpt-grand"><td colspan="2"><strong>Total</strong></td>
            <td class="num"><strong>${UI.money(data.total_debit||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_credit||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-income-customer", (m) => reportScreen(m, {
  title: "Income By Customer Summary", action: "reportIncomeByCustomer", mode: "range",
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Income By Customer Summary</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Customer</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${(data.lines||[]).map(r=>`<tr><td>${docLink("report-customer-statement", r.customer_id, r.customer)}</td><td class="num">${UI.money(r.amount)}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="2" style="text-align:center;padding:28px">No income in this period.</td></tr>`:""}
          <tr class="rpt-grand"><td><strong>Total</strong></td><td class="num"><strong>${UI.money(data.total||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-transactions-summary", (m) => reportScreen(m, {
  title: "Transactions Summary", action: "reportTransactionsSummary", mode: "range",
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Transactions Summary</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Transaction Type</th><th class="num">Count</th><th class="num">Total</th></tr></thead>
        <tbody>
          ${(data.rows||[]).map(r=>`<tr><td>${navLink(TX_ROUTES[r.label], r.label)}</td><td class="num">${r.count}</td><td class="num">${UI.money(r.total)}</td></tr>`).join("")}
          <tr class="rpt-grand"><td><strong>Total</strong></td><td class="num"><strong>${data.grand_count||0}</strong></td>
            <td class="num"><strong>${UI.money(data.grand_total||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

/* ===================================================================
   RECEIVABLES REPORTS
   =================================================================== */
Router.register("report-customer-balances", (m) => reportScreen(m, {
  title: "Customer Balance Summary", action: "reportCustomerBalances", mode: "asof",
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||'')}</div>
        <div class="report-title">Customer Balance Summary</div><div class="report-period">As of ${UI.date(to)}</div>
        <div class="report-sub" style="font-size:11px;color:#94a3b8;margin-top:2px">Click a customer name to open their statement</div>
      </div>
      <table class="data-table report-table">
        <thead><tr><th>Customer</th><th class="num">Invoiced</th><th class="num">Paid</th><th class="num">Balance</th></tr></thead>
        <tbody>
          ${(data.lines||[]).map(r=>`<tr><td>
            ${docLink('report-customer-statement', r.customer_id, r.customer)}
          </td><td class="num">${UI.money(r.invoiced)}</td>
            <td class="num">${UI.money(r.paid)}</td><td class="num" style="${r.balance>0?'color:var(--bad)':''}">${UI.money(r.balance)}</td></tr>`).join('')}
          ${!(data.lines||[]).length?`<tr><td colspan="4" style="text-align:center;padding:28px">No customer balances found.</td></tr>`:''}
          <tr class="rpt-grand"><td><strong>Total</strong></td><td class="num"><strong>${UI.money(data.total_invoiced||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_paid||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_balance||0)}</strong></td></tr>
        </tbody>
      </table>
    </div>`;
  }
}));

Router.register("report-payment-collection", (m) => reportScreen(m, {
  title: "Payment Collection Summary", action: "reportPaymentCollection", mode: "range",
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Payment Collection Summary</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Customer</th><th>Method</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${(data.lines||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${docLink('report-customer-statement', r.customer_id, r.customer)}</td>
            <td>${UI.escape(r.method||"")}</td><td class="num">${UI.money(r.amount)}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="4" style="text-align:center;padding:28px">No payments in this period.</td></tr>`:""}
          <tr class="rpt-grand"><td colspan="3"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.total||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-customer-statement", (m, p) => reportScreen(m, {
  title: "Customer Statement", action: "reportCustomerStatement", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Customer</span>
    <select id="rpt-customer"><option value="">Select a customer…</option></select></label>`,
  gatherExtra(mount) { return { customer_id: mount.querySelector("#rpt-customer").value }; },
  async init(mount, params) {
    const custs = await API.list("Customers");
    const sel = mount.querySelector("#rpt-customer");
    custs.forEach(c => sel.add(new Option(c.name, c.id)));
    UI.enhanceSelect(sel, "Type customer name…");
    if (params && params.id) { sel.value = params.id; mount.querySelector("#rpt-run").click(); }
  },
  render(data, {from, to, co}) {
    if (data.need_pick) {
      return `<div class="card"><div class="empty"><p>Select a customer above and click View to see their statement.</p></div></div>`;
    }
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Customer Statement — ${UI.escape(data.name||"")}</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Type</th><th>Number</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
        <tbody>
          <tr class="rpt-subtotal"><td colspan="5">Opening Balance</td><td class="num">${UI.money(data.opening||0)}</td></tr>
          ${(data.lines||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.type)}</td>
          <td>${docLink(DOC_DETAIL_ROUTES[r.doc], r.id, r.number||"")}</td><td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="6" style="text-align:center;padding:20px">No activity in this period.</td></tr>`:""}
          <tr class="rpt-grand"><td colspan="5"><strong>Closing Balance</strong></td><td class="num"><strong>${UI.money(data.closing||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}, p));

Router.register("report-account-statement", (m, p) => reportScreen(m, {
  title: "Account Statement", action: "reportCustomerStatement", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Customer</span>
    <select id="rpt-customer"><option value="">Select a customer…</option></select></label>`,
  gatherExtra(mount) { return { customer_id: mount.querySelector("#rpt-customer").value }; },
  async init(mount, params) {
    const custs = await API.list("Customers");
    const sel = mount.querySelector("#rpt-customer");
    custs.forEach(c => sel.add(new Option(c.name, c.id)));
    UI.enhanceSelect(sel, "Type customer name…");
    if (params && params.id) { sel.value = params.id; mount.querySelector("#rpt-run").click(); }
  },
  render(data, {from, to, co}) {
    if (data.need_pick) {
      return `<div class="card"><div class="empty"><p>Select a customer above and click View to see their statement.</p></div></div>`;
    }
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Account Statement — ${UI.escape(data.name||"")}</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Type</th><th>Number</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
        <tbody>
          <tr class="rpt-subtotal"><td colspan="5">Opening Balance</td><td class="num">${UI.money(data.opening||0)}</td></tr>
          ${(data.lines||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.type)}</td>
          <td>${docLink(DOC_DETAIL_ROUTES[r.doc], r.id, r.number||"")}</td><td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="6" style="text-align:center;padding:20px">No activity in this period.</td></tr>`:""}
          <tr class="rpt-grand"><td colspan="5"><strong>Closing Balance</strong></td><td class="num"><strong>${UI.money(data.closing||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}, p));

/* ===================================================================
   PAYABLES REPORTS
   =================================================================== */
Router.register("report-supplier-balances", (m) => reportScreen(m, {
  title: "Supplier Balance Summary", action: "reportSupplierBalances", mode: "asof",
  render(data, {to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Supplier Balance Summary</div><div class="report-period">As of ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Supplier</th><th class="num">Billed</th><th class="num">Paid</th><th class="num">Balance</th></tr></thead>
        <tbody>
          ${(data.lines||[]).map(r=>`<tr><td>${docLink('report-supplier-statement', r.supplier_id, r.supplier)}</td><td class="num">${UI.money(r.billed)}</td>
            <td class="num">${UI.money(r.paid)}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="4" style="text-align:center;padding:28px">No supplier balances found.</td></tr>`:""}
          <tr class="rpt-grand"><td><strong>Total</strong></td><td class="num"><strong>${UI.money(data.total_billed||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_paid||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_balance||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-supplier-statement", (m, p) => reportScreen(m, {
  title: "Supplier Statement", action: "reportSupplierStatement", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Supplier</span>
    <select id="rpt-supplier"><option value="">Select a supplier…</option></select></label>`,
  gatherExtra(mount) { return { supplier_id: mount.querySelector("#rpt-supplier").value }; },
  async init(mount, params) {
    const supps = await API.list("Suppliers");
    const sel = mount.querySelector("#rpt-supplier");
    supps.forEach(s => sel.add(new Option(s.name, s.id)));
    if (params && params.id) { sel.value = params.id; mount.querySelector("#rpt-run").click(); }
  },
  render(data, {from, to, co}) {
    if (data.need_pick) {
      return `<div class="card"><div class="empty"><p>Select a supplier above and click View to see their statement.</p></div></div>`;
    }
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Supplier Statement — ${UI.escape(data.name||"")}</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Type</th><th>Number</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
        <tbody>
          <tr class="rpt-subtotal"><td colspan="5">Opening Balance</td><td class="num">${UI.money(data.opening||0)}</td></tr>
          ${(data.lines||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.type)}</td>
          <td>${docLink(DOC_DETAIL_ROUTES[r.doc], r.id, r.number||"")}</td><td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="6" style="text-align:center;padding:20px">No activity in this period.</td></tr>`:""}
          <tr class="rpt-grand"><td colspan="5"><strong>Closing Balance</strong></td><td class="num"><strong>${UI.money(data.closing||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}, p));

/* ===================================================================
   ACCOUNTS REPORTS
   =================================================================== */
Router.register("report-journal", (m) => reportScreen(m, {
  title: "Journal", action: "reportJournal", mode: "range",
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Journal</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Account</th><th>Memo</th><th class="num">Debit</th><th class="num">Credit</th></tr></thead>
        <tbody>${(data.lines||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${docLink('report-general-ledger', r.account_id, r.account)}</td>
          <td>${UI.escape(r.memo||"")}</td>
          <td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td></tr>`).join("")}
          ${!(data.lines||[]).length?`<tr><td colspan="5" style="text-align:center;padding:28px">No journal entries in this period.</td></tr>`:""}
          <tr class="rpt-grand"><td colspan="3"><strong>Total</strong></td>
            <td class="num"><strong>${UI.money(data.total_debit||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_credit||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-general-ledger", (m, p) => reportScreen(m, {
  title: "General Ledger", action: "reportGeneralLedger", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Account</span>
    <select id="rpt-gl-acct"><option value="">All Accounts</option></select></label>`,
  gatherExtra(mount) { return { account_id: mount.querySelector("#rpt-gl-acct").value }; },
  async init(mount, params) {
    const accts = await API.list("Accounts");
    const sel = mount.querySelector("#rpt-gl-acct");
    accts.forEach(a => sel.add(new Option(a.account_name, a.id)));
    if (params && params.id) { sel.value = params.id; mount.querySelector("#rpt-run").click(); }
  },
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">General Ledger</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      ${!(data.accounts||[]).length?`<div class="empty" style="padding:28px"><p>No account activity in this period.</p></div>`:""}
      ${(data.accounts||[]).map(acct => `
        <div style="margin-bottom:24px">
          <h3 class="gl-acct" style="margin:0 0 8px;font-size:14px;color:#334155">${docLink('report-account-statement', acct.id, acct.account)} <span style="color:#94a3b8;font-weight:400">${UI.escape(acct.type)}</span></h3>
          <table class="data-table report-table">
            <thead><tr><th>Date</th><th>Memo</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
            <tbody>
              <tr class="rpt-subtotal"><td colspan="4">Opening Balance</td><td class="num">${UI.money(acct.opening||0)}</td></tr>
              ${(acct.lines||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.memo||"")}</td>
              <td class="num">${r.debit?UI.money(r.debit):""}</td><td class="num">${r.credit?UI.money(r.credit):""}</td>
              <td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
              <tr class="rpt-subtotal"><td colspan="4"><strong>Closing Balance</strong></td>
                <td class="num"><strong>${UI.money(acct.closing)}</strong></td></tr>
            </tbody>
          </table>
        </div>`).join("")}
      </div>`;
  }
}, p));

/* ===================================================================
   INVENTORY REPORTS  (7 subtabs)
   =================================================================== */

// Shared filter helper for inventory reports
async function invFilters(mount, opts) {
  opts = opts || {};
  let warehouses = [], categories = [], suppliers = [];
  try { warehouses = await API.list("Warehouses"); } catch(e){}
  try { categories = await API.list("Categories"); } catch(e){}
  if (opts.vendors) { try { suppliers = await API.list("Suppliers"); } catch(e){} }
  const whOpts = `<option value="">All Warehouses</option>${warehouses.map(w=>`<option value="${UI.escape(String(w.id))}">${UI.escape(w.warehouse_name)}</option>`).join("")}`;
  const catOpts = `<option value="">All Categories</option>${categories.map(c=>`<option value="${UI.escape(String(c.id))}">${UI.escape(c.name)}</option>`).join("")}`;
  const suppOpts = opts.vendors ? `<option value="">All Suppliers</option>${suppliers.map(s=>`<option value="${UI.escape(String(s.id))}">${UI.escape(s.name)}</option>`).join("")}` : "";
  return { whOpts, catOpts, suppOpts };
}

// 1. Quantity On-hand by Warehouse
Router.register("report-inv-onhand", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const { whOpts, catOpts } = await invFilters(mount);
  mount.innerHTML = `
    <div class="page-head"><h1>Quantity On-hand by Warehouse</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">Warehouse</span><select id="f-wh">${whOpts}</select></label>
        <label class="field"><span class="field-label">Category</span><select id="f-cat">${catOpts}</select></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-inventory");
  mount.querySelector("#print-btn").onclick = () => window.print();
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const res = await API.call("reportInventoryOnhand", { warehouse: mount.querySelector("#f-wh").value, category: mount.querySelector("#f-cat").value });
      const whs = (res && res.warehouses) || [];
      const items = (res && res.items) || [];
      // group items by category (Diyar style)
      const groups = {};
      items.forEach(it => { const c = it.category || "Uncategorized"; (groups[c] = groups[c] || []).push(it); });
      const catNames = Object.keys(groups).sort((a,b)=>a.localeCompare(b));
      const colCount = 2 + whs.length + 1;
      const whHead = whs.map(w=>`<th class="num">${UI.escape(w)}</th>`).join("");
      const colTotals = whs.map(()=>0); let grand = 0;
      const bodyHtml = catNames.map(cat => {
        const rowsHtml = groups[cat].map(it => {
          const cells = whs.map((w,idx)=>{ const q = Number((it.by_wh && it.by_wh[w]) || 0); colTotals[idx]+=q; return `<td class="num">${q}</td>`; }).join("");
          grand += Number(it.total || 0);
          return `<tr><td>${UI.escape(it.name)}</td><td>${UI.escape(it.sku)}</td>${cells}<td class="num"><strong>${Number(it.total || 0)}</strong></td></tr>`;
        }).join("");
        return `<tr class="group-row"><td colspan="${colCount}" style="background:#f1f5f9"><strong>${UI.escape(cat)}</strong></td></tr>${rowsHtml}`;
      }).join("");
      const footCells = colTotals.map(t=>`<td class="num"><strong>${t}</strong></td>`).join("");
      const whSel = mount.querySelector("#f-wh");
      const whLabel = (whSel && whSel.selectedOptions[0]) ? whSel.selectedOptions[0].textContent : "All Warehouses";
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Quantity On-hand by Warehouse</div>
          <div class="report-sub" style="font-size:11px;color:#94a3b8">${UI.escape(whLabel)} · Grouped by Category</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Item</th><th>SKU</th>${whHead}<th class="num">Total</th></tr></thead>
          <tbody>${bodyHtml || `<tr><td colspan="${colCount}" class="empty" style="text-align:center;padding:28px">No items found.</td></tr>`}</tbody>
          <tfoot><tr><td colspan="2"><strong>Grand Total</strong></td>${footCells}<td class="num"><strong>${grand}</strong></td></tr></tfoot>
        </table></div></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

// 2. Inventory Valuation by Warehouse
Router.register("report-inv-valuation", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const { whOpts, catOpts } = await invFilters(mount);
  mount.innerHTML = `
    <div class="page-head"><h1>Inventory Valuation by Warehouse</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">Warehouse</span><select id="f-wh">${whOpts}</select></label>
        <label class="field"><span class="field-label">Category</span><select id="f-cat">${catOpts}</select></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-inventory");
  mount.querySelector("#print-btn").onclick = () => window.print();
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const data = await API.call("reportInventoryValuation", { warehouse: mount.querySelector("#f-wh").value, category: mount.querySelector("#f-cat").value });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Inventory Valuation by Warehouse</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th class="num">Qty</th><th class="num">Avg Cost</th><th class="num">Total Value</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.sku)}</td><td>${UI.escape(r.category)}</td>
            <td class="num">${r.qty}</td><td class="num">${UI.money(r.cost)}</td><td class="num">${UI.money(r.value)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No items found.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="5"><strong>Total Inventory Value</strong></td>
            <td class="num"><strong>${UI.money(data.total)}</strong></td></tr></tfoot>
        </table></div></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

// 3. Damaged / Expired Inventory
Router.register("report-inv-damaged", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const { catOpts } = await invFilters(mount);
  mount.innerHTML = `
    <div class="page-head"><h1>Damaged / Expired Inventory</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">Category</span><select id="f-cat">${catOpts}</select></label>
        <label class="field"><span class="field-label">Type</span>
          <select id="f-type">
            <option value="all">All (Damaged + Expired)</option>
            <option value="expired">Expired Only</option>
            <option value="damaged">Damaged Only</option>
          </select>
        </label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-inventory");
  mount.querySelector("#print-btn").onclick = () => window.print();
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const rows = await API.call("reportInventoryDamaged", { category: mount.querySelector("#f-cat").value, type: mount.querySelector("#f-type").value });
      const total = rows.reduce((s,r)=>s+r.value,0);
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Damaged / Expired Inventory Valuation</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Type</th><th>Expiry</th><th class="num">Qty</th><th class="num">Cost</th><th class="num">Value</th></tr></thead>
          <tbody>${rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.sku)}</td><td>${UI.escape(r.category)}</td>
            <td><span class="badge ${r.type==='Expired'?'badge--bad':'badge--warn'}">${UI.escape(r.type)}</span></td>
            <td>${r.expiry?UI.escape(UI.date(r.expiry)):""}</td>
            <td class="num">${r.qty}</td><td class="num">${UI.money(r.cost)}</td><td class="num">${UI.money(r.value)}</td>
          </tr>`).join("")}
          ${!rows.length?`<tr><td colspan="8" style="text-align:center;padding:28px">No damaged or expired items found.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="7"><strong>Total Loss Value</strong></td><td class="num"><strong>${UI.money(total)}</strong></td></tr></tfoot>
        </table></div></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

// 4. Inventory Movement Summary
Router.register("report-inv-movement", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  let cats = [];
  try { cats = await API.list("Categories"); } catch(e){}
  const catOpts2 = `<option value="">All Categories</option>${cats.map(c=>`<option value="${UI.escape(String(c.id))}">${UI.escape(c.name)}</option>`).join("")}`;
  const def = presetDates("This Month-to-date");
  mount.innerHTML = `
    <div class="page-head"><h1>Inventory Movement Summary</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">Date Preset</span>
          <select id="f-preset">${DATE_PRESETS.map(p=>`<option>${p}</option>`).join("")}</select></label>
        <div></div>
        <label class="field"><span class="field-label">From Date</span><input type="date" id="f-from" value="${def.from}"></label>
        <label class="field"><span class="field-label">To Date</span><input type="date" id="f-to" value="${def.to}"></label>
        <label class="field"><span class="field-label">Category</span><select id="f-cat">${catOpts2}</select></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-inventory");
  mount.querySelector("#print-btn").onclick = () => window.print();
  const preset = mount.querySelector("#f-preset");
  preset.value = "This Month-to-date";
  preset.onchange = function() {
    if (this.value === "Custom") return;
    if (this.value === "All") { mount.querySelector("#f-from").value = ''; mount.querySelector("#f-to").value = ''; return; }
    const d = presetDates(this.value);
    mount.querySelector("#f-from").value = d.from;
    mount.querySelector("#f-to").value   = d.to;
  };
  const M = (v) => UI.money(v);
  const N = (v) => Number(v||0).toFixed(2);
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value;
      const to   = mount.querySelector("#f-to").value;
      const data = await API.call("reportInventoryMovement", {
        from, to, category: mount.querySelector("#f-cat").value
      });
      if (!data.groups || !data.groups.length) {
        mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card"><div class="empty"><p>No inventory movements in this period.</p></div></div>`;
        UI.loading(false); return;
      }
      const g = data.grand;
      let html = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Inventory Movement Summary</div>
          <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
        <div class="table-wrap"><table class="data-table report-table" style="font-size:12.5px">
          <thead><tr>
            <th class="num">Sr#</th><th style="min-width:220px">Item</th>
            <th class="num">Opening Qty</th><th class="num">Qty In</th><th class="num">Qty Out</th>
            <th class="num">Adjusted In</th><th class="num">Adjusted Out</th><th class="num">Closing Qty</th>
            <th class="num">Opening Value</th><th class="num">Value In</th><th class="num">Value Out</th><th class="num">Closing Value</th>
          </tr></thead>
          <tbody>`;
      data.groups.forEach(grp => {
        html += `<tr style="background:var(--row-alt)"><td colspan="12" style="font-weight:600;padding:8px 12px">${UI.escape(grp.category)}</td></tr>`;
        grp.items.forEach(it => {
          html += `<tr>
            <td class="num" style="color:#94a3b8">${it.sr}</td>
            <td><span style="color:#94a3b8;font-size:11px;margin-right:6px">${UI.escape(it.sku)}</span><span style="color:var(--accent)">${UI.escape(it.name)}</span></td>
            <td class="num">${it.opening_qty}</td>
            <td class="num" style="${it.qty_in>0?'color:var(--ok)':''}">${it.qty_in}</td>
            <td class="num" style="${it.qty_out>0?'color:var(--bad)':''}">${it.qty_out}</td>
            <td class="num" style="${it.adj_in>0?'color:var(--ok)':''}">${it.adj_in}</td>
            <td class="num" style="${it.adj_out>0?'color:var(--bad)':''}">${it.adj_out}</td>
            <td class="num"><strong>${it.closing_qty}</strong></td>
            <td class="num">${M(it.opening_val)}</td>
            <td class="num">${M(it.val_in)}</td>
            <td class="num">${M(it.val_out)}</td>
            <td class="num"><strong>${M(it.closing_val)}</strong></td>
          </tr>`;
        });
        const t = grp.total;
        html += `<tr class="rpt-subtotal">
          <td colspan="2"><strong>Total ${UI.escape(grp.category)}</strong></td>
          <td class="num">${N(t.opening_qty)}</td><td class="num">${N(t.qty_in)}</td>
          <td class="num">${N(t.qty_out)}</td><td class="num">${N(t.adj_in)}</td>
          <td class="num">${N(t.adj_out)}</td><td class="num">${N(t.closing_qty)}</td>
          <td class="num">${M(t.opening_val)}</td><td class="num">${M(t.val_in)}</td>
          <td class="num">${M(t.val_out)}</td><td class="num"><strong>${M(t.closing_val)}</strong></td>
        </tr>`;
      });
      html += `<tr class="rpt-grand">
        <td colspan="2"><strong>Grand Total</strong></td>
        <td class="num">${N(g.opening_qty)}</td><td class="num">${N(g.qty_in)}</td>
        <td class="num">${N(g.qty_out)}</td><td class="num">${N(g.adj_in)}</td>
        <td class="num">${N(g.adj_out)}</td><td class="num">${N(g.closing_qty)}</td>
        <td class="num"><strong>${M(g.opening_val)}</strong></td>
        <td class="num"><strong>${M(g.val_in)}</strong></td>
        <td class="num"><strong>${M(g.val_out)}</strong></td>
        <td class="num"><strong>${M(g.closing_val)}</strong></td>
      </tr></tbody></table></div></div>`;
      mount.querySelector("#rpt-out").innerHTML = html;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

// 5. Stock Status by Vendor
Router.register("report-inv-vendor", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const { suppOpts } = await invFilters(mount, { vendors: true });
  mount.innerHTML = `
    <div class="page-head"><h1>Stock Status by Vendor</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">Supplier / Vendor</span><select id="f-supp">${suppOpts}</select></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-inventory");
  mount.querySelector("#print-btn").onclick = () => window.print();
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const rows = await API.call("reportInventoryVendor", { supplier: mount.querySelector("#f-supp").value });
      const statusBadge = s => s==="Out of Stock"?'<span class="badge badge--bad">Out</span>':s==="Low Stock"?'<span class="badge badge--warn">Low</span>':'<span class="badge badge--ok">In Stock</span>';
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Stock Status by Vendor</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Supplier</th><th class="num">On Hand</th><th class="num">Reorder</th><th>Status</th></tr></thead>
          <tbody>${rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.sku)}</td><td>${UI.escape(r.category)}</td>
            <td>${UI.escape(r.supplier)}</td><td class="num">${r.on_hand}</td><td class="num">${r.reorder}</td>
            <td>${statusBadge(r.status)}</td>
          </tr>`).join("")}
          ${!rows.length?`<tr><td colspan="7" style="text-align:center;padding:28px">No items found.</td></tr>`:""}
          </tbody>
        </table></div></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

// 6. Physical Inventory Worksheet (print-ready)
Router.register("report-inv-worksheet", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const { whOpts, catOpts } = await invFilters(mount);
  mount.innerHTML = `
    <div class="page-head"><h1>Physical Inventory Worksheet</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn btn--primary no-print" id="print-btn">${UI.icon("printer")} Print Worksheet</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">Warehouse</span><select id="f-wh">${whOpts}</select></label>
        <label class="field"><span class="field-label">Category</span><select id="f-cat">${catOpts}</select></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">Generate Worksheet</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-inventory");
  mount.querySelector("#print-btn").onclick = () => window.print();
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const rows = await API.call("reportInventoryWorksheet", { warehouse: mount.querySelector("#f-wh").value, category: mount.querySelector("#f-cat").value });
      const today = new Date().toLocaleDateString();
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Physical Inventory Worksheet</div>
          <div class="report-period">Date: ${today} &nbsp;&nbsp; Counted by: _________________</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Item</th><th>SKU</th><th>Category</th>
            <th class="num">System Qty</th><th class="num" style="min-width:120px">Actual Qty</th>
            <th class="num" style="min-width:100px">Difference</th></tr></thead>
          <tbody>${rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.sku)}</td><td>${UI.escape(r.category)}</td>
            <td class="num">${r.system_qty}</td>
            <td class="num" style="border-bottom:1px solid #94a3b8">&nbsp;</td>
            <td class="num" style="border-bottom:1px solid #94a3b8">&nbsp;</td>
          </tr>`).join("")}
          ${!rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No items found.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total Items: ${rows.length}</strong></td>
            <td class="num"><strong>${rows.reduce((s,r)=>s+r.system_qty,0)}</strong></td><td></td><td></td></tr></tfoot>
        </table></div>
        <div style="margin-top:28px;font-size:12px;color:#94a3b8">
          Count Date: _________________ &nbsp;&nbsp; Verified by: _________________ &nbsp;&nbsp; Approved by: _________________
        </div>
      </div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

/* ===================================================================
   PURCHASES REPORTS
   =================================================================== */

Router.register("reports-purchases", (m) => reportCategoryPage(m, "Purchases"));

Router.register("report-purchases-suppliers", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const def = presetDates("This Month-to-date");
  mount.innerHTML = `
    <div class="page-head"><h1>Purchases by Suppliers Summary</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">Date Preset</span>
          <select id="f-preset">${DATE_PRESETS.map(p=>`<option>${p}</option>`).join("")}</select>
        </label>
        <div></div>
        <label class="field"><span class="field-label">From Date</span><input type="date" id="f-from" value="${def.from}"></label>
        <label class="field"><span class="field-label">To Date</span><input type="date" id="f-to" value="${def.to}"></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-purchases");
  mount.querySelector("#print-btn").onclick = () => window.print();
  mount.querySelector("#f-preset").value = "This Month-to-date";
  mount.querySelector("#f-preset").onchange = function() {
    if (this.value === "Custom") return;
    const d = presetDates(this.value);
    mount.querySelector("#f-from").value = d.from;
    mount.querySelector("#f-to").value = d.to;
  };
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value;
      const to   = mount.querySelector("#f-to").value;
      const data = await API.call("reportPurchasesBySupplier", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Purchases by Suppliers Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Supplier</th><th class="num">Bills</th><th class="num">POs</th>
            <th class="num">Total Purchases</th><th class="num">Amount Paid</th><th class="num">Balance</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.supplier)}</td>
            <td class="num">${r.bills}</td><td class="num">${r.pos}</td>
            <td class="num">${UI.money(r.total)}</td>
            <td class="num">${UI.money(r.paid)}</td>
            <td class="num" style="${r.balance>0?'color:var(--bad)':''}">${UI.money(r.balance)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No purchase data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td><strong>Total</strong></td><td></td><td></td>
            <td class="num"><strong>${UI.money(data.grand_total)}</strong></td>
            <td class="num"><strong>${UI.money(data.grand_paid)}</strong></td>
            <td class="num"><strong>${UI.money(data.grand_balance)}</strong></td></tr></tfoot>
        </table></div></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

/* ===================================================================
   SALES REPORTS  (11 subtabs)
   =================================================================== */

Router.register("reports-discounts",   (m) => reportCategoryPage(m, "Discounts"));
Router.register("reports-sales-orders",(m) => reportCategoryPage(m, "Sales Orders"));
Router.register("reports-misc",        (m) => reportCategoryPage(m, "Misc."));
Router.register("reports-sales",       (m) => reportCategoryPage(m, "Sales"));

// Shared date filter block for sales reports
function salesDateBlock(defFrom, defTo) {
  return `
    <label class="field"><span class="field-label">Date Preset</span>
      <select id="f-preset">${DATE_PRESETS.map(p=>`<option>${p}</option>`).join("")}</select>
    </label>
    <div></div>
    <label class="field"><span class="field-label">From Date</span><input type="date" id="f-from" value="${defFrom}"></label>
    <label class="field"><span class="field-label">To Date</span><input type="date" id="f-to" value="${defTo}"></label>`;
}
function wireDatePreset(mount) {
  const el = mount.querySelector("#f-preset");
  if (!el) return;
  el.value = "This Month-to-date";
  el.onchange = function() {
    if (this.value === "Custom") return;
    if (this.value === "All") {
      if (mount.querySelector("#f-from")) mount.querySelector("#f-from").value = '';
      if (mount.querySelector("#f-to"))   mount.querySelector("#f-to").value   = '';
      return;
    }
    const d = presetDates(this.value);
    if (mount.querySelector("#f-from")) mount.querySelector("#f-from").value = d.from;
    if (mount.querySelector("#f-to"))   mount.querySelector("#f-to").value   = d.to;
  };
}

// Helper to build a standard sales report page
function salesReportPage(mount, title, bodyHTML, onRun, backRoute) {
  const def = presetDates("This Month-to-date");
  mount.innerHTML = `
    <div class="page-head"><h1>${UI.escape(title)}</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">${bodyHTML(def.from, def.to)}</div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go(backRoute || "reports-sales");
  mount.querySelector("#print-btn").onclick = () => window.print();
  wireDatePreset(mount);
  mount.querySelector("#run-btn").onclick = onRun;
  onRun();
}

// 1. Sales by Category Summary
Router.register("report-sales-category", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales by Category Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportSalesByCategory", { from, to });
        const gt = data.grand;
        const pct = (a) => gt.amount ? Math.round(a/gt.amount*1000)/10 : 0;
        const gm  = (amt, cogs) => amt - cogs;
        const gmp = (amt, cogs) => amt ? Math.round((amt-cogs)/amt*1000)/10 : 0;
        let html = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Sales by Category Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div>
            <div class="report-sub" style="font-size:11px;color:#94a3b8">All Warehouses</div></div>
          <table class="data-table report-table">
            <thead><tr><th></th><th class="num">Qty</th><th class="num">Amount</th>
              <th class="num">% of Sales</th><th class="num">COGS Amount</th>
              <th class="num">Gross Margin</th><th class="num">Gross Margin %</th></tr></thead>
          <tbody>`;
        data.groups.forEach(g => {
          html += `<tr style="background:var(--row-alt);font-weight:600"><td>${UI.escape(g.name)}</td><td colspan="6"></td></tr>`;
          g.categories.forEach(c => {
            const cm = gm(c.amount, c.cogs), cmp = gmp(c.amount, c.cogs);
            html += `<tr><td style="padding-left:20px">${UI.escape(c.name)}</td>
              <td class="num">${c.qty.toFixed(2)}</td>
              <td class="num">${UI.money(c.amount)}</td>
              <td class="num">${pct(c.amount)} %</td>
              <td class="num">${UI.money(c.cogs)}</td>
              <td class="num">${UI.money(cm)}</td>
              <td class="num">${cmp}%</td></tr>`;
          });
          const gCm = gm(g.total.amount, g.total.cogs), gCmp = gmp(g.total.amount, g.total.cogs);
          html += `<tr class="rpt-subtotal"><td>Total ${UI.escape(g.name)}</td>
            <td class="num">${g.total.qty.toFixed(2)}</td>
            <td class="num">${UI.money(g.total.amount)}</td>
            <td class="num">${pct(g.total.amount)}%</td>
            <td class="num">${UI.money(g.total.cogs)}</td>
            <td class="num">${UI.money(gCm)}</td>
            <td class="num">${gCmp}%</td></tr>`;
        });
        const totCm = gm(gt.amount, gt.cogs), totCmp = gmp(gt.amount, gt.cogs);
        html += `<tr class="rpt-grand"><td><strong>Grand Total</strong></td>
          <td class="num"><strong>${gt.qty.toFixed(2)}</strong></td>
          <td class="num"><strong>${UI.money(gt.amount)}</strong></td>
          <td class="num">100%</td>
          <td class="num"><strong>${UI.money(gt.cogs)}</strong></td>
          <td class="num"><strong>${UI.money(totCm)}</strong></td>
          <td class="num"><strong>${totCmp}%</strong></td></tr>
          </tbody></table></div>`;
        mount.querySelector("#rpt-out").innerHTML = html;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 2. Sales by Items Summary
Router.register("report-sales-items", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales by Items Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportSalesByItems", { from, to });
        const gt = data.grand;
        const pct  = (a) => gt.amount ? Math.round(a/gt.amount*1000)/10 : 0;
        const gm   = (amt, cogs) => amt - cogs;
        const gmp  = (amt, cogs) => amt ? Math.round((amt-cogs)/amt*1000)/10 : 0;
        let html = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Sales by Items Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div>
            <div class="report-sub" style="font-size:11px;color:#94a3b8">All Warehouses · Grouped by Category</div></div>
          <table class="data-table report-table">
            <thead><tr><th></th><th class="num">Qty</th><th class="num">Amount</th>
              <th class="num">% of Sales</th><th class="num">Avg Price</th>
              <th class="num">COGS Amount</th><th class="num">Avg COGS</th>
              <th class="num">Gross Margin</th><th class="num">Gross Margin %</th></tr></thead>
          <tbody>`;
        data.groups.forEach(g => {
          html += `<tr style="background:var(--row-alt);font-weight:600"><td>${UI.escape(g.name)}</td><td colspan="8"></td></tr>`;
          g.categories.forEach(cat => {
            html += `<tr style="background:var(--row-alt2,#f8fafc)"><td style="padding-left:12px;font-style:italic">${UI.escape(cat.name)}</td><td colspan="8"></td></tr>`;
            cat.items.forEach(it => {
              const itCm = gm(it.amount, it.cogs), itCmp = gmp(it.amount, it.cogs);
              const avgP = it.qty ? it.amount/it.qty : 0;
              const avgC = it.qty ? it.cogs/it.qty : 0;
              html += `<tr><td style="padding-left:28px;color:var(--accent);cursor:pointer" class="item-drill" data-item="${UI.escape(it.name)}">${UI.escape(it.name)}</td>
                <td class="num">${it.qty}</td>
                <td class="num">${UI.money(it.amount)}</td>
                <td class="num">${pct(it.amount)} %</td>
                <td class="num">${UI.money(avgP)}</td>
                <td class="num">${UI.money(it.cogs)}</td>
                <td class="num">${UI.money(avgC)}</td>
                <td class="num">${UI.money(itCm)}</td>
                <td class="num">${itCmp}%</td></tr>`;
            });
            const cCm = gm(cat.total.amount, cat.total.cogs), cCmp = gmp(cat.total.amount, cat.total.cogs);
            html += `<tr class="rpt-subtotal"><td style="padding-left:12px">Total ${UI.escape(cat.name)}</td>
              <td class="num">${cat.total.qty.toFixed(2)}</td>
              <td class="num">${UI.money(cat.total.amount)}</td>
              <td class="num">${pct(cat.total.amount)}%</td><td></td>
              <td class="num">${UI.money(cat.total.cogs)}</td><td></td>
              <td class="num">${UI.money(cCm)}</td>
              <td class="num">${cCmp}%</td></tr>`;
          });
          const gCm = gm(g.total.amount, g.total.cogs), gCmp = gmp(g.total.amount, g.total.cogs);
          html += `<tr class="rpt-total"><td>Total ${UI.escape(g.name)}</td>
            <td class="num">${g.total.qty.toFixed(2)}</td>
            <td class="num">${UI.money(g.total.amount)}</td>
            <td class="num">${pct(g.total.amount)}%</td><td></td>
            <td class="num">${UI.money(g.total.cogs)}</td><td></td>
            <td class="num">${UI.money(gCm)}</td>
            <td class="num">${gCmp}%</td></tr>`;
        });
        const totCm = gm(gt.amount, gt.cogs), totCmp = gmp(gt.amount, gt.cogs);
        html += `<tr class="rpt-grand"><td><strong>Grand Total</strong></td>
          <td class="num"><strong>${gt.qty.toFixed(2)}</strong></td>
          <td class="num"><strong>${UI.money(gt.amount)}</strong></td>
          <td class="num">100%</td><td></td>
          <td class="num"><strong>${UI.money(gt.cogs)}</strong></td><td></td>
          <td class="num"><strong>${UI.money(totCm)}</strong></td>
          <td class="num"><strong>${totCmp}%</strong></td></tr>
          </tbody></table></div>`;
        mount.querySelector("#rpt-out").innerHTML = html;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 3. Invoices Summary
Router.register("report-invoices-summary", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Invoices Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportInvoicesSummary", { from, to });
        mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Invoices Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
          <div class="table-wrap"><table class="data-table report-table">
            <thead><tr><th class="num">S#</th><th>Type</th><th>Date</th><th>Num</th><th>Name</th>
              <th class="num">Items Count</th><th class="num">Sale Amount</th>
              <th class="num">COGS Amount</th><th class="num">Income</th></tr></thead>
            <tbody>${data.rows.map((r,i)=>`<tr>
              <td class="num">${i+1}</td>
              <td>${UI.escape(r.type)}</td>
              <td>${UI.escape(UI.date(r.date))}</td>
              <td>${docLink(DOC_DETAIL_ROUTES[r.doc], r.id, r.num)}</td>
              <td>${docLink('report-customer-statement', r.customer_id, r.customer)}</td>
              <td class="num">${r.items_count}</td>
              <td class="num">${UI.money(r.sale_amount)}</td>
              <td class="num">${UI.money(r.cogs_amount)}</td>
              <td class="num">${UI.money(r.income)}</td>
            </tr>`).join("")}
            ${!data.rows.length?`<tr><td colspan="9" style="text-align:center;padding:28px">No transactions in this period.</td></tr>`:""}
            </tbody>
            <tfoot><tr><td colspan="5"><strong>Total (${data.grand_count})</strong></td>
              <td class="num"><strong>${data.total_items}</strong></td>
              <td class="num"><strong>${UI.money(data.total_sale)}</strong></td>
              <td class="num"><strong>${UI.money(data.total_cogs)}</strong></td>
              <td class="num"><strong>${UI.money(data.total_income)}</strong></td>
            </tr></tfoot>
          </table></div></div>`;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 4. Sales by Customers Summary
Router.register("report-sales-customers", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales by Customers Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportSalesByCustomers", { from, to });
        mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Sales by Customers Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
          <table class="data-table report-table">
            <thead><tr><th class="num">S#</th><th>Id</th><th>Name</th><th class="num">Sales Amount</th></tr></thead>
            <tbody>${data.rows.map((r,i)=>`<tr>
              <td class="num">${i+1}</td>
              <td>${UI.escape(r.id||String(i+1))}</td>
              <td>${docLink('report-customer-statement', r.id, r.customer)}</td>
              <td class="num">${UI.money(r.total)}</td>
            </tr>`).join("")}
            ${!data.rows.length?`<tr><td colspan="4" style="text-align:center;padding:28px">No sales in this period.</td></tr>`:""}
            </tbody>
            <tfoot><tr><td colspan="3"><strong>Total</strong></td>
              <td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
          </table></div>`;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 5. Sales By Representative Summary
Router.register("report-sales-rep", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales By Representative Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportSalesByRep", { from, to });
        mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Sales By Representative Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
          <table class="data-table report-table">
            <thead><tr><th class="num">S#</th><th>Representative Name</th><th class="num">Amount</th></tr></thead>
            <tbody>${data.rows.map((r,i)=>`<tr>
              <td class="num">${i+1}</td>
              <td style="color:var(--accent)">${UI.escape(r.rep)}</td>
              <td class="num">${UI.money(r.total)}</td>
            </tr>`).join("")}
            ${!data.rows.length?`<tr><td colspan="3" style="text-align:center;padding:28px">No data in this period.</td></tr>`:""}
            </tbody>
            <tfoot><tr><td colspan="2"><strong>Total</strong></td>
              <td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
          </table></div>`;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 6. Return Stock By Representative Summary
Router.register("report-return-stock-rep", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Return Stock By Representative Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportReturnStockByRep", { from, to });
        const g = data.grand;
        mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Return Stock By Representative Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
          <table class="data-table report-table">
            <thead><tr><th>Item</th>
              <th class="num">Invoiced Qty.</th><th class="num">Invoiced Amount</th>
              <th class="num">Returned Qty.</th><th class="num">Returned Amount</th>
              <th class="num">Balance Qty.</th><th class="num">Balance Amount</th></tr></thead>
            <tbody>${data.rows.map(r=>`<tr>
              <td>${UI.escape(r.name)}</td>
              <td class="num">${r.inv_qty}</td><td class="num">${UI.money(r.inv_amt)}</td>
              <td class="num">${r.ret_qty}</td><td class="num">${UI.money(r.ret_amt)}</td>
              <td class="num">${r.bal_qty}</td><td class="num">${UI.money(r.bal_amt)}</td>
            </tr>`).join("")}
            ${!data.rows.length?`<tr><td colspan="7" style="text-align:center;padding:28px">No stock movements in this period.</td></tr>`:""}
            </tbody>
            <tfoot class="rpt-grand"><tr><td><strong>Grand Total</strong></td>
              <td class="num">${g.inv_qty}</td><td class="num"><strong>${UI.money(g.inv_amt)}</strong></td>
              <td class="num">${g.ret_qty}</td><td class="num"><strong>${UI.money(g.ret_amt)}</strong></td>
              <td class="num">${g.bal_qty}</td><td class="num"><strong>${UI.money(g.bal_amt)}</strong></td>
            </tr></tfoot>
          </table></div>`;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 7. Sales By Salesman Summary
Router.register("report-sales-salesman", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales By Salesman Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportSalesBySalesman", { from, to });
        let html = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Sales By Salesman Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
          <table class="data-table report-table">
            <thead><tr><th>Date</th><th>Transaction No.</th><th>Item Name</th>
              <th class="num">Quantity</th><th class="num">Price</th><th class="num">Amount</th>
              <th class="num">%age</th><th class="num">Commission</th></tr></thead>
          <tbody>`;
        data.salesmen.forEach(s => {
          html += `<tr style="background:var(--row-alt);font-weight:600"><td colspan="8">${UI.escape(s.rep)}</td></tr>`;
          s.lines.forEach(l => {
            html += `<tr>
              <td>${UI.escape(UI.date(l.date))}</td>
              <td>${UI.escape(l.num)}</td>
              <td>${UI.escape(l.item)}</td>
              <td class="num">${l.qty}</td>
              <td class="num">${UI.money(l.price)}</td>
              <td class="num">${UI.money(l.amount)}</td>
              <td class="num">${l.pct}%</td>
              <td class="num">${UI.money(l.commission)}</td>
            </tr>`;
          });
          html += `<tr class="rpt-subtotal">
            <td colspan="5"><strong>Total ${UI.escape(s.rep)}</strong></td>
            <td class="num"><strong>${UI.money(s.total)}</strong></td><td></td>
            <td class="num"><strong>${UI.money(s.commission)}</strong></td></tr>`;
        });
        if (!data.salesmen.length) html += `<tr><td colspan="8" style="text-align:center;padding:28px">No data in this period.</td></tr>`;
        html += `<tr class="rpt-grand"><td colspan="5"><strong>Grand Total</strong></td>
          <td class="num"><strong>${UI.money(data.grand_total)}</strong></td><td></td>
          <td class="num"><strong>${UI.money(data.grand_commission)}</strong></td></tr>
          </tbody></table></div>`;
        mount.querySelector("#rpt-out").innerHTML = html;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 8. Financial Recovery and Sales Performance Summary
Router.register("report-financial-recovery", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Financial Recovery and Sales Performance Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportFinancialRecovery", { from, to });
        const g = data.grand;
        mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Financial Recovery and Sales Performance Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
          <table class="data-table report-table">
            <thead><tr><th>Customer</th><th>CCM Name</th><th>Region</th><th>Area</th>
              <th class="num">Total Sales</th><th class="num">Recovered Credit</th>
              <th class="num">Outstanding Dues</th><th class="num">Collection Efficiency (%)</th></tr></thead>
            <tbody>${data.rows.map(r=>`<tr>
              <td>${UI.escape(r.customer)}</td>
              <td>${UI.escape(r.ccm||"—")}</td>
              <td>${UI.escape(r.region||"")}</td>
              <td>${UI.escape(r.area||"")}</td>
              <td class="num">${UI.money(r.total_sales)}</td>
              <td class="num">${UI.money(r.recovered)}</td>
              <td class="num" style="${r.outstanding>0?'color:var(--bad)':''}">${UI.money(r.outstanding)}</td>
              <td class="num">${r.efficiency}%</td>
            </tr>`).join("")}
            ${!data.rows.length?`<tr><td colspan="8" style="text-align:center;padding:28px">No data in this period.</td></tr>`:""}
            </tbody>
            <tfoot class="rpt-grand"><tr><td colspan="4"><strong>Grand Total</strong></td>
              <td class="num"><strong>${UI.money(g.total_sales)}</strong></td>
              <td class="num"><strong>${UI.money(g.recovered)}</strong></td>
              <td class="num"><strong>${UI.money(g.outstanding)}</strong></td>
              <td class="num"><strong>${g.efficiency}%</strong></td>
            </tr></tfoot>
          </table></div>`;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});

// 9. Invoice Items Summary
Router.register("report-invoice-items", (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const pfx = (window.ABS_CONFIG.COMPANY||{}).invoice_prefix || "INV-";
  mount.innerHTML = `
    <div class="page-head"><h1>Invoice Items Summary</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">From Invoice No.</span>
          <input id="f-inv-from" placeholder="${pfx}1-1"></label>
        <label class="field"><span class="field-label">To Invoice No.</span>
          <input id="f-inv-to" placeholder="${pfx}1-999"></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-sales");
  mount.querySelector("#print-btn").onclick = () => window.print();
  mount.querySelector("#run-btn").onclick = async () => {
    UI.loading(true, "Loading…");
    try {
      const data = await API.call("reportInvoiceItemsSummary", {
        inv_from: mount.querySelector("#f-inv-from").value,
        inv_to:   mount.querySelector("#f-inv-to").value
      });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Invoice Items Summary</div>
          <div class="report-period">From ${UI.escape(mount.querySelector("#f-inv-from").value||"beginning")} to ${UI.escape(mount.querySelector("#f-inv-to").value||"end")} · ${data.invoice_count} invoices</div></div>
        <table class="data-table report-table">
          <thead><tr><th class="num">Sr. No.</th><th>Item</th><th class="num">Total Qty.</th></tr></thead>
          <tbody>${data.rows.map((r,i)=>`<tr>
            <td class="num">${i+1}</td>
            <td>${UI.escape(r.name)}</td>
            <td class="num">${r.qty}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="3" style="text-align:center;padding:28px">No items found for the given invoice range.</td></tr>`:""}
          </tbody>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
});

// 10. Invoice Batch Print
Router.register("report-invoice-batch-print", (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  const pfx = (window.ABS_CONFIG.COMPANY||{}).invoice_prefix || "INV-";
  mount.innerHTML = `
    <div class="page-head"><h1>Invoices Batch Print</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn btn--primary no-print" id="print-btn">${UI.icon("printer")} Print All</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        <label class="field"><span class="field-label">From Invoice No.</span>
          <input id="f-inv-from" placeholder="${pfx}1-1"></label>
        <label class="field"><span class="field-label">To Invoice No.</span>
          <input id="f-inv-to" placeholder="${pfx}1-999"></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">Load Invoices</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-sales");
  mount.querySelector("#print-btn").onclick = () => window.print();
  mount.querySelector("#run-btn").onclick = async () => {
    UI.loading(true, "Loading…");
    try {
      const invoices = await API.call("reportInvoiceBatchPrint", {
        inv_from: mount.querySelector("#f-inv-from").value,
        inv_to:   mount.querySelector("#f-inv-to").value
      });
      mount.querySelector("#rpt-out").innerHTML = invoices.map(inv => `
        <div class="card invoice-doc" style="page-break-after:always;margin-bottom:24px">
          <div class="inv-top">
            <div><div class="inv-co-name">${UI.escape((co&&co.name)||"")}</div>
              <div class="inv-co-meta">${UI.escape((co&&co.address)||"")}</div></div>
            <div class="inv-title"><h2>INVOICE</h2>
              <div class="inv-no">${UI.escape(inv.invoice_no)}</div>
              <div class="inv-date">${UI.escape(UI.date(inv.date))}</div></div>
          </div>
          <div class="inv-billto"><div class="inv-label">BILL TO</div>
            <div class="inv-cust-name">${UI.escape(inv.customer)}</div>
            ${inv.phone?`<div class="inv-co-meta">${UI.escape(inv.phone)}</div>`:""}
          </div>
          <table class="data-table inv-items">
            <thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Total</th></tr></thead>
            <tbody>${(inv.lines||[]).map(l=>`<tr>
              <td>${UI.escape(l.description||"")}</td><td class="num">${l.qty}</td>
              <td class="num">${UI.money(l.unit_price||l.cost)}</td>
              <td class="num">${UI.money(l.line_total)}</td></tr>`).join("")}</tbody>
          </table>
          <div class="inv-totals">
            <div class="totals-line totals-grand"><span>Total</span><span class="num">${UI.money(inv.total)}</span></div>
            <div class="totals-line"><span>Paid</span><span class="num">${UI.money(inv.paid)}</span></div>
            <div class="totals-line" style="color:var(--bad)"><span><strong>Balance Due</strong></span><span class="num"><strong>${UI.money(inv.balance)}</strong></span></div>
          </div>
        </div>`).join("") || `<div class="card"><div class="empty"><p>No invoices found in that range.</p></div></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
});

// 11. Customers Items Sales Summary
Router.register("report-customers-items-sales", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Customers Items Sales Summary",
    (f,t) => salesDateBlock(f,t),
    async () => {
      UI.loading(true, "Loading…");
      try {
        const from = mount.querySelector("#f-from").value;
        const to   = mount.querySelector("#f-to").value;
        const data = await API.call("reportCustomersItemsSales", { from, to });
        const g = data.grand;
        let html = `<div class="card no-print-card">
          <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
            <div class="report-title">Customers Items Sales Summary</div>
            <div class="report-period">${from?UI.date(from)+" — "+UI.date(to):"All Dates"}</div></div>
          <table class="data-table report-table">
            <thead><tr><th>Customer</th><th>Inv. No.</th><th>Date</th><th>Item</th>
              <th class="num">Quantity</th><th class="num">Original Amt.</th>
              <th class="num">Discount %</th><th class="num">Discount Amt.</th>
              <th class="num">Net Amt.</th></tr></thead>
          <tbody>`;
        data.customers.forEach(cust => {
          html += `<tr style="background:var(--accent);color:#fff;font-weight:600"><td colspan="9">${UI.escape(cust.name)}</td></tr>`;
          cust.rows.forEach(r => {
            html += `<tr>
              <td></td>
              <td style="color:var(--accent)">${UI.escape(r.inv_no)}</td>
              <td>${UI.escape(UI.date(r.date))}</td>
              <td>${UI.escape(r.item)}</td>
              <td class="num">${r.qty} ea</td>
              <td class="num">${UI.money(r.orig_amt)}</td>
              <td class="num">${r.disc_pct}%</td>
              <td class="num">${UI.money(r.disc_amt)}</td>
              <td class="num">${UI.money(r.net_amt)}</td>
            </tr>`;
          });
          html += `<tr class="rpt-subtotal"><td colspan="4"><strong>Total ${UI.escape(cust.name)}</strong></td>
            <td class="num"><strong>${cust.total_qty.toFixed(2)}</strong></td>
            <td class="num"><strong>${UI.money(cust.total_orig)}</strong></td>
            <td class="num">${cust.total_orig?Math.round(cust.total_disc_amt/cust.total_orig*1000)/10:0}%</td>
            <td class="num"><strong>${UI.money(cust.total_disc_amt)}</strong></td>
            <td class="num"><strong>${UI.money(cust.total_net)}</strong></td></tr>`;
        });
        if (!data.customers.length) html += `<tr><td colspan="9" style="text-align:center;padding:28px">No data in this period.</td></tr>`;
        html += `<tr class="rpt-grand"><td colspan="4"><strong>Grand Total</strong></td>
          <td class="num"><strong>${g.qty.toFixed(2)}</strong></td>
          <td class="num"><strong>${UI.money(g.orig_amt)}</strong></td>
          <td class="num">0%</td>
          <td class="num"><strong>${UI.money(g.disc_amt)}</strong></td>
          <td class="num"><strong>${UI.money(g.net_amt)}</strong></td></tr>
          </tbody></table></div>`;
        mount.querySelector("#rpt-out").innerHTML = html;
      } catch(e) { UI.toast(e.message, "error"); }
      UI.loading(false);
    }, "reports-sales");
});


/* ===================================================================
   DISCOUNTS REPORTS  (v7.10)
   =================================================================== */

Router.register("reports-discounts", (m) => reportCategoryPage(m, "Discounts"));

Router.register("report-customer-discounts", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Customers Discounts Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportCustomerDiscounts", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Customers Discounts Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Customer</th><th class="num">Transactions</th>
            <th class="num">Total Sales</th><th class="num">Total Discount</th><th class="num">Discount %</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.customer)}</td><td class="num">${r.invoices}</td>
            <td class="num">${UI.money(r.total)}</td>
            <td class="num" style="color:var(--warn)">${UI.money(r.discount)}</td>
            <td class="num">${r.total?Math.round(r.discount/r.total*1000)/10:0}%</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="5" style="text-align:center;padding:28px">No discounts given in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td><strong>Total</strong></td><td></td>
            <td class="num"><strong>${UI.money(data.grand_total)}</strong></td>
            <td class="num" style="color:var(--warn)"><strong>${UI.money(data.grand_discount)}</strong></td>
            <td class="num"><strong>${data.grand_total?Math.round(data.grand_discount/data.grand_total*1000)/10:0}%</strong></td>
          </tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  }, "reports-discounts");
});

Router.register("report-item-discounts", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  let cats = [], brands = [];
  try { cats = await API.list("categories"); } catch(e){}
  try { brands = await API.list("brands"); } catch(e){}
  const catOpts = `<option value="">All Categories</option>${cats.map(c=>`<option value="${UI.escape(String(c.id))}">${UI.escape(c.name)}</option>`).join("")}`;
  const brandOpts = `<option value="">All Brands</option>${brands.map(b=>`<option value="${UI.escape(String(b.id))}">${UI.escape(b.name)}</option>`).join("")}`;
  const def = presetDates("This Month-to-date");
  mount.innerHTML = `
    <div class="page-head"><h1>Items Discounts Summary</h1>
      <div class="page-actions">
        <button class="btn" id="back-btn">← Reports</button>
        <button class="btn no-print" id="print-btn">${UI.icon("printer")} Print</button>
      </div>
    </div>
    <div class="card no-print">
      <div class="form-grid">
        ${salesDateBlock(def.from, def.to)}
        <label class="field"><span class="field-label">Category</span><select id="f-cat">${catOpts}</select></label>
        <label class="field"><span class="field-label">Brand</span><select id="f-brand">${brandOpts}</select></label>
      </div>
      <div style="margin-top:12px"><button class="btn btn--primary" id="run-btn">View</button></div>
    </div>
    <div id="rpt-out"></div>`;
  mount.querySelector("#back-btn").onclick = () => Router.go("reports-discounts");
  mount.querySelector("#print-btn").onclick = () => window.print();
  wireDatePreset(mount);
  const run = async () => {
    UI.loading(true, "Loading…");
    try {
      const data = await API.call("reportItemDiscounts", {
        from: mount.querySelector("#f-from").value, to: mount.querySelector("#f-to").value,
        category: mount.querySelector("#f-cat").value, brand: mount.querySelector("#f-brand").value
      });
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Items Discounts Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Item</th><th>Category</th><th>Brand</th>
            <th class="num">Qty Sold</th><th class="num">Total Sales</th><th class="num">Total Discount</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.category)}</td><td>${UI.escape(r.brand)}</td>
            <td class="num">${r.qty}</td><td class="num">${UI.money(r.total)}</td>
            <td class="num" style="color:var(--warn)">${UI.money(r.discount)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No item discounts found.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="5"><strong>Total Discount</strong></td>
            <td class="num" style="color:var(--warn)"><strong>${UI.money(data.grand_discount)}</strong></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  };
  mount.querySelector("#run-btn").onclick = run;
  run();
});

/* ===================================================================
   SALES ORDERS REPORTS  (v7.10)
   =================================================================== */

Router.register("reports-sales-orders", (m) => reportCategoryPage(m, "Sales Orders"));

Router.register("report-sales-orders-summary", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales Orders Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportSalesOrdersSummary", { from, to });
      const statusBadge = s => {
        const m = {open:'badge--ok',pending:'badge--warn',closed:'badge--bad',cancelled:'badge--bad',approved:'badge--ok'};
        return `<span class="badge ${m[String(s).toLowerCase()]||'badge--warn'}">${UI.escape(s)}</span>`;
      };
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Sales Orders Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)} · ${data.count} orders</div></div>
        <table class="data-table report-table">
          <thead><tr><th>SO No.</th><th>Date</th><th>Customer</th>
            <th>Due Date</th><th class="num">Total</th><th>Status</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.so_no)}</td><td>${UI.escape(UI.date(r.date))}</td>
            <td>${UI.escape(r.customer)}</td><td>${r.due_date?UI.escape(UI.date(r.due_date)):""}</td>
            <td class="num">${UI.money(r.total)}</td><td>${statusBadge(r.status)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No sales orders in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="4"><strong>Total (${data.count})</strong></td>
            <td class="num"><strong>${UI.money(data.grand_total)}</strong></td><td></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  }, "reports-sales-orders");
});

Router.register("report-open-orders", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Open Orders Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportOpenOrders", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Open Orders Summary</div>
          <div class="report-period">${data.count} open orders</div></div>
        <table class="data-table report-table">
          <thead><tr><th>SO No.</th><th>Date</th><th>Customer</th>
            <th class="num">Total</th><th class="num">Days Open</th><th>Status</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.so_no)}</td><td>${UI.escape(UI.date(r.date))}</td>
            <td>${UI.escape(r.customer)}</td><td class="num">${UI.money(r.total)}</td>
            <td class="num" style="${r.days_open>7?'color:var(--bad)':r.days_open>3?'color:var(--warn)':''}">${r.days_open}</td>
            <td><span class="badge badge--warn">${UI.escape(r.status)}</span></td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No open orders found.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total Open Value</strong></td>
            <td class="num"><strong>${UI.money(data.grand_total)}</strong></td><td colspan="2"></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  }, "reports-sales-orders");
});

/* ===================================================================
   MISC. REPORTS  (v7.10)
   =================================================================== */

Router.register("reports-misc", (m) => reportCategoryPage(m, "Misc."));

Router.register("report-deleted-transactions", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Deleted Transactions", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportDeletedTransactions", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Deleted Transactions</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)} · ${data.count} deleted records</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Type</th><th>Number</th><th>Date</th><th>Party</th>
            <th class="num">Total</th><th>Deleted By</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td><span class="badge badge--bad">${UI.escape(r.type)}</span></td>
            <td>${UI.escape(r.number)}</td><td>${UI.escape(UI.date(r.date))}</td>
            <td>${UI.escape(r.party)}</td><td class="num">${UI.money(r.total)}</td>
            <td>${UI.escape(r.deleted_by)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No deleted transactions in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="4"><strong>Total Value Deleted (${data.count})</strong></td>
            <td class="num"><strong>${UI.money(data.total_value)}</strong></td><td></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  }, "reports-misc");
});

Router.register("report-updated-transactions", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Updated Transactions", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportUpdatedTransactions", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Updated Transactions</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)} · ${data.count} transactions</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Type</th><th>Number</th><th>Date</th><th>Party</th>
            <th class="num">Total</th><th>Status</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.type)}</td><td>${UI.escape(r.number)}</td>
            <td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.party)}</td>
            <td class="num">${UI.money(r.total)}</td>
            <td><span class="badge badge--ok">${UI.escape(r.status)}</span></td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No transactions in this period.</td></tr>`:""}
          </tbody>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  }, "reports-misc");
});
