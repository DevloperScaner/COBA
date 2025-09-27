
// Redirect if already logged in
ensureFirebase(() => {
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  App.auth = auth;

  auth.onAuthStateChanged(u => {
    if (u) {
      // Logged in -> go to home
      window.location.href = "index.html";
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  // modals from app.js
  setupModals?.();

  const email = document.getElementById("email");
  const pass = document.getElementById("password");
  const btn = document.getElementById("login");
  const loading = document.getElementById("loading");

  btn.addEventListener("click", async () => {
    if (!email.value || !pass.value) return alert("Harap isi email & sandi.");
    try{
      const userCred = await firebase.auth().signInWithEmailAndPassword(email.value.trim(), pass.value);
      // show spinner 5s then redirect
      loading.classList.add("show");
      setTimeout(()=> window.location.href="index.html", 5000);
    }catch(e){
      alert(e.message);
    }
  });

  document.getElementById("forgot").addEventListener("click", async (e) => {
    e.preventDefault();
    if (!email.value) return alert("Masukkan email dulu.");
    try{
      await firebase.auth().sendPasswordResetEmail(email.value.trim());
      alert("Link reset sandi sudah dikirim.");
    }catch(err){ alert(err.message); }
  });
});
