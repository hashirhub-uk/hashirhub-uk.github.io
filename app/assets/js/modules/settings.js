/* =====================================================================
   Adil Business Solutions — Settings screens
   Company Information (feeds printed documents) + Stores, Warehouses,
   Price Lists, Users.
   ===================================================================== */

const CompanySettings = {
  // pull settings from the Sheet and merge into the live company config
  async loadCompany() {
    try {
      const s = await API.call('getSettings');
      const co = window.ABS_CONFIG.COMPANY;
      if (s.company_name) co.name = s.company_name;
      const addr = [s.address1, s.address2].filter(Boolean).join(', ');
      if (addr) co.address = addr; else if (s.address) co.address = s.address;
      if (s.phone) co.phone = s.phone;
      co.mobile = s.mobile || '';
      co.terms = s.terms || '';
      co.name_urdu = s.name_urdu || '';
      co.ticker = s.ticker || '';
      if (s.email) co.email = s.email;
      if (s.currency) co.currency = s.currency;
      if (s.currency_symbol) co.currency_symbol = s.currency_symbol;
      if (s.invoice_prefix) co.invoice_prefix = s.invoice_prefix;
      co.logo = s.logo || '';
      co.theme_color = s.theme_color || '';
      co.font_family = s.font_family || '';
      co.sidebar_color = s.sidebar_color || 'dark';
      co.sidebar_text_color = s.sidebar_text_color || 'soft-grey';
      this.applyBrand();
      this.applyTheme();
      return s;
    } catch (e) { return null; }
  },

  // logo is used on printed invoices/receipts, not the sidebar
  applyBrand() { /* intentionally no sidebar logo */ },

  applyTheme() {
    const co = window.ABS_CONFIG.COMPANY;
    const root = document.documentElement;
    const c = THEME_COLORS.find(x => x.id === co.theme_color);
    if (c) {
      root.style.setProperty('--accent', c.accent);
      root.style.setProperty('--accent-2', c.accent2);
      root.style.setProperty('--accent-ink', c.ink);
    } else {
      root.style.removeProperty('--accent'); root.style.removeProperty('--accent-2'); root.style.removeProperty('--accent-ink');
    }
    const f = THEME_FONTS.find(x => x.id === co.font_family);
    document.body.style.fontFamily = f ? f.stack : '';
    // apply sidebar color
    const SIDEBAR_COLORS_DEF = [
      { id:'dark',bg:'#0e1a2b',hover:'#16263b',border:'#233448',text:'#cfd9e4'},
      { id:'navy',bg:'#1a2a50',hover:'#24376b',border:'#2f4580',text:'#c8d4f0'},
      { id:'forest',bg:'#1a3328',hover:'#234435',border:'#2c5542',text:'#c2ddd2'},
      { id:'burgundy',bg:'#3b1223',hover:'#4e1b31',border:'#621e3d',text:'#e8c4cf'},
      { id:'charcoal',bg:'#2d2d2d',hover:'#3a3a3a',border:'#444',text:'#d0d0d0'},
      { id:'slate',bg:'#334155',hover:'#3f5068',border:'#4a5f78',text:'#cbd5e1'},
      { id:'light',bg:'#f1f5f9',hover:'#e2e8f0',border:'#cbd5e1',text:'#334155'}
    ];
    const s = SIDEBAR_COLORS_DEF.find(x => x.id === (co.sidebar_color || 'dark'));
    if (s) {
      root.style.setProperty('--sidebar-bg', s.bg);
      root.style.setProperty('--sidebar-hover', s.hover);
      root.style.setProperty('--sidebar-border', s.border);
      root.style.setProperty('--sidebar-text', s.text);
    }
    // apply sidebar text color override
    const TEXT_COLORS_DEF = [
      {id:'soft-grey',value:'#cfd9e4'},{id:'white',value:'#ffffff'},{id:'soft-blue',value:'#a8c4e0'},
      {id:'cream',value:'#f0e8d0'},{id:'mint',value:'#a8d8b8'},{id:'dark',value:'#334155'}
    ];
    const tc = TEXT_COLORS_DEF.find(x => x.id === (co.sidebar_text_color || 'soft-grey'));
    if (tc) root.style.setProperty('--sidebar-text', tc.value);
  }
};

const THEME_COLORS = [
  { id: 'teal',   name: 'Teal',   accent: '#0f766e', accent2: '#14b8a6', ink: '#0b5650' },
  { id: 'blue',   name: 'Blue',   accent: '#2563eb', accent2: '#3b82f6', ink: '#1e40af' },
  { id: 'indigo', name: 'Indigo', accent: '#4f46e5', accent2: '#6366f1', ink: '#3730a3' },
  { id: 'violet', name: 'Violet', accent: '#7c3aed', accent2: '#8b5cf6', ink: '#5b21b6' },
  { id: 'rose',   name: 'Rose',   accent: '#e11d48', accent2: '#f43f5e', ink: '#9f1239' },
  { id: 'red',    name: 'Red',    accent: '#dc2626', accent2: '#ef4444', ink: '#991b1b' },
  { id: 'orange', name: 'Orange', accent: '#ea580c', accent2: '#f97316', ink: '#9a3412' },
  { id: 'amber',  name: 'Amber',  accent: '#d97706', accent2: '#f59e0b', ink: '#92400e' },
  { id: 'green',  name: 'Green',  accent: '#16a34a', accent2: '#22c55e', ink: '#15803d' },
  { id: 'slate',  name: 'Slate',  accent: '#334155', accent2: '#475569', ink: '#1e293b' }
];
const THEME_FONTS = [
  { id: 'system', name: 'System (sans-serif)', stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { id: 'serif',  name: 'Classic Serif',       stack: 'Georgia, "Times New Roman", Times, serif' },
  { id: 'rounded',name: 'Rounded',             stack: 'ui-rounded, "Hiragino Maru Gothic ProN", "Quicksand", "Segoe UI", system-ui, sans-serif' }
];

const SIDEBAR_COLORS = [
  { id: 'dark',      name: 'Dark',      bg: '#0e1a2b', hover: '#16263b', border: '#233448', text: '#cfd9e4' },
  { id: 'navy',      name: 'Navy',      bg: '#1a2a50', hover: '#24376b', border: '#2f4580', text: '#c8d4f0' },
  { id: 'forest',    name: 'Forest',    bg: '#1a3328', hover: '#234435', border: '#2c5542', text: '#c2ddd2' },
  { id: 'burgundy',  name: 'Burgundy',  bg: '#3b1223', hover: '#4e1b31', border: '#621e3d', text: '#e8c4cf' },
  { id: 'charcoal',  name: 'Charcoal',  bg: '#2d2d2d', hover: '#3a3a3a', border: '#444',    text: '#d0d0d0' },
  { id: 'slate',     name: 'Slate',     bg: '#334155', hover: '#3f5068', border: '#4a5f78', text: '#cbd5e1' },
  { id: 'light',     name: 'Light',     bg: '#f1f5f9', hover: '#e2e8f0', border: '#cbd5e1', text: '#334155' }
];

const SIDEBAR_TEXT_COLORS = [
  { id: 'soft-grey', name: 'Soft Grey',  value: '#cfd9e4' },
  { id: 'white',     name: 'White',      value: '#ffffff' },
  { id: 'soft-blue', name: 'Soft Blue',  value: '#a8c4e0' },
  { id: 'cream',     name: 'Cream',      value: '#f0e8d0' },
  { id: 'mint',      name: 'Mint',       value: '#a8d8b8' },
  { id: 'dark',      name: 'Dark',       value: '#334155' }
];

Router.register('appearance', (mount) => {
  const co = window.ABS_CONFIG.COMPANY;
  let pickColor  = co.theme_color   || 'teal';
  let pickFont   = co.font_family   || 'system';
  let pickSidebar = co.sidebar_color || 'dark';
  let pickSidebarText = co.sidebar_text_color || 'soft-grey';

  mount.innerHTML = `
    <div class="page-head"><h1>Appearance</h1><span class="page-sub">Customize how the app looks</span>
      <div class="page-actions"><button class="btn btn--primary" id="ap-save">Save</button></div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Accent color</h2></div>
      <p class="muted">Used for buttons, links, highlights and active menu items.</p>
      <div class="swatch-grid" id="ap-colors">
        ${THEME_COLORS.map(c => `<button class="swatch${c.id === pickColor ? ' selected' : ''}" data-id="${c.id}" title="${c.name}" style="background:${c.accent}"><span>${UI.escape(c.name)}</span></button>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Sidebar color</h2></div>
      <p class="muted">Changes the background color of the left navigation bar.</p>
      <div class="swatch-grid" id="ap-sidebar">
        ${SIDEBAR_COLORS.map(s => `<button class="swatch${s.id === pickSidebar ? ' selected' : ''}" data-id="${s.id}" title="${s.name}" style="background:${s.bg};border-color:${s.id === pickSidebar ? '#fff' : 'transparent'}"><span style="color:${s.text}">${UI.escape(s.name)}</span></button>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Sidebar text color</h2></div>
      <p class="muted">Changes the color of menu labels and text in the left navigation bar.</p>
      <div class="swatch-grid" id="ap-sidebar-text">
        ${SIDEBAR_TEXT_COLORS.map(s => `<button class="swatch${s.id === pickSidebarText ? ' selected' : ''}" data-id="${s.id}" title="${s.name}" style="background:#1b2431;color:${s.value};border:2px solid ${s.id === pickSidebarText ? '#fff' : 'transparent'};font-weight:600;font-size:12px">${UI.escape(s.name)}</button>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Font style</h2></div>
      <div class="font-grid" id="ap-fonts">
        ${THEME_FONTS.map(f => `<button class="font-option${f.id === pickFont ? ' selected' : ''}" data-id="${f.id}" style="font-family:${f.stack}">${UI.escape(f.name)}<em>The quick brown fox 123</em></button>`).join('')}
      </div>
    </div>`;

  const live = () => {
    const c = THEME_COLORS.find(x => x.id === pickColor), root = document.documentElement;
    if (c) { root.style.setProperty('--accent', c.accent); root.style.setProperty('--accent-2', c.accent2); root.style.setProperty('--accent-ink', c.ink); }
    const f = THEME_FONTS.find(x => x.id === pickFont);
    document.body.style.fontFamily = f ? f.stack : '';
    const s = SIDEBAR_COLORS.find(x => x.id === pickSidebar);
    if (s) {
      root.style.setProperty('--sidebar-bg', s.bg);
      root.style.setProperty('--sidebar-hover', s.hover);
      root.style.setProperty('--sidebar-border', s.border);
      root.style.setProperty('--sidebar-text', s.text);
    }
    const st = SIDEBAR_TEXT_COLORS.find(x => x.id === pickSidebarText);
    if (st) root.style.setProperty('--sidebar-text', st.value);
  };
  mount.querySelectorAll('#ap-colors .swatch').forEach(b => b.onclick = () => { pickColor = b.dataset.id; mount.querySelectorAll('#ap-colors .swatch').forEach(x => x.classList.toggle('selected', x === b)); live(); });
  mount.querySelectorAll('#ap-sidebar .swatch').forEach(b => b.onclick = () => { pickSidebar = b.dataset.id; mount.querySelectorAll('#ap-sidebar .swatch').forEach(x => x.classList.toggle('selected', x === b)); live(); });
  mount.querySelectorAll('#ap-sidebar-text .swatch').forEach(b => b.onclick = () => { pickSidebarText = b.dataset.id; mount.querySelectorAll('#ap-sidebar-text .swatch').forEach(x => x.classList.toggle('selected', x === b)); live(); });
  mount.querySelectorAll('#ap-fonts .font-option').forEach(b => b.onclick = () => { pickFont = b.dataset.id; mount.querySelectorAll('#ap-fonts .font-option').forEach(x => x.classList.toggle('selected', x === b)); live(); });
  mount.querySelector('#ap-save').onclick = async () => {
    UI.loading(true, 'Saving…');
    try {
      await API.call('saveSettings', { data: { theme_color: pickColor, font_family: pickFont, sidebar_color: pickSidebar, sidebar_text_color: pickSidebarText } });
      await CompanySettings.loadCompany();
      UI.loading(false); UI.toast('Appearance saved.', 'success');
    } catch (e) { UI.loading(false); UI.toast(e.message, 'error'); }
  };
});
window.CompanySettings = CompanySettings;

// ---- Company Information screen ---------------------------------------
Router.register('company-information', async (mount) => {
  UI.loading(true);
  let s;
  try { s = await API.call('getSettings'); }
  catch (e) { UI.loading(false); mount.innerHTML = `<div class="card"><div class="empty">${UI.icon('alert')}<h3>Couldn't load settings</h3><p>${UI.escape(e.message)}</p></div></div>`; return; }
  UI.loading(false);

  const v = (k) => UI.escape(s[k] != null ? s[k] : '');
  mount.innerHTML = `
    <div class="page-head"><h1>Company Information</h1>
      <span class="page-sub">Shown on your printed invoices & receipts</span>
      <div class="page-actions"><button class="btn btn--primary" id="ci-save">Save</button></div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Branding</h2></div>
      <div class="logo-row">
        <div class="logo-preview" id="ci-logo-preview">${s.logo ? `<img src="${s.logo}" alt="logo">` : `<span class="logo-placeholder">${UI.escape(window.ABS_CONFIG.APP_SHORT)}</span>`}</div>
        <div class="logo-controls">
          <p class="muted">Shown in the sidebar and on the login screen. A small square image works best — it's automatically resized, so keep it simple (PNG with transparency is ideal).</p>
          <input type="file" id="ci-logo-file" accept="image/*" style="display:none">
          <button class="btn" id="ci-logo-pick">Choose image…</button>
          <button class="btn" id="ci-logo-clear">Remove logo</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="form-grid">
        <label class="field field--wide"><span class="field-label">Company Name</span><input id="ci-company_name" value="${v('company_name')}"></label>
        <label class="field field--wide"><span class="field-label">Company Name (Urdu)</span><input id="ci-name_urdu" value="${v('name_urdu')}" dir="rtl"></label>
        <label class="field"><span class="field-label">Address 1</span><input id="ci-address1" value="${v('address1')}"></label>
        <label class="field"><span class="field-label">Address 2</span><input id="ci-address2" value="${v('address2')}"></label>
        <label class="field"><span class="field-label">Phone</span><input id="ci-phone" value="${v('phone')}"></label>
        <label class="field"><span class="field-label">Mobile No.</span><input id="ci-mobile" value="${v('mobile')}"></label>
        <label class="field"><span class="field-label">Email</span><input id="ci-email" value="${v('email')}"></label>
        <label class="field"><span class="field-label">Currency Symbol</span><input id="ci-currency_symbol" value="${v('currency_symbol')}"></label>
        <label class="field"><span class="field-label">Currency Code</span><input id="ci-currency" value="${v('currency')}"></label>
        <label class="field"><span class="field-label">Invoice Prefix</span><input id="ci-invoice_prefix" value="${v('invoice_prefix')}"></label>
        <label class="field field--wide"><span class="field-label">Terms & Conditions (printed on documents)</span><textarea id="ci-terms" rows="3">${v('terms')}</textarea></label>
        <label class="field field--wide"><span class="field-label">Ticker Text</span><input id="ci-ticker" value="${v('ticker')}"></label>
      </div>
    </div>`;

  // --- logo upload (resized client-side so it fits in one Sheet cell) ---
  let logoData = s.logo || '';
  const preview = mount.querySelector('#ci-logo-preview');
  const setPreview = () => {
    preview.innerHTML = logoData ? `<img src="${logoData}" alt="logo">` : `<span class="logo-placeholder">${UI.escape(window.ABS_CONFIG.APP_SHORT)}</span>`;
  };
  const resizeImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 160;
        let { width: w, height: h } = img;
        if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
        else if (h > max) { w = Math.round(w * max / h); h = max; }
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        let out = c.toDataURL('image/png');
        if (out.length > 45000) out = c.toDataURL('image/jpeg', 0.82); // keep under one Sheet cell
        resolve(out);
      };
      img.onerror = () => reject(new Error('That file could not be read as an image.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
  mount.querySelector('#ci-logo-pick').onclick = () => mount.querySelector('#ci-logo-file').click();
  mount.querySelector('#ci-logo-file').onchange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try { logoData = await resizeImage(file); setPreview(); UI.toast('Logo ready — click Save to apply.', 'success'); }
    catch (err) { UI.toast(err.message, 'error'); }
  };
  mount.querySelector('#ci-logo-clear').onclick = () => { logoData = ''; setPreview(); UI.toast('Logo cleared — click Save to apply.', 'info'); };

  mount.querySelector('#ci-save').onclick = async () => {
    const keys = ['company_name','name_urdu','address1','address2','phone','mobile','email','currency_symbol','currency','invoice_prefix','terms','ticker'];
    const data = {};
    keys.forEach(k => { data[k] = mount.querySelector('#ci-' + k).value; });
    data.logo = logoData;
    UI.loading(true, 'Saving…');
    try {
      await API.call('saveSettings', { data });
      await CompanySettings.loadCompany();
      UI.loading(false);
      UI.toast('Company information saved.', 'success');
    } catch (e) { UI.loading(false); UI.toast(e.message, 'error'); }
  };
});

// ---- Stores -----------------------------------------------------------
Router.register('stores', (m) => CRUD.page(m, {
  entity: 'Stores', title: 'Stores', singular: 'Store',
  columns: [
    { key: 'store_name', label: 'Store Name' },
    { key: 'region_id', label: 'Region', ref: 'Areas' },
    { key: 'ecommerce_eligibility', label: 'E-Commerce' }
  ],
  fields: [
    { key: 'store_name', label: 'Store Name', required: true, wide: true },
    { key: 'region_id', label: 'Region', type: 'select', ref: 'Areas' },
    { key: 'description', label: 'Description', type: 'textarea', wide: true },
    { key: 'ecommerce_eligibility', label: 'E-Commerce Eligibility', type: 'select', options: ['No', 'Yes'], default: 'No' }
  ]
}));

// ---- Warehouses -------------------------------------------------------
Router.register('warehouses', (m) => CRUD.page(m, {
  entity: 'Warehouses', title: 'Warehouses', singular: 'Warehouse',
  columns: [ { key: 'warehouse_name', label: 'Name' }, { key: 'description', label: 'Description' } ],
  fields: [
    { key: 'warehouse_name', label: 'Warehouse Name', required: true, wide: true },
    { key: 'description', label: 'Description', type: 'textarea', wide: true }
  ]
}));

// ---- Price Lists ------------------------------------------------------
Router.register('price-lists', (m) => CRUD.page(m, {
  entity: 'PriceLists', title: 'Price Lists', singular: 'Price List',
  columns: [ { key: 'list_date', label: 'Date' }, { key: 'list_type', label: 'Type' } ],
  fields: [
    { key: 'list_date', label: 'List Date', type: 'date' },
    { key: 'list_type', label: 'List Type', type: 'select', options: ['Retail', 'Wholesale', 'Custom'], default: 'Retail' },
    { key: 'list_image', label: 'Image URL (optional)', wide: true }
  ]
}));

// ---- My Account (self-service password change) -----------------------
// v7.20: clients can no longer create or manage user accounts. They may
// only change their own password. Provisioning is done by the provider.
Router.register('users', (m) => {
  const sess = Session.get() || {};
  const user = sess.user || {};
  m.innerHTML = `
    <div class="page-head">
      <h1 class="page-title">My Account</h1>
      <span class="page-sub">Change your password</span>
    </div>
    <div class="card" style="max-width:480px">
      <div class="form-grid">
        <label class="wide">Username
          <input type="text" value="${UI.escape(user.username || '')}" disabled>
        </label>
        <form id="pw-form" class="form-grid" autocomplete="off" style="grid-column:1/-1">
          <label class="wide">Current password
            <input name="old" type="password" required autocomplete="current-password">
          </label>
          <label class="wide">New password (at least 6 characters)
            <input name="new1" type="password" required minlength="6" autocomplete="new-password">
          </label>
          <label class="wide">Confirm new password
            <input name="new2" type="password" required minlength="6" autocomplete="new-password">
          </label>
          <div class="wide" style="display:flex;align-items:center;gap:12px">
            <button type="submit" class="btn btn--primary">Change password</button>
            <span id="pw-msg" class="login-error" style="margin:0"></span>
          </div>
        </form>
      </div>
    </div>`;

  const form = m.querySelector('#pw-form');
  const msg  = m.querySelector('#pw-msg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = ''; msg.style.color = '';
    const fd = new FormData(form);
    const oldPw = String(fd.get('old') || '');
    const n1 = String(fd.get('new1') || '');
    const n2 = String(fd.get('new2') || '');
    if (n1 !== n2) { msg.textContent = 'New passwords do not match.'; return; }
    UI.loading(true, 'Updating\u2026');
    try {
      await API.changePassword(oldPw, n1);
      UI.loading(false);
      form.reset();
      msg.style.color = '#0f766e';
      msg.textContent = 'Password changed successfully.';
      UI.toast('Password updated', 'success');
    } catch (ex) {
      UI.loading(false);
      msg.textContent = ex.message;
    }
  });
});
