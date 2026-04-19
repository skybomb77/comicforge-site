// ComicForge API Config & Helpers
// Set backend URL: localStorage.setItem('cf_backend', 'https://xxxx.ngrok-free.dev')
const CF = {
  get api() {
    return localStorage.getItem('cf_backend') || 'https://interstaminal-unvirtuously-gennie.ngrok-free.dev';
  },
  get token() {
    return localStorage.getItem('cf_token') || '';
  },
  set token(t) {
    if (t) localStorage.setItem('cf_token', t);
    else localStorage.removeItem('cf_token');
  },
  get isLoggedIn() {
    return !!this.token;
  },
  // Authenticated fetch
  async apiFetch(path, opts = {}) {
    const headers = opts.headers || {};
    headers['ngrok-skip-browser-warning'] = 'true';
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(this.api + path, { ...opts, headers });
    const data = await res.json();
    if (res.status === 401) { this.token = ''; }
    return { ok: res.ok, status: res.status, data };
  },
  // Require login, redirect if not
  requireLogin() {
    if (!this.isLoggedIn) { window.location.href = 'login.html'; return false; }
    return true;
  },
  // Logout
  async logout() {
    try { await this.apiFetch('/api/logout', { method: 'POST' }); } catch(e) {}
    this.token = '';
    window.location.href = 'index.html';
  }
};
