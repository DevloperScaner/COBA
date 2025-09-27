
// Firebase init
const firebaseConfig = {
  apiKey: "AIzaSyB7Xlu02Winh4wp2XDzw5592yE9_J-qiuM",
  authDomain: "investasi-hewan.firebaseapp.com",
  projectId: "investasi-hewan",
  storageBucket: "investasi-hewan.firebasestorage.app",
  messagingSenderId: "180728484800",
  appId: "1:180728484800:web:f2fcd8e390b636dfb6ee25"
};

// load Firebase via CDN if present in page
let fbLoaded = false;
function ensureFirebase(cb){
  if (fbLoaded) return cb();
  if (!window.firebase) {
    const s1 = document.createElement('script');
    s1.src = "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";
    const s2 = document.createElement('script');
    s2.src = "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";
    const s3 = document.createElement('script');
    s3.src = "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";
    let left = 3;
    [s1,s2,s3].forEach(s => s.onload = () => { if(--left===0){ fbLoaded = true; cb(); } });
    document.head.append(s1,s2,s3);
  } else { fbLoaded=true; cb(); }
}

// Theme & i18n
const I18N = {
  id: {
    title: "PETERNAKAN HEWAN",
    stats_total: "Total Aset",
    stats_quan: "Akun Kuantitatif",
    stats_active: "Holding Aktif",
    menu: "Menu",
    notif: "Notifikasi",
    promo_chicken: "Promo ayam khusus minggu ini.",
    cashback: "Cashback 5%",
    btn_close: "Tutup",
    back: "Kembali"
  },
  en: {
    title: "ANIMAL FARM",
    stats_total: "Total Assets",
    stats_quan: "Quantitative Account",
    stats_active: "Active Holdings",
    menu: "Menu",
    notif: "Notifications",
    promo_chicken: "Chicken promo this week.",
    cashback: "Cashback 5%",
    btn_close: "Close",
    back: "Back"
  }
};

const App = {
  lang: localStorage.getItem("lang") || "id",
  theme: localStorage.getItem("theme") || "dark",
  t(key){ return (I18N[this.lang]||I18N.id)[key] || key; },
  setLang(l){ this.lang=l; localStorage.setItem("lang", l); location.reload(); },
  setTheme(t){
    this.theme=t;
    localStorage.setItem("theme", t);
    document.documentElement.classList.remove("light","dark");
    document.documentElement.classList.add(t);
  },
  auth: null,
  user: null
};
document.documentElement.classList.add(App.theme);

// Helpers
function qs(s, el=document){ return el.querySelector(s); }
function qsa(s, el=document){ return [...el.querySelectorAll(s)]; }

// Simple notifications store
const bellStore = {
  items: [
    { id:1, text:"Bonus cashback 5% minggu ini."},
    { id:2, text:"Update sistem selesai."}
  ]
};

// Shared modals
function setupModals(){
  const notifBtn = qs("[data-action='notif']");
  const langBtn = qs("[data-action='lang']");
  const themeBtn = qs("[data-action='theme']");

  const notifModal = qs("#notif-modal");
  const langModal = qs("#lang-modal");
  const themeModal = qs("#theme-modal");

  function open(m){ m.classList.add("show"); }
  function close(m){ m.classList.remove("show"); }

  if (notifBtn){
    notifBtn.addEventListener("click", () => {
      const list = qs("#notif-list");
      if (list){
        list.innerHTML = bellStore.items.map(i => `<li class='section' style="margin:0 0 8px">${i.text}</li>`).join("");
      }
      open(notifModal);
    });
  }
  if (langBtn){
    langBtn.addEventListener("click", () => {
      qsa(".pill", langModal).forEach(p=>p.classList.toggle("active", p.dataset.lang===App.lang));
      open(langModal);
    });
    langModal?.addEventListener("click", e => {
      if (e.target.classList.contains("pill")){
        App.setLang(e.target.dataset.lang);
      }
    });
  }
  if (themeBtn){
    themeBtn.addEventListener("click", () => open(themeModal));
    qs("#set-dark")?.addEventListener("click", () => App.setTheme("dark"));
    qs("#set-light")?.addEventListener("click", () => App.setTheme("light"));
  }
  qsa(".close-modal").forEach(b => b.addEventListener("click", e => e.target.closest(".modal").classList.remove("show")));
}

window.addEventListener("DOMContentLoaded", setupModals);

// Auth helpers used by pages
function requireAuthOrRedirect(){
  ensureFirebase(() => {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    App.auth = auth;
    auth.onAuthStateChanged(async (u) => {
      if (!u){
        // not logged in -> send to login
        window.location.href = "login.html";
      } else {
        App.user = u;
        // Optionally load user doc
        try {
          const db = firebase.firestore();
          const doc = await db.collection("users").doc(u.uid).get();
          window.USER_DOC = doc.exists ? doc.data() : null;
        } catch(e){ console.warn(e); }
      }
    });
  });
}

function signOut(){
  if (!App.auth) return location.href="login.html";
  App.auth.signOut().then(()=> location.href="login.html");
}
