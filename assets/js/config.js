/* =====================================================================
   Adil Business Solutions — Configuration  v7.7
   ===================================================================== */

window.ABS_CONFIG = {

  APP_NAME: "Adil Business Solutions",
  APP_SHORT: "ABS",
  TAGLINE:   "Invoicing & Inventory",

  // API_URL kept as fallback in case session has no api_url
  API_URL: "https://script.google.com/macros/s/AKfycbz7tHSyERDRNsCHr4Jh9Z7T0dW7UpEyDfBNvYkIbZUBNLVbhsYG1TBMaL6Z3iQ3ykhF/exec",

  COMPANY: {
    name:            "Adil Business Solutions",
    address:         "Your address line, City, Country",
    phone:           "+00 000 0000000",
    email:           "info@adilbusiness.example",
    currency:        "PKR",
    currency_symbol: "Rs",
    tax_percent:     0,
    invoice_prefix:  "INV-"
  },

  VERSION: "7.14",

  MENU: [
    { label: "Dashboard", icon: "home", route: "home" },

    { label: "Settings", icon: "settings", children: [
      { label: "Categories",            route: "categories" },
      { label: "Brands",                route: "brands" },
      { label: "Stores",                route: "stores" },
      { label: "Warehouses",            route: "warehouses" },
      { label: "Regions & Areas",       route: "areas" },
      { label: "Price Lists",           route: "price-lists" },
      { label: "Templates",             route: "templates" },
      { label: "UOM",                   route: "uom" },
      { label: "Sales Representatives", route: "sales-representatives" },
      { label: "Users",                 route: "users" },
      { label: "Company Information",   route: "company-information" },
      { label: "Appearance",            route: "appearance" }
    ]},

    { label: "Items", icon: "box", children: [
      { label: "Item List",         route: "items" },
      { label: "Item Search",       route: "item-search" },
      { label: "New Item",          route: "new-item" },
      { label: "Inventory Alert",   route: "inventory-alert" },
      { label: "Expired Inventory", route: "expired-inventory" },
      { label: "Price Manager",     route: "price-manager" }
    ]},

    { label: "E-Commerce Info", icon: "cart", children: [
      { label: "Slideshow",            route: "slideshow" },
      { label: "Campaign Manager",     route: "campaign-manager" },
      { label: "Notification Manager", route: "notification-manager" }
    ]},

    { label: "Accounts", icon: "layers", children: [
      { label: "Chart of Accounts", route: "accounts" },
      { label: "General Journal",   route: "general-journal" },
      { label: "Customer Payments", route: "customer-payments" },
      { label: "Pay Bills",         route: "pay-bills" },
      { label: "View Paid Bills",   route: "view-paid-bills" },
      { label: "Transfer Funds",    route: "transfer-funds" },
      { label: "Check Register",    route: "check-register" }
    ]},

    { label: "Transactions", icon: "file-text", children: [
      { label: "All Transactions",      route: "all-transactions" },
      { label: "Purchase Order",        route: "purchase-orders" },
      { label: "Bills",                 route: "bills" },
      { label: "Expenses",              route: "expenses" },
      { label: "Suppliers",             route: "suppliers" },
      { label: "Customers",             route: "customers" },
      { label: "Sales Orders",          route: "sales-orders" },
      { label: "Quotations",            route: "quotations" },
      { label: "Invoices",              route: "invoices" },
      { label: "Sales Receipts",        route: "sales-receipts" },
      { label: "Credit Memo / Refunds", route: "credit-memos" },
      { label: "Claims",                route: "claims" },
      { label: "Inventory Transfers",   route: "inventory-transfer" },
      { label: "Inventory Adjustments", route: "inventory-adjustments" },
      { label: "Bulk SMS",              route: "bulk-sms" }
    ]},

    { label: "Reports", icon: "chart", children: [
      { label: "All Reports",         route: "all-reports" },
      { label: "Company & Financial", route: "reports-company-financial" },
      { label: "Receivables",         route: "reports-receivables" },
      { label: "Payables",            route: "reports-payables" },
      { label: "Accounts",            route: "reports-accounts" },
      { label: "Inventory",           route: "reports-inventory" },
      { label: "Purchases",            route: "reports-purchases" },
      { label: "Sales",                route: "reports-sales" },
      { label: "Discounts",            route: "reports-discounts" },
      { label: "Sales Orders",         route: "reports-sales-orders" },
      { label: "Misc.",                route: "reports-misc" }
    ]}
  ],

  BUILT_ROUTES: ["home","items","new-item","customers","suppliers","categories","brands","uom","tax-types","areas","sales-representatives","invoices","new-invoice","sales-receipts","new-sales-receipt","all-transactions","stores","warehouses","price-lists","users","company-information","accounts","account-ledger","general-journal","new-general-journal-entry","receive-payments","view-payments","show-undeposited-list","view-deposits","transfer-funds","check-register","pay-bills","view-paid-bills","purchase-orders","new-purchase-order","edit-purchase-order","bills","new-bill","edit-bill","sales-orders","new-sales-order","edit-sales-order","quotations","new-quotation","edit-quotation","credit-memos","new-credit-memo","edit-credit-memo","expenses","new-expense","edit-expense","inventory-transfer","new-inventory-transfer","edit-inventory-transfer","inventory-adjustments","new-inventory-adjustment","edit-inventory-adjustment","claims","new-claim","edit-claim","item-search","price-manager","inventory-alert","all-reports","report-pl","report-balance-sheet","report-trial-balance","report-income-customer","report-transactions-summary","reports-company-financial","reports-receivables","reports-payables","reports-accounts","report-customer-balances","report-payment-collection","report-customer-statement","report-account-statement","report-supplier-balances","report-supplier-statement","report-journal","report-general-ledger","appearance","bulk-sms","customer-payments","reports-inventory","report-inv-onhand","report-inv-valuation","report-inv-damaged","report-inv-movement","report-inv-vendor","report-inv-worksheet","reports-purchases","report-purchases-suppliers","reports-sales","report-sales-category","report-sales-items","report-invoices-summary","report-sales-customers","report-sales-rep","report-return-stock-rep","report-sales-salesman","report-financial-recovery","report-invoice-items","report-invoice-batch-print","report-customers-items-sales","reports-discounts","report-customer-discounts","report-item-discounts","reports-sales-orders","report-sales-orders-summary","report-open-orders","reports-misc","report-deleted-transactions","report-updated-transactions"]
};
