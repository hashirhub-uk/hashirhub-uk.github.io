# Adil Business Solutions — Architecture Notes

*A multi-company invoicing, inventory, and accounting system. Static front-end
hosted on GitHub Pages, Google Sheets backend via Google Apps Script.*

## Goals

- Run invoicing, inventory, and full double-entry accounting for multiple
  companies from one shared codebase, each with its own private data.
- Keep hosting cost near zero by using GitHub Pages + Google Sheets instead of
  a traditional server and database.
- Make onboarding a new client a content change (one Apps Script deployment +
  one row in a company list), not a code change.
- Keep a clean separation between front-end and backend so the backend can be
  swapped for a real database later without rewriting the UI.

## Architecture

- **Front-end:** a single-page app using hash routing (`#home`, `#invoices`,
  `#new-invoice`, `#customers`, …). Clicking a menu item loads that screen into
  a content area without a full page reload.
- **Backend:** Google Apps Script exposed as a Web App, one deployment per
  company. All requests go through a single `doPost` JSON API; the front-end
  never talks to the Sheet directly.
- **Database:** a Google Sheet per company, with one tab per entity (Items,
  Customers, Invoices, Accounts, Journal, etc.). `migrate()` creates any
  missing tabs and seeds default data.
- **Multi-company:** `assets/js/companies.js` lists every company by name and
  Web App URL. The login screen shows a picker when there's more than one.

| Layer | Choice | Why |
|---|---|---|
| Markup/layout | Plain HTML5 + custom CSS | No build step, fast to iterate |
| Hosting | GitHub Pages + Cloudflare | Free, simple DNS/CDN/cache control |
| Backend | Google Apps Script | Free, no server to maintain |
| Database | Google Sheets | Free, human-readable, easy manual fixes |

## What's built

Multi-company login, full inventory (items, categories, brands, warehouses,
price manager, alerts), sales (invoices, sales receipts, quotations, sales
orders, credit memos), purchasing (purchase orders, bills), full double-entry
accounting (chart of accounts, general journal, trial balance, balance sheet,
profit & loss, general ledger), and the complete report suite (financial,
receivables, payables, inventory, purchases, sales, discounts, sales orders,
deleted/updated transactions).

## On the horizon

- Replacing the company dropdown with a per-client link (`?co=slug`) backed by
  a small company directory, so adding client #51 doesn't require touching the
  front-end at all.
- A real domain + database backend once Apps Script's quotas become a
  bottleneck — the API-only front-end design means this swap shouldn't require
  rewriting the UI.
