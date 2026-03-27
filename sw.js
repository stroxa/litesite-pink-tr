let CACHE = "tostcu-v20260327031011";
let CORE = ["/","/site.css","/site.js","/logo.png","/favicon.png","/favicon.ico"];
let PRODUCTS = ["/products/ayran-27-cl.html","/products/cajun-baharatli-patates-kizartmasi.html","/products/cajun-citir-tavuk.html","/products/cheddarli-doner-100-gr.html","/products/gazoz-33cl.html","/products/hatay-usulu-mega-durum-120-gr.html","/products/hatay-usulu-tavuk-doner-100-gr.html","/products/karisik-tost.html","/products/kasarli-doner-100-gr.html","/products/kasarli-tost.html","/products/kizartma-icli-kofte-4-adet.html","/products/kola-33-cl.html","/products/kola-zero-33-cl.html","/products/patates-kizartmasi.html","/products/sarıkola-33-cl.html","/products/snitzel.html","/products/special-doner.html","/products/su-50-cl.html","/products/tavuk-nugget-8-adet.html","/img/products/ayran-27-cl-k.webp","/img/products/ayran-27-cl.webp","/img/products/cajun-baharatli-patates-kizartmasi-k.webp","/img/products/cajun-baharatli-patates-kizartmasi.webp","/img/products/cajun-citir-tavuk-k.webp","/img/products/cajun-citir-tavuk.webp","/img/products/gazoz-33cl-k.webp","/img/products/gazoz-33cl.webp","/img/products/karisik-tost-k.webp","/img/products/karisik-tost.webp","/img/products/kasarli-tost-k.webp","/img/products/kasarli-tost.webp","/img/products/kizartma-icli-kofte-4-adet-k.webp","/img/products/kizartma-icli-kofte-4-adet.webp","/img/products/kola-33-cl-k.webp","/img/products/kola-33-cl.webp","/img/products/kola-zero-33-cl-k.webp","/img/products/kola-zero-33-cl.webp","/img/products/patates-kizartmasi-k.webp","/img/products/patates-kizartmasi.webp","/img/products/sarıkola-33-cl-k.webp","/img/products/sarıkola-33-cl.webp","/img/products/snitzel-k.webp","/img/products/snitzel.webp","/img/products/su-50-cl-k.webp","/img/products/su-50-cl.webp","/img/products/tavuk-nugget-8-adet-k.webp","/img/products/tavuk-nugget-8-adet.webp"];
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
      let urls = PRODUCTS.concat(PAGES);
      Promise.allSettled(
        urls.map(function(url) { return c.add(url); })
      );
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
