
requireAuthOrRedirect();

window.addEventListener("DOMContentLoaded", () => {
  qs("#back").addEventListener("click", ()=> location.href="index.html");
  ensureFirebase(async () => {
    const u = App.user;
    if (!u) return;
    qs("#uid").textContent = u.uid;
    qs("#email").textContent = u.email || "-";
    // Load displayName from Firestore if available
    try {
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(u.uid).get();
      const data = doc.exists ? doc.data() : {};
      qs("#name").value = data.displayName || u.displayName || "";
      qs("#phone").value = data.phone || "";
      qs("#kyc").textContent = data.kycStatus || "Belum KYC";
    } catch(e){ console.warn(e); }
  });

  qs("#save").addEventListener("click", async () => {
    try {
      const db = firebase.firestore();
      const u = App.user;
      await db.collection("users").doc(u.uid).set({
        displayName: qs("#name").value.trim(),
        phone: qs("#phone").value.trim(),
        updatedAt: new Date()
      }, { merge:true });
      alert("Tersimpan.");
    } catch(e){ alert(e.message); }
  });

  qs("#logout").addEventListener("click", signOut);
});
