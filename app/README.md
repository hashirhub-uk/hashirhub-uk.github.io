# Adil Business Solutions

A multi-company invoicing, inventory, and accounting system. Static front-end hosted
on GitHub Pages, with a Google Sheets backend powered by Google Apps Script — no
server or database to maintain.

## Structure

```
index.html              app shell entry point
assets/
  css/app.css           application theme + print scaffold
  js/
    config.js           branding, menu structure, app version    ← edit this
    companies.js         company directory shown at login         ← edit this
    api.js               the only module that talks to the backend
    router.js            hash routing
    ui.js                shared helpers (icons, toasts, formatting)
    app.js               bootstrap: login screen / app chrome
    crud.js               generic create/read/update/delete helpers
    modules/
      dashboard.js        dashboard + KPI cards
      items.js             item catalog, search, price manager
      master-data.js       customers, suppliers, categories, brands, etc.
      operations.js        invoices, sales receipts, payments
      purchasing.js         purchase orders, bills
      sales.js              sales orders, quotations, credit memos
      accounts.js            chart of accounts, journal, ledger
      reports.js             all report screens
      settings.js             company information, appearance, users
backend/
  Code.gs               Google Apps Script: setup, migration, and the JSON API
docs/
  SETUP.md              step-by-step deployment guide
  Adil-Business-Solutions-Blueprint.md   architecture & design notes
```

## Multi-company

Each client gets their own Google Sheet + Apps Script deployment (their own private
database and backend URL). The `assets/js/companies.js` file lists every company by
name and Web App URL, and the login screen shows a company picker whenever there is
more than one entry.

## Onboarding a new client

1. Create a new Google Sheet
2. Extensions → Apps Script → paste `backend/Code.gs` → run `migrate()` → run `resetAdmin()`
3. Deploy as a Web App (access: Anyone) and copy the `/exec` URL
4. Add an entry to `assets/js/companies.js` with their name and URL
5. Upload the updated file to GitHub

## Notes

- No build step — plain HTML/CSS/JS, edit and push.
- The front-end never touches the Sheet directly; it only calls the API in `api.js`.
  That keeps a future backend or database swap straightforward.
