# Hashir Hub — Instructions for Claude

## What this project is
Multi-company ERP/invoicing/accounting SaaS. Static HTML/CSS/JS frontend on
GitHub Pages (hashirhub.uk, Cloudflare DNS/SSL). Google Apps Script + Google
Sheets backend **per client company**. White-labelled for multiple businesses.

Owner: Yasar — GitHub account `hashirhub-uk`, repo `hashirhub-uk.github.io`.
Project Gmail: yasir.visal@gmail.com

Two active companies:
- **Adil Business Solutions (ABS)**  
  `https://script.google.com/macros/s/AKfycbz7tHSyERDRNsCHr4Jh9Z7T0dW7UpEyDfBNvYkIbZUBNLVbhsYG1TBMaL6Z3iQ3ykhF/exec`
- **Trial Client**  
  `https://script.google.com/macros/s/AKfycbzyHzuvywemna2dL8J2rRLr-FTGcIb-vnIult3qADeLbagsF-jZr1O-e81EdYEbuyOf1g/exec`

---

## File structure
```
index.html                         app shell entry point
assets/
  css/app.css                      all styling + print scaffold
  images/
    hashir-hub-icon.png            sidebar icon (96×86, transparent PNG)
    hashir-hub-lockup.png          login screen logo (480×175, transparent PNG)
  js/
    config.js      ← VERSION lives here, bump on every build
    companies.js   ← NEVER include in ZIPs (see rules below)
    api.js         Session + API.call
    router.js      hash router
    ui.js          shared helpers (icons, toasts, money formatting)
    app.js         login screen + app chrome + sidebar
    crud.js        generic list/form/edit screen builder
    modules/
      dashboard.js
      items.js
      master-data.js   customers, suppliers, categories, brands, etc.
      operations.js    invoices, sales receipts, payments, record deposit
      purchasing.js    purchase orders, bills
      sales.js         sales orders, quotations, credit memos
      accounts.js      chart of accounts, journal, ledger, deposits
      reports.js       all report screens
      settings.js      company info, appearance, users
backend/
  Code.gs          Google Apps Script API (one deployment per company)
docs/
  CLAUDE_INSTRUCTIONS.md   ← this file
  Adil-Business-Solutions-Blueprint.md
```

---

## Non-negotiable rules — follow every single time

### 1. companies.js is NEVER in a ZIP
The file `assets/js/companies.js` must **never** be included in any ZIP delivered
to the user. It is maintained manually on GitHub and contains the live company
URLs. Including it in a ZIP will overwrite it and break the company selector.
After building a site folder, always run: `rm -f site_folder/assets/js/companies.js`

### 2. Always use `dayKey_()` for date comparisons in Code.gs
Google Sheets can return date cells as Date objects, not strings.
`String(date).slice(0,10)` gives `'Thu Jun 23'` for a Date object — comparisons break.
Always use `dayKey_(date)` which handles both. It already exists in Code.gs.

```javascript
// WRONG
var d = String(r.date || '').slice(0, 10);

// CORRECT
var d = dayKey_(r.date);
```

### 3. Never download GitHub Code.gs and then deliver it as a fix
When making a Code.gs fix: always start from the **outputs/Code.gs** that was
last delivered to the user (or download from GitHub and verify fixes are present
before overlaying). Multiple times, downloading fresh from GitHub has silently
lost dashboard and date fixes that were only delivered as standalone files.
Before delivering any Code.gs: grep for `ALWAYS_SHOW`, `daysBack_`, `keepAlive`
to confirm current fixes are present.

### 4. Whitelist (not blacklist) for Account Balances dashboard
The dashboard Account Balances section uses a strict whitelist in `dashboardExtra_()`.
Do NOT revert to blacklist approach. The rule is:

```javascript
var ALWAYS_SHOW     = ['ar', 'ap', 'cash', 'undeposited'];
var MANUAL_OK_TYPES = ['Bank', 'Accounts Receivable', 'Accounts Payable'];
// show if system_key in ALWAYS_SHOW
// OR if system_key is '' and account_type in MANUAL_OK_TYPES
// block everything else
```

### 5. No guesswork — always read the actual code first
Before changing any function, read it from GitHub or the outputs folder.
Never assume what a function does. The user will call this out.

### 6. Bump VERSION in config.js on every frontend build
`VERSION: "7.XX"` in `assets/js/config.js` — increment by 0.1 each build.
Also bump `?v=7.XX` in `index.html` for all asset URLs.

### 7. migrate() only when adding new schema tables/columns
`migrate()` = run when SCHEMA changes (new table or new column).
`resetAdmin()` = resets admin password to `admin123`.
`resetAllTransactions()` = clears all transaction data, keeps reference data.
`installKeepAlive()` = run once per company, sets 10-min ping trigger.

### 8. Check syntax before delivering
Always run: `node -e "const fs=require('fs'),c=fs.readFileSync('FILE','utf8');try{new Function(c);console.log('OK')}catch(e){console.log('ERROR:',e.message)}"`

---

## Deployment workflow (tell the user every time)

### Backend (do for each company)
1. Open the company's Google Sheet → Extensions → Apps Script
2. Select all → Delete → Paste new `Code.gs` → Ctrl+S to save
3. Deploy → Manage deployments → ✏️ → New version → Deploy
4. Run `installKeepAlive()` once if it's a new company or hasn't been set up

### Frontend
1. Extract ZIP → open the `siteXXX` folder inside
2. GitHub → `hashirhub-uk.github.io` → Add file → Upload files
3. Drag **contents** of `siteXXX` (not the folder itself) → Commit changes
4. Cloudflare → hashirhub.uk → Caching → Configuration → **Purge Everything**

### When only Code.gs changes (no ZIP needed)
Just paste into Apps Script → Save → deploy as new version. No upload to GitHub,
no Cloudflare purge required.

---

## Key architecture decisions

**Accounting:** Double-entry via Journal sheet. COGS posted at time of sale using
item's current WAC (Weighted Average Cost). Sales Receipts route through
Undeposited Funds → Deposits.

**WAC:** When a bill is saved, `writeBillLines_()` reads qty on hand BEFORE
creating the StockMovement, then computes:
`WAC = (currentQty × currentCost + receivedQty × newCost) / (currentQty + receivedQty)`

**Multi-company:** `companies.js` holds the array. Login shows a dropdown when
>1 company. Each company is a separate Google Sheet + Apps Script deployment.

**Passwords:** SHA-256 of `username:password`. Never plain text in sheet.

**Date handling:** ALL date comparisons in Code.gs must use `dayKey_()`.

**buildSalesIndex_():** Must be called at the start of every sales report function
to build O(1) lookup indexes. Never use nested filter loops — they time out.

---

## Current version: 7.18
Last build included: daily line charts on dashboard, account balances whitelist,
keep-alive trigger, sales report comprehensive rewrite (all 11 reports), inventory
movement summary Diyar-style, item list 3 prices + qty on hand, inDateRange_ date
fix, account/customer drilldowns on reports, P&L zero-rows + clickable accounts,
journal entry dependent dropdowns, comprehensive reset function.

---

## Schema quick reference (key tables)
```
Items:          id, sku, name, category_id, brand_id, cost_price, regular_price,
                wholesale_price, cogs_account_id, income_account_id, asset_account_id,
                opening_qty, commission, reorder_level, status, ...
Invoices:       id, invoice_no, date, customer_id, subtotal, discount, tax,
                total, paid, balance, status, notes, created_by, ...
InvoiceItems:   id, invoice_id, item_id, description, qty, unit_price, discount, line_total
SalesReceipts:  id, receipt_no, date, customer_id, customer_name, subtotal,
                discount, tax, total, paid, balance, status, sales_rep, ...
SalesReceiptItems: id, receipt_id, item_id, description, qty, unit_price, discount, line_total
Payments:       id, date, customer_id, invoice_id, amount, method, reference,
                notes, is_deposited, deposit_id, receipt_id
Bills:          id, bill_no, bill_type, date, supplier_id, total, paid, balance, status, ...
BillItems:      id, bill_id, item_id, description, qty, multiplier, cost, line_total
StockMovements: id, date, item_id, type(in/out), qty, reference_type, reference_id
Journal:        id, entry_no, date, account_id, debit, credit, memo,
                source_type, source_id, created_by
Accounts:       id, account_number, account_name, account_type, system_key,
                is_active, parent_id
Customers:      id, name, phone, email, address, area_id, type, sales_rep_id, ...
Suppliers:      id, name, phone, email, address, ...
```

## System account keys
`bank`, `ar`, `undeposited`, `cogs`, `inventory`, `ap`, `sales`,
`sales_discount`, `pos_drawer`, `ob_equity`, `sales_tax`, `cash`

## StockMovements reference_types
`opening`, `bill`, `invoice`, `receipt`, `adjustment`, `transfer`
