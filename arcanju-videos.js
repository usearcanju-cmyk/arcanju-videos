/*!
 * Use Arcanju · Vídeos de produto
 * Bolha flutuante, carrossel antes do rodapé e bolinhas na página do produto.
 * Carregado pelo Google Tag Manager. Toda a configuração fica em videos.json.
 */
(function () {
  'use strict';
  if (window.__arcvLoaded) return;
  window.__arcvLoaded = true;

  var SCRIPT = document.currentScript || (function () {
    var s = document.querySelectorAll('script[src*="arcanju-videos"]');
    return s[s.length - 1];
  })();
  var BASE = (SCRIPT && SCRIPT.src ? SCRIPT.src : location.href).replace(/[^\/]*(\?.*)?$/, '');
  var CONFIG_URL = (SCRIPT && SCRIPT.getAttribute('data-config')) || (BASE + 'videos.json');

  var C = null;              // configuração
  var VID = {};              // vídeos por id
  var PROD = {};             // dados de produto já buscados
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var autoplayOk = !reduceMotion && !saveData;

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function url(u) { if (!u) return ''; return /^(https?:)?\/\//.test(u) || u.indexOf('data:') === 0 ? u : BASE + u.replace(/^\//, ''); }
  function brl(n) { n = Number(n); return isFinite(n) && n > 0 ? 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''; }
  function track(acao, v, extra) {
    try {
      window.dataLayer = window.dataLayer || [];
      var o = { event: 'arcv_' + acao, arcv_video: v ? v.id : '', arcv_produto: v ? (v.produto || '') : '' };
      for (var k in extra || {}) o[k] = extra[k];
      window.dataLayer.push(o);
    } catch (e) {}
  }
  function slugAtual() { var m = location.pathname.match(/\/produtos\/([^\/?#]+)/); return m ? decodeURIComponent(m[1]).toLowerCase() : ''; }
  function tipoPagina() {
    var p = location.pathname.replace(/\/+$/, '') || '/';
    if (/\/produtos\/[^\/]+/.test(p)) return 'produto';
    if (p === '/') return 'home';
    if (/\/(checkout|comprar|cart|carrinho|account|conta)(\/|$)/.test(p)) return 'excluida';
    return 'categoria';
  }
  function naPagina(lista) {
    if (!lista || !lista.length || lista.indexOf('todas') >= 0) return tipoPagina() !== 'excluida';
    return lista.indexOf(tipoPagina()) >= 0;
  }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- dados do produto (lidos da própria loja) ---------- */
  function produtoUrl(v) {
    if (v.link) return v.link;
    if (!v.produto) return '';
    return location.origin + '/produtos/' + v.produto + '/';
  }
  function lerProduto(v) {
    var slug = v.produto;
    if (!slug) return Promise.resolve(null);
    if (PROD[slug]) return PROD[slug];
    var cache = store('arcv_p_' + slug);
    if (cache) { try { PROD[slug] = Promise.resolve(JSON.parse(cache)); return PROD[slug]; } catch (e) {} }
    PROD[slug] = fetch(produtoUrl(v), { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (html) {
      var d = new DOMParser().parseFromString(html, 'text/html');
      var info = { nome: '', preco: 0, precoDe: 0, img: '' };
      $$('script[type="application/ld+json"]', d).forEach(function (s) {
        try {
          var j = JSON.parse(s.textContent);
          (Array.isArray(j) ? j : [j]).concat(j['@graph'] || []).forEach(function (x) {
            if (!x || String(x['@type']).indexOf('Product') < 0) return;
            info.nome = info.nome || x.name || '';
            var img = Array.isArray(x.image) ? x.image[0] : x.image;
            info.img = info.img || (img && (img.url || img)) || '';
            var of = Array.isArray(x.offers) ? x.offers[0] : x.offers;
            if (of) info.preco = info.preco || Number(of.price || of.lowPrice || 0);
          });
        } catch (e) {}
      });
      function meta(p) { var m = d.querySelector('meta[property="' + p + '"],meta[name="' + p + '"]'); return m ? m.getAttribute('content') : ''; }
      info.nome = info.nome || meta('og:title').replace(/\s*[-|–]\s*Use Arcanju.*$/i, '');
      info.img = info.img || meta('og:image');
      info.preco = info.preco || Number(meta('product:price:amount') || meta('og:price:amount') || 0);
      var de = d.querySelector('.js-compare-price-display, [data-compare-price], .price-compare');
      if (de) info.precoDe = Number((de.getAttribute('data-compare-price') || de.textContent).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      if (info.img && info.img.indexOf('//') === 0) info.img = 'https:' + info.img;
      store('arcv_p_' + slug, JSON.stringify(info));
      return info;
    }).catch(function () { return null; });
    return PROD[slug];
  }
  function dadosCard(v) {
    return lerProduto(v).then(function (p) {
      p = p || {};
      return {
        nome: v.nome || p.nome || '',
        preco: v.preco || p.preco || 0,
        precoDe: v.precoDe || p.precoDe || 0,
        img: url(v.imagemProduto) || p.img || '',
        link: produtoUrl(v)
      };
    });
  }

  /* ---------- estilos ---------- */
  function css() {
    var cor = (C.cores && C.cores.principal) || '#6b1a20';
    var bot = (C.cores && C.cores.botao) || '#1f9d4c';
    var s = el('style');
    s.id = 'arcv-css';
    s.textContent = [
      ':root{--arcv-cor:' + cor + ';--arcv-botao:' + bot + '}',
      '.arcv *{box-sizing:border-box}',
      '.arcv{font-family:inherit;-webkit-font-smoothing:antialiased}',
      '.arcv button{font:inherit;cursor:pointer}',
      /* bolha flutuante */
      '.arcv-bolha{position:fixed;z-index:2147483000;bottom:var(--arcv-b,20px);width:var(--arcv-t,84px);height:var(--arcv-t,84px);border-radius:50%;padding:3px;background:conic-gradient(from 210deg,var(--arcv-cor),#c9a26a,var(--arcv-cor));box-shadow:0 10px 28px -8px rgba(0,0,0,.45);transition:transform .25s ease,opacity .25s ease;animation:arcv-in .45s ease both}',
      '.arcv-bolha.dir{right:16px}.arcv-bolha.esq{left:16px}',
      '.arcv-bolha:hover{transform:scale(1.05)}',
      '.arcv-bolha .arcv-abrir{all:unset;display:block;width:100%;height:100%;border-radius:50%;overflow:hidden;border:2px solid #fff;background:#222;cursor:pointer}',
      '.arcv-bolha video,.arcv-bolha img{width:100%;height:100%;object-fit:cover;display:block}',
      '.arcv-bolha .arcv-x{position:absolute;top:-4px;right:-4px;width:22px;height:22px;border-radius:50%;border:0;background:#fff;color:#333;font-size:14px;line-height:22px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.25);padding:0}',
      '.arcv-bolha .arcv-play{position:absolute;left:50%;bottom:-10px;transform:translateX(-50%);background:var(--arcv-cor);color:#fff;font-size:10px;font-weight:700;letter-spacing:.04em;padding:3px 8px;border-radius:20px;white-space:nowrap;pointer-events:none;text-transform:uppercase}',
      '@keyframes arcv-in{from{opacity:0;transform:translateY(16px) scale(.9)}to{opacity:1;transform:none}}',
      /* carrossel */
      '.arcv-sec{padding:40px 0 48px;overflow:hidden}',
      '.arcv-sec h2{text-align:center;margin:0 16px 22px;font-size:clamp(20px,2.4vw,28px);font-weight:700;color:inherit}',
      '.arcv-trilho{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:12px 16px 18px;scrollbar-width:none;-webkit-overflow-scrolling:touch;align-items:center}',
      '.arcv-trilho::-webkit-scrollbar{display:none}',
      '@media(min-width:900px){.arcv-trilho{padding-left:max(16px,calc((100vw - 1240px)/2));padding-right:max(16px,calc((100vw - 1240px)/2))}}',
      '.arcv-card{all:unset;flex:0 0 auto;width:clamp(170px,42vw,230px);aspect-ratio:9/16;border-radius:16px;overflow:hidden;position:relative;background:#e9e3dc;scroll-snap-align:center;cursor:pointer;transition:transform .3s ease,box-shadow .3s ease;box-shadow:0 6px 18px -10px rgba(0,0,0,.35)}',
      '@media(hover:hover){.arcv-card:hover{transform:scale(1.06);box-shadow:0 16px 34px -14px rgba(0,0,0,.5);z-index:2}}',
      '.arcv-card:focus-visible{outline:3px solid var(--arcv-cor);outline-offset:3px}',
      '.arcv-card video,.arcv-card>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
      '.arcv-info{position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:8px;align-items:center;background:rgba(255,255,255,.88);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-radius:10px;padding:6px 8px;color:#1d1d1d;min-height:46px}',
      '.arcv-info img{width:34px;height:34px;border-radius:6px;object-fit:cover;flex:0 0 auto;background:#f2ede8}',
      '.arcv-info .t{font-size:11px;line-height:1.25;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
      '.arcv-info .p{font-size:12px;font-weight:700;margin-top:1px}',
      '.arcv-info .p s{font-weight:400;opacity:.5;margin-left:4px;font-size:10px}',
      '.arcv-setas{display:none}',
      '@media(min-width:900px){.arcv-setas{display:flex;justify-content:center;gap:10px;margin-top:4px}.arcv-setas button{width:40px;height:40px;border-radius:50%;border:1px solid #d8cfc6;background:#fff;color:#333;font-size:18px}.arcv-setas button:hover{border-color:var(--arcv-cor);color:var(--arcv-cor)}}',
      /* bolinhas no produto */
      '.arcv-mini{margin:14px 0 10px}',
      '.arcv-mini .tit{font-size:14px;font-weight:600;margin:0 0 8px;color:inherit}',
      '.arcv-mini .lista{display:flex;gap:12px}',
      '.arcv-mini button{all:unset;cursor:pointer;width:64px;height:64px;border-radius:50%;padding:2px;background:conic-gradient(from 210deg,var(--arcv-cor),#c9a26a,var(--arcv-cor));flex:0 0 auto;transition:transform .2s}',
      '.arcv-mini button:hover{transform:scale(1.06)}',
      '.arcv-mini button:focus-visible{outline:3px solid var(--arcv-cor);outline-offset:3px}',
      '.arcv-mini .in{display:block;width:100%;height:100%;border-radius:50%;overflow:hidden;border:2px solid #fff;background:#ddd}',
      '.arcv-mini video,.arcv-mini img{width:100%;height:100%;object-fit:cover;display:block}',
      /* player */
      '.arcv-player{position:fixed;inset:0;z-index:2147483600;background:rgba(10,6,5,.94);display:flex;align-items:center;justify-content:center;animation:arcv-f .2s ease both;touch-action:none}',
      '@keyframes arcv-f{from{opacity:0}to{opacity:1}}',
      '.arcv-palco{position:relative;width:100vw;height:100vh;height:100dvh;background:#000;overflow:hidden}',
      '@media(min-width:600px){.arcv-palco{border-radius:18px;height:min(92vh,782px);width:calc(min(92vh,782px)*9/16)}}',
      '.arcv-palco video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}',
      '.arcv-barras{position:absolute;top:10px;left:10px;right:10px;display:flex;gap:4px;z-index:3}',
      '.arcv-barras i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.35);overflow:hidden}',
      '.arcv-barras i b{display:block;height:100%;width:0;background:#fff}',
      '.arcv-topo{position:absolute;top:22px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;z-index:3}',
      '.arcv-topo .marca{color:#fff;font-size:13px;font-weight:600;text-shadow:0 1px 4px rgba(0,0,0,.5)}',
      '.arcv-topo .bt{display:flex;gap:8px}',
      '.arcv-topo button{width:38px;height:38px;border-radius:50%;border:0;background:rgba(0,0,0,.38);color:#fff;display:grid;place-items:center;padding:0}',
      '.arcv-topo svg{width:20px;height:20px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
      '.arcv-zona{position:absolute;top:70px;bottom:150px;width:35%;z-index:2}',
      '.arcv-zona.ant{left:0}.arcv-zona.prox{right:0}',
      '.arcv-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.9);color:#222;font-size:20px;display:none;z-index:4}',
      '@media(min-width:600px){.arcv-nav{display:block}.arcv-nav.ant{left:calc(50% - min(46vh,391px)*9/16 - 64px)}.arcv-nav.prox{right:calc(50% - min(46vh,391px)*9/16 - 64px)}}',
      '.arcv-nav[disabled]{opacity:.3;cursor:default}',
      '.arcv-prod{position:absolute;left:12px;right:12px;bottom:14px;z-index:3;background:#fff;border-radius:14px;padding:10px;display:flex;gap:10px;align-items:center;color:#1d1d1d;box-shadow:0 8px 24px -10px rgba(0,0,0,.6)}',
      '.arcv-prod img{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto;background:#f2ede8}',
      '.arcv-prod .tx{flex:1;min-width:0}',
      '.arcv-prod .t{font-size:13px;line-height:1.25;font-weight:600;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
      '.arcv-prod .p{font-size:14px;font-weight:700;margin-top:2px}',
      '.arcv-prod .p s{font-weight:400;opacity:.5;font-size:11px;margin-left:4px}',
      '.arcv-prod .promo{font-size:11px;color:var(--arcv-cor);font-weight:600;margin-top:2px}',
      '.arcv-prod a{flex:0 0 auto;background:var(--arcv-botao);color:#fff!important;text-decoration:none!important;font-weight:700;font-size:13px;padding:11px 14px;border-radius:10px;text-transform:uppercase;letter-spacing:.02em}',
      '.arcv-som{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;background:rgba(0,0,0,.55);color:#fff;border:0;border-radius:30px;padding:10px 16px;font-size:13px;font-weight:600;display:none}',
      '.arcv-carreg{position:absolute;left:50%;top:50%;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;animation:arcv-g 1s linear infinite;z-index:1}',
      '@keyframes arcv-g{to{transform:rotate(360deg)}}',
      'html.arcv-travado,html.arcv-travado body{overflow:hidden!important}',
      '@media(prefers-reduced-motion:reduce){.arcv-bolha,.arcv-player{animation:none}.arcv-card,.arcv-mini button{transition:none}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ---------- miniaturas que tocam só quando visíveis ---------- */
  var obs = 'IntersectionObserver' in window ? new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting && e.intersectionRatio >= 0.5) { if (!v.src && v.dataset.src) v.src = v.dataset.src; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else if (!v.paused) v.pause();
    });
  }, { threshold: [0, 0.5, 1] }) : null;

  function miniVideo(v) {
    // prévia leve (muda, em loop) com o pôster por baixo
    var src = url(v.previa || v.src);
    if (!autoplayOk || !src) { var i = el('img'); i.src = url(v.poster); i.alt = ''; i.loading = 'lazy'; return i; }
    var m = el('video');
    m.muted = true; m.loop = true; m.playsInline = true;
    m.setAttribute('muted', ''); m.setAttribute('playsinline', ''); m.setAttribute('preload', 'none');
    m.poster = url(v.poster);
    m.dataset.src = src;
    if (obs) obs.observe(m); else { m.src = src; m.autoplay = true; }
    return m;
  }

  /* ---------- player em tela cheia ---------- */
  var P = null;
  function abrir(lista, inicio, origem) {
    lista = lista.filter(function (id) { return VID[id]; });
    if (!lista.length) return;
    fechar(true);
    var foco = document.activeElement;
    var raiz = el('div', 'arcv arcv-player');
    raiz.setAttribute('role', 'dialog');
    raiz.setAttribute('aria-modal', 'true');
    raiz.setAttribute('aria-label', 'Vídeos dos produtos');
    raiz.innerHTML =
      '<button class="arcv-nav ant" aria-label="Vídeo anterior">‹</button>' +
      '<div class="arcv-palco">' +
        '<div class="arcv-carreg"></div>' +
        '<video playsinline preload="auto"></video>' +
        '<div class="arcv-barras">' + lista.map(function () { return '<i><b></b></i>'; }).join('') + '</div>' +
        '<div class="arcv-topo"><span class="marca">' + esc(C.marca || 'Use Arcanju') + '</span><span class="bt">' +
          '<button class="arcv-mudo" aria-label="Ligar ou desligar o som"></button>' +
          '<button class="arcv-fechar" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span></div>' +
        '<div class="arcv-zona ant" aria-hidden="true"></div><div class="arcv-zona prox" aria-hidden="true"></div>' +
        '<button class="arcv-som">Toque para ouvir</button>' +
        '<div class="arcv-prod" hidden></div>' +
      '</div>' +
      '<button class="arcv-nav prox" aria-label="Próximo vídeo">›</button>';
    document.body.appendChild(raiz);
    document.documentElement.classList.add('arcv-travado');
    var video = $('video', raiz);
    var mudo = store('arcv_mudo') === '1';
    P = { raiz: raiz, video: video, lista: lista, i: 0, origem: origem, foco: foco, raf: 0 };

    function iconeSom() {
      $('.arcv-mudo', raiz).innerHTML = video.muted
        ? '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
    }
    function barras() {
      $$('.arcv-barras b', raiz).forEach(function (b, k) { b.style.width = k < P.i ? '100%' : (k > P.i ? '0' : b.style.width); });
    }
    function progresso() {
      var b = $$('.arcv-barras b', raiz)[P.i];
      if (b && video.duration) b.style.width = Math.min(100, video.currentTime / video.duration * 100) + '%';
      P.raf = requestAnimationFrame(progresso);
    }
    function mostrar(k) {
      if (k < 0 || k >= lista.length) { if (k >= lista.length) fechar(); return; }
      P.i = k;
      var v = VID[lista[k]];
      $$('.arcv-barras b', raiz).forEach(function (b, j) { if (j === k) b.style.width = '0'; });
      barras();
      $('.arcv-carreg', raiz).style.display = '';
      video.poster = url(v.poster);
      video.src = url(v.src);
      video.muted = mudo;
      iconeSom();
      var tentar = video.play();
      if (tentar && tentar.catch) tentar.catch(function () {
        // o navegador bloqueou o som: toca mudo e oferece ligar
        video.muted = true; iconeSom();
        video.play().catch(function () {});
        $('.arcv-som', raiz).style.display = 'block';
        $('.arcv-carreg', raiz).style.display = 'none';
      });
      $('.arcv-nav.ant', raiz).disabled = k === 0;
      $('.arcv-nav.prox', raiz).disabled = k === lista.length - 1;
      var box = $('.arcv-prod', raiz);
      box.hidden = true;
      dadosCard(v).then(function (d) {
        if (P && P.i === k && d.link) {
          box.innerHTML = (d.img ? '<img src="' + esc(d.img) + '" alt="">' : '') +
            '<div class="tx"><div class="t">' + esc(d.nome) + '</div>' +
            (d.preco ? '<div class="p">' + brl(d.preco) + (d.precoDe > d.preco ? '<s>' + brl(d.precoDe) + '</s>' : '') + '</div>' : '') +
            (C.promo ? '<div class="promo">' + esc(C.promo) + '</div>' : '') + '</div>' +
            '<a href="' + esc(d.link) + '">' + esc(C.textoBotao || 'Comprar') + '</a>';
          box.hidden = false;
          $('a', box).addEventListener('click', function () { track('comprar', v, { arcv_origem: origem }); });
        }
      });
      track('ver', v, { arcv_origem: origem, arcv_posicao: k + 1 });
    }
    P.mostrar = mostrar;

    video.addEventListener('playing', function () { $('.arcv-carreg', raiz).style.display = 'none'; });
    video.addEventListener('waiting', function () { $('.arcv-carreg', raiz).style.display = ''; });
    video.addEventListener('ended', function () { mostrar(P.i + 1); });
    $('.arcv-fechar', raiz).addEventListener('click', function () { fechar(); });
    $('.arcv-mudo', raiz).addEventListener('click', function (e) {
      e.stopPropagation(); video.muted = !video.muted; mudo = video.muted; store('arcv_mudo', mudo ? '1' : '0'); iconeSom();
      $('.arcv-som', raiz).style.display = 'none';
    });
    $('.arcv-som', raiz).addEventListener('click', function () {
      video.muted = false; mudo = false; store('arcv_mudo', '0'); iconeSom(); this.style.display = 'none'; video.play().catch(function () {});
    });
    $('.arcv-zona.ant', raiz).addEventListener('click', function () { mostrar(P.i - 1); });
    $('.arcv-zona.prox', raiz).addEventListener('click', function () { mostrar(P.i + 1); });
    $('.arcv-nav.ant', raiz).addEventListener('click', function () { mostrar(P.i - 1); });
    $('.arcv-nav.prox', raiz).addEventListener('click', function () { mostrar(P.i + 1); });
    raiz.addEventListener('click', function (e) { if (e.target === raiz) fechar(); });

    // segurar pausa; arrastar para baixo fecha; para os lados troca
    var t0 = null;
    var palco = $('.arcv-palco', raiz);
    palco.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button,a,.arcv-prod')) return;
      t0 = { x: e.clientX, y: e.clientY, t: Date.now() };
      P.segura = setTimeout(function () { video.pause(); }, 220);
    });
    palco.addEventListener('pointerup', function (e) {
      clearTimeout(P.segura);
      if (!t0) return;
      var dx = e.clientX - t0.x, dy = e.clientY - t0.y, dt = Date.now() - t0.t;
      t0 = null;
      if (video.paused && dt > 220) { video.play().catch(function () {}); return; }
      if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { fechar(); return; }
      if (Math.abs(dx) > 60) { mostrar(P.i + (dx < 0 ? 1 : -1)); }
    });
    palco.addEventListener('pointercancel', function () { clearTimeout(P.segura); t0 = null; if (video.paused) video.play().catch(function () {}); });

    P.tecla = function (e) {
      if (e.key === 'Escape') fechar();
      else if (e.key === 'ArrowRight') mostrar(P.i + 1);
      else if (e.key === 'ArrowLeft') mostrar(P.i - 1);
      else if (e.key === 'Tab') {
        var f = $$('button:not([disabled]),a[href]', raiz).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var a = f.indexOf(document.activeElement);
        if (e.shiftKey && a <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && a === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', P.tecla);
    // pausa as miniaturas enquanto o player está aberto
    $$('.arcv-bolha video,.arcv-card video,.arcv-mini video').forEach(function (m) { m.pause(); });
    mostrar(Math.max(0, Math.min(lista.indexOf(inicio), lista.length - 1)));
    progresso();
    $('.arcv-fechar', raiz).focus();
    track('abrir', VID[inicio] || VID[lista[0]], { arcv_origem: origem });
  }

  function fechar(silencioso) {
    if (!P) return;
    cancelAnimationFrame(P.raf);
    clearTimeout(P.segura);
    document.removeEventListener('keydown', P.tecla);
    P.video.pause(); P.video.removeAttribute('src'); P.video.load();
    P.raiz.remove();
    document.documentElement.classList.remove('arcv-travado');
    var foco = P.foco;
    P = null;
    if (!silencioso && foco && foco.focus) foco.focus();
    // retoma as miniaturas visíveis
    if (obs) $$('.arcv-bolha video,.arcv-card video,.arcv-mini video').forEach(function (m) { obs.unobserve(m); obs.observe(m); });
  }

  /* ---------- 1. bolha flutuante ---------- */
  function bolha() {
    var b = C.bolha;
    if (!b || b.ativa === false || !naPagina(b.paginas)) return;
    if (store('arcv_bolha_fechada') === '1') return;
    var lista = (b.videos || []).filter(function (id) { return VID[id]; });
    if (tipoPagina() === 'produto' && b.noProdutoUsarVideosDoProduto !== false) {
      var dele = videosDoProduto();
      if (dele.length) lista = dele;
    }
    if (!lista.length) return;
    var w = el('div', 'arcv arcv-bolha ' + (b.lado === 'esquerda' ? 'esq' : 'dir'));
    w.style.setProperty('--arcv-b', (b.distanciaBaixo || 20) + 'px');
    w.style.setProperty('--arcv-t', (b.tamanho || 84) + 'px');
    var abrirBt = el('button', 'arcv-abrir');
    abrirBt.setAttribute('aria-label', 'Ver vídeos dos produtos');
    abrirBt.appendChild(miniVideo(VID[lista[0]]));
    var x = el('button', 'arcv-x', '×');
    x.setAttribute('aria-label', 'Esconder vídeo');
    w.appendChild(abrirBt);
    if (b.etiqueta !== '') w.appendChild(el('span', 'arcv-play', esc(b.etiqueta || 'Ver vídeo')));
    w.appendChild(x);
    abrirBt.addEventListener('click', function () { abrir(lista, lista[0], 'bolha'); });
    x.addEventListener('click', function (e) { e.stopPropagation(); store('arcv_bolha_fechada', '1'); w.remove(); track('fechar_bolha'); });
    document.body.appendChild(w);
    if (b.atrasoSegundos) { w.style.display = 'none'; setTimeout(function () { w.style.display = ''; }, b.atrasoSegundos * 1000); }
  }

  /* ---------- 2. carrossel antes do rodapé ---------- */
  function rodape() {
    var sels = [].concat(C.carrossel.seletorRodape || [], ['footer', '.js-footer', '[data-store^="footer"]', '#footer', '.footer']);
    for (var i = 0; i < sels.length; i++) { var f = $(sels[i]); if (f) return f; }
    return null;
  }
  function carrossel() {
    var c = C.carrossel;
    if (!c || c.ativo === false || !naPagina(c.paginas)) return;
    if ($('.arcv-sec')) return;
    var lista = (c.videos && c.videos.length ? c.videos : Object.keys(VID)).filter(function (id) { return VID[id]; });
    if (!lista.length) return;
    var f = rodape();
    var sec = el('section', 'arcv arcv-sec');
    sec.setAttribute('aria-label', c.titulo || 'Vídeos dos produtos');
    if (c.corFundo) sec.style.background = c.corFundo;
    sec.innerHTML = '<h2>' + esc(c.titulo || 'Descubra cada detalhe em vídeo') + '</h2><div class="arcv-trilho"></div>' +
      '<div class="arcv-setas"><button aria-label="Voltar">‹</button><button aria-label="Avançar">›</button></div>';
    var trilho = $('.arcv-trilho', sec);
    lista.forEach(function (id) {
      var v = VID[id];
      var card = el('button', 'arcv-card');
      card.setAttribute('aria-label', 'Ver vídeo' + (v.nome ? ' de ' + v.nome : ''));
      card.appendChild(miniVideo(v));
      var info = el('div', 'arcv-info', '<div><div class="t">' + esc(v.nome || '') + '</div><div class="p"></div></div>');
      card.appendChild(info);
      dadosCard(v).then(function (d) {
        info.innerHTML = (d.img ? '<img src="' + esc(d.img) + '" alt="" loading="lazy">' : '') +
          '<div><div class="t">' + esc(d.nome) + '</div>' +
          (d.preco ? '<div class="p">' + brl(d.preco) + (d.precoDe > d.preco ? '<s>' + brl(d.precoDe) + '</s>' : '') + '</div>' : '') + '</div>';
        if (!d.nome) info.style.display = 'none';
      });
      card.addEventListener('click', function () { abrir(lista, id, 'carrossel'); });
      trilho.appendChild(card);
    });
    var setas = $$('.arcv-setas button', sec);
    setas[0].addEventListener('click', function () { trilho.scrollBy({ left: -trilho.clientWidth * 0.8, behavior: 'smooth' }); });
    setas[1].addEventListener('click', function () { trilho.scrollBy({ left: trilho.clientWidth * 0.8, behavior: 'smooth' }); });
    if (f && f.parentNode) f.parentNode.insertBefore(sec, f); else document.body.appendChild(sec);
  }

  /* ---------- 3. bolinhas na página do produto ---------- */
  function videosDoProduto() {
    var s = slugAtual();
    if (!s) return [];
    var mapa = (C.produto && C.produto.porProduto) || {};
    var ids = mapa[s] || [];
    if (!ids.length) ids = Object.keys(VID).filter(function (id) { return (VID[id].produto || '').toLowerCase() === s; });
    if (!ids.length && C.produto && C.produto.padrao) ids = C.produto.padrao;
    return ids.filter(function (id) { return VID[id]; }).slice(0, (C.produto && C.produto.maximo) || 3);
  }
  function pontoProduto() {
    var p = C.produto || {};
    if (p.seletorAntes) { var a = $(p.seletorAntes); if (a) return { antes: a }; }
    // bloco "Compra segura" com as bandeiras
    var alvo = null;
    $$('div,p,span,section').some(function (n) {
      if (n.closest('.arcv')) return false;
      var t = (n.textContent || '').trim();
      if (t.length < 80 && /compra segura/i.test(t) && n.children.length < 12) { alvo = n; return true; }
      return false;
    });
    if (alvo) {
      while (alvo.parentElement && (alvo.parentElement.textContent || '').trim().length < 120 && !alvo.parentElement.querySelector('.js-addtocart,[type=submit],form')) alvo = alvo.parentElement;
      return { antes: alvo };
    }
    var btn = $('.js-addtocart, .js-prod-submit-form, form[action*="carrinho"] [type=submit], form[action*="cart"] [type=submit]');
    if (btn) {
      var linha = btn.closest('.form-row,.row,.js-product-buy-container,.product-buy-container') || btn.parentElement;
      return { depois: linha };
    }
    return null;
  }
  function bolinhas() {
    var p = C.produto;
    if (!p || p.ativo === false || tipoPagina() !== 'produto') return;
    var lista = videosDoProduto();
    if (!lista.length) return;
    function inserir() {
      if ($('.arcv-mini')) return true;
      var ponto = pontoProduto();
      if (!ponto) return false;
      var w = el('div', 'arcv arcv-mini');
      w.innerHTML = (p.titulo === '' ? '' : '<div class="tit">' + esc(p.titulo || 'Descubra cada detalhe em vídeo') + '</div>') + '<div class="lista"></div>';
      lista.forEach(function (id, k) {
        var b = el('button');
        b.setAttribute('aria-label', 'Ver vídeo ' + (k + 1));
        var i = el('span', 'in');
        i.appendChild(miniVideo(VID[id]));
        b.appendChild(i);
        b.addEventListener('click', function () { abrir(lista, id, 'produto'); });
        $('.lista', w).appendChild(b);
      });
      if (ponto.antes) ponto.antes.parentNode.insertBefore(w, ponto.antes);
      else ponto.depois.parentNode.insertBefore(w, ponto.depois.nextSibling);
      return true;
    }
    inserir();
    // o tema redesenha a área de compra ao trocar a variação: recoloca se sumir
    var tempo;
    new MutationObserver(function () {
      clearTimeout(tempo);
      tempo = setTimeout(function () { if (!$('.arcv-mini')) inserir(); }, 300);
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- início ---------- */
  function iniciar(cfg) {
    C = cfg || {};
    if (C.ativo === false) return;
    (C.videos || []).forEach(function (v) { if (v && v.id && v.src && v.ativo !== false) VID[v.id] = v; });
    if (!Object.keys(VID).length) return;
    C.bolha = C.bolha || {};
    C.carrossel = C.carrossel || {};
    C.produto = C.produto || {};
    css();
    bolha();
    carrossel();
    bolinhas();
    window.ArcanjuVideos = { abrir: function (ids, inicio) { abrir(ids || Object.keys(VID), inicio, 'api'); }, fechar: fechar, config: C };
  }
  function carregar() {
    if (window.ARCANJU_VIDEOS_CONFIG) return iniciar(window.ARCANJU_VIDEOS_CONFIG);
    fetch(CONFIG_URL + (CONFIG_URL.indexOf('?') < 0 ? '?' : '&') + 'v=' + Math.floor(Date.now() / 60000))
      .then(function (r) { return r.json(); })
      .then(iniciar)
      .catch(function (e) { if (window.console) console.warn('[Arcanju vídeos] não carregou a configuração', e); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', carregar); else carregar();
})();
