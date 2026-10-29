MicroIX.register({
  id: 'crt-tv',
  title: 'CRT channel surf',
  description: 'Click the old TV to zoom into its screen. Flip channels with 1–6 or the front buttons, and each flip bursts static and rolls the picture. Z toggles zoom and Esc goes back to the desk.',
  tags: ['retro', 'keyboard', 'zoom'],
  source: { label: 'Felix Rieseberg ↗', url: 'https://felixrieseberg.com/' },
  layout: { wide: true, stageHeight: 560 },
  css: `
.ix-crt { position: absolute; inset: 0; overflow: hidden; background: #120d0a; outline: none; font-family: ui-monospace, "SF Mono", Menlo, monospace; user-select: none; -webkit-user-select: none; }

/* Room */
.ix-crt .room { position: absolute; inset: 0; transition: transform 1.3s cubic-bezier(.7,0,.2,1), filter 1.3s; }
.ix-crt .room::before { content: ""; position: absolute; inset: 0; background: radial-gradient(40% 55% at 18% 62%, rgba(255,150,70,.32), transparent 70%), radial-gradient(60% 60% at 50% 40%, rgba(70,90,140,.18), transparent 70%); }
.ix-crt .window { position: absolute; left: 50%; top: 22px; width: min(62%, 700px); height: 330px; translate: -50% 0; overflow: hidden; border: 10px solid #3a2a20; border-radius: 4px; background: linear-gradient(180deg, #0b1020 0%, #1b1e2c 60%, #2a2228 100%); box-shadow: inset 0 0 40px rgba(0,0,0,.8); }
.ix-crt .window::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent calc(50% - 5px), #3a2a20 calc(50% - 5px) calc(50% + 5px), transparent calc(50% + 5px)), linear-gradient(180deg, transparent 30%, #3a2a20 30% calc(30% + 8px), transparent calc(30% + 8px)); }
.ix-crt .city { position: absolute; inset: 40% 0 0; filter: blur(1.4px); background:
  radial-gradient(3px 3px at 8% 40%, #ffd28a, transparent), radial-gradient(3px 3px at 14% 55%, #ffe7b0, transparent), radial-gradient(4px 4px at 22% 35%, #fff2c8, transparent),
  radial-gradient(3px 3px at 31% 60%, #ffcf7a, transparent), radial-gradient(3px 3px at 40% 45%, #ffe3a8, transparent), radial-gradient(5px 3px at 47% 30%, #9fd4ff, transparent),
  radial-gradient(3px 3px at 55% 58%, #ffd28a, transparent), radial-gradient(4px 4px at 63% 42%, #fff, transparent), radial-gradient(3px 3px at 70% 62%, #ffcf7a, transparent),
  radial-gradient(14px 5px at 78% 28%, #fff7d6, transparent), radial-gradient(3px 3px at 86% 50%, #ffe3a8, transparent), radial-gradient(3px 3px at 93% 38%, #ffd28a, transparent),
  linear-gradient(180deg, transparent, rgba(255,170,90,.15)); }
.ix-crt .rain { position: absolute; inset: -40px 0 0; opacity: .25; background: repeating-linear-gradient(100deg, transparent 0 14px, rgba(200,220,255,.5) 14px 15px, transparent 15px 31px); animation: ix-crt-rain .5s linear infinite; }
@keyframes ix-crt-rain { to { transform: translate(-6px, 40px); } }

/* Desk scene (this whole layer zooms) */
.ix-crt .scene { position: absolute; inset: 0; transition: transform 1.3s cubic-bezier(.7,0,.2,1); }
.ix-crt .desk { position: absolute; left: 0; right: 0; bottom: 0; height: 122px; background: linear-gradient(180deg, #5a3a24 0, #3e2716 10px, #2b1b10 100%); box-shadow: 0 -2px 0 #6b4830; }
.ix-crt .vcr { position: absolute; left: 50%; bottom: 122px; width: 310px; height: 40px; translate: -50% 0; border-radius: 4px; background: linear-gradient(180deg, #23201d, #141210); box-shadow: 0 2px 0 rgba(0,0,0,.5); }
.ix-crt .vcr .slot { position: absolute; left: 22px; top: 15px; width: 120px; height: 8px; border-radius: 2px; background: #070605; }
.ix-crt .vcr .clock { position: absolute; right: 22px; top: 11px; padding: 2px 6px; border-radius: 2px; background: #071009; color: #5dffb0; font-size: 12px; text-shadow: 0 0 6px #5dffb0; }
.ix-crt .books { position: absolute; right: calc(50% - 360px); bottom: 122px; display: grid; gap: 2px; }
.ix-crt .books span { display: block; height: 15px; padding: 0 8px; border-radius: 2px; color: rgba(255,255,255,.85); font: 700 8px/15px ui-sans-serif, system-ui, sans-serif; letter-spacing: .1em; }
.ix-crt .mug { position: absolute; left: calc(50% - 280px); bottom: 122px; width: 44px; height: 50px; border-radius: 4px 4px 8px 8px; background: linear-gradient(90deg, #d8d2c6, #f4efe6 40%, #bfb8ab); }
.ix-crt .mug::after { content: ""; position: absolute; right: -14px; top: 10px; width: 14px; height: 22px; border: 5px solid #d8d2c6; border-left: 0; border-radius: 0 12px 12px 0; }

.ix-crt .tv { position: absolute; left: 50%; bottom: 162px; width: 340px; height: 280px; translate: -50% 0; padding: 24px 18px 46px; border-radius: 18px; background: linear-gradient(180deg, #2d2925, #171513); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 18px 30px -10px rgba(0,0,0,.7); cursor: pointer; }
.ix-crt .brand { position: absolute; left: 22px; right: 22px; top: 6px; display: flex; justify-content: space-between; color: #b9b0a4; font: 700 10px ui-sans-serif, system-ui, sans-serif; letter-spacing: .14em; }
.ix-crt .brand i { font-weight: 600; letter-spacing: .02em; color: #8c8378; }
.ix-crt .bezel { height: 100%; padding: 12px; border-radius: 16px; background: #0c0b0a; }
.ix-crt .panel { position: absolute; left: 22px; right: 22px; bottom: 12px; display: flex; align-items: center; gap: 6px; }
.ix-crt .panel button { width: 26px; height: 20px; padding: 0; border: 0; border-radius: 3px; background: #2a2622; color: #8c8378; font: 700 9px ui-monospace, Menlo, monospace; cursor: pointer; box-shadow: inset 0 -2px 0 rgba(0,0,0,.4); transition: background .2s, color .2s, transform .1s; }
.ix-crt .panel button:active { transform: translateY(1px); box-shadow: none; }
.ix-crt .panel button.on { background: #3a2f22; color: #ffb455; text-shadow: 0 0 6px #ff9a2e; }
.ix-crt .led { width: 7px; height: 7px; margin-left: auto; border-radius: 50%; background: #ff3b30; box-shadow: 0 0 8px #ff3b30; }

/* Screen */
.ix-crt .screen { position: relative; height: 100%; overflow: hidden; border-radius: 20px / 26px; background: #1d3ce0; color: #eef1ff; box-shadow: inset 0 0 30px rgba(0,0,20,.7); animation: ix-crt-flicker 3s infinite; }
@keyframes ix-crt-flicker { 0%, 100% { opacity: 1; } 47% { opacity: .96; } 48% { opacity: 1; } 72% { opacity: .98; } }
.ix-crt .content { position: absolute; inset: 0; padding: 12px 16px; }
.ix-crt .content.roll { animation: ix-crt-roll .45s cubic-bezier(.2,.8,.2,1); }
@keyframes ix-crt-roll { from { transform: translateY(-35%) skewX(10deg); filter: brightness(1.8) blur(1px); } }
.ix-crt .noise { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .07; mix-blend-mode: screen; image-rendering: pixelated; pointer-events: none; transition: opacity .2s; }
.ix-crt .screen.static .noise { opacity: 1; mix-blend-mode: normal; transition: none; }
.ix-crt .scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,.2) 0 1px, transparent 1px 3px); }
.ix-crt .glare { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; background: radial-gradient(70% 50% at 30% 15%, rgba(255,255,255,.16), transparent 70%); box-shadow: inset 0 0 18px rgba(0,0,0,.5); }
.ix-crt .osd { position: absolute; z-index: 2; top: 10px; right: 14px; color: #fff; font-size: 12px; font-weight: 700; text-shadow: 1.5px 0 rgba(255,0,80,.7), -1.5px 0 rgba(0,220,255,.7); opacity: 0; transition: opacity .3s; }
.ix-crt .osd.show { opacity: 1; transition: none; }

/* Channel content */
.ix-crt .rgb { text-shadow: 2px 0 rgba(255,0,70,.65), -2px 0 rgba(0,220,255,.65); animation: ix-crt-jitter 2.2s steps(1) infinite; }
@keyframes ix-crt-jitter { 0%, 100% { transform: none; } 31% { transform: translateX(1.5px); } 33% { transform: translateX(-1px); } 35% { transform: none; } 78% { transform: translateX(-2px) skewX(-3deg); } 80% { transform: none; } }
.ix-crt .row { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; }
.ix-crt h4 { position: relative; z-index: 1; margin: 14px 0 6px; font: 900 36px/.9 ui-sans-serif, "Arial Black", system-ui, sans-serif; letter-spacing: .01em; }
.ix-crt .sub { position: relative; z-index: 1; margin: 0; font-size: 9px; font-weight: 700; letter-spacing: .06em; opacity: .9; }
.ix-crt .orbit { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.ix-crt .orbit .dots { fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-dasharray: .1 6; animation: ix-crt-orbit 6s linear infinite; }
@keyframes ix-crt-orbit { to { stroke-dashoffset: -61; } }
.ix-crt .boot { display: grid; place-items: center; align-content: center; height: 100%; gap: 8px; }
.ix-crt .boot .cte { font-size: 14px; font-weight: 700; letter-spacing: .1em; opacity: .55; animation: ix-crt-blink 1.2s steps(1) infinite; }
@keyframes ix-crt-blink { 50% { opacity: .2; } }
.ix-crt .boot .bar { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 700; }
.ix-crt .boot .track { width: 130px; height: 7px; background: repeating-linear-gradient(90deg, #eef1ff 0 4px, transparent 4px 6px); clip-path: inset(0 100% 0 0); animation: ix-crt-load 1.8s steps(22) forwards; }
@keyframes ix-crt-load { to { clip-path: inset(0 0 0 0); } }
.ix-crt .list { margin: 12px 0 0; padding: 0; list-style: none; font-size: 12px; font-weight: 700; line-height: 1.7; }
.ix-crt .list li::before { content: "► "; }
.ix-crt .list li:nth-child(odd) { opacity: .85; }
.ix-crt .bars { position: absolute; inset: 0; display: grid; grid-template-rows: 1fr 18px; }
.ix-crt .bars .top { display: flex; }
.ix-crt .bars .top i, .ix-crt .bars .bot i { flex: 1; }
.ix-crt .bars .bot { display: flex; }
.ix-crt .nosig { display: grid; place-items: center; height: 100%; font-size: 14px; font-weight: 700; letter-spacing: .12em; }
.ix-crt .caret::after { content: "█"; animation: ix-crt-blink 1s steps(1) infinite; }
.ix-crt .screen.ch6 { background: #111; }
.ix-crt .screen.ch6 .noise { opacity: .9; mix-blend-mode: normal; }

/* Zoomed */
.ix-crt.zoomed .room { transform: scale(1.25); filter: blur(3px) brightness(.6); }
.ix-crt.zoomed .tv { cursor: default; }
.ix-crt .hud { position: absolute; z-index: 5; right: 14px; bottom: 12px; display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,.75); font-size: 10px; font-weight: 700; }
.ix-crt .back { padding: 6px 12px; border: 1px solid rgba(255,255,255,.3); border-radius: 999px; background: rgba(0,0,0,.4); color: #fff; font: inherit; cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .4s; }
.ix-crt.zoomed .back { opacity: 1; pointer-events: auto; }
.ix-crt:focus-visible .tv { outline: 2px solid #ffb455; outline-offset: 4px; }

@media (prefers-reduced-motion: reduce) {
  .ix-crt .room, .ix-crt .scene { transition-duration: .01ms; }
  .ix-crt .rain, .ix-crt .rgb, .ix-crt .screen { animation: none; }
}
`,
  mount(stage) {
    const orbit = `<svg class="orbit" viewBox="0 0 280 186" aria-hidden="true">
      <circle cx="170" cy="95" r="70" fill="none" stroke="rgba(255,255,255,.18)"/>
      <ellipse class="dots" cx="150" cy="118" rx="140" ry="42" transform="rotate(-16 150 118)"/></svg>`;

    const CHANNELS = {
      0: `<div class="boot"><div class="row" style="position:absolute;top:12px;right:16px">CH 00</div>
            <div class="cte">CLICK TO ENTER</div>
            <div class="bar"><span class="track"></span><span>100%</span></div></div>`,
      1: `${orbit}<div class="row rgb"><span>▶ PLAY</span><span>CH 01</span></div>
          <h4 class="rgb">MICRO<br>IX</h4><p class="sub rgb">I COLLECT THINGS · CH 01</p>`,
      2: `<div class="row rgb"><span>WORK</span><span>CH 02</span></div>
          <ul class="list rgb"><li>POOL IMPORT</li><li>ASK CAROUSEL</li><li>DRIFT CANVAS</li><li>CRT CHANNEL SURF</li></ul>`,
      3: `<div class="row rgb"><span>POSTS</span><span>CH 03</span></div>
          <ul class="list rgb"><li>ON SPRINGS ..... 10/26</li><li>WHY HOLD-TO ... 09/26</li><li>STATIC NOISE .. 08/26</li></ul>`,
      4: `<div class="bars"><div class="top">${['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'].map((c) => `<i style="background:${c}"></i>`).join('')}</div>
          <div class="bot">${['#0000c0', '#131313', '#c000c0', '#131313', '#00c0c0', '#131313', '#c0c0c0'].map((c) => `<i style="background:${c}"></i>`).join('')}</div></div>`,
      5: `${orbit}<div class="row rgb"><span>ONLINE</span><span>CH 05</span></div>
          <h4 class="rgb" style="font-size:24px">SAY<br>HELLO</h4><p class="sub rgb caret">HI@MICRO-IX.LOCAL </p>`,
      6: `<div class="nosig rgb">NO SIGNAL</div>`,
    };

    stage.innerHTML = `
      <div class="ix-crt" tabindex="0" aria-label="Retro TV. Click to enter. Keys 1 to 6 change channel, Z zooms, Escape goes back.">
        <div class="room"><div class="window"><div class="city"></div><div class="rain"></div></div></div>
        <div class="scene">
          <div class="desk"></div>
          <div class="mug"></div>
          <div class="books">
            <span style="background:#2d6be0">POOL</span><span style="background:#c8442a">ASK</span>
            <span style="background:#1f8a5b">DRIFT</span><span style="background:#7a3fc0">CRT</span><span style="background:#d29a1c">MICRO-IX</span>
          </div>
          <div class="vcr"><span class="slot"></span><span class="clock">23:04</span></div>
          <div class="tv">
            <div class="brand"><span>MICRO·IX</span><i>Teleview</i></div>
            <div class="bezel"><div class="screen">
              <div class="content"></div>
              <canvas class="noise" width="140" height="94"></canvas>
              <div class="scan"></div><div class="glare"></div>
              <div class="osd"></div>
            </div></div>
            <div class="panel">
              ${[1, 2, 3, 4, 5, 6].map((n) => `<button data-ch="${n}" aria-label="Channel ${n}">${n}</button>`).join('')}
              <span class="led"></span>
            </div>
          </div>
        </div>
        <div class="hud"><span>1–6 CHANNELS · Z ZOOM</span><button class="back">BACK TO THE DESK · ESC</button></div>
      </div>`;

    const root = stage.querySelector('.ix-crt');
    const scene = root.querySelector('.scene');
    const screen = root.querySelector('.screen');
    const content = root.querySelector('.content');
    const osd = root.querySelector('.osd');
    const buttons = [...root.querySelectorAll('.panel button')];
    const canvas = root.querySelector('.noise');
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(canvas.width, canvas.height);
    const px = new Uint32Array(img.data.buffer);

    let channel = 0;
    let zoomed = false;
    let staticUntil = 0;
    let osdTimer;

    // Film grain / static. Drawn every frame during a burst, every 4th frame otherwise.
    let running = false;
    let tick = 0;
    const draw = () => {
      if (!running) return;
      const bursting = performance.now() < staticUntil;
      if (bursting || channel === 6 || tick++ % 4 === 0) {
        for (let i = 0; i < px.length; i++) {
          const v = (Math.random() * 255) | 0;
          px[i] = 0xff000000 | (v << 16) | (v << 8) | v;
        }
        ctx.putImageData(img, 0, 0);
      }
      screen.classList.toggle('static', bursting);
      requestAnimationFrame(draw);
    };
    new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(draw);
    }).observe(root);

    const setChannel = (n, { instant = false } = {}) => {
      channel = n;
      buttons.forEach((b) => b.classList.toggle('on', +b.dataset.ch === n));
      screen.classList.toggle('ch6', n === 6);
      const show = () => {
        content.innerHTML = CHANNELS[n];
        content.classList.remove('roll');
        void content.offsetWidth;
        content.classList.add('roll');
      };
      if (instant) return show();
      staticUntil = performance.now() + 280;
      setTimeout(show, 200);
      if (n !== 0) {
        osd.textContent = `CH ${String(n).padStart(2, '0')}`;
        osd.classList.add('show');
        clearTimeout(osdTimer);
        osdTimer = setTimeout(() => osd.classList.remove('show'), 1800);
      }
    };

    // Zoom: scale the scene around the screen's centre and move that point to the stage centre.
    const setZoom = (on) => {
      zoomed = on;
      root.classList.toggle('zoomed', on);
      if (!on) { scene.style.transform = ''; return; }
      scene.style.transform = '';
      // Rects are in screen px; the card may be scaled down, so convert to layout px
      const z = root.getBoundingClientRect().width / root.offsetWidth || 1;
      const un = (b) => ({ left: b.left / z, top: b.top / z, width: b.width / z, height: b.height / z });
      const r = un(root.getBoundingClientRect());
      const s = un(screen.getBoundingClientRect());
      const cx = s.left + s.width / 2 - r.left;
      const cy = s.top + s.height / 2 - r.top;
      const k = Math.min((r.height * 0.84) / s.height, (r.width * 0.8) / s.width);
      scene.style.transformOrigin = `${cx}px ${cy}px`;
      scene.style.transform = `translate(${r.width / 2 - cx}px, ${r.height / 2 - cy}px) scale(${k})`;
    };

    const enter = () => {
      if (!zoomed) setZoom(true);
      if (channel === 0) setTimeout(() => setChannel(1), 500);
    };

    root.querySelector('.tv').addEventListener('click', (e) => {
      if (e.target.closest('.panel button')) return;
      root.focus({ preventScroll: true });
      enter();
    });
    buttons.forEach((b) => b.addEventListener('click', () => {
      root.focus({ preventScroll: true });
      setChannel(+b.dataset.ch);
    }));
    root.querySelector('.back').addEventListener('click', () => setZoom(false));

    root.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '6') setChannel(+e.key);
      else if (e.key === 'z' || e.key === 'Z') zoomed ? setZoom(false) : enter();
      else if (e.key === 'Escape' && zoomed) setZoom(false);
      else if (e.key === 'Enter' && !zoomed) enter();
      else return;
      e.preventDefault();
    });

    setChannel(0, { instant: true });
  },
});
