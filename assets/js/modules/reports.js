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
const DATE_PRESETS = ["Today","This Week","This Month","This Month-to-date","This Quarter","This Year","Last Week","Last Month","Last Quarter","Last Year","Custom"];

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

function reportScreen(mount, cfg) {
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
    const d = presetDates(this.value);
    if (isRange) { mount.querySelector("#rpt-from").value = d.from; mount.querySelector("#rpt-to").value = d.to; }
    else { mount.querySelector("#rpt-asof").value = d.to; }
  };

  async function run() {
    if (isRange) { from = mount.querySelector("#rpt-from").value; to = mount.querySelector("#rpt-to").value; }
    else { to = mount.querySelector("#rpt-asof").value; from = to; }
    const extra = cfg.gatherExtra ? cfg.gatherExtra(mount) : {};
    UI.loading(true, "Generating report…");
    try {
      const data = await API.call(cfg.action, Object.assign({ from, to }, extra));
      mount.querySelector("#rpt-print").style.display = "";
      mount.querySelector("#rpt-out").innerHTML = cfg.render(data, { from, to, co, extra });
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
    const section = (label, rows, cls) => rows.length ? `
      <tr class="rpt-section"><td colspan="2">${UI.escape(label)}</td></tr>
      ${rows.map(r=>`<tr><td style="padding-left:28px">${UI.escape(r.name)}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
      <tr class="rpt-subtotal"><td>Total ${UI.escape(label)}</td><td class="num">${UI.money(rows.reduce((s,r)=>s+r.balance,0))}</td></tr>` : "";
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Profit and Loss Standard</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table" style="max-width:520px;margin:auto">
        <thead><tr><th>Account</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${section("Income", data.income||[])}
          ${section("Cost of Goods Sold", data.cogs||[])}
          ${data.gross!==undefined?`<tr class="rpt-total"><td><strong>Gross Profit</strong></td><td class="num"><strong>${UI.money(data.gross)}</strong></td></tr>`:""}
          ${section("Expenses", data.expenses||[])}
          <tr class="rpt-grand"><td><strong>Net Income</strong></td><td class="num"><strong>${UI.money(data.net||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-balance-sheet", (m) => reportScreen(m, {
  title: "Balance Sheet Standard", action: "reportBalanceSheet", mode: "asof",
  render(data, {to, co}) {
    const section = (label, rows) => rows&&rows.length ? `
      <tr class="rpt-section"><td colspan="2">${UI.escape(label)}</td></tr>
      ${rows.map(r=>`<tr><td style="padding-left:28px">${UI.escape(r.name)}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
      <tr class="rpt-subtotal"><td>Total ${UI.escape(label)}</td><td class="num">${UI.money(rows.reduce((s,r)=>s+r.balance,0))}</td></tr>` : "";
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Balance Sheet</div><div class="report-period">As of ${UI.date(to)}</div></div>
      <table class="data-table report-table" style="max-width:520px;margin:auto">
        <thead><tr><th>Account</th><th class="num">Balance</th></tr></thead>
        <tbody>
          <tr class="rpt-section"><td colspan="2"><strong>Assets</strong></td></tr>
          ${section("Current Assets", data.current_assets)}
          ${section("Fixed Assets", data.fixed_assets)}
          ${section("Other Assets", data.other_assets)}
          <tr class="rpt-total"><td><strong>Total Assets</strong></td><td class="num"><strong>${UI.money(data.total_assets||0)}</strong></td></tr>
          <tr class="rpt-section"><td colspan="2"><strong>Liabilities & Equity</strong></td></tr>
          ${section("Current Liabilities", data.current_liab)}
          ${section("Long-term Liabilities", data.longterm_liab)}
          ${section("Equity", data.equity)}
          <tr class="rpt-grand"><td><strong>Total Liabilities & Equity</strong></td><td class="num"><strong>${UI.money(data.total_liab_equity||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
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
          ${(data.rows||[]).map(r=>`<tr><td>${UI.escape(r.name)}</td><td>${UI.escape(r.type)}</td>
            <td class="num">${r.debit?UI.money(r.debit):""}</td><td class="num">${r.credit?UI.money(r.credit):""}</td></tr>`).join("")}
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
          ${(data.rows||[]).map(r=>`<tr><td>${UI.escape(r.customer)}</td><td class="num">${UI.money(r.total)}</td></tr>`).join("")}
          <tr class="rpt-grand"><td><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total||0)}</strong></td></tr>
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
          ${(data.rows||[]).map(r=>`<tr><td>${UI.escape(r.type)}</td><td class="num">${r.count}</td><td class="num">${UI.money(r.total)}</td></tr>`).join("")}
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
  render(data, {to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Customer Balance Summary</div><div class="report-period">As of ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Customer</th><th class="num">Invoiced</th><th class="num">Paid</th><th class="num">Balance</th></tr></thead>
        <tbody>
          ${(data.rows||[]).map(r=>`<tr><td>${UI.escape(r.customer)}</td><td class="num">${UI.money(r.invoiced)}</td>
            <td class="num">${UI.money(r.paid)}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
          <tr class="rpt-grand"><td><strong>Total</strong></td><td class="num"><strong>${UI.money(data.total_invoiced||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_paid||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_balance||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
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
          ${(data.rows||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.customer)}</td>
            <td>${UI.escape(r.method||"")}</td><td class="num">${UI.money(r.amount)}</td></tr>`).join("")}
          <tr class="rpt-grand"><td colspan="3"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-customer-statement", (m) => reportScreen(m, {
  title: "Customer Statement", action: "reportCustomerStatement", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Customer</span>
    <select id="rpt-customer"><option value="">All Customers</option></select></label>`,
  gatherExtra(mount) { return { customer_id: mount.querySelector("#rpt-customer").value }; },
  async init(mount) {
    const custs = await API.list("customers");
    const sel = mount.querySelector("#rpt-customer");
    custs.forEach(c => sel.add(new Option(c.name, c.id)));
  },
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Customer Statement</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Type</th><th>Number</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
        <tbody>${(data.rows||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.type)}</td>
          <td>${UI.escape(r.number||"")}</td><td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-account-statement", (m) => reportScreen(m, {
  title: "Account Statement", action: "reportAccountStatement", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Account</span>
    <select id="rpt-account"><option value="">All Accounts</option></select></label>`,
  gatherExtra(mount) { return { account_id: mount.querySelector("#rpt-account").value }; },
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Account Statement</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Description</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
        <tbody>${(data.rows||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.description||"")}</td>
          <td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td>
          <td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
        </tbody>
      </table></div>`;
  }
}));

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
          ${(data.rows||[]).map(r=>`<tr><td>${UI.escape(r.supplier)}</td><td class="num">${UI.money(r.billed)}</td>
            <td class="num">${UI.money(r.paid)}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
          <tr class="rpt-grand"><td><strong>Total</strong></td><td class="num"><strong>${UI.money(data.total_billed||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_paid||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_balance||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-supplier-statement", (m) => reportScreen(m, {
  title: "Supplier Statement", action: "reportSupplierStatement", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Supplier</span>
    <select id="rpt-supplier"><option value="">All Suppliers</option></select></label>`,
  gatherExtra(mount) { return { supplier_id: mount.querySelector("#rpt-supplier").value }; },
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">Supplier Statement</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      <table class="data-table report-table">
        <thead><tr><th>Date</th><th>Type</th><th>Number</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
        <tbody>${(data.rows||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.type)}</td>
          <td>${UI.escape(r.number||"")}</td><td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td><td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
        </tbody>
      </table></div>`;
  }
}));

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
        <tbody>${(data.rows||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.account)}</td>
          <td>${UI.escape(r.memo||"")}</td>
          <td class="num">${r.debit?UI.money(r.debit):""}</td>
          <td class="num">${r.credit?UI.money(r.credit):""}</td></tr>`).join("")}
          <tr class="rpt-grand"><td colspan="3"><strong>Total</strong></td>
            <td class="num"><strong>${UI.money(data.total_debit||0)}</strong></td>
            <td class="num"><strong>${UI.money(data.total_credit||0)}</strong></td></tr>
        </tbody>
      </table></div>`;
  }
}));

Router.register("report-general-ledger", (m) => reportScreen(m, {
  title: "General Ledger", action: "reportGeneralLedger", mode: "range",
  extraFilters: `<label class="field"><span class="field-label">Account</span>
    <select id="rpt-gl-acct"><option value="">All Accounts</option></select></label>`,
  gatherExtra(mount) { return { account_id: mount.querySelector("#rpt-gl-acct").value }; },
  render(data, {from, to, co}) {
    return `<div class="card report-doc no-print-card">
      <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
        <div class="report-title">General Ledger</div>
        <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
      ${(data.accounts||[]).map(acct => `
        <div style="margin-bottom:24px">
          <h3 class="gl-acct" style="margin:0 0 8px;font-size:14px;color:#334155">${UI.escape(acct.name)} <span style="color:#94a3b8;font-weight:400">${UI.escape(acct.type)}</span></h3>
          <table class="data-table report-table">
            <thead><tr><th>Date</th><th>Memo</th><th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
            <tbody>${(acct.rows||[]).map(r=>`<tr><td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.memo||"")}</td>
              <td class="num">${r.debit?UI.money(r.debit):""}</td><td class="num">${r.credit?UI.money(r.credit):""}</td>
              <td class="num">${UI.money(r.balance)}</td></tr>`).join("")}
              <tr class="rpt-subtotal"><td colspan="4"><strong>Closing Balance</strong></td>
                <td class="num"><strong>${UI.money(acct.closing_balance)}</strong></td></tr>
            </tbody>
          </table>
        </div>`).join("")}
      </div>`;
  }
}));

/* ===================================================================
   INVENTORY REPORTS  (7 subtabs)
   =================================================================== */

// Shared filter helper for inventory reports
async function invFilters(mount, opts) {
  opts = opts || {};
  let warehouses = [], categories = [], suppliers = [];
  try { warehouses = await API.list("warehouses"); } catch(e){}
  try { categories = await API.list("categories"); } catch(e){}
  if (opts.vendors) { try { suppliers = await API.list("suppliers"); } catch(e){} }
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
      const rows = await API.call("reportInventoryOnhand", { warehouse: mount.querySelector("#f-wh").value, category: mount.querySelector("#f-cat").value });
      const statusBadge = s => s==="Out"?'<span class="badge badge--bad">Out</span>':s==="Low"?'<span class="badge badge--warn">Low</span>':'<span class="badge badge--ok">OK</span>';
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Quantity On-hand by Warehouse</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Item</th><th>SKU</th><th>Category</th><th class="num">On Hand</th><th class="num">Reorder</th><th>Status</th></tr></thead>
          <tbody>${rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.sku)}</td><td>${UI.escape(r.category)}</td>
            <td class="num">${r.on_hand}</td><td class="num">${r.reorder}</td><td>${statusBadge(r.status)}</td>
          </tr>`).join("")}
          ${!rows.length?`<tr><td colspan="6" class="empty" style="text-align:center;padding:28px">No items found.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total Items: ${rows.length}</strong></td>
            <td class="num"><strong>${rows.reduce((s,r)=>s+r.on_hand,0)}</strong></td><td colspan="2"></td></tr></tfoot>
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
  const { catOpts } = await invFilters(mount);
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
        <label class="field"><span class="field-label">From Date</span><input type="date" id="f-from" value="${def.from}"></label>
        <label class="field"><span class="field-label">To Date</span><input type="date" id="f-to" value="${def.to}"></label>
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
      const rows = await API.call("reportInventoryMovement", {
        from: mount.querySelector("#f-from").value, to: mount.querySelector("#f-to").value,
        category: mount.querySelector("#f-cat").value
      });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Inventory Movement Summary</div>
          <div class="report-period">${UI.date(mount.querySelector("#f-from").value)} — ${UI.date(mount.querySelector("#f-to").value)}</div></div>
        <div class="table-wrap"><table class="data-table report-table">
          <thead><tr><th>Item</th><th>SKU</th><th>Category</th>
            <th class="num">Opening</th><th class="num">In</th><th class="num">Out</th><th class="num">Closing</th></tr></thead>
          <tbody>${rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.sku)}</td><td>${UI.escape(r.category)}</td>
            <td class="num">${r.opening}</td><td class="num" style="color:var(--ok)">${r.in_qty}</td>
            <td class="num" style="color:var(--bad)">${r.out_qty}</td>
            <td class="num"><strong>${r.closing}</strong></td>
          </tr>`).join("")}
          ${!rows.length?`<tr><td colspan="7" style="text-align:center;padding:28px">No movements in this period.</td></tr>`:""}
          </tbody>
        </table></div></div>`;
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

Router.register("reports-sales", (m) => reportCategoryPage(m, "Sales"));

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
  salesReportPage(mount, "Sales by Category Summary", (f,t) => salesDateBlock(f,t) + `
    <label class="field"><span class="field-label">Warehouse</span>
      <select id="f-wh"><option value="">All Warehouses</option></select></label>`,
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportSalesByCategory", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Sales by Category Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Category</th><th class="num">Qty Sold</th><th class="num">Total Sales</th><th class="num">%</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.category)}</td><td class="num">${r.qty}</td>
            <td class="num">${UI.money(r.total)}</td>
            <td class="num">${data.grand_total?Math.round(r.total/data.grand_total*1000)/10:0}%</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="4" style="text-align:center;padding:28px">No sales data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td><strong>Total</strong></td><td></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td><td class="num">100%</td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});

// 2. Sales by Items Summary
Router.register("report-sales-items", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales by Items Summary", (f,t) => salesDateBlock(f,t) + `
    <label class="field"><span class="field-label">Warehouse</span>
      <select id="f-wh"><option value="">All Warehouses</option></select></label>`,
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportSalesByItems", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Sales by Items Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Item</th><th>Category</th><th class="num">Qty Sold</th><th class="num">Total Sales</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td>${UI.escape(r.category)}</td>
            <td class="num">${r.qty}</td><td class="num">${UI.money(r.total)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="4" style="text-align:center;padding:28px">No sales data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});

// 3. Invoices Summary
Router.register("report-invoices-summary", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  let reps = [];
  try { reps = await API.list("sales-representatives"); } catch(e){}
  const repOpts = `<option value="">All</option>${reps.map(r=>`<option value="${UI.escape(String(r.id))}">${UI.escape(r.name)}</option>`).join("")}`;
  salesReportPage(mount, "Invoices Summary", (f,t) => salesDateBlock(f,t) + `
    <label class="field"><span class="field-label">Sales Representative</span>
      <select id="f-rep">${repOpts}</select></label>
    <label class="field"><span class="field-label">Customer Type</span>
      <select id="f-ctype"><option value="">All</option><option>Local</option><option>Online</option></select></label>`,
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportInvoicesSummary", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Invoices Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px">${data.grand_count} invoices</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Invoice No.</th><th>Date</th><th>Customer</th>
            <th class="num">Total</th><th class="num">Paid</th><th class="num">Balance</th><th>Status</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td><a class="link-btn" style="padding:0" onclick="Router.go('invoice-detail?id='+${JSON.stringify(r.id||'')})">${UI.escape(r.invoice_no)}</a></td>
            <td>${UI.escape(UI.date(r.date))}</td><td>${UI.escape(r.customer)}</td>
            <td class="num">${UI.money(r.total)}</td><td class="num">${UI.money(r.paid)}</td>
            <td class="num" style="${r.balance>0?'color:var(--bad)':''}">${UI.money(r.balance)}</td>
            <td>${Sales&&Sales.statusBadge?Sales.statusBadge(r.status):UI.escape(r.status)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="7" style="text-align:center;padding:28px">No invoices in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total (${data.grand_count})</strong></td>
            <td class="num"><strong>${UI.money(data.grand_total)}</strong></td><td></td><td></td><td></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});

// 4. Sales by Customers Summary
Router.register("report-sales-customers", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  let stores = [];
  try { stores = await API.list("stores"); } catch(e){}
  const storeOpts = `<option value="">All Stores</option>${stores.map(s=>`<option value="${UI.escape(String(s.id))}">${UI.escape(s.name||s.store_name||'')}</option>`).join("")}`;
  salesReportPage(mount, "Sales by Customers Summary", (f,t) => salesDateBlock(f,t) + `
    <label class="field"><span class="field-label">Customer Type</span>
      <select id="f-ctype"><option value="">All</option><option>Local</option><option>Online</option></select></label>
    <label class="field"><span class="field-label">Store</span><select id="f-store">${storeOpts}</select></label>`,
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportSalesByCustomers", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Sales by Customers Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Customer</th><th class="num">Invoices</th><th class="num">Receipts</th>
            <th class="num">Total Sales</th><th class="num">Paid</th><th class="num">Balance</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.customer)}</td><td class="num">${r.invoices}</td><td class="num">${r.receipts}</td>
            <td class="num">${UI.money(r.total)}</td><td class="num">${UI.money(r.paid)}</td>
            <td class="num" style="${r.balance>0?'color:var(--bad)':''}">${UI.money(r.balance)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="6" style="text-align:center;padding:28px">No data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td><td></td><td></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});

// 5. Sales By Representative Summary
Router.register("report-sales-rep", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales By Representative Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportSalesByRep", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Sales By Representative Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Sales Representative</th><th class="num">Invoice Count</th><th class="num">Total Sales</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.rep)}</td><td class="num">${r.count}</td><td class="num">${UI.money(r.total)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="3" style="text-align:center;padding:28px">No data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="2"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});

// 6. Return Stock By Representative Summary
Router.register("report-return-stock-rep", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Return Stock By Representative Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportReturnStockByRep", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Return Stock By Representative Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Sales Representative</th><th class="num">Returns Count</th><th class="num">Total Returned</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.rep)}</td><td class="num">${r.count}</td><td class="num">${UI.money(r.total)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="3" style="text-align:center;padding:28px">No return data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="2"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});

// 7. Sales By Salesman Summary
Router.register("report-sales-salesman", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Sales By Salesman Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportSalesBySalesman", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Sales By Salesman Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Salesman</th><th class="num">Invoice Count</th><th class="num">Total Sales</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.rep)}</td><td class="num">${r.count}</td><td class="num">${UI.money(r.total)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="3" style="text-align:center;padding:28px">No data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="2"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});

// 8. Financial Recovery and Sales Performance Summary
Router.register("report-financial-recovery", async (mount) => {
  const co = window.ABS_CONFIG.COMPANY || {};
  salesReportPage(mount, "Financial Recovery and Sales Performance Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportFinancialRecovery", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Financial Recovery and Sales Performance Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-top:16px">
          ${[
            {label:"Total Invoiced",val:UI.money(data.invoiced),color:"var(--text)"},
            {label:"Total Collected",val:UI.money(data.collected),color:"var(--ok)"},
            {label:"Outstanding",val:UI.money(data.outstanding),color:"var(--bad)"},
            {label:"Recovery Rate",val:data.recovery_rate+"%",color:"var(--accent)"}
          ].map(k=>`<div class="card" style="padding:18px;text-align:center">
            <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${UI.escape(k.label)}</div>
            <div style="font-size:26px;font-weight:700;color:${k.color};font-family:'IBM Plex Mono',monospace">${k.val}</div>
          </div>`).join("")}
        </div></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
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
          <input id="f-inv-from" placeholder="${pfx}1"></label>
        <label class="field"><span class="field-label">To Invoice No.</span>
          <input id="f-inv-to" placeholder="${pfx}999"></label>
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
          <div class="report-period">${data.invoice_count} invoices included</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Item</th><th class="num">Qty Sold</th><th class="num">Customers</th><th class="num">Total Sales</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.name)}</td><td class="num">${r.qty}</td>
            <td class="num">${r.cust_count}</td><td class="num">${UI.money(r.total)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="4" style="text-align:center;padding:28px">No items found for the given invoice range.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
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
          <input id="f-inv-from" placeholder="${pfx}1"></label>
        <label class="field"><span class="field-label">To Invoice No.</span>
          <input id="f-inv-to" placeholder="${pfx}999"></label>
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
            <tbody>${inv.lines.map(l=>`<tr>
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
  salesReportPage(mount, "Customers Items Sales Summary", (f,t) => salesDateBlock(f,t),
  async () => {
    UI.loading(true, "Loading…");
    try {
      const from = mount.querySelector("#f-from").value, to = mount.querySelector("#f-to").value;
      const data = await API.call("reportCustomersItemsSales", { from, to });
      mount.querySelector("#rpt-out").innerHTML = `<div class="card no-print-card">
        <div class="report-head"><div class="report-co">${UI.escape((co&&co.name)||"")}</div>
          <div class="report-title">Customers Items Sales Summary</div>
          <div class="report-period">${UI.date(from)} — ${UI.date(to)}</div></div>
        <table class="data-table report-table">
          <thead><tr><th>Customer</th><th>Item</th><th class="num">Qty</th><th class="num">Total</th></tr></thead>
          <tbody>${data.rows.map(r=>`<tr>
            <td>${UI.escape(r.customer)}</td><td>${UI.escape(r.item)}</td>
            <td class="num">${r.qty}</td><td class="num">${UI.money(r.total)}</td>
          </tr>`).join("")}
          ${!data.rows.length?`<tr><td colspan="4" style="text-align:center;padding:28px">No data in this period.</td></tr>`:""}
          </tbody>
          <tfoot><tr><td colspan="3"><strong>Total</strong></td><td class="num"><strong>${UI.money(data.grand_total)}</strong></td></tr></tfoot>
        </table></div>`;
    } catch(e) { UI.toast(e.message, "error"); }
    UI.loading(false);
  });
});
