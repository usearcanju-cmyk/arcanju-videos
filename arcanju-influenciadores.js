/* ==========================================================================
   Use Arcanju — Página "Influenciadores" (mural de santinhos)  |  v1
   Prefixo: ain-
   Roda só na página configurada em CFG.caminhos. Substitui o conteúdo da
   página (título + texto) pelo mural. O carrossel "Descubra cada detalhe em
   vídeo" e o resto do site não são tocados.
   ========================================================================== */
(function () {
  'use strict';

  if (window.__ARCANJU_INFLU__) return;
  window.__ARCANJU_INFLU__ = true;

  /* =========================================================================
     CONFIGURAÇÃO
     ========================================================================= */
  var CFG = {
    // Endereços da página na loja (com ou sem barra no final)
    caminhos: ['/influenciadores', '/influenciadoras'],

    // Onde ficam os vídeos (mesmo projeto dos vídeos de produto)
    baseVideos: 'https://arcanju-videos.vercel.app/videos/',
    // <arquivo> = o @ sem pontos e sem "_" (ex.: babinogueira_ → babinogueira)

    selo: 'Comunidade Use Arcanju',
    titulo: 'Quem veste a fé com a gente',
    texto: 'Criadoras e criadores católicos que já fizeram parceria com a Use Arcanju. Toque em um santinho para assistir.',
    textoSemVideo: 'Criadoras e criadores católicos que já fizeram parceria com a Use Arcanju. Toque em um santinho para conhecer cada um.',

    botaoLoja: { texto: 'Ver as camisetas', link: '/produtos/' },

    convite: {
      ativo: true,
      titulo: 'Quer vestir a fé com a gente?',
      texto: 'Se você cria conteúdo católico e quer fazer parceria com a Use Arcanju, fale com a gente.',
      botao: 'Quero ser parceira(o)',
      link: 'https://suporte.usearcanju.com.br/'
    },

    // itens = sequência dos stories de cada pessoa: v = vídeo, f = foto (na ordem).
    // Arquivos: influ-<slug>-<n>.mp4 / .jpg  (n = posição, começando em 1).
    // Deixe itens vazio ('') para quem ainda não tem conteúdo: o santinho leva ao Instagram.
    // Quem tem stories aparece primeiro no mural. capa: n = qual vídeo vira a capa (padrão: o primeiro vídeo).
    pessoas: [
      { nome: 'Babi Nogueira',       user: 'babinogueira_',         slug: 'babinogueira',       itens: 'ffvvf', capa: 4 },
      { nome: 'Anna Helena Zanella', user: 'annahelenazanella',     slug: 'annahelenazanella',  itens: 'vvvvvfvvvvvvfvvfvvvvvvv' },
      { nome: 'Clara Donegatti',     user: 'clara.donegatti',       slug: 'claradonegatti',     itens: 'vvvvv' },
      { nome: 'Nath Blogs',          user: 'nathblogs_',            slug: 'nathblogs2',         itens: 'vvvvvf' },
      { nome: 'Mariazinha',          user: 'a_mariazinhaa_',        slug: 'amariazinhaa',       itens: 'vvv' },
      { nome: 'Eloize Mregalote',    user: 'elo_catolica_',         slug: 'elocatolica',        itens: 'vvv' },
      { nome: 'Gabrielly Cruz',      user: 'gabriellycruz_oficial', slug: 'gabriellycruz',      itens: 'v' },
      { nome: 'Isabela Rubik',       user: 'isabela_rubik',         slug: 'isabelarubik2',      itens: 'vvfvvv' },
      { nome: 'Julia Silva',         user: 'juliasiilva.daily',     slug: 'juliasilva',         itens: '' },
      { nome: 'Clis Colo de Deus',   user: 'cliscolodedeus',        slug: 'cliscolodedeus',     itens: 'v' },
      { nome: 'Sthella Goulart',     user: 'sthellagoulart',        slug: 'sthellagoulart',     itens: 'vff' },
      { nome: 'Elisa Ester',         user: 'elisacavalcante_',      slug: 'elisacavalcante',    itens: '' },
      { nome: 'Clara de Oliveira',   user: 'dailyby_clarinha',      slug: 'dailybyclarinha',    itens: 'fff' },
      { nome: 'Bruna Fernandes',     user: 'brunnafernanddes10',    slug: 'brunnafernanddes102', itens: 'vvfvv' },
      { nome: 'Elena Milhomem',      user: 'elena.milhomem',        slug: 'elenamilhomem',      itens: 'v' },
      { nome: 'Clara Fonseca',       user: 'clarafonsecash',        slug: 'clarafonseca',       itens: 'v' },
      { nome: 'João Acutis',         user: 'joaoacutis',            slug: 'joaoacutis',         itens: 'vvf' },
      { nome: 'Lavinia Tavares',     user: 'laviniatavares_',       slug: 'laviniatavares',     itens: 'vvvvvvv' },
      { nome: 'Clara Seabra',        user: 'clara_seabra',          slug: 'claraseabra',        itens: 'f' },
      { nome: 'Letícia Sales',       user: 'leeticia.salles',       slug: 'leticiasales',       itens: 'v' },
      { nome: 'Gica',                user: 'itss.gica',             slug: 'itssgica',           itens: 'v' }
    ],
    segundosFoto: 6,

    // Seção na página inicial (abaixo de "Por dentro da Use Arcanju")
    home: {
      ativo: true,
      titulo: 'QUEM VESTE A FÉ COM A GENTE',
      texto: 'Criadoras e criadores católicos que receberam e vestem a Use Arcanju. Toque em um santinho para assistir.',
      botao: 'Conhecer todos os influenciadores',
      link: '/influenciadores/',
      depoisDe: '.arcanju-production'   // seção que fica acima
    },

    cores: {
      vinho: '#6B1B22',
      vinhoClaro: '#8C2A33',
      texto: '#2B2B2B',
      cinza: '#6F6F6F',
      borda: '#E6E1DC',
      creme: '#FBF8F3',
      papel: '#F6EFE6'
    }
  };

  // Para testes: window.ARCANJU_INFLU_TESTE = { pessoas: [...] } sobrescreve a config
  if (window.ARCANJU_INFLU_TESTE) {
    Object.keys(window.ARCANJU_INFLU_TESTE).forEach(function (k) { CFG[k] = window.ARCANJU_INFLU_TESTE[k]; });
  }

  /* =========================================================================
     Helpers
     ========================================================================= */
  function $(s, c) { return (c || document).querySelector(s); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function base(p, n) { return CFG.baseVideos + 'influ-' + p.slug + '-' + n; }
  function itensDe(p) {
    return (p.itens || '').split('').map(function (t, i) { return { tipo: t === 'v' ? 'video' : 'foto', n: i + 1 }; });
  }
  function urlItem(p, it) { return base(p, it.n) + (it.tipo === 'video' ? '.mp4' : '.jpg'); }
  function urlCapa(p, it) { return base(p, it.n) + '.jpg'; }
  function primeiroVideo(p) { return itensDe(p).filter(function (it) { return it.tipo === 'video'; })[0]; }
  function urlInsta(p) { return 'https://www.instagram.com/' + p.user + '/'; }
  function inicial(nome) { return nome.trim().charAt(0).toUpperCase(); }
  function evento(nome, p) {
    try { (window.dataLayer = window.dataLayer || []).push({ event: nome, influenciador: p ? p.user : undefined }); } catch (e) {}
  }
  function reduzMovimento() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function naPagina() {
    var path = location.pathname.replace(/\/+$/, '').toLowerCase();
    return CFG.caminhos.some(function (c) { return path === c.replace(/\/+$/, '').toLowerCase(); });
  }

  var CRUZ = '<svg viewBox="0 0 64 16" aria-hidden="true"><path d="M2 8h22M40 8h22" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity=".55"/><path d="M32 2v12M28 6h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  var INSTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>';
  var SOM_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var SOM_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var FECHAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  /* =========================================================================
     CSS
     ========================================================================= */
  function injetarCSS() {
    if ($('#ain-css')) return;
    var c = CFG.cores;
    var css = `
    .ain, .ain * { box-sizing:border-box; }
    .ain { font-family:inherit; color:${c.texto}; padding:8px 0 56px; }
    .ain-titulo-fonte { font-family:Gabarito, inherit; }

    /* Topo */
    .ain-topo { text-align:center; max-width:640px; margin:0 auto; padding:28px 16px 8px; }
    .ain-selo { display:inline-flex; align-items:center; gap:10px; color:${c.vinho};
      font-size:11.5px; font-weight:700; letter-spacing:2.4px; text-transform:uppercase; }
    .ain-selo svg { width:34px; height:10px; }
    .ain-topo h1 { font-family:Gabarito, inherit; font-weight:800; color:${c.vinho};
      font-size:34px; line-height:1.04; letter-spacing:-.6px; margin:14px 0 12px; text-transform:none; }
    .ain-topo p { font-size:15px; line-height:1.55; color:${c.cinza}; margin:0 auto; max-width:480px; }
    .ain-conta { margin-top:16px; display:inline-flex; gap:8px; align-items:center; font-size:13px;
      color:${c.vinho}; font-weight:600; background:${c.papel}; border:1px solid ${c.borda};
      border-radius:999px; padding:7px 14px; }
    .ain-conta b { font-family:Gabarito, inherit; font-size:15px; }

    /* Faixa com os @ */
    .ain-faixa { margin:26px 0 30px; background:${c.vinho}; color:${c.creme}; overflow:hidden;
      transform:rotate(-1.2deg); width:104%; margin-left:-2%; box-shadow:0 6px 18px rgba(107,27,34,.18); }
    .ain-faixa__trilho { display:flex; width:max-content; animation:ainRola 60s linear infinite; }
    .ain-faixa span { white-space:nowrap; font-size:13px; font-weight:600; letter-spacing:.3px; padding:11px 0; }
    .ain-faixa i { font-style:normal; opacity:.55; padding:0 14px; }
    @keyframes ainRola { from { transform:translateX(0); } to { transform:translateX(-50%); } }

    /* Mural */
    .ain-mural { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:26px 14px;
      max-width:1120px; margin:0 auto; padding:10px 14px 0; }
    .ain-card { position:relative; display:block; text-decoration:none; color:inherit; cursor:pointer;
      background:${c.creme}; border:1px solid rgba(107,27,34,.22); border-radius:999px 999px 14px 14px;
      padding:8px 8px 14px; text-align:center;
      box-shadow:0 1px 0 rgba(255,255,255,.8) inset, 0 8px 22px rgba(60,20,20,.08);
      transform:rotate(var(--ain-r, 0deg)); transition:transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s;
      opacity:0; animation:ainEntra .7s cubic-bezier(.2,.8,.2,1) forwards; animation-delay:var(--ain-d, 0s);
      -webkit-tap-highlight-color:transparent; font:inherit; width:100%; }
    .ain-card::after { content:''; position:absolute; inset:4px; border:1px solid rgba(107,27,34,.12);
      border-radius:999px 999px 11px 11px; pointer-events:none; }
    .ain-card:hover, .ain-card:focus-visible { transform:rotate(0deg) translateY(-6px);
      box-shadow:0 18px 34px rgba(60,20,20,.16); outline:none; }
    .ain-card:active { transform:rotate(0deg) scale(.98); }
    @keyframes ainEntra { from { opacity:0; translate:0 18px; } to { opacity:1; translate:0 0; } }

    .ain-midia { position:relative; display:block; aspect-ratio:3/4; border-radius:999px 999px 8px 8px; overflow:hidden;
      background:linear-gradient(160deg, ${c.vinhoClaro}, ${c.vinho} 70%); isolation:isolate; }
    .ain-midia video, .ain-midia img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
    .ain-midia video { opacity:0; transition:opacity .4s; }
    .ain-midia video.ain-on { opacity:1; }
    .ain-midia::after { content:''; position:absolute; inset:0;
      background:linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(40,8,12,.45)); pointer-events:none; }
    .ain-mono { position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      font-family:Gabarito, inherit; font-weight:800; font-size:64px; color:rgba(251,248,243,.92); }
    .ain-mono::before { content:''; position:absolute; width:62%; aspect-ratio:1; border-radius:50%;
      border:1px solid rgba(251,248,243,.35); box-shadow:0 0 0 10px rgba(251,248,243,.06); }
    .ain-raios { position:absolute; inset:0; opacity:.18;
      background:repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,255,255,.9) 0 2deg, transparent 2deg 12deg);
      -webkit-mask:radial-gradient(circle at 50% 46%, #000 0 30%, transparent 62%);
              mask:radial-gradient(circle at 50% 46%, #000 0 30%, transparent 62%); }
    .ain-play { position:absolute; z-index:2; left:50%; bottom:10px; transform:translateX(-50%);
      width:34px; height:34px; border-radius:50%; background:rgba(251,248,243,.94); color:${c.vinho};
      display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,.25); }
    .ain-play svg { width:15px; height:15px; margin-left:2px; }
    .ain-ig { position:absolute; z-index:2; left:50%; bottom:10px; transform:translateX(-50%);
      height:28px; padding:0 11px; border-radius:999px; background:rgba(251,248,243,.94); color:${c.vinho};
      display:flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700; }
    .ain-ig svg { width:14px; height:14px; }

    .ain-orn { display:block; color:${c.vinho}; margin:11px auto 4px; width:52px; height:13px; }
    .ain-orn svg { width:100%; height:100%; display:block; }
    .ain-nome { display:block; font-family:Gabarito, inherit; font-weight:700; font-size:15px; line-height:1.15; color:${c.vinho};
      padding:0 4px; }
    .ain-user { display:block; margin-top:3px; font-size:12px; color:${c.cinza}; overflow:hidden; text-overflow:ellipsis;
      white-space:nowrap; padding:0 6px; }

    /* Convite */
    .ain-convite { max-width:560px; margin:56px auto 0; padding:0 16px; text-align:center; }
    .ain-convite__caixa { border:1px dashed rgba(107,27,34,.35); border-radius:16px; background:${c.papel};
      padding:24px 20px; }
    .ain-convite h2 { font-family:Gabarito, inherit; font-weight:800; color:${c.vinho}; font-size:22px;
      margin:8px 0 8px; text-transform:none; letter-spacing:-.2px; }
    .ain-convite p { margin:0 0 16px; font-size:14px; line-height:1.5; color:${c.cinza}; }
    .ain-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:46px;
      padding:0 22px; border-radius:10px; background:${c.vinho}; color:#fff !important; font-weight:700;
      font-size:14px; text-decoration:none !important; letter-spacing:.2px; transition:background .2s; }
    .ain-btn:hover { background:${c.vinhoClaro}; }

    @media (min-width:640px) {
      .ain-mural { grid-template-columns:repeat(3, minmax(0,1fr)); gap:34px 22px; }
      .ain-topo h1 { font-size:44px; }
    }
    @media (min-width:1000px) {
      .ain-mural { grid-template-columns:repeat(4, minmax(0,1fr)); gap:40px 28px; padding-bottom:40px; }
      .ain-mural .ain-card:nth-child(4n+2), .ain-mural .ain-card:nth-child(4n+4) { margin-top:44px; margin-bottom:-44px; }
      .ain-topo h1 { font-size:54px; }
      .ain-topo { padding-top:40px; }
      .ain-nome { font-size:16.5px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ain-faixa__trilho { animation:none; }
      .ain-card { animation:none; opacity:1; }
    }

    /* Player (stories) */
    .ain-st { position:fixed; inset:0; z-index:2147483000; background:#0B0707; display:flex;
      align-items:center; justify-content:center; opacity:0; transition:opacity .25s; touch-action:none; }
    .ain-st.ain-aberto { opacity:1; }
    .ain-st__caixa { position:relative; height:100%; max-height:100dvh; aspect-ratio:9/16; max-width:100vw;
      background:#000; overflow:hidden; transition:transform .25s; }
    @media (min-width:700px) { .ain-st__caixa { height:92vh; border-radius:18px; } }
    .ain-st video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; background:#000; }
    .ain-st__sombra { position:absolute; inset:0; pointer-events:none;
      background:linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,.7)); }
    .ain-st__barras { position:absolute; top:10px; left:10px; right:10px; display:flex; gap:4px; z-index:3; }
    .ain-st__barras span { flex:1; height:2.5px; border-radius:2px; background:rgba(255,255,255,.35); overflow:hidden; }
    .ain-st__barras span i { display:block; height:100%; width:0; background:#fff; }
    .ain-st__topo { position:absolute; top:22px; left:12px; right:8px; z-index:3; display:flex; align-items:center;
      gap:10px; color:#fff; }
    .ain-st__av { width:36px; height:36px; border-radius:50%; flex:0 0 auto; display:flex; align-items:center;
      justify-content:center; background:${c.vinho}; border:2px solid ${c.creme}; font-family:Gabarito, inherit;
      font-weight:800; font-size:16px; }
    .ain-st__quem { flex:1; min-width:0; line-height:1.2; }
    .ain-st__quem b { display:block; font-size:14px; }
    .ain-st__quem a { color:rgba(255,255,255,.8) !important; font-size:12px; text-decoration:none !important; }
    .ain-st__ic { width:40px; height:40px; border:0; background:transparent; color:#fff; display:flex;
      align-items:center; justify-content:center; cursor:pointer; padding:0; }
    .ain-st__ic svg { width:22px; height:22px; }
    .ain-st__zona { position:absolute; top:70px; bottom:110px; z-index:2; }
    .ain-st__zona--esq { left:0; width:32%; } .ain-st__zona--dir { right:0; width:68%; }
    .ain-st__base { position:absolute; left:12px; right:12px; bottom:max(14px, env(safe-area-inset-bottom)); z-index:3;
      display:flex; gap:8px; }
    .ain-st__base a { flex:1; height:46px; border-radius:10px; display:flex; align-items:center; justify-content:center;
      gap:7px; font-size:14px; font-weight:700; text-decoration:none !important; }
    .ain-st__base svg { width:17px; height:17px; }
    .ain-st__insta { background:rgba(255,255,255,.14); color:#fff !important; border:1px solid rgba(255,255,255,.35);
      -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); }
    .ain-st__loja { background:${c.vinho}; color:#fff !important; }
    .ain-st__seta { display:none; }
    .ain-st__foto { position:absolute; inset:0; display:none; background:#000; }
    .ain-st__foto.ain-on { display:block; }
    .ain-st__foto .ain-st__fundo { position:absolute; inset:-20px; background-size:cover; background-position:center;
      filter:blur(22px) brightness(.55); }
    .ain-st__foto img { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; }
    .ain-st video.ain-off { display:none; }
    .ain-st__caixa.ain-troca { animation:ainTroca .28s ease; }
    @keyframes ainTroca { from { opacity:.35; transform:scale(.97); } to { opacity:1; transform:none; } }
    .ain-qtd { position:absolute; z-index:2; left:50%; bottom:10px; transform:translateX(-50%); height:28px;
      padding:0 11px 0 9px; border-radius:999px; background:rgba(251,248,243,.94); color:${c.vinho};
      font-size:11.5px; font-weight:700; white-space:nowrap; display:flex; align-items:center; gap:5px;
      box-shadow:0 4px 12px rgba(0,0,0,.25); }
    .ain-qtd svg { width:12px; height:12px; }
    .ain-card--story .ain-midia { box-shadow:0 0 0 2px ${c.creme}, 0 0 0 4px ${c.vinho}; }
    @media (min-width:900px) {
      .ain-st__seta { display:flex; position:absolute; top:50%; transform:translateY(-50%); width:48px; height:48px;
        border-radius:50%; border:0; background:rgba(255,255,255,.12); color:#fff; cursor:pointer;
        align-items:center; justify-content:center; font-size:22px; }
      .ain-st__seta:hover { background:rgba(255,255,255,.22); }
      .ain-st__seta--ant { left:calc(50% - 46vh * 9 / 16 - 76px); }
      .ain-st__seta--prox { right:calc(50% - 46vh * 9 / 16 - 76px); }
    }
    body.ain-travado { overflow:hidden !important; }
    .ain-home { padding:64px 20px; box-sizing:border-box; }
    .ain-home .arc-head { margin-bottom:22px; }
    .ain-home__trilho-wrap { position:relative; }
    .ain-home__trilho { display:flex; gap:18px; overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none;
      -webkit-overflow-scrolling:touch; padding:14px 6px 22px; margin:0 -6px; }
    .ain-home__trilho::-webkit-scrollbar { display:none; }
    .ain-home__trilho .ain-card { flex:0 0 138px; width:138px; scroll-snap-align:start; }
    .ain-home__trilho .ain-nome { font-size:14px; }
    .ain-home__nav { display:none; }
    .ain-home__rodape { margin-top:10px; }
    .ain-home__link { display:inline-flex; align-items:center; gap:8px; height:46px; padding:0 22px; border-radius:10px;
      background:${c.vinho}; color:#fff !important; font-weight:700; font-size:14px; text-decoration:none !important;
      transition:background .2s; }
    .ain-home__link:hover { background:${c.vinhoClaro}; }
    @media (max-width:640px) { .ain-home { padding:44px 16px; } }
    @media (min-width:900px) {
      .ain-home__trilho .ain-card { flex-basis:190px; width:190px; }
      .ain-home__nav { display:flex; position:absolute; top:42%; transform:translateY(-50%); z-index:3; width:44px; height:44px;
        border-radius:50%; border:1px solid ${c.borda}; background:#fff; color:${c.texto}; font-size:22px; cursor:pointer;
        align-items:center; justify-content:center; box-shadow:0 6px 18px rgba(0,0,0,.08); }
      .ain-home__nav:hover { border-color:${c.vinho}; color:${c.vinho}; }
      .ain-home__nav--ant { left:-14px; } .ain-home__nav--prox { right:-14px; }
    }
    .ain-card.ain-destaque { opacity:1; animation:ainDestaque 1.4s ease-in-out 3; z-index:2; }
    @keyframes ainDestaque { 0%,100% { box-shadow:0 8px 22px rgba(60,20,20,.08), 0 0 0 0 rgba(107,27,34,.0); transform:rotate(0) scale(1); }
      50% { box-shadow:0 18px 34px rgba(60,20,20,.18), 0 0 0 6px rgba(107,27,34,.28); transform:rotate(0) scale(1.04); } }
    `;
    var s = el('style'); s.id = 'ain-css'; s.textContent = css;
    document.head.appendChild(s);
  }

  /* =========================================================================
     Montagem da página
     ========================================================================= */
  function comStories() { return CFG.pessoas.filter(function (p) { return !!p.itens; }); }

  function montarTopo() {
    var temVideo = comStories().length > 0;
    var t = el('header', 'ain-topo');
    t.innerHTML =
      '<div class="ain-selo">' + CRUZ.replace('viewBox="0 0 64 16"', 'viewBox="0 0 64 16" style="transform:scaleX(-1)"') +
        esc(CFG.selo) + CRUZ + '</div>' +
      '<h1>' + esc(CFG.titulo) + '</h1>' +
      '<p>' + esc(temVideo ? CFG.texto : CFG.textoSemVideo) + '</p>' +
      '<div class="ain-conta"><b>' + CFG.pessoas.length + '</b> vozes, uma mesma fé</div>';
    return t;
  }

  function montarFaixa() {
    var f = el('div', 'ain-faixa');
    f.setAttribute('aria-hidden', 'true');
    var itens = CFG.pessoas.map(function (p) { return '@' + esc(p.user); }).join('<i>✦</i>') + '<i>✦</i>';
    f.innerHTML = '<div class="ain-faixa__trilho"><span>' + itens + '</span><span>' + itens + '</span></div>';
    return f;
  }

  function montarCard(p, i) {
    var itens = itensDe(p), tem = itens.length > 0;
    var card = el(tem ? 'button' : 'a', 'ain-card' + (tem ? ' ain-card--story' : ''));
    card.setAttribute('data-slug', p.slug);
    if (tem) {
      card.type = 'button';
      card.setAttribute('aria-label', 'Ver os stories de ' + p.nome);
    } else {
      card.href = urlInsta(p); card.target = '_blank'; card.rel = 'noopener';
      card.setAttribute('aria-label', p.nome + ' no Instagram');
    }
    var rot = [-1.6, 1.1, -0.7, 1.5, -1.2, 0.8][i % 6];
    card.style.setProperty('--ain-r', rot + 'deg');
    card.style.setProperty('--ain-d', Math.min(i * 0.05, 0.8) + 's');

    var midia;
    if (tem) {
      var pv = p.capa ? itens[p.capa - 1] : primeiroVideo(p);
      var capa = pv ? urlCapa(p, pv) : urlCapa(p, itens[0]);
      midia = '<img src="' + esc(capa) + '" alt="" loading="lazy">' +
        (pv ? '<video muted playsinline loop preload="none" data-src="' + esc(base(p, pv.n) + '-previa.mp4') + '"></video>' : '') +
        '<span class="ain-play">' + PLAY + '</span>';
    } else {
      midia = '<span class="ain-raios"></span><span class="ain-mono">' + esc(inicial(p.nome)) + '</span>' +
        '<span class="ain-ig">' + INSTA + 'Instagram</span>';
    }

    card.innerHTML =
      '<span class="ain-midia">' + midia + '</span>' +
      '<span class="ain-orn">' + CRUZ + '</span>' +
      '<span class="ain-nome">' + esc(p.nome) + '</span>' +
      '<span class="ain-user">@' + esc(p.user) + '</span>';

    if (tem) card.addEventListener('click', function () { abrirPlayer(comStories().indexOf(p)); });
    else card.addEventListener('click', function () { evento('influ_instagram', p); });
    return card;
  }

  function montarConvite() {
    var v = CFG.convite;
    var w = el('section', 'ain-convite');
    w.innerHTML = '<div class="ain-convite__caixa">' +
      '<span class="ain-orn">' + CRUZ + '</span>' +
      '<h2>' + esc(v.titulo) + '</h2><p>' + esc(v.texto) + '</p>' +
      '<a class="ain-btn" href="' + esc(v.link) + '">' + esc(v.botao) + '</a></div>';
    return w;
  }

  /* Veio do "Ver influenciador" (?ver=slug): rola até o santinho e destaca */
  function destacarVindo() {
    var m = location.search.match(/[?&]ver=([^&]+)/);
    if (!m) return;
    var slug = decodeURIComponent(m[1]);
    var card = document.querySelector('.ain-card[data-slug="' + slug.replace(/"/g, '') + '"]');
    if (!card) return;
    function alvo() { var r = card.getBoundingClientRect(); return Math.max(0, r.top + window.pageYOffset - (window.innerHeight - r.height) / 2); }
    function chegou() { var r = card.getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight; }
    setTimeout(function () {
      try { window.scrollTo({ top: alvo(), behavior: reduzMovimento() ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, alvo()); }
      card.classList.add('ain-destaque');
      // plano B: se a rolagem suave não aconteceu, pula direto
      setTimeout(function () { if (!chegou()) window.scrollTo(0, alvo()); }, 1000);
      setTimeout(function () { card.classList.remove('ain-destaque'); }, 4200);
    }, 450);
  }

  /* Prévias tocam só quando o card aparece na tela (economiza dados) */
  function ligarPrevias(raiz) {
    var vids = Array.prototype.slice.call(raiz.querySelectorAll('.ain-midia video'));
    if (!vids.length || reduzMovimento()) return;
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) {
            v.src = v.getAttribute('data-src');
            v.addEventListener('playing', function () { v.classList.add('ain-on'); }, { once: true });
          }
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
  }

  function montar() {
    var conteudo = $('section.user-content') || $('.user-content');
    if (!conteudo || $('#ain-pagina')) return !!$('#ain-pagina');

    injetarCSS();

    var titulo = $('[data-store="page-title"]');
    if (titulo) titulo.style.display = 'none';

    var pagina = el('div', 'ain');
    pagina.id = 'ain-pagina';
    pagina.appendChild(montarTopo());
    pagina.appendChild(montarFaixa());

    var mural = el('div', 'ain-mural');
    var ordem = comStories().concat(CFG.pessoas.filter(function (p) { return !p.itens; }));
    ordem.forEach(function (p, i) { mural.appendChild(montarCard(p, i)); });
    pagina.appendChild(mural);

    if (CFG.convite && CFG.convite.ativo) pagina.appendChild(montarConvite());

    conteudo.innerHTML = '';
    conteudo.classList.remove('pb-5');
    conteudo.appendChild(pagina);

    ligarPrevias(pagina);
    destacarVindo();
    return true;
  }

  /* =========================================================================
     Player em tela cheia (estilo stories)
     ========================================================================= */
  var ST = null;

  // Abre os stories de UMA pessoa (não passa para outra; ao terminar, fecha).
  // opts.inicio = posição do primeiro story (0 = começo); opts.botao = { texto, link } do botão da direita
  function abrirPlayer(pIdx, opts) {
    opts = opts || {};
    var todas = comStories();
    if (!todas.length || pIdx < 0 || !todas[pIdx]) return;
    var lista = [todas[pIdx]];
    var botao = opts.botao || CFG.botaoLoja;
    injetarCSS();
    fecharPlayer(true);

    var o = el('div', 'ain-st');
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    o.innerHTML =
      '<button class="ain-st__seta ain-st__seta--ant" aria-label="Anterior">‹</button>' +
      '<div class="ain-st__caixa">' +
        '<video playsinline preload="auto"></video>' +
        '<div class="ain-st__foto"><div class="ain-st__fundo"></div><img alt=""></div>' +
        '<div class="ain-st__sombra"></div>' +
        '<div class="ain-st__barras"></div>' +
        '<div class="ain-st__topo">' +
          '<span class="ain-st__av"></span>' +
          '<span class="ain-st__quem"><b></b><a target="_blank" rel="noopener"></a></span>' +
          '<button class="ain-st__ic ain-st__som" aria-label="Som"></button>' +
          '<button class="ain-st__ic ain-st__fechar" aria-label="Fechar">' + FECHAR + '</button>' +
        '</div>' +
        '<div class="ain-st__zona ain-st__zona--esq"></div><div class="ain-st__zona ain-st__zona--dir"></div>' +
        '<div class="ain-st__base">' +
          '<a class="ain-st__insta" target="_blank" rel="noopener">' + INSTA + 'Ver no Instagram</a>' +
          '<a class="ain-st__loja" href="' + esc(botao.link) + '">' + esc(botao.texto) + '</a>' +
        '</div>' +
      '</div>' +
      '<button class="ain-st__seta ain-st__seta--prox" aria-label="Próximo">›</button>';
    document.body.appendChild(o);
    document.body.classList.add('ain-travado');

    ST = { o: o, lista: lista, p: 0, i: Math.max(0, Math.min(opts.inicio || 0, itensDe(lista[0]).length - 1)), v: $('video', o), foto: $('.ain-st__foto', o),
           caixa: $('.ain-st__caixa', o), mudo: false, raf: 0, pausado: false, tSeg: 0,
           fotoIni: 0, fotoAcum: 0 };
    requestAnimationFrame(function () { o.classList.add('ain-aberto'); });

    var v = ST.v;
    v.addEventListener('ended', function () { proximo(); });

    $('.ain-st__fechar', o).addEventListener('click', function () { fecharPlayer(); });
    $('.ain-st__som', o).addEventListener('click', function () {
      ST.mudo = !ST.mudo; v.muted = ST.mudo; atualizarSom();
    });
    $('.ain-st__seta--ant', o).addEventListener('click', anterior);
    $('.ain-st__seta--prox', o).addEventListener('click', proximo);
    o.addEventListener('click', function (e) { if (e.target === o) fecharPlayer(); });

    // Toque: esquerda volta, direita avança, segurar pausa
    [['.ain-st__zona--esq', anterior], ['.ain-st__zona--dir', proximo]].forEach(function (z) {
      var zona = $(z[0], o), px = 0, py = 0;
      zona.addEventListener('pointerdown', function (e) {
        px = e.clientX; py = e.clientY;
        ST.tSeg = setTimeout(function () { ST.segurando = true; pausar(); }, 220);
      });
      zona.addEventListener('pointerup', function (e) {
        clearTimeout(ST.tSeg);
        var moveu = Math.abs(e.clientX - px) > 25 || Math.abs(e.clientY - py) > 25;
        if (ST.segurando) { ST.segurando = false; continuar(); }
        else if (!moveu) z[1]();
      });
      zona.addEventListener('pointerleave', function () {
        clearTimeout(ST.tSeg);
        if (ST.segurando) { ST.segurando = false; continuar(); }
      });
    });

    // Arrastar: para baixo fecha; para os lados passa/volta o story
    var x0 = null, y0 = null;
    o.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    o.addEventListener('touchmove', function (e) {
      if (y0 == null) return;
      var dy = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0;
      if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
        ST.caixa.style.transform = 'translateY(' + dy + 'px) scale(' + (1 - dy / 2000) + ')';
      }
    }, { passive: true });
    o.addEventListener('touchend', function (e) {
      if (y0 == null) return;
      var dy = e.changedTouches[0].clientY - y0, dx = e.changedTouches[0].clientX - x0;
      x0 = y0 = null;
      if (Math.abs(dy) > Math.abs(dx) && dy > 110) { fecharPlayer(); return; }
      ST.caixa.style.transform = '';
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) proximo(); else anterior();
      }
    });

    document.addEventListener('keydown', teclas);
    montarBarras();
    carregar();
    loopBarra();
  }

  function teclas(e) {
    if (!ST) return;
    if (e.key === 'Escape') fecharPlayer();
    else if (e.key === 'ArrowRight') proximo();
    else if (e.key === 'ArrowLeft') anterior();
  }

  function atualizarSom() { $('.ain-st__som', ST.o).innerHTML = ST.mudo ? SOM_OFF : SOM_ON; }
  function pessoa() { return ST.lista[ST.p]; }
  function itemAtual() { return itensDe(pessoa())[ST.i]; }

  function montarBarras() {
    var n = itensDe(pessoa()).length;
    var html = '';
    for (var k = 0; k < n; k++) html += '<span><i></i></span>';
    $('.ain-st__barras', ST.o).innerHTML = html;
  }

  function tocarVideo() {
    var pr = ST.v.play();
    if (pr && pr.catch) pr.catch(function () { ST.mudo = true; ST.v.muted = true; atualizarSom(); ST.v.play(); });
  }

  function pausar() {
    ST.pausado = true;
    if (itemAtual().tipo === 'video') ST.v.pause();
    else { ST.fotoAcum += Date.now() - ST.fotoIni; }
  }
  function continuar() {
    ST.pausado = false;
    if (itemAtual().tipo === 'video') tocarVideo();
    else ST.fotoIni = Date.now();
  }

  function carregar() {
    var p = pessoa(), it = itemAtual(), o = ST.o;
    $('.ain-st__av', o).textContent = inicial(p.nome);
    $('.ain-st__quem b', o).textContent = p.nome;
    var a = $('.ain-st__quem a', o); a.href = urlInsta(p); a.textContent = '@' + p.user;
    $('.ain-st__insta', o).href = urlInsta(p);
    var barras = o.querySelectorAll('.ain-st__barras i');
    for (var k = 0; k < barras.length; k++) barras[k].style.width = k < ST.i ? '100%' : '0';
    atualizarSom();
    ST.pausado = false;

    if (it.tipo === 'video') {
      ST.foto.classList.remove('ain-on');
      ST.v.classList.remove('ain-off');
      ST.v.poster = urlCapa(p, it);
      ST.v.src = urlItem(p, it);
      ST.v.muted = ST.mudo;
      tocarVideo();
    } else {
      ST.v.pause(); ST.v.removeAttribute('src'); ST.v.load();
      ST.v.classList.add('ain-off');
      var url = urlItem(p, it);
      $('img', ST.foto).src = url;
      $('.ain-st__fundo', ST.foto).style.backgroundImage = 'url("' + url + '")';
      ST.foto.classList.add('ain-on');
      ST.fotoIni = Date.now(); ST.fotoAcum = 0;
    }
    preCarregar();
    evento('influ_story', p);
  }

  // Deixa a próxima foto/capa pronta
  function preCarregar() {
    var itens = itensDe(pessoa()), prox = itens[ST.i + 1];
    var p = pessoa();
    if (!prox && ST.lista[ST.p + 1]) { p = ST.lista[ST.p + 1]; prox = itensDe(p)[0]; }
    if (prox) { var im = new Image(); im.src = urlCapa(p, prox); }
  }

  function loopBarra() {
    if (!ST) return;
    var b = ST.o.querySelectorAll('.ain-st__barras i')[ST.i], it = itemAtual();
    if (it.tipo === 'video') {
      var v = ST.v;
      if (b && v.duration) b.style.width = (v.currentTime / v.duration * 100) + '%';
    } else if (!ST.pausado) {
      var dur = (CFG.segundosFoto || 6) * 1000;
      var t = ST.fotoAcum + (Date.now() - ST.fotoIni);
      if (b) b.style.width = Math.min(100, t / dur * 100) + '%';
      if (t >= dur) { proximo(); }
    }
    if (ST) ST.raf = requestAnimationFrame(loopBarra);
  }

  function trocarPessoa(novo) {
    ST.p = novo; ST.i = 0;
    ST.caixa.classList.remove('ain-troca'); void ST.caixa.offsetWidth; ST.caixa.classList.add('ain-troca');
    montarBarras(); carregar();
  }
  function proximaPessoa() {
    if (ST.p < ST.lista.length - 1) trocarPessoa(ST.p + 1); else fecharPlayer();
  }
  function pessoaAnterior() {
    if (ST.p > 0) trocarPessoa(ST.p - 1); else { ST.i = 0; carregar(); }
  }
  function proximo() {
    if (!ST) return;
    if (ST.i < itensDe(pessoa()).length - 1) { ST.i++; carregar(); }
    else proximaPessoa();
  }
  function anterior() {
    if (!ST) return;
    if (ST.i > 0) { ST.i--; carregar(); }
    else if (itemAtual().tipo === 'video' && ST.v.currentTime > 2) { ST.v.currentTime = 0; tocarVideo(); }
    else pessoaAnterior();
  }

  function fecharPlayer(imediato) {
    if (!ST) return;
    var s = ST; ST = null;
    cancelAnimationFrame(s.raf);
    document.removeEventListener('keydown', teclas);
    s.v.pause(); s.v.removeAttribute('src'); s.v.load();
    document.body.classList.remove('ain-travado');
    if (imediato) { s.o.remove(); return; }
    s.o.classList.remove('ain-aberto');
    setTimeout(function () { s.o.remove(); }, 260);
  }

  /* =========================================================================
     Boot
     ========================================================================= */
  /* =========================================================================
     Seção na página inicial
     ========================================================================= */
  function ehHome() {
    return location.pathname === '/' || (document.body && document.body.classList.contains('template-home'));
  }

  function montarHome() {
    var h = CFG.home;
    if (!h || !h.ativo) return true;
    if ($('#ain-home')) return true;
    var acima = $(h.depoisDe);
    if (!acima) return false;
    injetarCSS();

    var sec = el('div', 'ain ain-home');
    sec.id = 'ain-home';
    // usa as mesmas cores e fontes da seção de cima
    var cs = getComputedStyle(acima);
    ['--arc-bg', '--arc-text', '--arc-text-muted', '--arc-accent', '--arc-font-body', '--arc-font-display'].forEach(function (v) {
      var val = cs.getPropertyValue(v); if (val) sec.style.setProperty(v, val.trim());
    });
    sec.style.background = cs.backgroundColor;
    sec.style.color = cs.color;
    sec.style.fontFamily = cs.fontFamily;

    sec.innerHTML =
      '<section class="arc-section">' +
        '<header class="arc-head"><h2 class="arc-title">' + esc(h.titulo) + '</h2>' +
        '<p class="arc-text">' + esc(h.texto) + '</p></header>' +
        '<div class="ain-home__trilho-wrap">' +
          '<button type="button" class="ain-home__nav ain-home__nav--ant" aria-label="Anteriores">‹</button>' +
          '<div class="ain-home__trilho"></div>' +
          '<button type="button" class="ain-home__nav ain-home__nav--prox" aria-label="Próximos">›</button>' +
        '</div>' +
        '<div class="ain-home__rodape"><a class="ain-home__link" href="' + esc(h.link) + '">' + esc(h.botao) + ' →</a></div>' +
      '</section>';

    var trilho = $('.ain-home__trilho', sec);
    comStories().forEach(function (p, i) { trilho.appendChild(montarCard(p, i)); });
    $('.ain-home__nav--ant', sec).addEventListener('click', function () { trilho.scrollBy({ left: -trilho.clientWidth * 0.8, behavior: 'smooth' }); });
    $('.ain-home__nav--prox', sec).addEventListener('click', function () { trilho.scrollBy({ left: trilho.clientWidth * 0.8, behavior: 'smooth' }); });

    acima.parentNode.insertBefore(sec, acima.nextSibling);
    ligarPrevias(sec);
    return true;
  }

  // Usado pelas bolinhas da página de produto (arcanju-videos.js)
  window.ArcanjuInfluenciadores = {
    abrir: function (slug, opts) {
      var lista = comStories();
      for (var k = 0; k < lista.length; k++) if (lista[k].slug === slug) { abrirPlayer(k, opts); return true; }
      return false;
    }
  };

  function iniciar() {
    if (ehHome() && !naPagina()) {
      if (montarHome()) return;
      var k = 0;
      var tt = setInterval(function () { k++; if (montarHome() || k > 60) clearInterval(tt); }, 250);
      return;
    }
    if (!naPagina()) return;
    if (montar()) return;
    var n = 0;
    var t = setInterval(function () { n++; if (montar() || n > 40) clearInterval(t); }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
