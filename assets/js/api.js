/* =====================================================================
   Adil Business Solutions — API layer  v7.5
   ---------------------------------------------------------------------
   API_URL is now stored per-session (set at login from companies.js).
   Every call reads it from Session.apiUrl() instead of ABS_CONFIG.
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

  _url() {
    const u = Session.apiUrl();
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

  // --- convenience wrappers -------------------------------------------
  ping()                     { return this.call("ping"); },
  login(username, password)  { return this.call("login", { username, password }); },
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
