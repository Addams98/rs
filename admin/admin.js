/* ═══════════════════════════════════
   RÉVEIL SPIRITUEL — Admin Core JS
   GitHub Pages static admin panel
   Uses GitHub REST API for CRUD on JSON data files
═══════════════════════════════════ */

const GITHUB_OWNER  = 'Addams98';
const GITHUB_REPO   = 'rs';
const GITHUB_BRANCH = 'main';

/* ── Auth ── */
function getToken()  { return sessionStorage.getItem('rs_admin_token'); }
function setToken(t) { sessionStorage.setItem('rs_admin_token', t); }
function clearToken(){ sessionStorage.removeItem('rs_admin_token'); }

function requireAuth() {
  if (!getToken()) { window.location.href = 'login.html'; }
}

async function validateToken(token) {
  const res = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
  });
  return res.ok;
}

function logout() { clearToken(); window.location.href = 'login.html'; }

/* ── GitHub API helpers ── */
async function ghGetFile(filePath) {
  const url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
              '/contents/' + filePath + '?ref=' + GITHUB_BRANCH;
  const res = await fetch(url, {
    headers: { 'Authorization': 'token ' + getToken(), 'Accept': 'application/vnd.github.v3+json' }
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'GitHub API error ' + res.status); }
  const data = await res.json();
  const content = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
  return { data: JSON.parse(content), sha: data.sha };
}

async function ghPutFile(filePath, content, sha, commitMsg) {
  const url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + filePath;
  const body = {
    message: commitMsg || 'Admin: update ' + filePath,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
    branch: GITHUB_BRANCH
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': 'token ' + getToken(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'GitHub API write error'); }
  return res.json();
}

/* ── Toast notifications ── */
function showToast(msg, type) {
  type = type || 'success';
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<i class="fa fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + msg;
  container.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3500);
}

/* ── Modal helpers ── */
function openModal(id)  { const m = document.getElementById(id); if(m) m.classList.remove('hidden'); }
function closeModal(id) { const m = document.getElementById(id); if(m) m.classList.add('hidden'); }

/* ── ID generator ── */
function genId(titre) {
  return titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 40);
}

/* ── Today date ── */
function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

/* ── Category label ── */
const CAT_LABELS = {
  theologie: 'Théologie', torah: 'Torah & Réveil', prophetie: 'Prophétie',
  formation: 'Formation', priere: 'Prière & Intercession', 'vie-chretienne': 'Vie Chrétienne',
  louange: 'Louange', enseignement: 'Enseignement', evangelisation: 'Évangélisation',
  medias: 'Médias', social: 'Social', international: 'International'
};
function catLabel(c) { return CAT_LABELS[c] || c; }

/* ── Init sidebar ── */
document.addEventListener('DOMContentLoaded', function() {
  /* Mark active nav link */
  document.querySelectorAll('.sidebar-nav a').forEach(function(a) {
    if (window.location.href.includes(a.getAttribute('href'))) a.classList.add('active');
  });
  /* Logout button */
  const btn = document.getElementById('btnLogout');
  if (btn) btn.addEventListener('click', logout);
  /* Display GitHub username */
  const userEl = document.getElementById('sidebarUser');
  if (userEl && getToken()) {
    fetch('https://api.github.com/user', {
      headers: { 'Authorization': 'token ' + getToken() }
    }).then(r => r.json()).then(u => {
      if (u.login) userEl.textContent = '@' + u.login;
    }).catch(function() {});
  }
});
