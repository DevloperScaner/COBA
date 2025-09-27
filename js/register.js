
ensureFirebase(() => {
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  App.auth = auth;

  auth.onAuthStateChanged(u => {
    if (u) {
      // already logged in -> index
      window.location.href = "index.html";
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  setupModals?.();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const pass = document.getElementById("password");
  const btn = document.getElementById("register");
  const loading = document.getElementById("loading");

  btn.addEventListener("click", async () => {
    if (!name.value || !email.value || !pass.value) return alert("Harap isi semua kolom.");
    if (pass.value.length < 6) return alert("Sandi minimal 6 karakter.");
    try{
      const cred = await firebase.auth().createUserWithEmailAndPassword(email.value.trim(), pass.value);
      const uid = cred.user.uid;
      const db = firebase.firestore();
      await db.collection("users").doc(uid).set({
        displayName: name.value.trim(),
        email: email.value.trim(),
        role: "user",
        createdAt: new Date()
      }, { merge:true });
      loading.classList.add("show");
      setTimeout(()=> window.location.href="index.html", 5000);
    }catch(e){ alert(e.message); }
  });
});
