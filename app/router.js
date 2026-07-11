/* =====================================================================
   Adil Business Solutions — API layer  v7.7
   ===================================================================== */

const Session = {
  key: "abs_session",
  get()   { try { return JSON.parse(localStorage.getItem(this.key)) || null; } catch { return null; } },
  set(d)  { localStorage.setItem(this.key, JSON.stringify(d)); },
  clear() { localStorage.removeItem(this.key); },
  token() { const s = this.get(); return s ? s.token   : null; },
  user()  { const s = this.get(); return s ? s.user    : null; },
  apiUrl(){ const s = this.get(); return s ? s.api_url : null; }
};

const API = {

  configured() {
    const u = Session.apiUrl() || window.ABS_CONFIG.API_URL;
    return !!(u && u !== "PASTE_YOUR_WEB_APP_URL_HERE" && /^https:\/\//.test(u));
  },

  _url() {
    const u = Session.apiUrl() || window.ABS_CONFIG.API_URL;
    if (!u) throw new Error("No company selected. Please sign in again.");
    return u;
  },

  async call(action, payload = {}) {
    const url  = this._url();
    const body = JSON.stringify(Object.assign({ action, token: Session.token() }, payload));
    let res;
    try {
      res = await fetch(url, {
        method:   "POST",
        headers:  { "Content-Type": "text/plain;charset=utf-8" },
        body,
        redirect: "follow"
      });
    } catch (e) {
      throw new Error("Could not reach the backend. Check the Web App URL and that it is deployed for 'Anyone'.");
    }
    let json;
    try { json = await res.json(); }
    catch { throw new Error("Backend returned an unexpected response (not JSON). Re-check the deployment."); }
    if (!json.ok) throw new Error(json.error || "Request failed.");
    return json.data;
  },

  ping()                     { return this.call("ping"); },
  login(username, password)  { return this.call("login", { username, password }); },

  // v7.20 — ask the master Registry which company owns this username.
  async resolve(username) {
    const url = window.ABS_CONFIG.REGISTRY_URL;
    if (!url || /PASTE_/.test(url)) throw new Error("Login service is not configured.");
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "resolve", username }),
        redirect: "follow"
      });
    } catch (e) { throw new Error("Could not reach the login service."); }
    let json;
    try { json = await res.json(); }
    catch { throw new Error("Login service returned an unexpected response."); }
    if (!json.ok) throw new Error(json.error || "Invalid username or password.");
    return json.data; // { api_url, company_name }
  },

  findItemByCode(code)       { return this.call("findItemByCode", { code }); },
  changePassword(oldPw, newPw) {
    return this.call("changePassword", { old_password: oldPw, new_password: newPw });
  },
  dashboard()                { return this.call("dashboard"); },
  salesSummary(from, to)     { return this.call("salesSummary", { from, to }); },
  weeklySummary()            { return this.call("weeklySummary"); },
  dashboardExtra()           { return this.call("dashboardExtra"); },
  inventoryAlerts()          { return this.call("inventoryAlerts"); },
  searchDocuments(q)         { return this.call("searchDocuments", { q }); },

  list(entity, params = {})  { return this.call("list",   Object.assign({ entity }, params)); },
  get(entity, id)            { return this.call("get",    { entity, id }); },
  create(entity, data)       { return this.call("create", { entity, data }); },
  update(entity, id, data)   { return this.call("update", { entity, id, data }); },
  remove(entity, id)         { return this.call("delete", { entity, id }); },
  nextNumber(name)           { return this.call("nextNumber", { name }); }
};

window.API     = API;
window.Session = Session;
