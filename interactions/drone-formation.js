MicroIX.register({
  id: 'drone-formation',
  title: 'Scroll-driven formation',
  description: 'Scroll inside the frame and three drones glide over the terrain, from a hero shot to a linked swarm to a mission formation. Scroll position drives the tags, link lines and copy, and "Start mission" sends the drones out on a scan.',
  tags: ['scroll', 'storytelling', 'hero'],
  source: { label: 'USAvionix ↗', url: 'https://www.usavionix.com/' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-av { position: absolute; inset: 0; overflow-y: auto; scrollbar-width: none; background: #1d2419; color: #fff; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
.ix-av::-webkit-scrollbar { display: none; }
.ix-av .track { position: relative; height: 300%; }
.ix-av .scene { position: sticky; top: 0; overflow: hidden; }
.ix-av .terrain { position: absolute; left: -20%; top: -20%; width: 140%; height: 140%; transform-origin: 50% 50%; }
.ix-av .shade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(0,0,0,.45), transparent 35%, transparent 65%, rgba(0,0,0,.4)), radial-gradient(80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,.45)); }

.ix-av .links { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.ix-av .links line { stroke: rgba(255,255,255,.75); stroke-width: 1; stroke-dasharray: 2 4; }
.ix-av .drone { position: absolute; left: 0; top: 0; width: 200px; height: 140px; margin: -70px 0 0 -100px; pointer-events: none; }
.ix-av .drone svg { display: block; width: 100%; height: 100%; filter: drop-shadow(var(--sx, 12px) var(--sy, 18px) 5px rgba(0,0,0,.5)); }
.ix-av .tag { position: absolute; left: 0; top: 0; padding: 1px 4px; background: #fff; color: #111; font: 700 9px ui-monospace, Menlo, monospace; letter-spacing: .04em; pointer-events: none; }
.ix-av .ring { position: absolute; width: 260px; height: 260px; margin: -130px; border: 1px solid rgba(255,255,255,.7); border-radius: 50%; pointer-events: none; animation: ix-av-ring 1.4s var(--ease-out) forwards; }
@keyframes ix-av-ring { from { transform: scale(.1); opacity: 1; } to { transform: scale(1.6); opacity: 0; } }

.ix-av .top { position: absolute; z-index: 3; left: 20px; right: 16px; top: 14px; display: flex; justify-content: space-between; align-items: center; }
.ix-av .brand { font-size: 14px; font-weight: 700; letter-spacing: -.02em; }
.ix-av .label { position: absolute; left: 50%; translate: -50% 0; font: 600 9px ui-monospace, Menlo, monospace; letter-spacing: .22em; opacity: .85; }
.ix-av .menu { display: flex; align-items: center; gap: 12px; }
.ix-av .menu span { padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.18); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); font-size: 11px; }
.ix-av .menu i { width: 14px; height: 9px; border-block: 1.5px solid #fff; position: relative; }
.ix-av .menu i::after { content: ""; position: absolute; left: 0; right: 0; top: 2.25px; border-top: 1.5px solid #fff; }

.ix-av .copy { position: absolute; z-index: 2; inset: 0; pointer-events: none; }
.ix-av .copy h4 { position: absolute; left: 20px; top: 46px; margin: 0; max-width: 10.5em; font-size: clamp(28px, 3.8vw, 48px); font-weight: 500; line-height: 1.02; letter-spacing: -.035em; }
.ix-av .copy .side { position: absolute; right: 20px; bottom: 22px; width: min(380px, 44%); }
.ix-av .copy.mission .side { top: 46px; bottom: auto; }
.ix-av .copy p { margin: 0 0 12px; font-size: 15px; line-height: 1.25; }
.ix-av .rows { font-size: 11px; }
.ix-av .rows div { display: grid; grid-template-columns: 90px 1fr; padding: 5px 0; border-top: 1px solid rgba(255,255,255,.25); }
.ix-av .rows span { opacity: .75; }
.ix-av .pill { display: inline-flex; align-items: center; gap: 30px; padding: 6px 6px 6px 12px; border: 0; border-radius: 999px; background: rgba(255,255,255,.2); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: #fff; font: 500 11px "Helvetica Neue", Helvetica, Arial, sans-serif; cursor: pointer; pointer-events: auto; transition: background .2s; }
.ix-av .pill:hover { background: rgba(255,255,255,.32); }
.ix-av .pill b { display: grid; place-items: center; width: 18px; height: 18px; font-weight: 400; }

@media (max-width: 640px) {
  .ix-av .copy .side { left: 20px; width: auto; }
  .ix-av .drone { scale: .7; }
}
`,
  mount(stage) {
    const drone = (code) => `
      <svg viewBox="0 0 200 140" aria-hidden="true">
        <path d="M100 8L113 42 196 104 176 117 118 102 108 122H92L82 102 24 117 4 104 87 42Z" fill="#2a2d30" stroke="#55595e" stroke-width="1"/>
        <path d="M60 80L88 58M140 80L112 58M30 106L84 90M170 106L116 90" stroke="#4b5055" stroke-width="1.4"/>
        <path d="M94 30Q100 4 106 30L108 106Q100 116 92 106Z" fill="#1b1d1f"/>
        <rect x="96" y="42" width="8" height="18" rx="3" fill="#9a9ea2"/>
        <text x="40" y="104" transform="rotate(-27 40 104)" font-size="11" font-weight="700" font-family="ui-monospace, Menlo, monospace" fill="#e3e6e9">${code}</text>
        <rect x="148" y="88" width="15" height="8" fill="none" stroke="#e3e6e9" transform="rotate(27 155 92)"/>
      </svg>`;

    // Drone poses for each section: position as a fraction of the scene, scale, rotation.
    const POSES = [
      [{ x: 0.52, y: 0.58, s: 1.7, r: -24 }, { x: 1.25, y: -0.25, s: 0.8, r: -24 }, { x: 1.45, y: 0.1, s: 0.8, r: -24 }],
      [{ x: 0.45, y: 0.47, s: 0.95, r: 0 }, { x: 0.2, y: 0.78, s: 0.85, r: 6 }, { x: 0.8, y: 0.25, s: 0.8, r: -6 }],
      [{ x: 0.5, y: 0.74, s: 0.85, r: 0 }, { x: 0.28, y: 0.4, s: 0.85, r: 0 }, { x: 0.72, y: 0.4, s: 0.85, r: 0 }],
    ];
    const TERRAIN = [{ s: 1.25, r: -6 }, { s: 1.06, r: 0 }, { s: 1, r: 4 }];
    const CODES = ['011', '012', '013'];
    const LABELS = ['', 'SWARM', 'MISSION'];

    stage.innerHTML = `
      <div class="ix-av">
        <div class="track">
          <div class="scene">
            <canvas class="terrain"></canvas>
            <div class="shade"></div>
            <svg class="links"><line/><line/></svg>
            ${CODES.map((c) => `<div class="drone">${drone(c)}</div>`).join('')}
            ${CODES.map((c) => `<span class="tag">DSA${c}</span>`).join('')}
            <div class="top"><span class="brand">AIRFRAME</span><span class="label"></span><span class="menu"><span>Contact</span><i></i></span></div>
            <div class="copy" data-i="0">
              <h4>Autonomy for the open sky</h4>
              <div class="side"><p>A first agent in the air, with the speed, range and onboard intelligence to search wide areas on its own.</p>
                <button class="pill explore">Scroll to explore <b>↓</b></button></div>
            </div>
            <div class="copy" data-i="1">
              <h4>Understanding the swarm</h4>
              <div class="side"><p>Units coordinate without a pilot in the loop and scale across fleets to cover vast areas.</p>
                <div class="rows"><div>Autonomy<span>End-to-end, no pilot required</span></div><div>Scale<span>From one unit to whole fleets</span></div><div>Teamwork<span>Units share tasks in real time</span></div><div>Coverage<span>Watch huge areas at once</span></div></div></div>
            </div>
            <div class="copy mission" data-i="2">
              <h4>Mission preset</h4>
              <div class="side"><p>Watch a wide area continuously and flag hazards and anomalies early.</p>
                <button class="pill start">Start mission <b>↓</b></button></div>
            </div>
          </div>
        </div>
      </div>`;

    const root = stage.querySelector('.ix-av');
    const scene = root.querySelector('.scene');
    const canvas = root.querySelector('.terrain');
    const drones = [...root.querySelectorAll('.drone')];
    const tags = [...root.querySelectorAll('.tag')];
    const lines = [...root.querySelectorAll('.links line')];
    const copies = [...root.querySelectorAll('.copy')];
    const label = root.querySelector('.label');

    // Terrain: SVG noise lit like a relief map, rasterised once to a canvas so
    // transforming it every frame stays cheap.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="980">
      <filter id="t" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.0028" numOctaves="8" seed="4" result="n"/>
        <feComponentTransfer in="n" result="h"><feFuncA type="gamma" exponent="1.6" amplitude="1.4"/></feComponentTransfer>
        <feDiffuseLighting in="h" surfaceScale="26" lighting-color="#ffffff" result="l"><feDistantLight azimuth="230" elevation="28"/></feDiffuseLighting>
        <feColorMatrix in="n" type="matrix" values=".32 0 0 0 .1  0 .55 0 0 .1  0 0 .25 0 .07  0 0 0 0 1" result="c"/>
        <feBlend in="l" in2="c" mode="multiply"/>
      </filter>
      <rect width="1400" height="980" filter="url(#t)"/></svg>`;
    canvas.width = 1400;
    canvas.height = 980;
    const img = new Image();
    img.onload = () => canvas.getContext('2d').drawImage(img, 0, 0);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    let W = 0, H = 0;
    const size = () => {
      W = root.clientWidth;
      H = root.clientHeight;
      scene.style.height = `${H}px`;
    };
    size();
    new ResizeObserver(size).observe(root);

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const smooth = (t) => t * t * (3 - 2 * t);
    const lerp = (a, b, t) => a + (b - a) * t;

    let shown = 0; // eased scroll progress, 0..2
    let launchAt = -1;
    let running = false;

    const frame = (now) => {
      if (!running) return;
      const p = H ? root.scrollTop / H : 0;
      shown += (p - shown) * 0.1;
      const i0 = Math.min(1, Math.floor(shown));
      const t = smooth(clamp01(shown - i0));
      const secs = now / 1000;

      // Launch: fly out forward, then slide back in from below.
      let launchY = 0;
      if (launchAt >= 0) {
        const lt = secs - launchAt;
        if (lt < 1) launchY = -H * 1.1 * lt * lt;
        else if (lt < 1.3) launchY = -H * 2;
        else if (lt < 2.6) launchY = H * 1.1 * (1 - smooth((lt - 1.3) / 1.3));
        else launchAt = -1;
      }

      const ter = { s: lerp(TERRAIN[i0].s, TERRAIN[i0 + 1].s, t), r: lerp(TERRAIN[i0].r, TERRAIN[i0 + 1].r, t) };
      canvas.style.transform = `translateY(${-shown * 2}%) scale(${ter.s}) rotate(${ter.r}deg)`;

      const pts = drones.map((el, k) => {
        const a = POSES[i0][k], b = POSES[i0 + 1][k];
        const x = lerp(a.x, b.x, t) * W;
        const y = lerp(a.y, b.y, t) * H + Math.sin(secs * 1.3 + k * 2) * 3 + launchY;
        const s = lerp(a.s, b.s, t);
        const r = lerp(a.r, b.r, t) + Math.sin(secs * 0.9 + k) * 1.5;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
        el.style.setProperty('--sx', `${8 * s}px`);
        el.style.setProperty('--sy', `${14 * s}px`);
        return { x, y, s };
      });

      // Tags and link lines belong to the swarm section.
      const swarm = clamp01(1 - Math.abs(shown - 1) * 2.5);
      tags.forEach((tg, k) => {
        tg.style.transform = `translate(${pts[k].x - 22}px, ${pts[k].y + 4}px)`;
        tg.style.opacity = swarm;
      });
      [[0, 1], [0, 2]].forEach(([a, b], k) => {
        lines[k].setAttribute('x1', pts[a].x); lines[k].setAttribute('y1', pts[a].y);
        lines[k].setAttribute('x2', pts[b].x); lines[k].setAttribute('y2', pts[b].y);
        lines[k].style.opacity = swarm;
      });

      copies.forEach((c) => {
        const d = shown - +c.dataset.i;
        c.style.opacity = clamp01(1 - Math.abs(d) * 2.5);
        c.style.transform = `translateY(${-d * 40}px)`;
        c.style.visibility = Math.abs(d) < 0.6 ? 'visible' : 'hidden';
      });
      label.textContent = LABELS[Math.round(shown)];

      requestAnimationFrame(frame);
    };
    new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(frame);
    }).observe(root);

    root.querySelector('.explore').addEventListener('click', () => root.scrollTo({ top: H, behavior: 'smooth' }));
    root.querySelector('.start').addEventListener('click', () => {
      if (launchAt >= 0) return;
      launchAt = performance.now() / 1000;
      drones.forEach((el) => {
        const r = el.getBoundingClientRect();
        const s = scene.getBoundingClientRect();
        const ring = document.createElement('span');
        ring.className = 'ring';
        ring.style.left = `${r.left + r.width / 2 - s.left}px`;
        ring.style.top = `${r.top + r.height / 2 - s.top}px`;
        ring.addEventListener('animationend', () => ring.remove());
        scene.append(ring);
      });
    });
  },
});
