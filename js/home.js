
// Home interactions
requireAuthOrRedirect();

window.addEventListener("DOMContentLoaded", () => {
  // Fill texts
  qs("#title").textContent = App.t("title");
  qs("#stats-total").textContent = App.t("stats_total");
  qs("#stats-quan").textContent = App.t("stats_quan");
  qs("#stats-active").textContent = App.t("stats_active");
  qs("#menu-title").textContent = App.t("menu");
  qs("#hero-desc").textContent = App.t("promo_chicken");
  qs("#hero-h2").textContent = App.t("cashback");

  // Banner slider
  const slides = [
    { tag:"Chicken", title: App.t("cashback"), desc: App.t("promo_chicken") },
    { tag:"Cow", title: "Potongan 10%", desc: "Diskon spesial paket sapi." },
    { tag:"Sheep", title: "Bonus 15%", desc: "Beli paket domba dapat bonus." }
  ];
  let idx = 0;
  function renderBanner(i){
    qs("#hero-tag").textContent = slides[i].tag;
    qs("#hero-h2").textContent = slides[i].title;
    qs("#hero-desc").textContent = slides[i].desc;
    qsa(".hero .dot").forEach((d,di)=>d.classList.toggle("active", di===i));
  }
  renderBanner(0);
  setInterval(() => { idx = (idx+1)%slides.length; renderBanner(idx); }, 3500);

  // Grid swipe
  const viewport = qs(".grid-viewport");
  const pages = qs(".grid-pages");
  const dots = qsa(".pager-dots .dot");
  let page = 0;
  let startX = 0, currentX = 0, dragging = false;

  function go(p){
    page = Math.max(0, Math.min(1, p));
    pages.style.transform = `translateX(${page*-50}%)`;
    dots.forEach((d,i)=>d.classList.toggle("active", i===page));
  }
  go(0);

  viewport.addEventListener("touchstart", (e)=>{
    dragging = true; startX = e.touches[0].clientX; currentX = startX;
  }, {passive:true});
  viewport.addEventListener("touchmove", (e)=>{
    if(!dragging) return;
    const dx = e.touches[0].clientX - startX;
    pages.style.transform = `translateX(calc(${page*-50}% + ${dx}px))`;
  }, {passive:true});
  viewport.addEventListener("touchend", (e)=>{
    dragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50){ go(page + (dx<0 ? 1 : -1)); }
    else { go(page); }
  });

});
