/* =====================================================================
   Adil Business Solutions — Configuration  v7.7
   ===================================================================== */

window.ABS_CONFIG = {

  APP_NAME: "Hashir Hub",
  APP_SHORT: "Hashir Hub",
  TAGLINE:   "Invoicing & Inventory",

  // API_URL kept as fallback in case session has no api_url
  API_URL: "https://script.google.com/macros/s/AKfycbz7tHSyERDRNsCHr4Jh9Z7T0dW7UpEyDfBNvYkIbZUBNLVbhsYG1TBMaL6Z3iQ3ykhF/exec",

  // Master Registry web app URL — resolves username -> company backend.
  // Paste the Registry deployment /exec URL here.
  REGISTRY_URL: "https://script.google.com/macros/s/AKfycbzUzJG_MEW4se4Up68WCS5NkbVX3sqBm2pU7Fdh95qcX0i_ypOatiOV1a4o1KiiyfDd/exec",

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

  VERSION: "7.24",

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
      { label: "My Account",            route: "users" },
      { label: "Company Information",   route: "company-information" },
      { label: "Appearance",            route: "appearance" }
    ]},

    { label: "Items", icon: "box", children: [
      { label: "Scan Item",         route: "scan" },
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
      { label: "Customer Payments", children: [
        { label: "Receive Payment", route: "receive-payments" },
        { label: "View Payments",   route: "view-payments" },
        { label: "Record Deposit",  route: "show-undeposited-list" },
        { label: "View Deposits",   route: "view-deposits" }
      ]},
      { label: "Supplier Payment", children: [
        { label: "Pay Bills",       route: "pay-bills" },
        { label: "View Paid Bills", route: "view-paid-bills" }
      ]},
      { label: "Banking", children: [
        { label: "Transfer Funds",  route: "transfer-funds" },
        { label: "Check Register",  route: "check-register" }
      ]}
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
      { label: "All Reports", route: "all-reports" },
      { label: "Company & Financial", children: [
        { label: "Profit and Loss Standard", route: "report-pl" },
        { label: "Balance Sheet Standard", route: "report-balance-sheet" },
        { label: "Trial Balance", route: "report-trial-balance" },
        { label: "Income By Customer Summary", route: "report-income-customer" },
        { label: "Transactions Summary", route: "report-transactions-summary" }
      ]},
      { label: "Receivables", children: [
        { label: "Customer Balance Summary", route: "report-customer-balances" },
        { label: "Payment Collection Summary", route: "report-payment-collection" },
        { label: "Customer Statement", route: "report-customer-statement" },
        { label: "Account Statement", route: "report-account-statement" }
      ]},
      { label: "Payables", children: [
        { label: "Supplier Balance Summary", route: "report-supplier-balances" },
        { label: "Supplier Statement", route: "report-supplier-statement" }
      ]},
      { label: "Accounts", children: [
        { label: "Journal", route: "report-journal" },
        { label: "General Ledger", route: "report-general-ledger" }
      ]},
      { label: "Inventory", children: [
        { label: "Items List", route: "items" },
        { label: "Quantity On-hand by Warehouse", route: "report-inv-onhand" },
        { label: "Inventory Valuation by Warehouse", route: "report-inv-valuation" },
        { label: "Damaged/Expired Inventory", route: "report-inv-damaged" },
        { label: "Inventory Movement Summary", route: "report-inv-movement" },
        { label: "Stock Status by Vendor", route: "report-inv-vendor" },
        { label: "Physical Inventory Worksheet", route: "report-inv-worksheet" }
      ]},
      { label: "Purchases", children: [
        { label: "Purchases by Suppliers Summary", route: "report-purchases-suppliers" }
      ]},
      { label: "Sales", children: [
        { label: "Sales by Category Summary", route: "report-sales-category" },
        { label: "Sales by Items Summary", route: "report-sales-items" },
        { label: "Invoices Summary", route: "report-invoices-summary" },
        { label: "Sales by Customers Summary", route: "report-sales-customers" },
        { label: "Sales By Representative Summary", route: "report-sales-rep" },
        { label: "Return Stock By Representative Summary", route: "report-return-stock-rep" },
        { label: "Sales By Salesman Summary", route: "report-sales-salesman" },
        { label: "Financial Recovery and Sales Performance Summary", route: "report-financial-recovery" },
        { label: "Invoice Items Summary", route: "report-invoice-items" },
        { label: "Invoice Batch Print", route: "report-invoice-batch-print" },
        { label: "Customers Items Sales Summary", route: "report-customers-items-sales" }
      ]},
      { label: "Discounts", children: [
        { label: "Customers Discounts Summary", route: "report-customer-discounts" },
        { label: "Items Discounts Summary", route: "report-item-discounts" }
      ]},
      { label: "Sales Orders", children: [
        { label: "Sales Orders Summary", route: "report-sales-orders-summary" },
        { label: "Open Orders Summary", route: "report-open-orders" }
      ]},
      { label: "Misc.", children: [
        { label: "Deleted Transactions", route: "report-deleted-transactions" },
        { label: "Updated Transactions", route: "report-updated-transactions" }
      ]}
    ]}
  ],

  BUILT_ROUTES: ["home","scan","items","new-item","customers","suppliers","categories","brands","uom","tax-types","areas","sales-representatives","invoices","new-invoice","sales-receipts","new-sales-receipt","all-transactions","stores","warehouses","price-lists","users","company-information","accounts","account-ledger","general-journal","new-general-journal-entry","receive-payments","view-payments","show-undeposited-list","view-deposits","transfer-funds","check-register","pay-bills","view-paid-bills","purchase-orders","new-purchase-order","edit-purchase-order","bills","new-bill","edit-bill","sales-orders","new-sales-order","edit-sales-order","quotations","new-quotation","edit-quotation","credit-memos","new-credit-memo","edit-credit-memo","expenses","new-expense","edit-expense","inventory-transfer","new-inventory-transfer","edit-inventory-transfer","inventory-adjustments","new-inventory-adjustment","edit-inventory-adjustment","claims","new-claim","edit-claim","item-search","price-manager","inventory-alert","all-reports","report-pl","report-balance-sheet","report-trial-balance","report-income-customer","report-transactions-summary","reports-company-financial","reports-receivables","reports-payables","reports-accounts","report-customer-balances","report-payment-collection","report-customer-statement","report-account-statement","report-supplier-balances","report-supplier-statement","report-journal","report-general-ledger","appearance","bulk-sms","customer-payments","reports-inventory","report-inv-onhand","report-inv-valuation","report-inv-damaged","report-inv-movement","report-inv-vendor","report-inv-worksheet","reports-purchases","report-purchases-suppliers","reports-sales","report-sales-category","report-sales-items","report-invoices-summary","report-sales-customers","report-sales-rep","report-return-stock-rep","report-sales-salesman","report-financial-recovery","report-invoice-items","report-invoice-batch-print","report-customers-items-sales","reports-discounts","report-customer-discounts","report-item-discounts","reports-sales-orders","report-sales-orders-summary","report-open-orders","reports-misc","report-deleted-transactions","report-updated-transactions"]
};
