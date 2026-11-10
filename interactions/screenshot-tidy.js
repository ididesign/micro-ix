MicroIX.register({
  id: 'screenshot-tidy',
  title: 'Screenshot tidy up',
  description: 'A camera roll buried in thousands of screenshots. Tap Tidy Up and every one flies into its pile: tickets, receipts, recipes and places stack into folders while the expired junk lines up in a tray. Delete the tray and it squeezes away into storage freed.',
  tags: ['sorting', 'transition', 'delight'],
  source: { label: '@BenLouisX on X ↗', url: 'https://x.com/BenLouisX/status/2118822664605196583' },
  layout: { device: { width: 320, height: 660 } },
  css: `
.ix-tidy { position: relative; width: 100%; height: 100%; overflow: hidden; background: #fff; color: #111; font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; user-select: none; -webkit-user-select: none; }
.ix-tidy button { all: unset; cursor: pointer; }
.ix-tidy button:focus-visible { outline: 2px solid #2f6bff; outline-offset: 2px; }
.ix-tidy .status { position: absolute; z-index: 60; top: 16px; left: 32px; right: 28px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 15px; pointer-events: none; }
.ix-tidy .battery { width: 25px; height: 12px; border-radius: 4px; background: currentColor; }
.ix-tidy .head { position: absolute; z-index: 60; top: 50px; left: 18px; right: 16px; display: flex; align-items: center; gap: 6px; padding-bottom: 6px; background: linear-gradient(#fff 75%, rgba(255,255,255,0)); }
.ix-tidy h3 { margin: 0; font-size: 21px; font-weight: 700; letter-spacing: -.02em; }
.ix-tidy .total { font-size: 21px; font-weight: 600; color: #c4c4c9; font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.ix-tidy .more { margin-left: auto; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #f1f1f4; }
.ix-tidy .more svg { width: 14px; height: 14px; }

.ix-tidy .t { position: absolute; left: 0; top: 0; width: 34px; height: 72px; border-radius: 5px; overflow: hidden; box-shadow: 0 0 0 .5px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.14); transition: transform .9s cubic-bezier(.3,.85,.25,1), opacity .5s; will-change: transform; }
.ix-tidy .t svg { display: block; width: 100%; height: 100%; }

.ix-tidy .lbl { position: absolute; width: 130px; margin-left: -65px; text-align: center; font-size: 10.5px; font-weight: 600; opacity: 0; transition: opacity .4s; }
.ix-tidy .lbl span, .ix-tidy .tray-h span { color: #a3a3aa; font-weight: 500; font-variant-numeric: tabular-nums; }
.ix-tidy .tray { position: absolute; left: 10px; right: 10px; top: 440px; height: 140px; border-radius: 22px; background: #f3f3f6; opacity: 0; transition: opacity .4s; }
.ix-tidy .tray-h { position: absolute; left: 14px; right: 10px; top: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 10.5px; font-weight: 600; }
.ix-tidy .del { display: inline-flex; align-items: center; gap: 4px; padding: 5px 9px; border-radius: 999px; background: #ffe4e4; color: #e5342f; font-size: 10px; font-weight: 600; opacity: 0; transform: scale(.85); transition: opacity .3s, transform .3s cubic-bezier(.3,1.6,.5,1); pointer-events: none; }
.ix-tidy .del svg { width: 11px; height: 11px; }
.ix-tidy .freed { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 600; opacity: 0; transition: opacity .4s .2s; }
.ix-tidy .freed i { display: grid; place-items: center; width: 17px; height: 17px; border-radius: 50%; background: #34c759; color: #fff; font-style: normal; font-size: 11px; }

.ix-tidy .go { position: absolute; z-index: 60; left: 50%; bottom: 30px; translate: -50% 0; display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 999px; background: rgba(28,28,30,.92); color: #fff; font-size: 13px; font-weight: 600; box-shadow: 0 6px 18px rgba(0,0,0,.25); transition: opacity .3s, scale .3s; }
.ix-tidy .go svg { width: 14px; height: 14px; }
.ix-tidy .go:active { scale: .95; }

.ix-tidy.sorted .go { opacity: 0; scale: .8; pointer-events: none; }
.ix-tidy.sorted .lbl, .ix-tidy.sorted .tray { opacity: 1; }
.ix-tidy.sorted:not(.freed-on) .del { opacity: 1; transform: none; pointer-events: auto; transition-delay: .9s; }
.ix-tidy.freed-on .freed { opacity: 1; }
.ix-tidy.freed-on .tray-h { opacity: 0; transition: opacity .25s; }

@media (prefers-reduced-motion: reduce) {
  .ix-tidy .t { transition-duration: .01s !important; transition-delay: 0s !important; }
}
`,
  mount(stage) {
    // Tiny screenshot thumbnails, 34×72
    const lines = (y, n, c = '#d9d9de', x = 5, w = 24) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * 5}" width="${w - (i % 3) * 5}" height="2" rx="1" fill="${c}"/>`).join('');
    const ART = {
      ticket: () => `<rect width="34" height="72" fill="#1f3a78"/><rect x="5" y="9" width="10" height="3" rx="1" fill="#fff" opacity=".8"/><rect x="21" y="9" width="8" height="3" rx="1" fill="#fff" opacity=".8"/><rect x="8" y="24" width="18" height="18" rx="1" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${10 + (i % 3) * 5}" y="${26 + Math.floor(i / 3) * 8}" width="3" height="3" fill="#1f3a78"/>`).join('')}${lines(50, 3, '#5d77b5')}`,
      receipt: () => `<rect width="34" height="72" fill="#fff"/><rect width="34" height="14" fill="#1e7a52"/><circle cx="17" cy="7" r="3" fill="#fff"/>${lines(20, 8)}<rect x="5" y="62" width="24" height="3" rx="1" fill="#1e7a52" opacity=".5"/>`,
      recipe: () => `<rect width="34" height="72" fill="#fff"/><rect width="34" height="30" fill="#efe6d6"/><circle cx="17" cy="15" r="10" fill="#fff"/><circle cx="17" cy="15" r="7.5" fill="#f2a33a"/><circle cx="15" cy="13" r="2" fill="#e05a2b"/><circle cx="19.5" cy="17" r="1.6" fill="#7aa83a"/>${lines(36, 6)}`,
      place: () => `<rect width="34" height="72" fill="#e8efe2"/><path d="M0 20 L34 26 M0 44 L34 38 M12 0 L16 72 M26 0 L22 72" stroke="#fff" stroke-width="3"/><path d="M8 62 L13 46 L22 40 L19 24 L27 12" stroke="#2f6bff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="27" cy="12" r="3" fill="#2f6bff" stroke="#fff"/><rect x="4" y="64" width="26" height="5" rx="2.5" fill="#34c759"/>`,
      dark: () => `<rect width="34" height="72" fill="#121214"/>${lines(10, 3, '#3a3a40')}<rect x="5" y="28" width="24" height="14" rx="3" fill="#2a2a30"/>${lines(48, 3, '#3a3a40')}`,
      chat: () => `<rect width="34" height="72" fill="#fff"/><rect x="4" y="10" width="18" height="7" rx="3.5" fill="#e5e5ea"/><rect x="12" y="21" width="18" height="7" rx="3.5" fill="#2f8bff"/><rect x="4" y="32" width="14" height="7" rx="3.5" fill="#e5e5ea"/><rect x="10" y="43" width="20" height="10" rx="4" fill="#2f8bff"/><rect x="4" y="57" width="16" height="7" rx="3.5" fill="#e5e5ea"/>`,
      promo: () => `<rect width="34" height="72" fill="#e8484a"/><text x="17" y="26" text-anchor="middle" font-family="-apple-system, sans-serif" font-weight="800" font-size="9" fill="#fff">50%</text>${lines(34, 3, '#ff9d9e')}<rect x="7" y="56" width="20" height="7" rx="3.5" fill="#fff"/>`,
      settings: () => `<rect width="34" height="72" fill="#f2f2f7"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="3" y="${8 + i * 10}" width="28" height="8" rx="2" fill="#fff"/><rect x="5" y="${10 + i * 10}" width="4" height="4" rx="1" fill="${['#ff9500', '#34c759', '#2f6bff', '#af52de', '#ff3b30', '#8e8e93'][i]}"/>`).join('')}`,
      shop: () => `<rect width="34" height="72" fill="#fff"/><rect x="4" y="6" width="26" height="30" rx="2" fill="#f4dfe4"/><path d="M12 12 L17 10 L22 12 L24 18 L21 19 L21 32 L13 32 L13 19 L10 18Z" fill="#2c3550"/>${lines(41, 3)}<rect x="5" y="60" width="24" height="6" rx="3" fill="#111"/>`,
    };
    const CATS = [
      { key: 'ticket', name: 'Tickets & Passes', n: 86, x: 90, y: 102 },
      { key: 'receipt', name: 'Receipts', n: 412, x: 230, y: 102 },
      { key: 'recipe', name: 'Recipes', n: 57, x: 90, y: 262 },
      { key: 'place', name: 'Places', n: 203, x: 230, y: 262 },
    ];
    const JUNK = ['dark', 'chat', 'promo', 'settings', 'shop'];
    const PER = 6, NJUNK = 22, TOTAL = 4312, JUNK_N = 3180;

    stage.innerHTML = `
      <div class="ix-tidy">
        <div class="status"><span>9:41</span><span class="battery"></span></div>
        <div class="head"><h3>Screenshots</h3><span class="total"></span>
          <button class="more" type="button" aria-label="Mess them up again"><svg viewBox="0 0 16 16"><g fill="currentColor"><circle cx="3.5" cy="8" r="1.4"/><circle cx="8" cy="8" r="1.4"/><circle cx="12.5" cy="8" r="1.4"/></g></svg></button></div>
        <div class="tray"><div class="tray-h"><div>Used &amp; Expired <span class="jn"></span></div>
          <button class="del" type="button"><svg viewBox="0 0 12 12"><path d="M2 3.5h8M4.5 3.5V2h3v1.5M3 3.5l.6 7h4.8l.6-7" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Delete · 6.2 GB</button></div>
          <div class="freed" aria-live="polite"><i>✓</i>6.2 GB freed</div></div>
        <button class="go" type="button"><svg viewBox="0 0 16 16"><path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Tidy Up</button>
      </div>`;
    const root = stage.querySelector('.ix-tidy');
    const totalEl = root.querySelector('.total');
    const jn = root.querySelector('.jn');

    const labels = CATS.map((c) => {
      const l = document.createElement('div');
      l.className = 'lbl';
      l.style.left = `${c.x}px`;
      l.style.top = `${c.y + 106}px`;
      l.innerHTML = `${c.name} <span>0</span>`;
      root.insertBefore(l, root.querySelector('.tray'));
      return l.querySelector('span');
    });

    // Thumbnails: six per folder plus a pile of junk
    const thumbs = [];
    CATS.forEach((c, k) => { for (let i = 0; i < PER; i++) thumbs.push({ kind: c.key, cat: k, i }); });
    for (let j = 0; j < NJUNK; j++) thumbs.push({ kind: JUNK[(j * 3) % JUNK.length], cat: -1, i: j });
    // Seeded scatter so the mess looks the same on every load
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const order = thumbs.map((_, i) => i).sort(() => rnd() - .5);
    thumbs.forEach((t, n) => {
      const el = document.createElement('div');
      el.className = 't';
      el.innerHTML = `<svg viewBox="0 0 34 72" aria-hidden="true">${ART[t.kind]()}</svg>`;
      root.insertBefore(el, root.querySelector('.go'));
      t.el = el;
      t.z = order[n];
    });

    const fmt = (n) => Math.round(n).toLocaleString('en-US');
    const tweens = [];
    const tween = (el, to, ms, delay = 0) => {
      const from = parseFloat(el.textContent.replace(/,/g, '')) || 0;
      const t0 = performance.now() + delay;
      const step = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / ms));
        el.textContent = fmt(from + (to - from) * (1 - (1 - k) ** 3));
        if (k < 1) tweens.push(requestAnimationFrame(step));
      };
      tweens.push(requestAnimationFrame(step));
      tweens.push(setTimeout(() => { el.textContent = fmt(to); }, delay + ms + 120));
    };
    const stopTweens = () => { tweens.forEach((id) => { cancelAnimationFrame(id); clearTimeout(id); }); tweens.length = 0; };

    const place = (t, x, y, r, s, delay, o = 1) => {
      t.el.style.transitionDelay = `${delay}ms`;
      t.el.style.transform = `translate(${x - 17}px, ${y - 36}px) rotate(${r}deg) scale(${s})`;
      t.el.style.opacity = o;
    };

    const mess = (instant) => {
      stopTweens();
      root.classList.remove('sorted', 'freed-on');
      seed = 11;
      thumbs.forEach((t) => {
        t.el.style.zIndex = t.z;
        place(t, 24 + rnd() * 272, 112 + rnd() * 500, (rnd() - .5) * 70, 1, instant ? 0 : rnd() * 200);
      });
      totalEl.textContent = fmt(TOTAL);
      labels.forEach((l) => { l.textContent = '0'; });
      jn.textContent = '0';
    };

    let state = 'mess';
    const tidy = () => {
      if (state !== 'mess') return;
      state = 'sorted';
      stopTweens();
      root.classList.add('sorted');
      thumbs.forEach((t, n) => {
        const d = 40 + (t.z % 12) * 35 + (t.cat < 0 ? 180 : 0);
        if (t.cat >= 0) {
          const c = CATS[t.cat];
          t.el.style.zIndex = 30 + t.i;
          place(t, c.x + (t.i - 2.5) * 1.2, c.y + 50 - t.i * 1.4, (t.i % 2 ? 1 : -1) * (5 - t.i) * .9, 1.34, d);
        } else {
          t.el.style.zIndex = 30 + t.i;
          place(t, 30 + t.i * 11.6, 516, 0, .92, d);
        }
      });
      CATS.forEach((c, k) => tween(labels[k], c.n, 1100, 400));
      tween(jn, JUNK_N, 1300, 600);
    };
    const del = () => {
      if (state !== 'sorted') return;
      state = 'freed';
      root.classList.add('freed-on');
      thumbs.filter((t) => t.cat < 0).forEach((t) => place(t, 160, 516, 0, .3, (NJUNK - t.i) * 18, 0));
      tween(totalEl, TOTAL - JUNK_N, 1000, 300);
      root.querySelector('.more').focus({ preventScroll: true });
    };
    const reset = () => { state = 'mess'; mess(false); root.querySelector('.go').focus({ preventScroll: true }); };

    root.querySelector('.go').addEventListener('click', tidy);
    root.querySelector('.del').addEventListener('click', del);
    root.querySelector('.more').addEventListener('click', reset);

    mess(true);
    // test hooks
    root.ixTidy = tidy;
    root.ixDelete = del;
    root.ixReset = reset;
  },
});
