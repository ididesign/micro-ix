MicroIX.register({
  id: 'gift-card',
  title: 'Flower gift card',
  description: 'A thick 3D gift card floats over oversized type. It tilts toward the pointer, spins when you drag it and flips on click. The front is a row of swaying poppies, the back is the gift itself, and butterflies wander across both. Type a name to address it.',
  tags: ['3d', 'card', 'drag'],
  source: { label: '@marina_uiux on X ↗', url: 'https://x.com/marina_uiux/status/2115447175400276149' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-gift { --ink: #141414; --bg: #f1f0ec; --k: 1; position: relative; width: 100%; height: 100%; overflow: hidden; isolation: isolate; background: var(--bg); color: var(--ink); font-family: ui-sans-serif, -apple-system, system-ui, sans-serif; user-select: none; -webkit-user-select: none; transition: background .6s ease, color .6s ease; }
.ix-gift.dark { --ink: #f3f1ea; --bg: #0e0e0e; }
.ix-gift .top { position: absolute; z-index: 5; top: 14px; left: 18px; right: 18px; display: flex; justify-content: space-between; align-items: center; font: 400 15px/1 "Instrument Serif", Georgia, serif; }
.ix-gift .links { display: flex; align-items: center; gap: 6px; color: color-mix(in srgb, var(--ink) 70%, transparent); }
.ix-gift .links button { all: unset; cursor: pointer; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; transition: background .2s; }
.ix-gift .links button:hover { background: color-mix(in srgb, var(--ink) 10%, transparent); }
.ix-gift .links svg { width: 13px; height: 13px; }

/* Oversized condensed type behind the card */
.ix-gift .word { position: absolute; z-index: 0; left: 50%; top: 50%; translate: -50% -54%; margin: 0; font: 400 calc(250px * var(--k))/.8 "Instrument Serif", Georgia, serif; text-align: center; letter-spacing: -.02em; white-space: nowrap; transform: scaleX(.74); pointer-events: none; transition: color .6s; }
.ix-gift .word span { display: block; }

/* Card: front and back faces with stacked edge layers between them for thickness.
   Each layer gets the full rotation itself (no preserve-3d), so it renders the same in every browser. */
.ix-gift .scene { position: absolute; z-index: 2; inset: 0; display: grid; place-items: center; }
.ix-gift .float { width: calc(400px * var(--k)); height: calc(250px * var(--k)); animation: ix-gift-float 6s ease-in-out infinite; }
@keyframes ix-gift-float { 50% { translate: 0 -8px; } }
.ix-gift .card { position: relative; width: 100%; height: 100%; perspective: 1300px; cursor: grab; touch-action: none; }
.ix-gift .card.drag { cursor: grabbing; }
.ix-gift .face, .ix-gift .edge { position: absolute; inset: 0; border-radius: calc(26px * var(--k)); }
.ix-gift .edge { background: #1c1c1c; will-change: transform; }
.ix-gift .face { overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: #fbfaf7; box-shadow: inset 0 0 0 calc(3px * var(--k)) #1c1c1c; }
.ix-gift .face svg.art { position: absolute; inset: 0; width: 100%; height: 100%; }
.ix-gift .glare { position: absolute; inset: 0; background: radial-gradient(circle at var(--gx, 30%) var(--gy, 20%), rgba(255,255,255,.55), rgba(255,255,255,0) 45%); mix-blend-mode: soft-light; pointer-events: none; }
.ix-gift .name { position: absolute; left: 61%; top: 79.5%; width: 33%; padding-bottom: 2px; border-bottom: 1px solid #1c1c1c; font: 500 calc(13px * var(--k))/1.2 ui-sans-serif, system-ui, sans-serif; color: #1c1c1c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ix-gift .shadow { position: absolute; z-index: 1; left: 50%; top: 50%; width: calc(380px * var(--k)); height: calc(60px * var(--k)); margin: calc(150px * var(--k)) 0 0 calc(-190px * var(--k)); border-radius: 50%; background: rgba(0,0,0,.28); filter: blur(22px); pointer-events: none; }
.ix-gift.dark .shadow { background: rgba(0,0,0,.8); }

/* Poppies sway from the base of their stems */
.ix-gift .sway { transform-box: fill-box; transform-origin: 50% 100%; animation: ix-gift-sway var(--d, 4s) ease-in-out infinite alternate; animation-delay: var(--dl, 0s); }
@keyframes ix-gift-sway { from { rotate: -2.2deg; } to { rotate: 2.2deg; } }

/* Butterflies: JS moves them, CSS flaps the wings */
.ix-gift .fly { position: absolute; left: 0; top: 0; width: calc(22px * var(--k)); height: calc(22px * var(--k)); margin: calc(-11px * var(--k)); pointer-events: none; }
.ix-gift .fly svg { width: 100%; height: 100%; overflow: visible; }
.ix-gift .fly .wl, .ix-gift .fly .wr { transform-box: fill-box; animation: ix-gift-flap .22s ease-in-out infinite alternate; }
.ix-gift .fly .wl { transform-origin: 100% 50%; }
.ix-gift .fly .wr { transform-origin: 0% 50%; }
.ix-gift .fly.rest .wl, .ix-gift .fly.rest .wr { animation-duration: 1.4s; }
@keyframes ix-gift-flap { from { scale: 1 1; } to { scale: .25 1; } }

/* Pill controls */
.ix-gift .pill { position: absolute; z-index: 5; left: 50%; bottom: calc(28px * var(--k) + 10px); translate: -50% 0; display: flex; align-items: center; gap: 2px; padding: 4px; border-radius: 999px; background: #141414; color: #f3f1ea; font-size: 12px; box-shadow: 0 10px 24px -12px rgba(0,0,0,.6); }
.ix-gift.dark .pill { background: #f3f1ea; color: #141414; }
.ix-gift .pill button { all: unset; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; transition: background .2s; }
.ix-gift .pill button:hover { background: rgba(127,127,127,.25); }
.ix-gift .pill label { display: flex; align-items: center; gap: 6px; padding: 0 10px 0 12px; border-left: 1px solid rgba(127,127,127,.35); }
.ix-gift .pill input { width: 84px; padding: 4px 0; border: 0; background: none; color: inherit; font: inherit; outline: none; }
.ix-gift .pill input::placeholder { color: rgba(127,127,127,.9); }
.ix-gift .hint { position: absolute; z-index: 5; left: 50%; bottom: 10px; translate: -50% 0; font: 10px/1 ui-monospace, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; opacity: .45; white-space: nowrap; transition: opacity .4s; }
.ix-gift .hint.gone { opacity: 0; }
`,
  mount(stage) {
    const NS = 'http://www.w3.org/2000/svg';
    const root = document.createElement('div');
    root.className = 'ix-gift';
    root.innerHTML = `
      <div class="top"><span>field flowers</span>
        <span class="links"><button class="mode" aria-label="Toggle dark background"><svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/></svg></button>/ contact / buy</span></div>
      <h3 class="word" aria-hidden="true"><span>FIELD</span><span>FLOWERS</span></h3>
      <div class="shadow"></div>
      <div class="scene"><div class="float"><div class="card" tabindex="0" role="button" aria-label="Gift card. Drag to spin, click or press Enter to flip."></div></div></div>
      <div class="pill">
        <button class="flip"><svg width="12" height="12" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>flip the card</button>
        <label>to <input class="to" maxlength="18" placeholder="a name" value="Judy" aria-label="Recipient name"></label>
      </div>
      <div class="hint">drag to spin · click to flip</div>`;
    stage.append(root);
    const card = root.querySelector('.card');
    const shadow = root.querySelector('.shadow');
    const hint = root.querySelector('.hint');

    // ---------- art ----------
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.append(n);
      return n;
    };
    const shade = (hex, f) => {
      const n = parseInt(hex.slice(1), 16);
      const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f));
      return `rgb(${c})`;
    };
    let gid = 0;
    const uid = `g${Math.random().toString(36).slice(2, 7)}`;

    // A poppy: ruffled petals around a dark seed head, on a curved stem, all swaying from the ground
    const poppy = (svg, defs, { x, y, r, color, groundY, lean = 0, tilt = 0 }) => {
      const g = el('g', { class: 'sway', style: `--d:${3 + rnd() * 2.5}s;--dl:${-rnd() * 4}s` }, svg);
      const cx = x + lean, cy = y;
      el('path', { d: `M${x} ${groundY} C${x} ${groundY - (groundY - cy) * .4} ${cx + lean * .4} ${cy + r * 1.4} ${cx} ${cy + r * .4}`, stroke: '#5d8a2f', 'stroke-width': Math.max(1.6, r * .09), fill: 'none', 'stroke-linecap': 'round' }, g);
      const id = `${uid}p${gid++}`;
      const grad = el('radialGradient', { id, cx: '50%', cy: '50%', r: '60%' }, defs);
      el('stop', { offset: '0', 'stop-color': shade(color, -.35) }, grad);
      el('stop', { offset: '.45', 'stop-color': color }, grad);
      el('stop', { offset: '1', 'stop-color': shade(color, .18) }, grad);
      const head = el('g', { transform: `translate(${cx} ${cy}) rotate(${tilt}) scale(1 ${0.82 + rnd() * .14})` }, g);
      const petals = 5 + Math.floor(rnd() * 2);
      for (let i = 0; i < petals; i++) {
        const a = (i / petals) * Math.PI * 2 + rnd() * .5;
        const pr = r * (0.85 + rnd() * .25);
        const p = el('g', { transform: `rotate(${(a * 180) / Math.PI})` }, head);
        // Broad lobe with a ruffled rim
        const j = () => 1 + (rnd() - .5) * .14;
        const d = `M0 0 C${pr * .3} ${-pr * .6} ${pr * .72 * j()} ${-pr * .78 * j()} ${pr * .95} ${-pr * .42}`
          + ` Q${pr * 1.1 * j()} ${-pr * .2} ${pr * j()} 0 Q${pr * 1.12 * j()} ${pr * .2} ${pr * .95} ${pr * .42}`
          + ` C${pr * .72 * j()} ${pr * .78 * j()} ${pr * .3} ${pr * .6} 0 0Z`;
        el('path', { d, fill: `url(#${id})`, stroke: shade(color, -.25), 'stroke-width': .5, 'stroke-opacity': .5 }, p);
        el('path', { d: `M${pr * .2} 0 Q${pr * .55} ${(rnd() - .5) * pr * .3} ${pr * .85} ${(rnd() - .5) * pr * .3}`, stroke: shade(color, -.2), 'stroke-width': .7, fill: 'none', opacity: .5 }, p);
      }
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        el('line', { x1: Math.cos(a) * r * .14, y1: Math.sin(a) * r * .14, x2: Math.cos(a) * r * .3, y2: Math.sin(a) * r * .3, stroke: '#2b2420', 'stroke-width': .9, 'stroke-linecap': 'round' }, head);
      }
      el('circle', { r: r * .2, fill: '#f1c94a' }, head);
      el('circle', { r: r * .13, fill: '#3d4a2a' }, head);
      el('circle', { r: r * .055, fill: '#1f2516' }, head);
    };
    const bud = (svg, x, groundY, h) => {
      const g = el('g', { class: 'sway', style: `--d:${3.5 + rnd() * 2}s;--dl:${-rnd() * 4}s` }, svg);
      const top = groundY - h;
      el('path', { d: `M${x} ${groundY} Q${x - 2} ${top + h * .3} ${x + 6} ${top}`, stroke: '#5d8a2f', 'stroke-width': 1.6, fill: 'none' }, g);
      el('ellipse', { cx: x + 7, cy: top + 4, rx: 3.6, ry: 5.5, fill: '#6f9a3c', transform: `rotate(28 ${x + 7} ${top + 4})` }, g);
    };
    const stalk = (svg, x, groundY, h, color = '#b9773a') => {
      const g = el('g', { class: 'sway', style: `--d:${2.5 + rnd() * 2}s;--dl:${-rnd() * 4}s` }, svg);
      const top = groundY - h;
      const bend = (rnd() - .5) * 14;
      el('path', { d: `M${x} ${groundY} Q${x} ${top + h * .4} ${x + bend} ${top}`, stroke: '#7b8a3c', 'stroke-width': 1.1, fill: 'none' }, g);
      for (let i = 0; i < 9; i++) {
        const t = i / 9;
        const px = x + bend * t * t, py = top + h * .45 * (1 - t) - 2;
        [-1, 1].forEach((s) => el('ellipse', { cx: px + s * 2.4, cy: py, rx: 2.2, ry: 1.1, fill: color, transform: `rotate(${s * 35} ${px + s * 2.4} ${py})` }, g));
      }
    };
    const serif = (svg, text, attrs) => {
      const t = el('text', { 'font-family': '"Instrument Serif", Georgia, serif', ...attrs }, svg);
      t.textContent = text;
      return t;
    };

    const front = document.createElement('div');
    front.className = 'face front';
    const fsvg = el('svg', { class: 'art', viewBox: '0 0 400 250', preserveAspectRatio: 'none' });
    const fdefs = el('defs', {}, fsvg);
    serif(fsvg, 'Gift Card', { x: 200, y: 92, 'font-size': 84, 'text-anchor': 'middle', fill: '#141414', transform: 'translate(200 0) scale(.74 1) translate(-200 0)', 'letter-spacing': -2 });
    const G = 250;
    stalk(fsvg, 34, G, 120); stalk(fsvg, 248, G, 140, '#a8652e'); stalk(fsvg, 362, G, 96, '#c9a066');
    bud(fsvg, 98, G, 66); bud(fsvg, 218, G, 58); bud(fsvg, 330, G, 80);
    [
      { x: 58, y: 124, r: 26, color: '#e3262b', tilt: -12 },
      { x: 150, y: 170, r: 22, color: '#f0703c', lean: -4 },
      { x: 202, y: 140, r: 25, color: '#f5c23a', tilt: 8 },
      { x: 286, y: 158, r: 23, color: '#f26a3e', lean: 6 },
      { x: 312, y: 70, r: 30, color: '#ee6fa2', tilt: 14, lean: -8 },
      { x: 112, y: 196, r: 16, color: '#f39a3d' },
    ].forEach((p) => poppy(fsvg, fdefs, { ...p, groundY: G }));
    front.append(fsvg);

    const back = document.createElement('div');
    back.className = 'face back';
    const bsvg = el('svg', { class: 'art', viewBox: '0 0 400 250', preserveAspectRatio: 'none' });
    const bdefs = el('defs', {}, bsvg);
    const gold = el('linearGradient', { id: `${uid}gold`, x1: 0, y1: 0, x2: 0, y2: 1 }, bdefs);
    [['0', '#d8b46a'], ['.45', '#8a6420'], ['.55', '#c49a4c'], ['1', '#6e4c18']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, gold));
    serif(bsvg, '$300', { x: 30, y: 98, 'font-size': 92, fill: '#141414', transform: 'translate(30 0) scale(.7 1) translate(-30 0)', 'letter-spacing': -3 });
    serif(bsvg, 'GIFT', { x: 30, y: 172, 'font-size': 92, fill: `url(#${uid}gold)`, transform: 'translate(30 0) scale(.62 1) translate(-30 0)', 'letter-spacing': -2 });
    poppy(bsvg, bdefs, { x: 250, y: 74, r: 56, color: '#e1222a', groundY: 262, lean: 14, tilt: -6 });
    const msg = el('text', { x: 244, y: 168, 'font-size': 12, fill: '#1c1c1c', 'font-family': 'ui-sans-serif, system-ui, sans-serif' }, bsvg);
    ['Big bouquets and', 'happy smiles for dear'].forEach((line, i) => {
      const ts = el('tspan', { x: 244, dy: i ? 14 : 0 }, msg);
      ts.textContent = line;
    });
    back.append(bsvg);
    const name = document.createElement('div');
    name.className = 'name';
    back.append(name);
    // Layers from back to front: z in px (scaled by --k), back face turned around
    const layers = [{ el: back, z: -5, turn: true }];
    const T = 9;
    for (let i = 0; i < T; i++) {
      const e = document.createElement('div');
      e.className = 'edge';
      card.append(e);
      layers.push({ el: e, z: (i - (T - 1) / 2) * 1.1 });
    }
    layers.push({ el: front, z: 5 });
    [front, back].forEach((f) => {
      const gl = document.createElement('div');
      gl.className = 'glare';
      f.append(gl);
      card.append(f);
    });

    // ---------- butterflies ----------
    const wingColors = [['#f2a33a', '#c45a16'], ['#ef7fb0', '#b23a6e'], ['#f2c84a', '#b57d14']];
    const flies = [front, front, back].map((face, i) => {
      const f = document.createElement('div');
      f.className = 'fly';
      const [a, b] = wingColors[i];
      f.innerHTML = `<svg viewBox="-12 -12 24 24"><g class="wl"><path d="M0 0 C-4 -9 -12 -10 -11 -3 C-10 1 -4 1 0 0Z M0 0 C-4 2 -9 7 -6 9 C-3 10 -1 5 0 0Z" fill="${a}" stroke="${b}" stroke-width=".8"/></g><g class="wr"><path d="M0 0 C4 -9 12 -10 11 -3 C10 1 4 1 0 0Z M0 0 C4 2 9 7 6 9 C3 10 1 5 0 0Z" fill="${a}" stroke="${b}" stroke-width=".8"/></g><path d="M0 -5 L0 6" stroke="#2a1d14" stroke-width="1.6" stroke-linecap="round"/></svg>`;
      face.append(f);
      return { el: f, x: 0.3 + i * .2, y: 0.4, tx: 0.5, ty: 0.3, rest: 0, ang: 0, phase: i * 2.1 };
    });
    const pickTarget = (b) => {
      b.tx = 0.08 + rnd() * .84;
      b.ty = 0.12 + rnd() * .6;
    };
    flies.forEach(pickTarget);

    // ---------- spin / tilt ----------
    let angle = 0, vel = 0, target = 0;
    let tiltX = 0, tiltY = 0, tX = 0, tY = 0;
    let dragging = false, startX = 0, startAngle = 0, lastX = 0, lastT = 0, dragV = 0, moved = 0;
    const W = () => card.getBoundingClientRect().width || 1;

    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      tY = (fx - .5) * 26;
      tX = (.5 - fy) * 18;
      if (dragging) {
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        angle = startAngle + (dx / W()) * 200;
        const now = performance.now();
        dragV = ((e.clientX - lastX) / W()) * 200 / Math.max(1, now - lastT) * 16;
        lastX = e.clientX; lastT = now;
      }
    });
    root.addEventListener('pointerleave', () => { tX = 0; tY = 0; });
    card.addEventListener('pointerdown', (e) => {
      dragging = true; moved = 0;
      startX = lastX = e.clientX; lastT = performance.now();
      startAngle = angle; dragV = 0; vel = 0;
      card.classList.add('drag');
      card.setPointerCapture(e.pointerId);
      hint.classList.add('gone');
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('drag');
      if (moved < 5) { target = Math.round(angle / 180) * 180 + 180; return; }
      // Fling: carry the release speed into the next face
      const projected = angle + dragV * 12;
      target = Math.round(projected / 180) * 180;
      vel = dragV;
    };
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
    const flip = () => { target = Math.round(target / 180) * 180 + 180; hint.classList.add('gone'); };
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    root.querySelector('.flip').addEventListener('click', flip);
    const to = root.querySelector('.to');
    const setName = () => { name.textContent = to.value.trim() || ' '; };
    setName();
    to.addEventListener('input', () => {
      setName();
      // Show the back while someone is addressing the card
      if (Math.abs(((Math.round(target / 180) % 2) + 2) % 2) !== 1) target = Math.round(target / 180) * 180 + 180;
    });
    root.ixAngle = (a) => { angle = target = a; vel = 0; pose(); }; // test hook
    root.querySelector('.mode').addEventListener('click', () => root.classList.toggle('dark'));

    const pose = () => {
      const rot = `rotateX(${tiltX}deg) rotateY(${angle + tiltY}deg)`;
      // Paint order stands in for depth: whichever side faces the viewer goes on top
      const facing = Math.cos(((angle + tiltY) * Math.PI) / 180) >= 0 ? 1 : -1;
      layers.forEach((l, i) => {
        l.el.style.transform = `${rot} translateZ(calc(${l.z}px * var(--k)))${l.turn ? ' rotateY(180deg)' : ''}`;
        l.el.style.zIndex = facing * i + layers.length;
      });
    };
    pose();

    // ---------- loop ----------
    let raf = 0, visible = false, last = performance.now(), idle = 0;
    const tick = (now) => {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;
      if (!dragging) {
        // Spring toward the target face
        vel += (target - angle) * 0.06 * dt;
        vel *= Math.pow(0.8, dt);
        angle += vel * dt;
      }
      idle = dragging || tX || tY ? 0 : idle + dt;
      const t = now / 1000;
      const ax = idle > 30 ? Math.sin(t * .7) * 6 : 0, ay = idle > 30 ? Math.sin(t * .5) * 9 : 0;
      tiltX += (tX + ax - tiltX) * .08 * dt;
      tiltY += (tY + ay - tiltY) * .08 * dt;
      pose();
      const edgeOn = Math.abs(Math.cos(((angle + tiltY) * Math.PI) / 180));
      shadow.style.transform = `translateX(${-tiltY * 1.5}px) scaleX(${0.35 + edgeOn * .65})`;
      shadow.style.opacity = 0.6 + edgeOn * .4;
      const gx = 50 + tiltY * 2.2, gy = 40 - tiltX * 3;
      card.style.setProperty('--gx', `${gx}%`);
      card.style.setProperty('--gy', `${gy}%`);

      flies.forEach((b) => {
        if (b.rest > 0) {
          b.rest -= dt;
          if (b.rest <= 0) { b.el.classList.remove('rest'); pickTarget(b); }
        } else {
          const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy);
          if (d < 0.02) { b.rest = 60 + rnd() * 160; b.el.classList.add('rest'); }
          const sp = 0.0035 * dt;
          b.x += (dx / (d || 1)) * sp + Math.sin(t * 3 + b.phase) * .0016 * dt;
          b.y += (dy / (d || 1)) * sp + Math.cos(t * 4.1 + b.phase) * .0022 * dt;
          b.ang += (Math.atan2(dx, -dy) * 57.3 * .4 - b.ang) * .1 * dt;
        }
        b.el.style.left = `${b.x * 100}%`;
        b.el.style.top = `${b.y * 100}%`;
        b.el.style.transform = `rotate(${b.ang}deg)`;
      });
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }).observe(root);

    new ResizeObserver(() => {
      const w = root.clientWidth, h = root.clientHeight;
      root.style.setProperty('--k', Math.min(1.25, w / 820, h / 520).toFixed(3));
    }).observe(root);
  },
});
