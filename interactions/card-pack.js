MicroIX.register({
  id: 'card-pack',
  title: 'Tear-open card pack',
  description: 'A foil booster pack bobs on the table. Drag across its top edge and the strip peels away a piece at a time while rainbow light leaks out. Tear it all the way and the pack drops, confetti bursts and five creature cards fan out into a row. Tilt them with the pointer to catch the holo shine.',
  tags: ['drag', 'reveal', 'delight'],
  source: { label: '@yassshhu on X ↗', url: 'https://x.com/yassshhu/status/2119775071082557870' },
  layout: { wide: true, stageHeight: 520 },
  css: `
.ix-pack { --k: 1; position: relative; width: 100%; height: 100%; overflow: hidden; background: radial-gradient(70% 60% at 50% 40%, #f7f6f2, #e9e7e1); font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; color: #26252b; user-select: none; -webkit-user-select: none; }
.ix-pack .fit { position: absolute; left: 50%; top: 50%; width: 820px; height: 520px; translate: -50% -50%; scale: var(--k); }
.ix-pack .fx { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
.ix-pack .fx i { position: absolute; left: 0; top: 0; width: 7px; height: 11px; border-radius: 2px; }

/* The pack */
.ix-pack .pk { position: absolute; left: 330px; top: 116px; width: 160px; height: 220px; z-index: 3; touch-action: none; cursor: grab; outline: none; animation: ix-pack-bob 3.2s ease-in-out infinite; }
.ix-pack .pk:focus-visible { outline: 2px solid #26252b; outline-offset: 8px; border-radius: 6px; }
.ix-pack .pk.drag { cursor: grabbing; animation-play-state: paused; }
@keyframes ix-pack-bob { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-6px) rotate(1deg); } }
.ix-pack .pk svg { position: absolute; left: 0; top: 0; display: block; overflow: visible; }
.ix-pack .body { position: absolute; inset: 0; clip-path: inset(30px 0 0 0); z-index: 1; filter: drop-shadow(0 14px 14px rgba(40,30,60,.18)); }
.ix-pack .seg { position: absolute; top: 0; width: 20px; height: 31px; overflow: hidden; z-index: 3; transform-origin: 0 100%; }
.ix-pack .pk .leak { position: absolute; left: 0; top: -60px; width: 160px; height: 92px; z-index: 2; transform-origin: 50% 100%; transform: scaleY(0); }
.ix-pack .shadow { position: absolute; left: 345px; top: 360px; width: 130px; height: 14px; border-radius: 50%; background: radial-gradient(rgba(40,30,60,.22), transparent 70%); transition: opacity .4s; }
.ix-pack .hint { position: absolute; left: 0; right: 0; top: 392px; text-align: center; font-size: 12px; color: #8b8892; transition: opacity .3s; }
.ix-pack .hint b { color: #26252b; font-weight: 600; }

/* Cards */
.ix-pack .card { position: absolute; top: 150px; width: 120px; height: 168px; border-radius: 9px; z-index: 4; cursor: pointer; transition: transform .25s ease-out, box-shadow .25s; box-shadow: 0 10px 18px -8px rgba(40,30,60,.35), 0 1px 2px rgba(40,30,60,.2); }
.ix-pack .card svg { display: block; width: 100%; height: 100%; border-radius: 9px; }
.ix-pack .card .shine { position: absolute; inset: 0; border-radius: 9px; pointer-events: none; opacity: 0; transition: opacity .25s; background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.55), transparent 45%); mix-blend-mode: soft-light; }
.ix-pack .card.holo .shine { background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.6), transparent 42%), linear-gradient(115deg, transparent 25%, rgba(255,60,200,.45) 40%, rgba(60,240,255,.45) 50%, rgba(255,240,80,.45) 60%, transparent 75%) var(--mx, 50%) 0 / 260% 100%; mix-blend-mode: color-dodge; }
.ix-pack .card:hover { box-shadow: 0 22px 28px -12px rgba(40,30,60,.45), 0 2px 4px rgba(40,30,60,.2); z-index: 6; }
.ix-pack .card:hover .shine, .ix-pack .card:focus-visible .shine { opacity: 1; }
.ix-pack .card:focus-visible { outline: 2px solid #26252b; outline-offset: 3px; }

.ix-pack .again { all: unset; position: absolute; left: 50%; bottom: 40px; translate: -50% 10px; padding: 9px 16px; border-radius: 999px; background: #fff; box-shadow: 0 4px 14px rgba(40,30,60,.14), 0 0 0 1px rgba(40,30,60,.06); font-size: 12px; font-weight: 600; cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .35s, translate .35s, scale .15s; }
.ix-pack .again:hover { scale: 1.04; }
.ix-pack .again:focus-visible { outline: 2px solid #26252b; outline-offset: 2px; }
.ix-pack.done .again { opacity: 1; translate: -50% 0; pointer-events: auto; }
.ix-pack.done .hint, .ix-pack.done .shadow, .ix-pack.opening .hint, .ix-pack.opening .shadow { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .ix-pack .pk { animation: none; }
}
`,
  mount(stage) {
    const W = 160, H = 220, STRIP = 30, SEGS = 8;
    const COLORS = [['#2f3de0', '#1d27a8'], ['#e8448f', '#b42868'], ['#14a597', '#0b7066'], ['#f0782c', '#bf5110']];
    const RAINBOW = ['#ff4d5e', '#ff9a3c', '#ffd93d', '#5ee07a', '#3cc8ff', '#6d6bff', '#c86bff'];

    const face = (x, y, s = 1, ink = '#2a1f2e') =>
      `<g transform="translate(${x} ${y}) scale(${s})" fill="${ink}"><ellipse cx="-7" cy="0" rx="2.2" ry="3"/><ellipse cx="7" cy="0" rx="2.2" ry="3"/><circle cx="-6.3" cy="-1" r=".8" fill="#fff"/><circle cx="7.7" cy="-1" r=".8" fill="#fff"/><path d="M-3 5 Q0 8 3 5" stroke="${ink}" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`;

    // name, number, holo?, card bg, art bg, art(svg in a 100×90 box), ink
    const CARDS = [
      { name: 'Blip', type: 'Bubble', holo: false, bg: '#fbe1d6', ink: '#5a2c22',
        art: (id) => `<defs><radialGradient id="${id}b" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff9a8a"/><stop offset=".6" stop-color="#f0473a"/><stop offset="1" stop-color="#c02a22"/></radialGradient></defs>
          <rect width="100" height="90" fill="#f9c6b4"/>${[44, 34, 24].map((r, i) => `<circle cx="50" cy="48" r="${r + 10}" fill="none" stroke="#fff" stroke-opacity="${.25 + i * .1}" stroke-width="6"/>`).join('')}
          <path d="M50 20 C70 20 80 36 78 52 C76 68 64 74 50 74 C34 74 22 66 22 50 C22 34 32 20 50 20Z" fill="url(#${id}b)"/><ellipse cx="40" cy="32" rx="8" ry="5" fill="#fff" opacity=".55" transform="rotate(-25 40 32)"/>${face(50, 50)}` },
      { name: 'Ringo', type: 'Orbit', holo: true, bg: '#1d2559', ink: '#e8ecff',
        art: (id) => `<defs><radialGradient id="${id}p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9fb4ff"/><stop offset=".6" stop-color="#4c63e8"/><stop offset="1" stop-color="#2c3aa8"/></radialGradient><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#151a4a"/><stop offset="1" stop-color="#3b2a7a"/></linearGradient></defs>
          <rect width="100" height="90" fill="url(#${id}s)"/>${Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 37) % 100}" cy="${(i * 53) % 90}" r="${i % 3 ? .6 : 1.1}" fill="#fff" opacity=".8"/>`).join('')}
          <ellipse cx="50" cy="48" rx="38" ry="9" fill="none" stroke="#ffd36b" stroke-width="4" transform="rotate(-12 50 48)" stroke-dasharray="0 58 200"/>
          <circle cx="50" cy="46" r="21" fill="url(#${id}p)"/>${face(50, 46, .9)}
          <ellipse cx="50" cy="48" rx="38" ry="9" fill="none" stroke="#ffd36b" stroke-width="4" transform="rotate(-12 50 48)" stroke-dasharray="0 0 64 200"/>` },
      { name: 'Cubit', type: 'Block', holo: false, bg: '#dff3c6', ink: '#2c4a1a',
        art: (id) => `<rect width="100" height="90" fill="#cdeca8"/><path d="M0 70 L100 60 L100 90 L0 90Z" fill="#b8df8c"/>
          <path d="M50 18 L76 30 L50 42 L24 30Z" fill="#f2ff8a"/><path d="M24 30 L50 42 L50 74 L24 62Z" fill="#c8e83a"/><path d="M76 30 L50 42 L50 74 L76 62Z" fill="#a8cc22"/>${face(37, 54, .75, '#2c3a0a')}` },
      { name: 'Facet', type: 'Crystal', holo: true, bg: '#2a1d55', ink: '#efe8ff',
        art: (id) => `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9a8ff"/><stop offset=".5" stop-color="#7b4ee8"/><stop offset="1" stop-color="#3a1f9a"/></linearGradient><linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b1a6e"/><stop offset=".5" stop-color="#5a2d9e"/><stop offset="1" stop-color="#1c3a8a"/></linearGradient></defs>
          <rect width="100" height="90" fill="url(#${id}h)"/>
          <path d="M50 14 L74 30 L70 62 L50 76 L30 62 L26 30Z" fill="url(#${id}g)"/><path d="M50 14 L60 32 L50 76 L40 32Z" fill="#fff" opacity=".18"/><path d="M26 30 L74 30" stroke="#fff" stroke-opacity=".35"/>${face(50, 46, .85)}` },
      { name: 'Nova', type: 'Star', holo: true, bg: '#fff1c2', ink: '#5a3a08',
        art: (id) => `<defs><linearGradient id="${id}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#f2a91a"/></linearGradient></defs>
          <rect width="100" height="90" fill="#ff7ab8"/>${Array.from({ length: 16 }, (_, i) => `<path d="M50 48 L${50 + 90 * Math.cos((i * 22.5 * Math.PI) / 180)} ${48 + 90 * Math.sin((i * 22.5 * Math.PI) / 180)} L${50 + 90 * Math.cos(((i * 22.5 + 11) * Math.PI) / 180)} ${48 + 90 * Math.sin(((i * 22.5 + 11) * Math.PI) / 180)}Z" fill="${i % 2 ? '#ffd23f' : '#ff9f43'}"/>`).join('')}
          <path d="${Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 13 : 30, a = (-90 + i * 36) * Math.PI / 180; return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`; }).join(' ')}Z" fill="url(#${id}t)" stroke="#e08a00" stroke-width="1.2" stroke-linejoin="round"/>${face(50, 52, .8)}` },
    ];

    let uid = 0;
    const cardSVG = (c, n) => {
      const id = `ixpk${uid++}`;
      return `<svg viewBox="0 0 120 168" aria-hidden="true">
        <rect width="120" height="168" rx="9" fill="${c.bg}"/>
        <rect x="6" y="6" width="108" height="100" rx="5" fill="#000" opacity=".08"/>
        <svg x="8" y="8" width="104" height="96" viewBox="0 0 100 90" preserveAspectRatio="xMidYMid slice"><g>${c.art(id)}</g></svg>
        <text x="10" y="124" font-family="-apple-system, system-ui, sans-serif" font-weight="700" font-size="12" fill="${c.ink}">${c.name}</text>
        <text x="110" y="124" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="7" fill="${c.ink}" opacity=".6">#${String(n).padStart(3, '0')}</text>
        <text x="10" y="136" font-family="-apple-system, system-ui, sans-serif" font-size="7" fill="${c.ink}" opacity=".6">${c.type} type</text>
        <line x1="10" y1="144" x2="110" y2="144" stroke="${c.ink}" stroke-opacity=".15"/>
        <g fill="${c.ink}" opacity="${c.holo ? .85 : .35}">${[0, 1, 2].map((i) => `<path d="M${14 + i * 9} 151 l2.4 4.6 l-2.4 4.6 l-2.4 -4.6Z"/>`).join('')}</g>
        <text x="110" y="159" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="6" fill="${c.ink}" opacity=".55">${c.holo ? 'HOLO' : 'COMMON'}</text>
      </svg>`;
    };

    // Pack art, 160×220: crimped foil with a star mascot
    const packSVG = (col, id, withDefs) => {
      const crimp = (y, dir) => Array.from({ length: 33 }, (_, i) => `L${i * 5} ${y + (i % 2 ? dir * 3 : 0)}`).join(' ');
      const star = Array.from({ length: 8 }, (_, i) => { const r = i % 2 ? 13 : 38, a = (-90 + i * 45) * Math.PI / 180; return `${i ? 'L' : 'M'}${(80 + r * Math.cos(a)).toFixed(1)} ${(118 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
      return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        ${withDefs ? `<defs>
          <linearGradient id="${id}f" x1="0" x2="1"><stop offset="0" stop-color="${col[1]}"/><stop offset=".18" stop-color="${col[0]}"/><stop offset=".5" stop-color="${col[0]}"/><stop offset=".62" stop-color="#fff" stop-opacity=".0"/><stop offset=".82" stop-color="${col[0]}"/><stop offset="1" stop-color="${col[1]}"/></linearGradient>
          <linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
          <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe0f4"/><stop offset=".3" stop-color="#b8f0ff"/><stop offset=".55" stop-color="#e2d4ff"/><stop offset=".8" stop-color="#fff3b8"/><stop offset="1" stop-color="#c8b8ff"/></linearGradient>
        </defs>` : ''}
        <path d="M0 4 ${crimp(4, -1)} L160 ${H - 4} ${crimp(H - 4, 1).replace(/L(\d+)/g, (m, x) => `L${160 - x}`)} Z" fill="${col[0]}"/>
        <path d="M0 4 ${crimp(4, -1)} L160 ${H - 4} ${crimp(H - 4, 1).replace(/L(\d+)/g, (m, x) => `L${160 - x}`)} Z" fill="url(#${id}f)"/>
        <rect x="0" y="0" width="160" height="16" fill="#000" opacity=".1"/><rect x="0" y="${H - 16}" width="160" height="16" fill="#000" opacity=".1"/>
        ${Array.from({ length: 32 }, (_, i) => `<line x1="${i * 5 + 2.5}" y1="2" x2="${i * 5 + 2.5}" y2="14" stroke="#fff" stroke-opacity=".18"/><line x1="${i * 5 + 2.5}" y1="${H - 14}" x2="${i * 5 + 2.5}" y2="${H - 2}" stroke="#fff" stroke-opacity=".18"/>`).join('')}
        <line x1="0" y1="${STRIP}" x2="160" y2="${STRIP}" stroke="#fff" stroke-opacity=".3" stroke-dasharray="3 3"/>
        <text x="14" y="52" font-family="-apple-system, system-ui, sans-serif" font-weight="800" font-size="19" fill="#fff" letter-spacing="-.5">glim</text>
        <text x="146" y="44" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="5.5" fill="#fff" opacity=".7">5 CARDS · SERIES 1</text>
        <path d="${star}Z" fill="url(#${id}s)" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linejoin="round"/>
        <g fill="#3a2a55"><path d="M71 112 l5 3 l-5 3" stroke="#3a2a55" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M89 112 l-5 3 l5 3" stroke="#3a2a55" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M76 124 Q80 127 84 124" stroke="#3a2a55" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
        <text x="14" y="${H - 26}" font-family="ui-monospace, Menlo, monospace" font-size="5.5" fill="#fff" opacity=".7">TEAR HERE ↑</text>
        <text x="146" y="${H - 26}" text-anchor="end" font-family="ui-monospace, Menlo, monospace" font-size="5.5" fill="#fff" opacity=".7">HOLO INSIDE</text>
        <path d="M0 4 L160 4 L160 ${H - 4} L0 ${H - 4}Z" fill="url(#${id}h)"/>
      </svg>`;
    };

    const rainbowSVG = () => {
      const w = W / RAINBOW.length;
      return `<svg class="leak" viewBox="0 0 ${W} 92" preserveAspectRatio="none" aria-hidden="true">${RAINBOW.map((c, i) => {
        let d = '';
        for (let y = 92; y >= 0; y -= 4) d += `${y === 92 ? 'M' : 'L'}${(i * w + w / 2 + Math.sin(y / 7 + i) * 4).toFixed(1)} ${y}`;
        return `<path d="${d}" stroke="${c}" stroke-width="${w + 1.5}" fill="none"/>`;
      }).join('')}</svg>`;
    };

    stage.innerHTML = `
      <div class="ix-pack">
        <div class="fit">
          <div class="shadow"></div>
          <div class="hint"><b>Drag across the top</b> to tear the pack open</div>
          <div class="fx"></div>
          <button class="again" type="button">Open another</button>
        </div>
      </div>`;
    const root = stage.querySelector('.ix-pack');
    const fit = root.querySelector('.fit');
    const fx = root.querySelector('.fx');
    const again = root.querySelector('.again');

    let pack = null, segs = [], leak = null, tx = 0, state = 'pack', round = 0, cards = [];
    const anim = (el, frames, opts) => (el.animate ? el.animate(frames, opts) : { finished: Promise.resolve(), cancel() {} });

    const buildPack = (drop) => {
      const col = COLORS[round % COLORS.length];
      const id = `ixpk${uid++}`;
      pack = document.createElement('div');
      pack.className = 'pk';
      pack.tabIndex = 0;
      pack.setAttribute('role', 'button');
      pack.setAttribute('aria-label', 'Card pack. Press Enter to tear it open');
      pack.innerHTML = `<div class="body">${packSVG(col, id, true)}</div>${rainbowSVG()}`;
      segs = Array.from({ length: SEGS }, (_, i) => {
        const s = document.createElement('div');
        s.className = 'seg';
        s.style.left = `${i * 20}px`;
        s.innerHTML = packSVG(col, id, false).replace('<svg ', `<svg style="left:${-i * 20}px" `);
        pack.append(s);
        return s;
      });
      leak = pack.querySelector('.leak');
      fit.append(pack);
      tx = 0;
      setTear(0);
      pack.addEventListener('pointerdown', down);
      pack.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); autoTear(); } });
      if (drop) anim(pack, [{ translate: '0 -420px', rotate: '-8deg' }, { translate: '0 12px', rotate: '2deg', offset: .75 }, { translate: '0 0', rotate: '0deg' }], { duration: 750, easing: 'cubic-bezier(.3,.7,.3,1)' });
    };

    // How far along the strip the tear has run, in pack px
    const setTear = (x) => {
      tx = x;
      const p = x / W;
      segs.forEach((s, i) => {
        const a = Math.max(0, Math.min(1, (x - i * 20) / 46));
        s.style.transform = a ? `translate(${a * 6}px, ${-a * 12}px) rotate(${-a * (14 + i * 1.5)}deg)` : '';
      });
      leak.style.clipPath = `inset(0 ${W - x}px 0 0)`;
      leak.style.transform = `scaleY(${Math.min(1, p * 1.4)})`;
      leak.style.opacity = Math.min(1, p * 3);
    };

    let dragging = false, raf = 0;
    const localX = (e) => { const r = pack.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * W; };
    const down = (e) => {
      if (state !== 'pack' || e.button) return;
      dragging = true;
      cancelAnimationFrame(raf);
      pack.classList.add('drag');
      pack.setPointerCapture(e.pointerId);
    };
    root.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(W, localX(e)));
      if (x > tx) setTear(x);
      if (tx > W * .9) { dragging = false; pack.classList.remove('drag'); burst(); }
    });
    const up = () => {
      if (!dragging) return;
      dragging = false;
      pack.classList.remove('drag');
      // Let go too early and the strip settles back down
      const back = () => { setTear(Math.max(0, tx * .82 - 1)); if (tx > 0) raf = requestAnimationFrame(back); };
      raf = requestAnimationFrame(back);
    };
    root.addEventListener('pointerup', up);
    root.addEventListener('pointercancel', up);

    const autoTear = () => {
      if (state !== 'pack') return;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 650);
        setTear(Math.max(tx, W * (1 - (1 - k) ** 2)));
        if (k < 1) raf = requestAnimationFrame(step); else burst();
      };
      raf = requestAnimationFrame(step);
    };

    const confetti = (cx, cy) => {
      const cols = [...RAINBOW, '#ffffff'];
      for (let i = 0; i < 70; i++) {
        const c = document.createElement('i');
        c.style.background = cols[i % cols.length];
        fx.append(c);
        const a = -Math.PI / 2 + (Math.random() - .5) * 2.6;
        const v = 160 + Math.random() * 220;
        const dx = Math.cos(a) * v, dy = Math.sin(a) * v;
        const r = Math.random() * 720 - 360;
        anim(c, [
          { transform: `translate(${cx}px, ${cy}px) rotate(0deg) scale(.6)`, opacity: 1 },
          { transform: `translate(${cx + dx * .8}px, ${cy + dy * .8}px) rotate(${r * .6}deg) scale(1)`, opacity: 1, offset: .35 },
          { transform: `translate(${cx + dx}px, ${cy + dy + 340}px) rotate(${r}deg) scale(.9)`, opacity: 0 },
        ], { duration: 1500 + Math.random() * 900, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' }).finished.then(() => c.remove());
      }
    };

    const ROW_Y = 150, ROW_X = (820 - (5 * 120 + 4 * 16)) / 2;
    const burst = (dur = 1) => {
      if (state !== 'pack') return;
      state = 'opening';
      root.classList.add('opening');
      cancelAnimationFrame(raf);
      setTear(W);
      const p = pack;
      p.style.animation = 'none';
      // Strip flies off, rainbow flares, pack drops away
      segs.forEach((s, i) => anim(s, [{ transform: s.style.transform }, { transform: `translate(${120 + i * 6}px, ${-150 - i * 4}px) rotate(${40 + i * 6}deg)`, opacity: 0 }], { duration: 650 * dur, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }));
      anim(leak, [{ transform: 'scaleY(1)', opacity: 1 }, { transform: 'scale(2.6, 4)', opacity: .9, offset: .4 }, { transform: 'scale(3.4, 5)', opacity: 0 }], { duration: 1000 * dur, easing: 'ease-out', fill: 'forwards' });
      anim(p, [{ translate: '0 0', rotate: '0deg' }, { translate: '0 -10px', rotate: '-2deg', offset: .2 }, { translate: '0 460px', rotate: '10deg' }], { duration: 900 * dur, delay: 180 * dur, easing: 'cubic-bezier(.5,0,.8,.5)', fill: 'forwards' }).finished.then(() => p.remove());
      if (dur) confetti(410, 150);

      // Five cards fan out of the pack, then settle into a row
      const order = CARDS.map((c, i) => [c, i]).sort(() => Math.random() - .5);
      cards = order.map(([c, n], i) => {
        const el = document.createElement('div');
        el.className = `card${c.holo ? ' holo' : ''}`;
        el.tabIndex = 0;
        el.setAttribute('aria-label', `${c.name}, ${c.type} type${c.holo ? ', holo' : ''}`);
        el.innerHTML = `${cardSVG(c, n + 1 + round * 5)}<div class="shine"></div>`;
        const left = ROW_X + i * 136;
        el.style.left = `${left}px`;
        fit.append(el);
        const fromX = 410 - (left + 60), fromY = 230 - (ROW_Y + 84);
        const fanX = fromX + (i - 2) * 58, fanY = fromY - 70 + Math.abs(i - 2) * 14;
        anim(el, [
          { transform: `translate(${fromX}px, ${fromY}px) scale(.45) rotate(${(i - 2) * 6}deg)`, opacity: 0 },
          { opacity: 1, offset: .12 },
          { transform: `translate(${fanX}px, ${fanY}px) scale(1.04) rotate(${(i - 2) * 12}deg)`, opacity: 1, offset: .45 },
          { transform: 'none', opacity: 1 },
        ], { duration: 1200 * dur, delay: (260 + i * 70) * dur, easing: 'cubic-bezier(.25,.8,.25,1)', fill: 'backwards' });
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const mx = (e.clientX - r.left) / r.width, my = (e.clientY - r.top) / r.height;
          el.style.transform = `perspective(600px) rotateX(${(.5 - my) * 22}deg) rotateY(${(mx - .5) * 26}deg) translateY(-6px) scale(1.06)`;
          el.style.setProperty('--mx', `${mx * 100}%`);
          el.style.setProperty('--my', `${my * 100}%`);
        });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
        return el;
      });
      setTimeout(() => {
        state = 'cards';
        root.classList.remove('opening');
        root.classList.add('done');
      }, (260 + 4 * 70 + 1200) * dur);
    };

    const reset = () => {
      if (state !== 'cards') return;
      state = 'pack';
      root.classList.remove('done');
      const old = cards;
      cards = [];
      old.forEach((el, i) => anim(el, [{ transform: el.style.transform || 'none' }, { transform: `translate(${(2 - i) * 30}px, 420px) rotate(${(i - 2) * 14}deg)`, opacity: 0 }], { duration: 550, delay: i * 40, easing: 'cubic-bezier(.5,0,.8,.5)', fill: 'forwards' }).finished.then(() => el.remove()));
      round++;
      buildPack(true);
      pack.focus({ preventScroll: true });
    };
    again.addEventListener('click', reset);

    buildPack(false);

    new ResizeObserver(() => {
      const w = root.clientWidth, h = root.clientHeight;
      if (w && h) root.style.setProperty('--k', Math.min(1.3, w / 820, h / 520));
    }).observe(root);

    // test hooks
    root.ixTear = (x) => setTear(x);
    root.ixOpen = () => burst(0);
    root.ixReset = reset;
  },
});
