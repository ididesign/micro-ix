MicroIX.register({
  id: 'shape-cloud',
  title: 'Shape-shifting image cloud',
  description: 'Search results float as a cloud inside a soft outline. The left knob sets how many images to show (30/60/90), the right knob morphs the outline from circle to spiral to grid, and every thumbnail springs to its new spot. Click an image to search for more like it.',
  tags: ['layout', 'morph', 'gallery'],
  source: { label: 'Spiral by Soot ↗', url: 'https://spiral.soot.com/' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-cloud { position: absolute; inset: 0; overflow: hidden; background: #e3e3e3; color: #111; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; user-select: none; -webkit-user-select: none; }
.ix-cloud .paths { position: absolute; inset: -10%; width: 120%; height: 120%; pointer-events: none; }
.ix-cloud .paths path { fill: none; stroke: url(#ix-cloud-dots); stroke-width: 42; stroke-linecap: round; }
.ix-cloud .brand { position: absolute; left: 18px; top: 14px; font-size: 13px; font-weight: 300; letter-spacing: .5em; color: #9c9c9c; }
.ix-cloud .login { position: absolute; right: 14px; top: 12px; padding: 6px 12px; border: 0; border-radius: 8px; background: #fff; color: #111; font-family: inherit; font-size: 11px; font-weight: 500; cursor: pointer; }

.ix-cloud .center { position: absolute; left: 50%; top: 46%; width: 0; height: 0; }
.ix-cloud .outline { position: absolute; left: 0; top: 0; border: 1.4px solid #fff; transition: width .9s var(--ease-spring), height .9s var(--ease-spring), margin .9s var(--ease-spring), border-radius .9s var(--ease-out), rotate .9s var(--ease-spring); box-shadow: 0 0 0 1px rgba(0,0,0,.03); }
.ix-cloud .knob { position: absolute; z-index: 5; display: grid; place-items: center; width: 26px; height: 26px; margin: -13px; padding: 0; border: 0; border-radius: 50%; background: #fff; color: #111; font: 600 10px ui-monospace, Menlo, monospace; cursor: pointer; box-shadow: 0 2px 8px -3px rgba(0,0,0,.3); transition: left .9s var(--ease-spring), top .9s var(--ease-spring), transform .2s var(--ease-out); }
.ix-cloud .knob:hover { transform: scale(1.15); }
.ix-cloud .knob:active { transform: scale(.92); }
.ix-cloud .knob svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; transition: rotate .6s var(--ease-spring); }
.ix-cloud .knob span { position: absolute; top: 50%; translate: 0 -50%; white-space: nowrap; color: #777; font: 400 9px "Helvetica Neue", Helvetica, Arial, sans-serif; pointer-events: none; }
.ix-cloud .knob.count span { right: 34px; }
.ix-cloud .knob.shape span { left: 34px; }
.ix-cloud .knob .num { display: inline-block; animation: ix-cloud-num .4s var(--ease-out); }
@keyframes ix-cloud-num { from { opacity: 0; transform: translateY(6px); } }

.ix-cloud .pick { position: absolute; z-index: 5; left: 0; display: flex; align-items: center; gap: 3px; padding: 5px; border-radius: 8px; background: rgba(255,255,255,.85); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); translate: -50% -50%; transition: top .9s var(--ease-spring); }
.ix-cloud .pick svg { width: 12px; height: 12px; margin: 0 3px; fill: none; stroke: #111; stroke-width: 1.6; stroke-linecap: round; }
.ix-cloud .pick img { width: 16px; height: 20px; object-fit: cover; border-radius: 2px; animation: ix-cloud-pop .5s var(--ease-spring); }
@keyframes ix-cloud-pop { from { transform: scale(0); } }

.ix-cloud .thumb { position: absolute; left: 0; top: 0; padding: 0; border: 0; background: #ccc; cursor: pointer; opacity: 0; transform-origin: center; transition: transform .9s var(--ease-spring), opacity .4s, box-shadow .2s; }
.ix-cloud .thumb img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.ix-cloud .thumb.on { opacity: 1; }
.ix-cloud .thumb.on:hover { z-index: 4; box-shadow: 0 8px 18px -6px rgba(0,0,0,.45); }

.ix-cloud .cta { position: absolute; z-index: 5; left: 50%; bottom: 22px; translate: -50% 0; padding: 14px 22px; border: 0; background: #e9f50a; color: #111; font: 700 11px "Helvetica Neue", Helvetica, Arial, sans-serif; letter-spacing: .02em; cursor: pointer; border-radius: 46% 54% 50% 50% / 58% 48% 52% 42%; animation: ix-cloud-blob 5s ease-in-out infinite; transition: transform .3s var(--ease-spring); }
.ix-cloud .cta:hover { transform: scale(1.06) rotate(-2deg); }
@keyframes ix-cloud-blob {
  0%, 100% { border-radius: 46% 54% 50% 50% / 58% 48% 52% 42%; }
  33% { border-radius: 55% 45% 42% 58% / 45% 58% 42% 55%; }
  66% { border-radius: 42% 58% 56% 44% / 52% 42% 58% 48%; }
}

.ix-cloud .stack { position: absolute; z-index: 5; right: 26px; top: 50%; width: 150px; height: 130px; translate: 0 -50%; }
.ix-cloud .note { position: absolute; inset: 0; padding: 14px; border-radius: 12px; background: #fff; box-shadow: 0 10px 24px -14px rgba(0,0,0,.4); transition: transform .5s var(--ease-spring), opacity .35s; }
.ix-cloud .note h5 { margin: 0 0 14px; font-size: 17px; font-weight: 400; line-height: 1.05; letter-spacing: -.02em; }
.ix-cloud .note p { margin: 0 0 6px; font-size: 9px; }
.ix-cloud .note .go { padding: 4px 9px; border: 0; border-radius: 6px; background: #111; color: #fff; font-family: inherit; font-size: 9px; font-weight: 500; cursor: pointer; }
.ix-cloud .note .x { position: absolute; right: 8px; top: 8px; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: #eee; font: 10px/16px sans-serif; cursor: pointer; }
.ix-cloud .note.gone { opacity: 0; transform: translate(40px, -10px) rotate(8deg) !important; pointer-events: none; }

@media (max-width: 640px) {
  .ix-cloud .stack { display: none; }
  .ix-cloud .knob span { display: none; }
}
`,
  mount(stage) {
    const COUNTS = [30, 60, 90];
    const SHAPES = ['circle', 'spiral', 'grid'];
    const MAX = 90;
    const NOTES = [
      { h: 'Introducing Inspo', p: 'Aesthetic-driven image search engine', b: 'Try Inspo' },
      { h: 'Explore Page', p: 'A new kind of feed', b: 'Vibe out' },
      { h: 'Moodboards', p: 'Pin anything, anywhere', b: 'Start one' },
    ];

    // Tiny seeded random so every generation of results is stable
    const rand = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    stage.innerHTML = `
      <div class="ix-cloud">
        <svg class="paths" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs><pattern id="ix-cloud-dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.5" fill="#c4c4c4"/></pattern></defs>
          <path d="M-40 120C160 80 240 200 380 160S560 20 700 60"/>
          <path d="M240 -20C300 120 260 260 120 330S-20 520 60 700"/>
          <path d="M760 -30C720 120 860 180 980 150S1180 220 1240 120"/>
          <path d="M820 720C800 600 900 520 1040 540S1200 420 1250 460"/>
          <path d="M-30 560C120 520 200 600 320 640S480 760 540 720"/>
          <path d="M1000 320C1060 380 1140 360 1220 400"/>
        </svg>
        <span class="brand">ORBIT</span>
        <button class="login">Log in</button>
        <div class="center">
          <div class="outline"></div>
          <div class="pick"><svg viewBox="0 0 24 24"><path d="M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"/></svg></div>
          <button class="knob count" aria-label="Image count"><b class="num"></b><span>Image Count</span></button>
          <button class="knob shape" aria-label="Shape"><svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg><span>Shape</span></button>
        </div>
        <div class="stack">${NOTES.map((n) => `
          <div class="note"><button class="x" aria-label="Dismiss">×</button><h5>${n.h}</h5><p>${n.p}</p><button class="go">${n.b}</button></div>`).join('')}
        </div>
        <button class="cta">CONNECT YOUR DRIVES</button>
      </div>`;

    const root = stage.querySelector('.ix-cloud');
    const center = root.querySelector('.center');
    const outline = root.querySelector('.outline');
    const pick = root.querySelector('.pick');
    const countKnob = root.querySelector('.knob.count');
    const shapeKnob = root.querySelector('.knob.shape');
    const shapeIcon = shapeKnob.querySelector('svg');

    let count = 30;
    let shape = 'circle';
    let gen = 0;
    let picked = [];
    let auto = true;

    // Thumbnails: a fixed pool of 90, each with its own aspect ratio
    const r0 = rand(7);
    const thumbs = Array.from({ length: MAX }, (_, i) => {
      const b = document.createElement('button');
      b.className = 'thumb';
      b.setAttribute('aria-label', `Result ${i + 1}`);
      b.dataset.i = i;
      b.dataset.ar = [0.75, 0.8, 1, 1.33, 0.7][Math.floor(r0() * 5)];
      b.innerHTML = '<img alt="">';
      center.append(b);
      return b;
    });

    const loadImages = () => {
      const g = gen;
      thumbs.forEach((t, i) => {
        const ar = +t.dataset.ar;
        const w = 80, h = Math.round(80 / ar);
        // Mostly moody greyscale with a few colour hits, like a visual search result
        const grey = (i * 7 + g) % 5 !== 0 ? '?grayscale' : '';
        t.firstChild.src = `https://picsum.photos/seed/soot-${g}-${i}/${w}/${h}${grey}`;
      });
    };

    let W = 0, H = 0;
    const R = () => Math.max(110, Math.min(W * 0.3, H * 0.36));

    // Where each thumbnail sits for the current shape and count, relative to the centre
    const positions = () => {
      const r = R();
      const n = count;
      const out = [];
      if (shape === 'circle') {
        for (let i = 0; i < n; i++) {
          const rad = r * 0.8 * Math.sqrt((i + 0.5) / n);
          const a = i * 2.39996;
          out.push([Math.cos(a) * rad, Math.sin(a) * rad]);
        }
      } else if (shape === 'spiral') {
        const tilt = (-14 * Math.PI) / 180;
        for (let i = 0; i < n; i++) {
          const t = i / (n - 1);
          const a = t * Math.PI * 4.6;
          const rad = 0.12 + 0.82 * t;
          const x = Math.cos(a) * rad * r * 1.42;
          const y = Math.sin(a) * rad * r * 0.72;
          out.push([x * Math.cos(tilt) - y * Math.sin(tilt), x * Math.sin(tilt) + y * Math.cos(tilt)]);
        }
      } else {
        const cols = { 30: 6, 60: 8, 90: 10 }[n];
        const rows = Math.ceil(n / cols);
        const cw = (r * 2.25) / cols;
        const ch = (r * 1.85) / rows;
        for (let i = 0; i < n; i++) {
          const rr = Math.floor(i / cols);
          // Centre a short last row instead of leaving it ragged
          const inRow = Math.min(cols, n - rr * cols);
          const c = (i % cols) + (cols - inRow) / 2;
          out.push([(c - (cols - 1) / 2) * cw, (rr - (rows - 1) / 2) * ch]);
        }
      }
      return out;
    };

    const render = (origin) => {
      const r = R();
      const pos = positions();
      const size = (count === 30 ? 0.2 : count === 60 ? 0.15 : 0.125) * r;

      // Outline and knobs. The knobs ride the outline's edge.
      let ow, oh, rad, rot, kc, ks;
      if (shape === 'circle') { ow = oh = r * 2.1; rad = '50%'; rot = 0; kc = [-ow / 2, 0]; ks = [ow / 2 * Math.cos(0.6), oh / 2 * Math.sin(0.6)]; }
      else if (shape === 'spiral') { ow = r * 3.1; oh = r * 1.7; rad = '50%'; rot = -14; }
      else { ow = r * 2.65; oh = r * 2.3; rad = '28px'; rot = 0; kc = [-ow / 2, -oh * 0.08]; ks = [ow / 2, oh * 0.22]; }
      if (shape === 'spiral') {
        const t = (rot * Math.PI) / 180;
        const turn = ([x, y]) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)];
        kc = turn([-ow / 2, 0]);
        ks = turn([ow / 2 * Math.cos(0.6), oh / 2 * Math.sin(0.6)]);
      }
      Object.assign(outline.style, { width: `${ow}px`, height: `${oh}px`, margin: `${-oh / 2}px 0 0 ${-ow / 2}px`, borderRadius: rad, rotate: `${rot}deg` });
      Object.assign(countKnob.style, { left: `${kc[0]}px`, top: `${kc[1]}px` });
      Object.assign(shapeKnob.style, { left: `${ks[0]}px`, top: `${ks[1]}px` });
      const topY = shape === 'spiral' ? -oh / 2 - 18 : -oh / 2;
      pick.style.top = `${topY}px`;
      shapeIcon.style.rotate = `${SHAPES.indexOf(shape) * 120}deg`;

      // Thumbnails spring to their new spot; the stagger ripples out from `origin`
      const o = origin || [0, 0];
      thumbs.forEach((t, i) => {
        const on = i < count;
        const ar = +t.dataset.ar;
        const w = ar >= 1 ? size : size * ar;
        const h = ar >= 1 ? size / ar : size;
        t.style.width = `${w}px`;
        t.style.height = `${h}px`;
        t.style.margin = `${-h / 2}px 0 0 ${-w / 2}px`;
        const p = on ? pos[i] : [o[0] * 0.3, o[1] * 0.3];
        const d = Math.hypot(p[0] - o[0], p[1] - o[1]);
        t.style.transitionDelay = `${Math.round(d * 1.1)}ms, ${Math.round(d * 1.1)}ms, 0ms`;
        t.style.transform = `translate(${p[0]}px, ${p[1]}px) scale(${on ? 1 : 0})`;
        t.classList.toggle('on', on);
        t.tabIndex = on ? 0 : -1;
      });
    };

    const setCount = (c) => {
      count = c;
      countKnob.querySelector('.num').outerHTML = `<b class="num">${c}</b>`;
      render();
    };
    const setShape = (s) => { shape = s; render(); };

    const size = () => {
      W = root.clientWidth;
      H = root.clientHeight;
      render();
    };

    // Click a result: it becomes the query, and a fresh set ripples out from it
    const search = (t) => {
      const img = t.firstChild;
      picked = [img.src, ...picked].slice(0, 3);
      pick.querySelectorAll('img').forEach((e) => e.remove());
      picked.forEach((src) => { const e = new Image(); e.src = src; e.alt = ''; pick.append(e); });
      const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(t.style.transform);
      const origin = m ? [+m[1], +m[2]] : [0, 0];
      // Collapse into the clicked image, swap the images, then burst back out
      thumbs.forEach((x) => {
        x.style.transitionDelay = '0ms';
        x.style.transform = `translate(${origin[0]}px, ${origin[1]}px) scale(0)`;
      });
      setTimeout(() => {
        gen++;
        loadImages();
        render(origin);
      }, 380);
    };

    const stopAuto = () => { auto = false; };
    countKnob.addEventListener('click', () => { stopAuto(); setCount(COUNTS[(COUNTS.indexOf(count) + 1) % COUNTS.length]); });
    shapeKnob.addEventListener('click', () => { stopAuto(); setShape(SHAPES[(SHAPES.indexOf(shape) + 1) % SHAPES.length]); });
    thumbs.forEach((t) => t.addEventListener('click', () => { stopAuto(); search(t); }));

    // Info cards: dismiss the top one and the next slides up; they cycle forever
    const notes = [...root.querySelectorAll('.note')];
    let order = notes.map((_, i) => i);
    const stackRender = () => order.forEach((n, k) => {
      notes[n].style.zIndex = 10 - k;
      notes[n].style.transform = `translateY(${-k * 8}px) scale(${1 - k * 0.05})`;
    });
    notes.forEach((n, i) => n.querySelector('.x').addEventListener('click', () => {
      n.classList.add('gone');
      setTimeout(() => {
        order = [...order.slice(1), i];
        n.classList.remove('gone');
        stackRender();
      }, 350);
      order = [...order.slice(1)];
      stackRender();
    }));
    stackRender();

    // Demo mode: turn the knobs on a loop until someone touches them
    let step = 0;
    let visible = false;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
    const tour = setInterval(() => {
      if (!root.isConnected) return clearInterval(tour);
      if (!auto || !visible) return;
      step++;
      if (step % 2) setShape(SHAPES[(SHAPES.indexOf(shape) + 1) % SHAPES.length]);
      else setCount(COUNTS[(COUNTS.indexOf(count) + 1) % COUNTS.length]);
    }, 3200);

    loadImages();
    countKnob.querySelector('.num').textContent = count;
    new ResizeObserver(size).observe(root);
    size();
  },
});
