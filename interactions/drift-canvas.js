MicroIX.register({
  id: 'drift-canvas',
  title: 'Endless drift canvas',
  description: 'Photos float on an endless canvas that wraps around. Drag to pan (or click, then scroll), and it eases to a stop. Each photo has its own depth, so closer ones move faster and react more to the mouse. Hover "Collections" to gather everything into a pile.',
  tags: ['gallery', 'drag', 'cursor', 'intro'],
  source: { label: 'General Admission ↗', url: 'https://generaladmission.house/' },
  layout: { wide: true, stageHeight: 580 },
  css: `
.ix-drift { position: absolute; inset: 0; overflow: hidden; background: #fbfbfa; color: #111; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; outline: none; }
.ix-drift.grabbing { cursor: grabbing; }

.ix-drift .bgtext { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding: 70px 32px 0; opacity: .07; font-size: 14px; font-weight: 500; line-height: 1.15; pointer-events: none; }
.ix-drift .bgtext p { margin: 0 0 22px; text-indent: 40px; }
.ix-drift .guide { position: absolute; top: 0; bottom: 0; border-left: 1px dashed rgba(0,0,0,.12); pointer-events: none; }

.ix-drift .title { position: absolute; z-index: 1; left: 20px; bottom: 18px; margin: 0; font-size: clamp(34px, 5.2vw, 66px); font-weight: 500; line-height: .92; letter-spacing: -.045em; pointer-events: none; }
.ix-drift .title .line { display: block; overflow: hidden; }
.ix-drift .title .line > span { display: inline-block; }
.ix-drift .title sup { font-size: .45em; }
.ix-drift.intro .title .line > span { animation: ix-drift-line 1.1s cubic-bezier(.2,.8,.2,1) backwards; animation-delay: calc(.45s + var(--l) * .09s); }
@keyframes ix-drift-line { from { transform: translateY(105%); } }

.ix-drift .layer { position: absolute; z-index: 2; inset: 0; pointer-events: none; }
.ix-drift .item { position: absolute; left: 0; top: 0; z-index: var(--z); }
.ix-drift .inner { transition: transform .9s cubic-bezier(.75,0,.2,1); }
.ix-drift .photo { width: var(--w); height: var(--h); overflow: hidden; background: var(--bg); }
.ix-drift .photo img { display: block; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .5s; }
.ix-drift .photo img.loaded { opacity: 1; }
.ix-drift.intro .pop { animation: ix-drift-pop .9s cubic-bezier(.2,.8,.2,1) backwards; animation-delay: var(--delay); }
@keyframes ix-drift-pop { from { scale: .4; opacity: 0; } }
.ix-drift .word { font-size: var(--fs); font-weight: 500; line-height: .95; letter-spacing: -.035em; color: rgba(0,0,0,.16); white-space: nowrap; }
.ix-drift .star svg { display: block; width: 74px; height: 74px; fill: none; stroke: rgba(0,0,0,.28); stroke-width: 1.4; stroke-linecap: round; }

.ix-drift .nav { position: absolute; z-index: 5; top: 18px; left: 20px; display: grid; gap: 1px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
.ix-drift .nav button { all: unset; cursor: pointer; transition: opacity .3s; }
.ix-drift .nav button:focus-visible { outline: 1px solid #111; outline-offset: 2px; }
.ix-drift .nav:hover button:not(:hover) { opacity: .35; }
.ix-drift .replay { position: absolute; z-index: 5; top: 16px; right: 18px; padding: 5px 10px; border: 1px solid rgba(0,0,0,.15); border-radius: 999px; background: rgba(255,255,255,.8); color: #111; font: 600 11px "Helvetica Neue", Helvetica, Arial, sans-serif; text-transform: uppercase; cursor: pointer; }
.ix-drift .follower { position: absolute; z-index: 6; left: 0; top: 0; padding: 4px 9px; border-radius: 999px; background: #111; color: #fff; font-size: 10px; font-weight: 600; letter-spacing: .08em; pointer-events: none; opacity: 0; transition: opacity .25s; }
.ix-drift.hovering .follower { opacity: 1; }
.ix-drift.gathered .follower { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .ix-drift .inner { transition-duration: .01ms; }
}
`,
  mount(stage) {
    // Seeded RNG so the layout is the same on every load.
    let seed = 11;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    const W0 = stage.clientWidth || 1100;
    const H0 = stage.clientHeight || 580;
    const TW = Math.max(1800, W0 + 800); // wrap tile, bigger than the view so the seam never shows
    const TH = Math.max(1250, H0 + 700);
    const M = 320; // off-screen margin before an item wraps
    const ASPECTS = [3 / 4, 4 / 3, 1, 4 / 5, 3 / 2, 2 / 3];
    const WORDS = ['Open House®', 'For the curious', 'Est. 2026', 'Archive', 'Studio®'];

    const items = [];
    for (let i = 0; i < 30; i++) {
      const d = 0.6 + rand() * 0.7; // depth: >1 is closer, moves faster, sits on top
      const kind = i % 10 === 4 ? 'word' : i % 13 === 7 ? 'star' : 'photo';
      const w = kind === 'photo' ? (100 + rand() * 150) * d : kind === 'star' ? 74 : 220 * d;
      const h = kind === 'photo' ? w / ASPECTS[Math.floor(rand() * ASPECTS.length)] : kind === 'star' ? 74 : 40 * d;
      items.push({ i, kind, d, w, h, bx: rand() * TW, by: rand() * TH, hue: Math.floor(rand() * 360) });
    }

    const para = 'A small studio for things that move. Part archive, part playground, it is a place to collect interactions, take them apart and see what makes them feel alive. Built by tinkerers, for tinkerers.';
    const col = `<div>${`<p>${para}</p>`.repeat(7)}</div>`;

    stage.innerHTML = `
      <div class="ix-drift intro" tabindex="0" aria-label="Draggable photo canvas">
        <div class="bgtext">${col}${col}${col}</div>
        <span class="guide" style="left:33.3%"></span><span class="guide" style="left:66.6%"></span>
        <h3 class="title">
          <span class="line"><span style="--l:0">OPEN HOUSE<sup>®</sup></span></span>
          <span class="line"><span style="--l:1">EST.2026</span></span>
          <span class="line"><span style="--l:2">DRAG TO EXPLORE</span></span>
        </h3>
        <div class="layer"></div>
        <nav class="nav"><button>Index,</button><button class="collections">Collections,</button><button>About</button></nav>
        <button class="replay">Replay intro</button>
        <span class="follower">DRAG</span>
      </div>`;

    const root = stage.querySelector('.ix-drift');
    const layer = root.querySelector('.layer');
    const follower = root.querySelector('.follower');

    items.forEach((it) => {
      const el = document.createElement('div');
      el.className = 'item';
      el.style.setProperty('--z', Math.round(it.d * 100));
      const inner = document.createElement('div');
      inner.className = 'inner';
      let content;
      if (it.kind === 'photo') {
        content = `<div class="photo pop" style="--w:${it.w}px;--h:${it.h}px;--bg:hsl(${it.hue} 45% 82%);--delay:${(0.1 + rand() * 0.6).toFixed(2)}s">
          <img alt="" src="https://picsum.photos/seed/microix-${it.i}/${Math.round(it.w * 2)}/${Math.round(it.h * 2)}"></div>`;
      } else if (it.kind === 'word') {
        content = `<div class="word pop" style="--fs:${Math.round(34 * it.d)}px;--delay:.3s">${WORDS[it.i % WORDS.length]}</div>`;
      } else {
        content = `<div class="star pop" style="--delay:.5s"><svg viewBox="0 0 74 74"><path d="M37 6l2 62M10 22l55 30M64 18L12 56M30 40c10-4 22-6 34 2"/></svg></div>`;
      }
      inner.innerHTML = content;
      inner.querySelector('img')?.addEventListener('load', (e) => e.target.classList.add('loaded'));
      el.append(inner);
      layer.append(el);
      it.el = el;
      it.inner = inner;
    });

    // Pan state, eased toward the target every frame.
    const cur = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const mouse = { x: 0.5, y: 0.5, cx: 0.5, cy: 0.5 };
    const fpos = { x: 0, y: 0, tx: 0, ty: 0 };
    let W = W0, H = H0;
    let gathered = false;
    let running = false;
    const mod = (n, m) => ((n % m) + m) % m;

    const frame = () => {
      if (!running) return;
      cur.x += (target.x - cur.x) * 0.085;
      cur.y += (target.y - cur.y) * 0.085;
      mouse.cx += (mouse.x - mouse.cx) * 0.06;
      mouse.cy += (mouse.y - mouse.cy) * 0.06;
      for (const it of items) {
        if (gathered) break; // freeze positions while the pile is up
        it.x = mod(it.bx + cur.x * it.d - (mouse.cx - 0.5) * 60 * it.d + M, TW) - M;
        it.y = mod(it.by + cur.y * it.d - (mouse.cy - 0.5) * 40 * it.d + M, TH) - M;
        it.el.style.transform = `translate3d(${it.x}px, ${it.y}px, 0)`;
      }
      fpos.x += (fpos.tx - fpos.x) * 0.2;
      fpos.y += (fpos.ty - fpos.y) * 0.2;
      follower.style.transform = `translate(${fpos.x + 14}px, ${fpos.y + 14}px)`;
      requestAnimationFrame(frame);
    };

    // Only animate while the card is on screen.
    new IntersectionObserver(([entry]) => {
      const was = running;
      running = entry.isIntersecting;
      if (running && !was) requestAnimationFrame(frame);
    }).observe(root);
    new ResizeObserver(() => { W = root.clientWidth; H = root.clientHeight; }).observe(root);

    // Drag with a little throw on release.
    let last = null;
    let vel = { x: 0, y: 0 };
    root.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || gathered) return;
      root.focus({ preventScroll: true });
      root.setPointerCapture(e.pointerId);
      root.classList.add('grabbing');
      last = { x: e.clientX, y: e.clientY };
      vel = { x: 0, y: 0 };
    });
    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      const z = r.width / root.offsetWidth || 1; // the card may be scaled down
      fpos.tx = (e.clientX - r.left) / z;
      fpos.ty = (e.clientY - r.top) / z;
      mouse.x = fpos.tx / W;
      mouse.y = fpos.ty / H;
      if (!last || gathered) return;
      vel = { x: e.clientX - last.x, y: e.clientY - last.y };
      target.x += vel.x;
      target.y += vel.y;
      last = { x: e.clientX, y: e.clientY };
    });
    const release = () => {
      if (!last) return;
      target.x += vel.x * 8;
      target.y += vel.y * 8;
      last = null;
      root.classList.remove('grabbing');
    };
    root.addEventListener('pointerup', release);
    root.addEventListener('pointercancel', release);
    root.addEventListener('pointerenter', () => root.classList.add('hovering'));
    root.addEventListener('pointerleave', () => root.classList.remove('hovering'));

    // Wheel pans only once the canvas has focus, so page scrolling isn't hijacked.
    root.addEventListener('wheel', (e) => {
      if (document.activeElement !== root || gathered) return;
      e.preventDefault();
      target.x -= e.deltaX;
      target.y -= e.deltaY;
    }, { passive: false });

    // Gather: visible items fly to the centre in a staggered pile; scatter in random order.
    let pile = [];
    const gather = () => {
      if (gathered) return;
      gathered = true;
      target.x = cur.x;
      target.y = cur.y;
      root.classList.add('gathered');
      pile = items.filter((it) => it.x + it.w > 0 && it.x < W && it.y + it.h > 0 && it.y < H);
      pile.forEach((it, k) => {
        const rot = (Math.random() - 0.5) * 14;
        it.inner.style.transitionDelay = `${k * 22}ms`;
        it.inner.style.transform = `translate(${W / 2 - it.x - it.w / 2}px, ${H / 2 - it.y - it.h / 2}px) rotate(${rot}deg)`;
      });
    };
    const scatter = () => {
      if (!gathered) return;
      [...pile].sort(() => Math.random() - 0.5).forEach((it, k) => {
        it.inner.style.transitionDelay = `${k * 22}ms`;
        it.inner.style.transform = '';
      });
      root.classList.remove('gathered');
      gathered = false;
    };
    const collections = root.querySelector('.collections');
    let pointerType = 'mouse';
    collections.addEventListener('pointerdown', (e) => (pointerType = e.pointerType));
    collections.addEventListener('mouseenter', gather);
    collections.addEventListener('mouseleave', scatter);
    collections.addEventListener('focus', gather);
    collections.addEventListener('blur', scatter);
    collections.addEventListener('click', () => {
      if (pointerType !== 'mouse') (gathered ? scatter : gather)();
    });

    root.querySelector('.replay').addEventListener('click', () => {
      root.classList.remove('intro');
      void root.offsetWidth; // restart the CSS animations
      root.classList.add('intro');
    });
  },
});
