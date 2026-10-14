MicroIX.register({
  id: 'project-wheel',
  title: '3D project wheel',
  description: 'Projects sit on a vertical drum. Scroll, drag or use ↑/↓ to roll the next one face-on. Neighbors tilt away and fade to grey, and each site mock-up slides in as its card lands.',
  tags: ['carousel', '3d', 'scroll'],
  source: { label: 'Gabriel Beaugonin ↗', url: 'https://www.gabrielbeaugonin.com/' },
  layout: { wide: true, stageHeight: 560 },
  css: `
.ix-wheel { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr; align-items: center; overflow: hidden; background: #f4f4f4; color: #111; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; outline: none; touch-action: none; user-select: none; -webkit-user-select: none; }
.ix-wheel .intro { padding-left: clamp(20px, 12%, 150px); }
.ix-wheel h3 { margin: 0; font-size: clamp(20px, 2.6vw, 30px); font-weight: 500; line-height: 1.1; letter-spacing: -.01em; }
.ix-wheel h3 span { display: block; color: #9a9a9a; }
.ix-wheel .acts { display: flex; gap: 6px; margin-top: 36px; }
.ix-wheel .acts button { display: grid; place-items: center; width: 46px; height: 46px; padding: 0; border: 0; border-radius: 12px; background: #fff; color: #111; cursor: pointer; transition: transform .25s var(--ease-out), box-shadow .25s; }
.ix-wheel .acts button:hover { transform: translateY(-2px); box-shadow: 0 8px 18px -10px rgba(0,0,0,.35); }
.ix-wheel .acts svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

.ix-wheel .drum { position: relative; height: 100%; perspective: 1100px; cursor: grab; }
.ix-wheel.dragging .drum { cursor: grabbing; }
.ix-wheel .card { --s: min(300px, 54vh); position: absolute; left: 50%; top: 50%; width: var(--s); height: var(--s); margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2); overflow: hidden; border-radius: 20px; background: #ddd; backface-visibility: hidden; }
.ix-wheel .card::after { content: ""; position: absolute; z-index: 3; inset: 0; background: linear-gradient(180deg, #ededed, #dadada); opacity: var(--fog, 0); pointer-events: none; }
.ix-wheel .card > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ix-wheel .name { position: absolute; z-index: 2; left: 16px; bottom: 14px; color: #fff; font-size: 13px; text-shadow: 0 1px 10px rgba(0,0,0,.35); }

/* The site mock-up inside each card */
.ix-wheel .mock { position: absolute; z-index: 1; left: 10%; right: 10%; top: 28%; height: 44%; overflow: hidden; border-radius: 2px; background: #fff; box-shadow: 0 12px 30px -12px rgba(0,0,0,.45); opacity: 0; transform: translateY(18px) scale(.94); transition: transform .7s var(--ease-out), opacity .4s; }
.ix-wheel .card.active .mock { opacity: 1; transform: none; transition-delay: .12s; }
.ix-wheel .mock .bar { display: flex; gap: 4px; padding: 5px 7px; }
.ix-wheel .mock .bar i { width: 14px; height: 3px; border-radius: 2px; background: #ddd; }
.ix-wheel .mock .bar i:first-child { width: 8px; background: #111; }
.ix-wheel .mock .head { position: absolute; left: -2%; right: 0; top: 14%; color: #111; font-size: calc(var(--s) * .12); font-weight: 500; letter-spacing: -.045em; white-space: nowrap; transform: translateX(14%); transition: transform 1s var(--ease-out); }
.ix-wheel .card.active .mock .head { transform: none; transition-delay: .2s; }
.ix-wheel .mock .pic { position: absolute; left: 30%; top: 12%; width: 40%; height: 72%; object-fit: cover; clip-path: inset(100% 0 0 0); transition: clip-path .8s cubic-bezier(.7,0,.2,1); }
.ix-wheel .card.active .mock .pic { clip-path: inset(0 0 0 0); transition-delay: .35s; }
.ix-wheel .mock .meta { position: absolute; right: 6px; bottom: 6px; display: grid; gap: 2px; }
.ix-wheel .mock .meta i { width: 26px; height: 2px; background: #ccc; }

.ix-wheel .dots { position: absolute; right: 22px; top: 50%; display: grid; gap: 8px; translate: 0 -50%; }
.ix-wheel .dots button { width: 4px; height: 4px; padding: 0; border: 0; border-radius: 50%; background: #bbb; cursor: pointer; transition: background .3s, scale .3s; }
.ix-wheel .dots button.on { background: #111; scale: 1.5; }

@media (max-width: 640px) {
  .ix-wheel { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .ix-wheel .intro { padding: 24px 20px 0; }
  .ix-wheel .acts { margin-top: 16px; }
  .ix-wheel .card { --s: min(240px, 62vw); }
}
`,
  mount(stage) {
    const PROJECTS = [
      { name: 'Northwind', head: 'This is the N.1' },
      { name: 'Atelier Nº5', head: 'ATELIER Nº5' },
      { name: 'Halcyon', head: 'Calm by design' },
      { name: 'Fieldnote', head: 'Notes, in the field' },
      { name: 'Monolith', head: 'MONOLITH' },
      { name: 'Tidewater', head: 'Go with the tide' },
    ];
    const STEP = 76; // how far a neighbour folds away, in degrees

    stage.innerHTML = `
      <div class="ix-wheel" tabindex="0" aria-label="Project wheel. Scroll, drag or use the arrow keys.">
        <div class="intro">
          <h3>Selected work<span>UX case studies</span></h3>
          <div class="acts">
            <button aria-label="About"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></button>
            <button aria-label="Contact"><svg viewBox="0 0 24 24"><path d="M21 12a8.5 8.5 0 0 1-12.5 7.5L3 21l1.5-5A8.5 8.5 0 1 1 21 12z"/></svg></button>
          </div>
        </div>
        <div class="drum">${PROJECTS.map((p, i) => `
          <div class="card" data-i="${i}">
            <img alt="" src="https://picsum.photos/seed/wheel-${i}/640/640">
            <div class="mock">
              <div class="bar"><i></i><i></i><i></i></div>
              <div class="head">${p.head}</div>
              <img class="pic" alt="" src="https://picsum.photos/seed/wheel-in-${i}/300/400">
              <div class="meta"><i></i><i></i><i></i></div>
            </div>
            <span class="name">${p.name}</span>
          </div>`).join('')}
        </div>
        <div class="dots">${PROJECTS.map((p, i) => `<button aria-label="${p.name}" data-i="${i}"></button>`).join('')}</div>
      </div>`;

    const root = stage.querySelector('.ix-wheel');
    const cards = [...root.querySelectorAll('.card')];
    const dots = [...root.querySelectorAll('.dots button')];
    const last = PROJECTS.length - 1;
    const clamp = (v) => Math.max(0, Math.min(last, v));

    let cur = 0;
    let target = 0;
    let active = -1;
    let running = false;

    const render = () => {
      const s = cards[0].offsetWidth;
      const GAP = s * 0.72; // distance from centre to the first neighbour
      cards.forEach((card, i) => {
        const d = i - cur;
        const a = Math.abs(d);
        const sign = Math.sign(d);
        const visible = a < 3.6;
        card.style.visibility = visible ? 'visible' : 'hidden';
        if (!visible) return;
        // Neighbours fold almost edge-on and stack up as thin plates above and below;
        // cards further away pack tightly behind the first one.
        const y = sign * (a <= 1 ? a * GAP : GAP + (a - 1) * s * 0.08);
        const rot = -sign * Math.min(a, 1) * STEP;
        const z = -Math.min(a, 1) * s * 0.35 - Math.max(0, a - 1) * 30;
        card.style.transform = `translate3d(0, ${y}px, ${z}px) rotateX(${rot}deg)`;
        card.style.setProperty('--fog', Math.min(1, Math.abs(d) * 1.1).toFixed(3));
        card.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
      });
      const a = Math.round(cur);
      if (a !== active) {
        active = a;
        cards.forEach((c, i) => c.classList.toggle('active', i === a));
        dots.forEach((b, i) => b.classList.toggle('on', i === a));
      }
    };

    const frame = () => {
      if (!running) return;
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      render();
      requestAnimationFrame(frame);
    };
    new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(frame);
    }).observe(root);

    // Wheel rolls the drum, then snaps. At either end the page scrolls normally.
    let snap;
    root.addEventListener('wheel', (e) => {
      if ((e.deltaY < 0 && target <= 0) || (e.deltaY > 0 && target >= last)) return;
      e.preventDefault();
      target = clamp(target + e.deltaY / 380);
      clearTimeout(snap);
      snap = setTimeout(() => (target = Math.round(target)), 140);
    }, { passive: false });

    // Vertical drag
    let startY = null;
    let startTarget = 0;
    root.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      root.focus({ preventScroll: true });
      root.setPointerCapture(e.pointerId);
      root.classList.add('dragging');
      startY = e.clientY;
      startTarget = target;
    });
    root.addEventListener('pointermove', (e) => {
      if (startY === null) return;
      target = clamp(startTarget - (e.clientY - startY) / 220);
    });
    const end = () => {
      if (startY === null) return;
      startY = null;
      root.classList.remove('dragging');
      target = Math.round(target);
    };
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') target = clamp(Math.round(target) + 1);
      else if (e.key === 'ArrowUp') target = clamp(Math.round(target) - 1);
      else return;
      e.preventDefault();
    });
    dots.forEach((b) => b.addEventListener('click', () => (target = +b.dataset.i)));
    cards.forEach((c) => c.addEventListener('click', () => (target = +c.dataset.i)));

    render();
  },
});
