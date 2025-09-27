
// lockScale.js — kunci zoom & rapikan viewport
(function(){
  // Pastikan meta viewport ada & sesuai
  var meta = document.querySelector('meta[name="viewport"]');
  if(!meta){
    meta = document.createElement('meta');
    meta.setAttribute('name','viewport');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');

  // Cegah double-tap zoom & pinch
  var lastTouch = 0;
  document.addEventListener('touchend', function(e){
    var now = new Date().getTime();
    if (now - lastTouch <= 300) {
      e.preventDefault();
    }
    lastTouch = now;
  }, {passive:false});

  document.addEventListener('gesturestart', function(e){ e.preventDefault(); }, {passive:false});
  document.addEventListener('gesturechange', function(e){ e.preventDefault(); }, {passive:false});
  document.addEventListener('gestureend', function(e){ e.preventDefault(); }, {passive:false});

  // Tambahkan pembungkus .page-wrap jika belum ada, agar width terkunci konsisten
  // Hanya lakukan jika body belum punya .page-wrap langsung.
  if(!document.querySelector('.page-wrap')){
    var wrap = document.createElement('div');
    wrap.className = 'page-wrap';
    // pindahkan semua anak body (kecuali script overlay) ke wrap
    var moving = [];
    for (var i=0; i<document.body.childNodes.length; i++){
      var n = document.body.childNodes[i];
      // abaikan script yang mungkin dipakai loader
      if(!(n.tagName && n.tagName.toLowerCase() === 'script')){
        moving.push(n);
      }
    }
    moving.forEach(function(n){ wrap.appendChild(n); });
    document.body.appendChild(wrap);
  }
})();
