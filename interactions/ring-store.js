MicroIX.register({
  id: 'ring-store',
  title: 'Circle store',
  description: 'Products orbit on a ring. Click one and the ring swells until it becomes a giant arc, with the product sitting on it beside a dark info card. Scroll or use ↑/↓ to roll through the arc, open the card into a full product panel, or switch to Grid and watch every item fly into a tile.',
  tags: ['e-commerce', 'layout', 'morph'],
  source: { label: 'ElevenLabs Store ↗', url: 'https://store.elevenlabs.io/' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-store { position: absolute; inset: 0; overflow: hidden; background: #f3f2ee; color: #141412; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; outline: none; user-select: none; -webkit-user-select: none; touch-action: none; }
.ix-store .bar { position: absolute; z-index: 6; left: 20px; right: 16px; top: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.ix-store .mark { font-size: 15px; letter-spacing: -.02em; }
.ix-store .mark b { font-weight: 700; }
.ix-store nav { display: flex; align-items: center; gap: 12px; }
.ix-store nav button { padding: 0; border: 0; background: none; color: #a3a29d; font: inherit; cursor: pointer; transition: color .2s; }
.ix-store nav button.on { color: #141412; }
.ix-store nav .sep { width: 1px; height: 12px; background: #ddd; }
.ix-store .cart { display: flex; align-items: center; gap: 6px; color: #141412; }
.ix-store .cart i { display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 5px; border: 1px solid #e2e1dc; border-radius: 6px; background: #fff; font-style: normal; font-size: 11px; }
.ix-store .cart i.bump { animation: ix-store-bump .5s var(--ease-spring); }
@keyframes ix-store-bump { 40% { transform: scale(1.4); } }

.ix-store .line { position: absolute; left: 0; top: 0; border: 1px solid #dddcd6; border-radius: 50%; pointer-events: none; }
.ix-store .item { position: absolute; left: 0; top: 0; width: 200px; height: 200px; margin: -100px; padding: 0; border: 0; background: none; cursor: pointer; transform-origin: center; transition: opacity .45s; }
.ix-store .item::before { content: ""; position: absolute; inset: calc(2px - 11%); border-radius: 10px; background: #e9e7e1; opacity: var(--g, 0); }
.ix-store .item svg { position: relative; display: block; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 6px 6px rgba(0,0,0,.08)); }
.ix-store.open .item:not(.active) { opacity: .08; }

.ix-store .panel { position: absolute; z-index: 5; right: 16px; top: 50%; width: min(300px, 40%); height: 96px; padding: 12px 12px 12px 14px; border-radius: 16px; background: #171614; color: #f3f2ee; opacity: 0; translate: 0 -50%; transform: translateX(30px); pointer-events: none; transition: opacity .35s, transform .5s var(--ease-out), top .55s var(--ease-out), height .55s var(--ease-out), translate .55s var(--ease-out); }
.ix-store.focus .panel { opacity: 1; transform: none; pointer-events: auto; }
.ix-store.open .panel { top: 50px; height: calc(100% - 64px); translate: 0 0; }
.ix-store .panel h5 { margin: 0; font-size: 15px; font-weight: 400; }
.ix-store .panel .price { position: absolute; left: 14px; top: 68px; color: #8f8d87; font-size: 13px; }
.ix-store .thumb { position: absolute; right: 8px; top: 8px; width: 80px; height: 80px; padding: 0; border: 0; border-radius: 10px; background: #fff; cursor: pointer; }
.ix-store .thumb svg { width: 100%; height: 100%; }
.ix-store .thumb span { position: absolute; left: 50%; top: 50%; padding: 4px 10px; border-radius: 999px; background: #171614; color: #fff; font-size: 11px; translate: -50% -50%; transition: transform .2s var(--ease-out); }
.ix-store .thumb:hover span { transform: scale(1.08); }
.ix-store .details { position: absolute; left: 14px; right: 14px; top: 104px; bottom: 14px; display: flex; flex-direction: column; border-top: 1px solid #34322e; padding-top: 12px; opacity: 0; transition: opacity .3s; }
.ix-store.open .details { opacity: 1; transition-delay: .25s; }
.ix-store .details p { margin: 0 0 10px; color: #d8d6cf; font-size: 12px; line-height: 1.45; }
.ix-store .details .add { margin-top: auto; padding: 9px; border: 0; border-radius: 999px; background: #fff; color: #141412; font: inherit; font-size: 13px; cursor: pointer; transition: transform .15s var(--ease-out); }
.ix-store .details .add:active { transform: scale(.97); }
.ix-store .fly { position: absolute; z-index: 7; width: 60px; height: 60px; margin: -30px; pointer-events: none; }
.ix-store .hint { position: absolute; left: 20px; bottom: 14px; color: #a3a29d; font-size: 11px; transition: opacity .3s; }

@media (max-width: 640px) {
  .ix-store .panel { top: auto; bottom: 14px; left: 14px; right: 14px; width: auto; translate: 0 0; transform: translateY(30px); }
  .ix-store.open .panel { top: 120px; height: auto; }
  .ix-store .hint { display: none; }
}
`,
  mount(stage) {
    // Product art: simple garment silhouettes drawn in a 100×100 box
    const SHAPES = {
      tee: 'M30 20L41 15Q50 21 59 15L70 20L88 35L78 46L70 40V86H30V40L22 46L12 35Z',
      crew: 'M30 20L41 15Q50 20 59 15L70 20Q80 26 84 52L90 82L80 84L72 52L71 86H29L28 52L20 84L10 82L16 52Q20 26 30 20Z',
      hood: 'M30 22L39 18Q50 22 61 18L70 22Q80 28 84 54L90 84L80 86L72 54L71 88H29L28 54L20 86L10 84L16 54Q20 28 30 22Z',
      cap: 'M22 62Q22 28 50 26Q78 28 78 62ZM18 60Q50 50 82 60Q84 72 77 76Q50 64 23 76Q16 72 18 60Z',
      tote: 'M27 42H73L75 90H25Z',
      bottle: 'M36 28Q36 25 41 25H59Q64 25 64 28L67 84Q67 92 59 92H41Q33 92 33 84Z',
    };
    const art = (p) => {
      const ink = p.ink || 'rgba(255,255,255,.75)';
      let extra = '';
      if (p.type === 'hood') extra += `<path d="M38 20Q38 6 50 6Q62 6 62 20Q56 26 50 26Q44 26 38 20Z" fill="${p.color}" style="filter:brightness(.9)"/><path d="M37 70H63L66 82H34Z" fill="none" stroke="rgba(0,0,0,.12)"/>`;
      if (p.type === 'tote') extra += `<path d="M38 42Q38 12 50 12Q62 12 62 42" fill="none" stroke="${p.color}" stroke-width="3"/>`;
      if (p.type === 'bottle') extra += `<rect x="38" y="13" width="24" height="13" rx="2" fill="#151515"/><path d="M60 16Q74 10 72 22Q70 28 62 22" fill="none" stroke="#151515" stroke-width="1.4"/>`;
      if (p.type === 'cap') extra += `<circle cx="50" cy="27" r="2" fill="${p.color}" style="filter:brightness(.8)"/><path d="M50 27V58" stroke="rgba(0,0,0,.15)"/>`;
      // Prints
      const g = p.print;
      let print = '';
      const cy = p.type === 'cap' ? 46 : p.type === 'bottle' ? 58 : 52;
      if (g === 'wave') for (let k = 0; k < 4; k++) print += `<path d="M${42 + k * 5} 36q4 8 0 16t0 16t0 16" fill="none" stroke="${ink}" stroke-width=".9" stroke-dasharray="1 1.6"/>`;
      if (g === 'block') print += `<rect x="38" y="${cy - 7}" width="24" height="12" rx="1" fill="${ink}" transform="skewY(-6)"/>`;
      if (g === 'time') print += `<text x="50" y="${cy + 4}" text-anchor="middle" font-size="12" font-weight="700" font-family="Helvetica, Arial" fill="${ink}">11:11</text>`;
      if (g === 'word') print += `<text x="50" y="${cy}" text-anchor="middle" font-size="5.5" font-family="Georgia, serif" fill="${ink}">Make it</text><text x="50" y="${cy + 6}" text-anchor="middle" font-size="5.5" font-family="Georgia, serif" fill="${ink}">move</text>`;
      if (g === 'iso') print += `<path d="M40 40l10-5 10 5v22l-10 5-10-5zM40 40l10 5 10-5M50 45v22" fill="none" stroke="${ink}" stroke-width=".7"/>`;
      if (g === 'dot') print += `<rect x="48.5" y="24" width="3" height="3" fill="${ink}"/>`;
      if (g === 'logo') print += `<text x="50" y="${cy}" text-anchor="middle" font-size="5" font-weight="700" font-family="Helvetica, Arial" fill="${ink}">STUDIO</text>`;
      return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${SHAPES[p.type]}" fill="${p.color}" ${p.type === 'bottle' ? 'fill-opacity=".92"' : ''}/>${extra}${print}</svg>`;
    };

    const P = [
      { name: 'Wave Hoodie', price: 88, type: 'hood', color: '#e8e2cc', print: 'block', ink: '#3c63b8' },
      { name: 'Core Tee', price: 42, type: 'tee', color: '#f4f4f2', print: 'logo', ink: '#222' },
      { name: 'Cobalt Tee', price: 42, type: 'tee', color: '#1f47a8', print: 'dot', ink: '#fff' },
      { name: '11:11 Bottle', price: 32, type: 'bottle', color: '#3b2a1c', print: 'time', ink: '#efe3c4' },
      { name: 'Sand Crew', price: 74, type: 'crew', color: '#d7c7a3', print: 'logo', ink: '#f6efe0' },
      { name: 'Field Hoodie', price: 88, type: 'hood', color: '#6d6b4b', print: 'block', ink: '#e8e2cc' },
      { name: 'Signal Crew', price: 74, type: 'crew', color: '#151515', print: 'time', ink: '#e9e9e9' },
      { name: 'Blueprint Crew', price: 78, type: 'crew', color: '#1c2640', print: 'iso', ink: '#8ea6e0' },
      { name: 'Night Hoodie', price: 88, type: 'hood', color: '#141414', print: 'dot', ink: '#777' },
      { name: 'Studio Tee', price: 44, type: 'tee', color: '#efe9d6', print: 'word', ink: '#d2463c' },
      { name: 'Washed Cap', price: 31, type: 'cap', color: '#5d5b58', print: 'logo', ink: '#eee' },
      { name: 'Kinetic Tee', price: 48, type: 'tee', color: '#121212', print: 'wave', ink: '#cfcfcf' },
      { name: 'Everyday Tote', price: 28, type: 'tote', color: '#151515', print: 'iso', ink: '#cfcfcf' },
      { name: 'Preview Cap', price: 31, type: 'cap', color: '#8a3b3e', print: 'logo', ink: '#f0d6d0' },
      { name: 'Long Sleeve', price: 56, type: 'crew', color: '#f2f1ed', print: 'dot', ink: '#d2463c' },
    ];
    const N = P.length;
    const DESC = 'Heavyweight, garment-dyed and cut for a relaxed fit. Printed by hand in small batches, so each piece is slightly different. Pre-washed to keep its shape.';

    stage.innerHTML = `
      <div class="ix-store" tabindex="0" aria-label="Circle store. Click a product, scroll or use the arrow keys.">
        <div class="line"></div>
        ${P.map((p, i) => `<button class="item" data-i="${i}" aria-label="${p.name}">${art(p)}</button>`).join('')}
        <div class="bar">
          <span class="mark"><b>Studio</b> Store</span>
          <nav><button class="v-grid">Grid</button><button class="v-circle on">Circle</button><span class="sep"></span><span class="cart">Cart <i>0</i></span></nav>
        </div>
        <div class="panel">
          <h5></h5><span class="price"></span>
          <button class="thumb"><span>Open</span></button>
          <div class="details"><p>${DESC}</p><p>Ships in 2–3 weeks.</p><button class="add">Add to Cart</button></div>
        </div>
        <span class="hint">Drag to spin · click a product</span>
      </div>`;

    const root = stage.querySelector('.ix-store');
    const items = [...root.querySelectorAll('.item')];
    const line = root.querySelector('.line');
    const card = root.querySelector(".panel");
    const thumb = card.querySelector('.thumb');
    const cartNum = root.querySelector('.cart i');
    const hint = root.querySelector('.hint');
    const btnGrid = root.querySelector('.v-grid');
    const btnCircle = root.querySelector('.v-circle');

    let W = 0, H = 0;
    let mode = 'ring'; // ring | focus | grid
    let rot = 0, rotT = 0;      // ring rotation in item steps (eased → target)
    let active = 0;
    let gridY = 0, gridYT = 0;  // grid scroll
    let cart = 0;
    let running = false;
    // Eased layout params
    const cur = { f: 0, g: 0 };
    const tgt = { f: 0, g: 0 };

    const lerp = (a, b, t) => a + (b - a) * t;
    const wrap = (i) => ((i % N) + N) % N;

    const geom = (f) => {
      // f = 0 overview ring, 1 focus arc. Interpolating these numbers is what makes
      // the ring "swell" into the arc.
      const small = W < 640;
      const ring = { cx: W / 2, cy: H / 2 + 16, R: Math.min(W, H) * 0.38, size: Math.min(W, H) * 0.12, line: 1.12 };
      const ax = small ? W * 0.5 : W * 0.36;           // where the active product sits
      const R = Math.max(H * 1.35, 700);
      const arc = { cx: ax - R, cy: small ? H * 0.4 : H / 2 + 10, R, size: small ? H * 0.4 : H * 0.62, line: 1 + (small ? 0.5 : W * 0.2) / R };
      return {
        cx: lerp(ring.cx, arc.cx, f), cy: lerp(ring.cy, arc.cy, f), R: lerp(ring.R, arc.R, f),
        size: lerp(ring.size, arc.size, f), line: lerp(ring.line, arc.line, f),
        // spacing between items: a full turn in overview, ~1.1 product heights on the arc
        step: lerp((Math.PI * 2) / N, (arc.size * 1.08) / arc.R, f),
      };
    };

    const gridLayout = () => {
      const cols = W < 640 ? 2 : W < 900 ? 3 : 5;
      const pad = 16, gap = 8, top = 50;
      const cw = (W - pad * 2 - gap * (cols - 1)) / cols;
      const rows = Math.ceil(N / cols);
      const total = top + rows * (cw + gap) + pad;
      return { cols, cw, gap, pad, top, max: Math.max(0, total - H) };
    };

    const render = () => {
      const G = geom(cur.f);
      const L = gridLayout();
      line.style.width = line.style.height = `${G.R * G.line * 2}px`;
      line.style.transform = `translate(${G.cx - G.R * G.line}px, ${G.cy - G.R * G.line}px)`;
      line.style.opacity = 1 - cur.g;
      items.forEach((el, i) => {
        // Ring position: overview starts at the top, the arc puts the active item at 3 o'clock
        let d = i - rot;
        d = d - Math.round(d / N) * N;               // shortest way round
        const a = d * G.step + lerp(-Math.PI / 2, 0, cur.f);
        const rx = G.cx + Math.cos(a) * G.R;
        const ry = G.cy + Math.sin(a) * G.R;
        const rs = G.size / 200;
        // Grid position
        const c = i % L.cols, r = Math.floor(i / L.cols);
        const gx = L.pad + c * (L.cw + L.gap) + L.cw / 2;
        const gy = L.top + r * (L.cw + L.gap) + L.cw / 2 - gridY;
        const gs = (L.cw / 200) * 0.82;
        const x = lerp(rx, gx, cur.g), y = lerp(ry, gy, cur.g), s = lerp(rs, gs, cur.g);
        el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
        el.style.setProperty('--g', cur.g.toFixed(3));
        el.style.zIndex = i === active ? 2 : 1;
        el.classList.toggle('active', i === active);
      });
    };

    const frame = () => {
      if (!running) return;
      const k = 0.11;
      cur.f += (tgt.f - cur.f) * k;
      cur.g += (tgt.g - cur.g) * k;
      if (mode === 'ring' && !dragging && idle) rotT += 0.0025;
      rot += (rotT - rot) * 0.12;
      gridY += (gridYT - gridY) * 0.18;
      render();
      requestAnimationFrame(frame);
    };
    new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(frame);
    }).observe(root);

    const fillCard = () => {
      const p = P[active];
      card.querySelector('h5').textContent = p.name;
      card.querySelector('.price').textContent = `$${p.price.toFixed(2)}`;
      thumb.innerHTML = `${art(p)}<span>${root.classList.contains('open') ? 'Close' : 'Open'}</span>`;
    };

    const setMode = (m) => {
      mode = m;
      tgt.f = m === 'focus' ? 1 : 0;
      tgt.g = m === 'grid' ? 1 : 0;
      root.classList.toggle('focus', m === 'focus');
      if (m !== 'focus') root.classList.remove('open');
      btnGrid.classList.toggle('on', m === 'grid');
      btnCircle.classList.toggle('on', m !== 'grid');
      hint.style.opacity = m === 'ring' ? 1 : 0;
      if (m === 'grid') gridYT = 0;
    };

    const goTo = (i) => {
      // Rotate the short way to item i
      let d = i - wrap(Math.round(rotT));
      d = d - Math.round(d / N) * N;
      rotT = Math.round(rotT) + d;
      active = wrap(i);
      fillCard();
    };

    const focusOn = (i) => {
      goTo(i);
      setMode('focus');
    };

    // Pointer: drag spins the ring (or scrolls the grid); a click without movement picks an item
    let dragging = false, moved = 0, last = null, idle = true;
    let idleTimer;
    const wake = () => { idle = false; clearTimeout(idleTimer); idleTimer = setTimeout(() => (idle = true), 4000); };
    root.addEventListener('pointerdown', (e) => {
      if (e.target.closest(".panel, .bar")) return;
      root.focus({ preventScroll: true });
      dragging = true; moved = 0; last = [e.clientX, e.clientY];
      wake();
    });
    root.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - last[0], dy = e.clientY - last[1];
      last = [e.clientX, e.clientY];
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6 && !root.hasPointerCapture(e.pointerId)) root.setPointerCapture(e.pointerId);
      if (mode === 'grid') gridYT = Math.max(0, Math.min(gridLayout().max, gridYT - dy));
      else if (mode === 'focus') rotT -= dy / (H * 0.6);
      else {
        // Spin by the angle swept around the ring centre
        const r = root.getBoundingClientRect();
        const G = geom(0);
        const px = e.clientX - r.left - G.cx, py = e.clientY - r.top - G.cy;
        const cross = (px * dy - py * dx) / Math.max(1, px * px + py * py);
        rotT -= cross / G.step;
      }
    });
    const up = (e) => {
      if (!dragging) return;
      dragging = false;
      if (moved <= 6) {
        const it = e.target.closest('.item');
        if (it) focusOn(+it.dataset.i);
        else if (mode === 'focus' && !root.classList.contains('open')) setMode('ring');
      } else if (mode === 'focus') {
        goTo(wrap(Math.round(rotT)));
      }
    };
    root.addEventListener('pointerup', up);
    root.addEventListener('pointercancel', () => (dragging = false));

    // Wheel only takes over once you're inside the store (focus or grid with room to scroll)
    let snap;
    root.addEventListener('wheel', (e) => {
      if (mode === 'focus') {
        e.preventDefault();
        rotT += e.deltaY / 300;
        clearTimeout(snap);
        snap = setTimeout(() => goTo(wrap(Math.round(rotT))), 140);
      } else if (mode === 'grid') {
        const max = gridLayout().max;
        if ((e.deltaY < 0 && gridYT <= 0) || (e.deltaY > 0 && gridYT >= max)) return;
        e.preventDefault();
        gridYT = Math.max(0, Math.min(max, gridYT + e.deltaY));
      }
    }, { passive: false });

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { mode === 'ring' ? focusOn(active) : goTo(active + 1); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { mode === 'ring' ? focusOn(active) : goTo(active - 1); }
      else if (e.key === 'Escape') { root.classList.contains('open') ? toggleOpen() : setMode('ring'); }
      else return;
      e.preventDefault();
      wake();
    });

    const toggleOpen = () => {
      root.classList.toggle('open');
      thumb.querySelector('span').textContent = root.classList.contains('open') ? 'Close' : 'Open';
    };
    thumb.addEventListener('click', toggleOpen);

    btnGrid.addEventListener('click', () => setMode('grid'));
    btnCircle.addEventListener('click', () => setMode('ring'));

    // Add to cart: a copy of the product arcs up into the cart counter
    card.querySelector('.add').addEventListener('click', () => {
      const rr = root.getBoundingClientRect();
      const a = items[active].getBoundingClientRect();
      const b = cartNum.getBoundingClientRect();
      const fly = document.createElement('div');
      fly.className = 'fly';
      fly.innerHTML = art(P[active]);
      root.append(fly);
      const x0 = a.left + a.width / 2 - rr.left, y0 = a.top + a.height / 2 - rr.top;
      const x1 = b.left + b.width / 2 - rr.left, y1 = b.top + b.height / 2 - rr.top;
      fly.animate([
        { transform: `translate(${x0}px, ${y0}px) scale(1.6)`, opacity: 1 },
        { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 60}px) scale(.9)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x1}px, ${y1}px) scale(.15)`, opacity: 0.2 },
      ], { duration: 750, easing: 'cubic-bezier(.4,0,.2,1)' }).onfinish = () => {
        fly.remove();
        cartNum.textContent = ++cart;
        cartNum.classList.remove('bump');
        void cartNum.offsetWidth;
        cartNum.classList.add('bump');
      };
    });

    new ResizeObserver(() => { W = root.clientWidth; H = root.clientHeight; render(); }).observe(root);
    W = root.clientWidth; H = root.clientHeight;
    fillCard();
    render();
  },
});
