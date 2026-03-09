let CACHE = "durumcu-v20260309234150";
let CORE = ["/","/site.css","/site.js","/logo.png","/favicon.png","/favicon.ico"];
let PRODUCTS = ["/products/adana-durum-120-gr.html","/products/ayran-27-cl.html","/products/cheddarli-doner-100-gr.html","/products/ciger-sis-durum.html","/products/ekmek-arasi-et-tantuni-100-gr.html","/products/ekmek-arasi-tavuk-tantuni-100-gr.html","/products/et-sis-durum.html","/products/et-tantuni-durum-100-gr.html","/products/gazoz-33cl.html","/products/hatay-usulu-mega-durum-120-gr.html","/products/hatay-usulu-tavuk-doner-100-gr.html","/products/kasarli-doner-100-gr.html","/products/kola-33-cl.html","/products/kola-zero-33-cl.html","/products/sarıkola-33-cl.html","/products/special-doner.html","/products/su-50-cl.html","/products/tavuk-sis-durum.html","/products/tavuk-tantuni-durum-100-gr.html","/products/urfa-durum-120-gr.html","/products/yogurtlu-et-tantuni.html","/products/yogurtlu-tavuk-tantuni.html","/img/products/adana-durum-120-gr-k.webp","/img/products/adana-durum-120-gr.webp","/img/products/ayran-27-cl-k.webp","/img/products/ayran-27-cl.webp","/img/products/cheddarli-doner-100-gr-k.webp","/img/products/cheddarli-doner-100-gr.webp","/img/products/ciger-sis-durum-k.webp","/img/products/ciger-sis-durum.webp","/img/products/ekmek-arasi-et-tantuni-100-gr-k.webp","/img/products/ekmek-arasi-et-tantuni-100-gr.webp","/img/products/ekmek-arasi-tavuk-tantuni-100-gr-k.webp","/img/products/ekmek-arasi-tavuk-tantuni-100-gr.webp","/img/products/et-sis-durum-k.webp","/img/products/et-sis-durum.webp","/img/products/et-tantuni-durum-100-gr-k.webp","/img/products/et-tantuni-durum-100-gr.webp","/img/products/gazoz-33cl-k.webp","/img/products/gazoz-33cl.webp","/img/products/hatay-usulu-mega-durum-120-gr-k.webp","/img/products/hatay-usulu-mega-durum-120-gr.webp","/img/products/hatay-usulu-tavuk-doner-100-gr-k.webp","/img/products/hatay-usulu-tavuk-doner-100-gr.webp","/img/products/kasarli-doner-100-gr-k.webp","/img/products/kasarli-doner-100-gr.webp","/img/products/kola-33-cl-k.webp","/img/products/kola-33-cl.webp","/img/products/kola-zero-33-cl-k.webp","/img/products/kola-zero-33-cl.webp","/img/products/sarıkola-33-cl-k.webp","/img/products/sarıkola-33-cl.webp","/img/products/special-doner-k.webp","/img/products/special-doner.webp","/img/products/su-50-cl-k.webp","/img/products/su-50-cl.webp","/img/products/tavuk-sis-durum-k.webp","/img/products/tavuk-sis-durum.webp","/img/products/tavuk-tantuni-durum-100-gr-k.webp","/img/products/tavuk-tantuni-durum-100-gr.webp","/img/products/urfa-durum-120-gr-k.webp","/img/products/urfa-durum-120-gr.webp","/img/products/yogurtlu-et-tantuni-k.webp","/img/products/yogurtlu-et-tantuni.webp","/img/products/yogurtlu-tavuk-tantuni-k.webp","/img/products/yogurtlu-tavuk-tantuni.webp"];
let PAGES = ["/pages/gizlilik-politikasi.html","/pages/hakkimizda.html","/pages/satis-sozlesmesi.html","/pages/site-haritasi.html","/pages/urunlerimiz.html","/index.html","/404.html","/img/address.png","/img/basket.png","/img/delete.png","/img/email.png","/img/facebook.png","/img/instagram.png","/img/linkedin.png","/img/map.png","/img/menu-close.png","/img/menu-open.png","/img/minus.png","/img/phone.png","/img/plus.png","/img/telegram.png","/img/whatsapp.png","/img/youtube.png","/img/pages/hero-header-k.webp","/img/pages/hero-header.webp"];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(CORE); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("message", function(e) {
  if (e.data === "cache-all") {
    caches.open(CACHE).then(function(c) {
      c.addAll(PRODUCTS).then(function() {
        return c.addAll(PAGES);
      }, function() {
        return c.addAll(PAGES);
      });
    });
  }
});

self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;

  let url = new URL(e.request.url);
  let isCore = CORE.indexOf(url.pathname) !== -1;

  if (isCore) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        let clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return caches.match(url.pathname);
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(cached) {
      let fetched = fetch(e.request).then(function(res) {
        let clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return cached;
      });
      return cached || fetched;
    })
  );
});
