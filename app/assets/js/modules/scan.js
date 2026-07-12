/* =====================================================================
   Hashir Hub — Barcode / QR scanning + labels   (v7.22)
   Uses camera scanning (html5-qrcode) and label generation
   (JsBarcode + qrcodejs), all lazy-loaded from CDN on first use.
   ===================================================================== */
(function () {
  var LIBS = {
    scan:    'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js',
    barcode: 'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js',
    qr:      'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
  };
  var loaded = {};
  function loadScript(url) {
    return new Promise(function (res, rej) {
      if (loaded[url]) return res();
      var sc = document.createElement('script');
      sc.src = url;
      sc.onload = function () { loaded[url] = true; res(); };
      sc.onerror = function () { rej(new Error('Could not load the scanner library. Check your internet connection.')); };
      document.head.appendChild(sc);
    });
  }

  function injectStyles() {
    if (document.getElementById('scan-styles')) return;
    var st = document.createElement('style');
    st.id = 'scan-styles';
    st.textContent =
      '.scan-overlay{position:fixed;inset:0;background:rgba(15,23,25,.72);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.scan-box,.scan-menu{background:#fff;border-radius:16px;max-width:420px;width:100%;overflow:hidden;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)}' +
      '.scan-head,.scan-menu-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:#0f766e;color:#fff}' +
      '.scan-head span,.scan-menu-head strong{flex:1;font-weight:600}' +
      '.scan-menu-head{flex-wrap:wrap}.scan-menu-head span{flex-basis:100%;font-size:12px;opacity:.85;font-weight:400}' +
      '.scan-x{background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer;line-height:1}' +
      '.scan-reader{width:100%;min-height:260px;background:#000}' +
      '.scan-hint{padding:10px 16px;color:#5b6b73;font-size:13px;text-align:center}' +
      '.scan-menu-body{padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
      '.scan-opt{padding:14px 10px;border:1px solid #d7dee0;border-radius:12px;background:#f6f8f9;font-weight:600;cursor:pointer;color:#1b2431}' +
      '.scan-opt:hover{background:#e9f1f0;border-color:#0f766e;color:#0f766e}' +
      '.scan-view{padding:8px 16px 4px}.scan-view div{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #eef1f2}' +
      '.scan-view span{color:#5b6b73}' +
      '.label-area{padding:18px;text-align:center}.label-name{font-weight:700;margin-bottom:10px}.label-qr{display:flex;justify-content:center;margin-bottom:8px}.label-code{margin-top:6px;font-family:monospace;font-size:13px}';
    document.head.appendChild(st);
  }

  function money(n) { return (window.UI && UI.money) ? UI.money(n) : n; }
  function esc(s) { return (window.UI && UI.escape) ? UI.escape(s) : String(s == null ? '' : s); }

  var Scan = {};

  // Open the camera, decode one code, resolve with the string (or null if cancelled).
  Scan.scan = async function () {
    injectStyles();
    try { await loadScript(LIBS.scan); }
    catch (e) { UI.toast(e.message, 'error'); return null; }
    return new Promise(function (resolve) {
      var ov = document.createElement('div');
      ov.className = 'scan-overlay';
      ov.innerHTML =
        '<div class="scan-box">' +
        '<div class="scan-head"><span>Point at a barcode or QR code</span>' +
        '<button class="scan-x" type="button" aria-label="Close">✕</button></div>' +
        '<div id="scan-reader" class="scan-reader"></div>' +
        '<div class="scan-hint">Hold steady in good light</div></div>';
      document.body.appendChild(ov);
      var qr, done = false;
      try { qr = new Html5Qrcode('scan-reader'); }
      catch (e) { if (ov.parentNode) ov.parentNode.removeChild(ov); UI.toast('Scanner failed to start.', 'error'); return resolve(null); }
      function cleanup(val) {
        if (done) return; done = true;
        var stop = qr.stop ? qr.stop() : Promise.resolve();
        stop.then(function () { try { qr.clear(); } catch (e) {} })
            .catch(function () {})
            .then(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); resolve(val); });
      }
      ov.querySelector('.scan-x').onclick = function () { cleanup(null); };
      ov.onclick = function (e) { if (e.target === ov) cleanup(null); };
      qr.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 },
        function (text) { cleanup(String(text)); },
        function () {}
      ).catch(function () {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
        UI.toast('Camera unavailable or permission denied.', 'error');
        resolve(null);
      });
    });
  };

  // Scan -> look up item -> show the action menu.
  Scan.itemMenu = async function () {
    var code = await Scan.scan();
    if (!code) return;
    UI.loading(true, 'Looking up item…');
    var item;
    try { item = await API.findItemByCode(code); }
    catch (e) { UI.loading(false); UI.toast(e.message, 'error'); return; }
    UI.loading(false);
    if (!item) { showNotFound(code); return; }
    showMenu(item);
  };

  function showNotFound(code) {
    injectStyles();
    var ov = document.createElement('div'); ov.className = 'scan-overlay';
    ov.innerHTML =
      '<div class="scan-menu"><div class="scan-menu-head"><strong>Item not found</strong>' +
      '<span>No item matches code: ' + esc(code) + '</span>' +
      '<button class="scan-x" type="button">\u2715</button></div>' +
      '<div class="scan-menu-body">' +
      '<button class="scan-opt" data-a="add" type="button">\u2795 Add this item</button>' +
      '<button class="scan-opt" data-a="cancel" type="button">Cancel</button>' +
      '</div></div>';
    document.body.appendChild(ov);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.querySelector('.scan-x').onclick = close;
    ov.onclick = function (e) { if (e.target === ov) close(); };
    ov.querySelector('[data-a=cancel]').onclick = close;
    ov.querySelector('[data-a=add]').onclick = function () {
      window.__SCAN_NEWITEM_CODE = code; close(); Router.go('new-item');
    };
  }

  function optBtn(a, label) { return '<button class="scan-opt" data-a="' + a + '" type="button">' + label + '</button>'; }

  function showMenu(item) {
    var ov = document.createElement('div'); ov.className = 'scan-overlay';
    ov.innerHTML =
      '<div class="scan-menu"><div class="scan-menu-head"><strong>' + esc(item.name || 'Item') + '</strong>' +
      '<span>SKU ' + esc(item.sku || '—') + ' • On hand: ' + (item.on_hand || 0) + '</span>' +
      '<button class="scan-x" type="button">✕</button></div>' +
      '<div class="scan-menu-body">' +
      optBtn('inv', 'Create Invoice') + optBtn('rec', 'Create Sale Receipt') +
      optBtn('recv', 'Receive Stock') + optBtn('adj', 'Adjust Stock') +
      optBtn('view', 'View Item') + optBtn('edit', 'Edit Item') +
      '</div></div>';
    document.body.appendChild(ov);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.querySelector('.scan-x').onclick = close;
    ov.onclick = function (e) { if (e.target === ov) close(); };
    function go(route) { window.__SCAN_PRELOAD = { id: item.id }; close(); Router.go(route); }
    ov.querySelector('[data-a=inv]').onclick  = function () { go('new-invoice'); };
    ov.querySelector('[data-a=rec]').onclick  = function () { go('new-sales-receipt'); };
    ov.querySelector('[data-a=recv]').onclick = function () { close(); Router.go('new-bill'); };
    ov.querySelector('[data-a=adj]').onclick  = function () { close(); Router.go('new-inventory-adjustment'); };
    ov.querySelector('[data-a=edit]').onclick = function () { close(); Router.go('items'); };
    ov.querySelector('[data-a=view]').onclick = function () { close(); showView(item); };
  }

  function showView(item) {
    var ov = document.createElement('div'); ov.className = 'scan-overlay';
    ov.innerHTML =
      '<div class="scan-menu"><div class="scan-menu-head"><strong>' + esc(item.name || 'Item') + '</strong>' +
      '<button class="scan-x" type="button">✕</button></div>' +
      '<div class="scan-view">' +
      '<div><span>SKU</span>' + esc(item.sku || '—') + '</div>' +
      '<div><span>Unique ID</span>' + esc(item.unique_id || '—') + '</div>' +
      '<div><span>On hand</span>' + (item.on_hand || 0) + '</div>' +
      '<div><span>Cost</span>' + money(item.cost_price || 0) + '</div>' +
      '<div><span>Retail</span>' + money(item.regular_price || 0) + '</div>' +
      '<div><span>Wholesale</span>' + money(item.wholesale_price || 0) + '</div></div>' +
      '<div class="scan-menu-body"><button class="scan-opt" data-a="label" type="button">Print Label</button></div></div>';
    document.body.appendChild(ov);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.querySelector('.scan-x').onclick = close;
    ov.onclick = function (e) { if (e.target === ov) close(); };
    ov.querySelector('[data-a=label]').onclick = function () { Scan.printLabel(item); };
  }

  // Generate a printable QR + barcode label for an item.
  Scan.printLabel = async function (item) {
    injectStyles();
    try { await loadScript(LIBS.qr); await loadScript(LIBS.barcode); }
    catch (e) { UI.toast(e.message, 'error'); return; }
    var codeVal = String(item.unique_id || item.sku || item.id || '');
    if (!codeVal) { UI.toast('This item has no code to print.', 'error'); return; }
    var ov = document.createElement('div'); ov.className = 'scan-overlay';
    ov.innerHTML =
      '<div class="scan-menu"><div class="scan-menu-head"><strong>Label</strong>' +
      '<button class="scan-x" type="button">✕</button></div>' +
      '<div id="label-area" class="label-area">' +
      '<div class="label-name">' + esc(item.name || '') + '</div>' +
      '<div id="label-qr" class="label-qr"></div>' +
      '<svg id="label-bar"></svg>' +
      '<div class="label-code">' + esc(codeVal) + '</div></div>' +
      '<div class="scan-menu-body"><button class="btn btn--primary" id="label-print" type="button">Print</button></div></div>';
    document.body.appendChild(ov);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.querySelector('.scan-x').onclick = close;
    ov.onclick = function (e) { if (e.target === ov) close(); };
    try { new QRCode(ov.querySelector('#label-qr'), { text: codeVal, width: 120, height: 120 }); } catch (e) {}
    try { JsBarcode(ov.querySelector('#label-bar'), codeVal, { format: 'CODE128', height: 50, displayValue: false }); } catch (e) {}
    ov.querySelector('#label-print').onclick = function () { printArea(ov.querySelector('#label-area')); };
  };

  function printArea(el) {
    var w = window.open('', '_blank', 'width=380,height=520');
    if (!w) { UI.toast('Allow pop-ups to print the label.', 'error'); return; }
    w.document.write('<html><head><title>Label</title><style>body{font-family:sans-serif;text-align:center;padding:16px}svg,canvas,img{max-width:100%}.label-name{font-weight:700;margin-bottom:10px}.label-code{margin-top:6px;font-family:monospace}</style></head><body>' + el.innerHTML + '</body></html>');
    w.document.close();
    setTimeout(function () { try { w.print(); } catch (e) {} }, 350);
  }

  // Route: /scan opens the scanner and action menu.
  if (window.Router) {
    Router.register('scan', function (mount) {
      mount.innerHTML =
        '<div class="page-head"><h1>Scan Item</h1></div>' +
        '<div class="card"><div style="padding:18px">' +
        '<p style="margin:0 0 14px">The camera opens automatically — point it at a barcode or QR code. ' +
        'If it does not open, tap below.</p>' +
        '<button class="btn btn--primary" id="scan-again" type="button">▣ Open Scanner</button>' +
        '</div></div>';
      var b = mount.querySelector('#scan-again');
      if (b) b.onclick = function () { Scan.itemMenu(); };
      Scan.itemMenu();
    });
  }

  window.Scan = Scan;
})();
