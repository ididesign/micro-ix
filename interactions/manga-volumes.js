MicroIX.register({
  id: 'manga-volumes',
  title: 'Changelog manga shelf',
  description: 'Ten release notes drawn as manga volumes climbing a diagonal. The front volume sits large with speed lines and a mascot while the rest shrink away behind it. Click a volume, scroll, press the arrow keys or use the buttons and the whole row glides to the new front, while the big version number and release details on the left swap in step.',
  tags: ['carousel', '3d', 'scroll'],
  source: { label: '@0xluffy on X ↗', url: 'https://x.com/0xluffy/status/2113718096011969014' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-mg { --k: 1; position: relative; width: 100%; height: 100%; overflow: hidden; background: radial-gradient(80% 70% at 30% 30%, #fff, #f1f0ec); color: #151515; user-select: none; -webkit-user-select: none; outline: none; }
.ix-mg:focus-visible { box-shadow: inset 0 0 0 2px #151515; }
.ix-mg .fit { position: absolute; left: 50%; top: 50%; width: 960px; height: 600px; translate: -50% -50%; scale: var(--k); }
.ix-mg .dots { position: absolute; right: 0; bottom: 0; width: 360px; height: 240px; background-image: radial-gradient(#0002 1px, transparent 1.4px); background-size: 12px 12px; mask-image: linear-gradient(to top left, #000, transparent 80%); -webkit-mask-image: linear-gradient(to top left, #000, transparent 80%); }
.ix-mg .info { position: absolute; left: 44px; top: 62px; width: 300px; z-index: 5; }
.ix-mg .eyebrow { font: 500 11px/1 ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: .12em; color: #555; text-transform: uppercase; }
.ix-mg .ver { margin: 18px 0 0; font: 400 96px/.95 'Instrument Serif', Georgia, serif; letter-spacing: -.02em; white-space: nowrap; }
.ix-mg .ver i { color: #b3b0aa; font-style: italic; padding-right: .06em; }
.ix-mg .name { margin: 6px 0 0; font: 400 28px/1.1 'Instrument Serif', Georgia, serif; }
.ix-mg .rows { margin: 36px 0 0; padding: 0; list-style: none; border-top: 1px solid #0002; font-size: 12px; }
.ix-mg .rows li { display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #0002; }
.ix-mg .rows span { font: 500 10px/1.6 ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: .1em; color: #666; text-transform: uppercase; }
.ix-mg .rows b { font-weight: 500; font-size: 14px; font-variant-numeric: tabular-nums; }
.ix-mg .swap { animation: ix-mg-in .45s cubic-bezier(.2,.8,.2,1) both; }
@keyframes ix-mg-in { from { opacity: 0; transform: translateY(10px); } }
.ix-mg .nav { position: absolute; left: 44px; bottom: 40px; display: flex; gap: 8px; z-index: 6; align-items: center; font: 500 11px ui-monospace, 'SF Mono', Menlo, monospace; color: #666; }
.ix-mg .nav button { all: unset; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: #fff; box-shadow: 0 0 0 1px #0002, 0 2px 6px #0001; cursor: pointer; transition: scale .15s; }
.ix-mg .nav button:hover { scale: 1.08; }
.ix-mg .nav button:disabled { opacity: .35; cursor: default; scale: 1; }
.ix-mg .nav button:focus-visible { outline: 2px solid #151515; outline-offset: 2px; }
.ix-mg .nav span { margin-left: 8px; }
.ix-mg .shelf { position: absolute; inset: 0; perspective: 1500px; perspective-origin: 70% 40%; }
.ix-mg .vol { position: absolute; left: 0; top: 0; width: 230px; height: 320px; transform-style: preserve-3d; cursor: pointer; transition: transform .7s cubic-bezier(.2,.8,.2,1), opacity .5s; outline: none; will-change: transform; }
.ix-mg .face { position: absolute; inset: 0; border-radius: 3px 6px 6px 3px; overflow: hidden; background: var(--c); box-shadow: 0 24px 34px -18px #0006; }
.ix-mg .face::before { content: ''; position: absolute; inset: 0; background: repeating-conic-gradient(from 0deg at 50% 46%, #0000 0 5deg, #0003 5deg 6deg); }
.ix-mg .face::after { content: ''; position: absolute; inset: 0; background: radial-gradient(#0002 1px, transparent 1.3px) 0 0 / 5px 5px; mask-image: linear-gradient(#000 0 45%, transparent 70%); -webkit-mask-image: linear-gradient(#000 0 45%, transparent 70%); }
.ix-mg .pages { position: absolute; left: 100%; top: 3px; width: 22px; height: calc(100% - 6px); background: repeating-linear-gradient(90deg, #f4f0e6 0 2px, #d9d3c3 2px 3px); transform-origin: 0 50%; transform: rotateY(90deg); }
.ix-mg .title { position: absolute; left: 14px; top: 12px; font: 800 26px/1 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif; color: #111; -webkit-text-stroke: 3px #fff; paint-order: stroke fill; z-index: 2; }
.ix-mg .title small { display: block; margin-top: 4px; font: 700 9px/1 system-ui, sans-serif; letter-spacing: .1em; -webkit-text-stroke: 2px #fff; }
.ix-mg .badge { position: absolute; right: 12px; top: 12px; width: 30px; height: 30px; border-radius: 50%; background: #111; color: #fff; display: grid; place-items: center; font: 800 13px system-ui, sans-serif; z-index: 2; }
.ix-mg .mascot { position: absolute; left: 50%; top: 46%; width: 62%; translate: -50% -50%; z-index: 1; }
.ix-mg .sfx { position: absolute; left: 12px; bottom: 76px; font: 800 22px/1 'Hiragino Sans', 'Yu Gothic', system-ui, sans-serif; font-style: italic; color: #111; -webkit-text-stroke: 3px #fff; paint-order: stroke fill; transform: rotate(-8deg); z-index: 2; }
.ix-mg .band { position: absolute; left: 0; right: 0; bottom: 0; height: 66px; background: #efeade; z-index: 2; border-top: 6px solid #d8231c; display: flex; align-items: center; gap: 10px; padding: 0 12px; }
.ix-mg .band b { font: 600 20px/1 'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif; }
.ix-mg .band span { border-left: 1px solid #0003; padding-left: 10px; font: 400 15px/1.1 'Instrument Serif', Georgia, serif; }
.ix-mg .band em { display: block; font: 400 8px/1.2 system-ui, sans-serif; font-style: normal; color: #666; }
.ix-mg .vol:focus-visible .face { outline: 2px solid #151515; outline-offset: 3px; }
.ix-mg .seal { position: absolute; right: 30px; top: 330px; z-index: 5; }
.ix-mg .seal i { display: block; width: 46px; height: 46px; margin: 0 auto 14px; background: #d8231c; border-radius: 6px; color: #fff; font: 700 17px/1 'Hiragino Mincho ProN', 'Yu Mincho', serif; text-align: center; padding-top: 6px; box-shadow: inset 0 0 0 2px #fff6, 0 0 0 2px #d8231c; }
.ix-mg .tate { writing-mode: vertical-rl; font: 700 17px/1.6 'Hiragino Mincho ProN', 'Yu Mincho', serif; margin-left: 12px; }
.ix-mg .tate small { display: block; font: 400 11px/1.8 'Hiragino Mincho ProN', 'Yu Mincho', serif; color: #555; }
@media (prefers-reduced-motion: reduce) { .ix-mg .vol { transition: none; } .ix-mg .swap { animation: none; } }
`,
  mount(stage) {
    const V = [
      { v: '0.3.0', n: 'MCP servers', d: '2026年9月24日', ch: 3, s: 10, c: '#e5483b', sfx: 'シーン' },
      { v: '0.4.0', n: 'Build-in-parallel agents', d: '2026年10月2日', ch: 4, s: 12, c: '#2150c4', sfx: 'ドキッ' },
      { v: '0.4.1', n: 'Faster file search', d: '2026年10月9日', ch: 2, s: 6, c: '#e8b218', sfx: 'フォン' },
      { v: '0.4.2', n: 'Tab-to-accept edits', d: '2026年10月15日', ch: 3, s: 8, c: '#d34a93', sfx: 'ココゴ' },
      { v: '0.4.3', n: 'Inline diff review', d: '2026年10月21日', ch: 2, s: 7, c: '#1f9a4c', sfx: 'ヂヂ' },
      { v: '0.4.4', n: 'Project memory', d: '2026年10月28日', ch: 3, s: 9, c: '#7a46c9', sfx: 'ゴゴ' },
      { v: '0.4.5', n: 'Terminal sandbox', d: '2026年11月3日', ch: 2, s: 5, c: '#f0842c', sfx: 'バン' },
      { v: '0.4.6', n: 'Prompt snippets', d: '2026年11月10日', ch: 3, s: 8, c: '#1e8fc8', sfx: 'ドドド' },
      { v: '0.4.7', n: 'Roll back any project', d: '2026年11月17日', ch: 4, s: 11, c: '#df4b3e', sfx: 'ズバッ' },
      { v: '0.5.0', n: 'Quick deploy and share', d: '2026年11月24日', ch: 5, s: 14, c: '#2fa99b', sfx: 'ガチャ' },
    ];
    const kanji = (n) => '〇一二三四五六七八九十'[n] || String(n);
    const mascot = `<svg class="mascot" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="44" fill="#fff" stroke="#111" stroke-width="5"/><ellipse cx="22" cy="24" rx="9" ry="8" fill="#fff" stroke="#111" stroke-width="5"/><ellipse cx="78" cy="24" rx="9" ry="8" fill="#fff" stroke="#111" stroke-width="5"/><path d="M33 52 q4 -5 9 0 M58 52 q4 -5 9 0" stroke="#111" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50 58 v6 M50 64 q-6 6 -13 2 M50 64 q6 6 13 2" stroke="#111" stroke-width="4.5" fill="none" stroke-linecap="round"/></svg>`;

    stage.innerHTML = `<div class="ix-mg" tabindex="0" role="group" aria-roledescription="carousel" aria-label="Changelog volumes. Use the arrow keys."><div class="fit">
      <div class="dots"></div>
      <div class="info" aria-live="polite"></div>
      <div class="shelf">${V.map((x, i) => `<div class="vol" data-i="${i}" role="button" tabindex="-1" aria-label="Volume ${i + 1}, version ${x.v}, ${x.n}" style="--c:${x.c}">
        <div class="face"><div class="title">カピー<small>CAPY</small></div><div class="badge">${i + 1}</div>${mascot}<div class="sfx">${x.sfx}</div>
        <div class="band"><b>第${kanji(i + 1)}巻</b><span>v${x.v}<em>${x.n}</em></span></div></div><div class="pages"></div></div>`).join('')}</div>
      <div class="seal" aria-hidden="true"><i>漫画</i><div class="tate">カピー漫画　全十巻<small>リリースを、まんがで。二〇二六年　秋</small></div></div>
      <div class="nav"><button type="button" data-d="-1" aria-label="Previous volume"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button type="button" data-d="1" aria-label="Next volume"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span></span></div>
    </div></div>`;

    const root = stage.querySelector('.ix-mg'), info = root.querySelector('.info'), count = root.querySelector('.nav span');
    const vols = [...root.querySelectorAll('.vol')], btns = [...root.querySelectorAll('.nav button')];
    let cur = 0;

    const place = () => {
      vols.forEach((el, i) => {
        const d = i - cur, a = Math.abs(d);
        const x = 430 + (d > 0 ? d * 120 : d * 140);
        const y = 170 - d * 74;
        const s = d === 0 ? 1.08 : Math.max(.34, .86 - a * .13);
        const ry = d === 0 ? -6 : -16;
        el.style.transform = `translate3d(${x}px, ${y}px, ${d === 0 ? 120 : -a * 40}px) rotateY(${ry}deg) scale(${s})`;
        el.style.opacity = a > 5 ? 0 : 1;
        el.style.pointerEvents = a > 5 ? 'none' : 'auto';
        el.style.zIndex = 50 - a;
        el.tabIndex = d === 0 ? 0 : -1;
        el.setAttribute('aria-current', d === 0 ? 'true' : 'false');
      });
      const x = V[cur];
      info.innerHTML = `<div class="eyebrow swap">第${kanji(cur + 1)}巻 · Volume ${String(cur + 1).padStart(2, '0')} / ${V.length}</div>
        <h3 class="ver swap"><i>v</i>${x.v}</h3><p class="name swap">${x.n}</p>
        <ul class="rows swap"><li><span>発売日 Released</span><b>${x.d}</b></li><li><span>話数 Chapters</span><b>${x.ch}話</b></li><li><span>節 Sections</span><b>${x.s}</b></li></ul>`;
      count.textContent = `${cur + 1} / ${V.length}`;
      btns[0].disabled = cur === 0; btns[1].disabled = cur === V.length - 1;
    };
    const go = (i) => { const n = Math.max(0, Math.min(V.length - 1, i)); if (n !== cur) { cur = n; place(); } };

    vols.forEach((el, i) => el.addEventListener('click', () => go(i)));
    btns.forEach(b => b.addEventListener('click', () => go(cur + +b.dataset.d)));
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(cur - 1); }
      else if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('vol')) { e.preventDefault(); }
    });
    let lock = 0;
    root.addEventListener('wheel', (e) => {
      const dd = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(dd) < 6 || ((dd > 0 && cur === V.length - 1) || (dd < 0 && cur === 0))) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lock < 260) return;
      lock = now; go(cur + (dd > 0 ? 1 : -1));
    }, { passive: false });
    const resize = () => root.style.setProperty('--k', Math.min(root.clientWidth / 980, root.clientHeight / 620));
    new ResizeObserver(resize).observe(root); resize();
    place();
  },
});
