MicroIX.register({
  id: 'merch-rack',
  title: 'Clothing rack portfolio',
  description: 'A merch portfolio laid out as a real rail of clothes. Garments hang side-on, and the one under the pointer turns to face you and swings on its hanger. Click one to take it off the rack: the rail blurs away and you can flip through the collection one piece at a time.',
  tags: ['portfolio', 'hover', 'gallery'],
  source: { label: '@cambreedesigns via @bestdesignsonx ↗', url: 'https://x.com/bestdesignsonx/status/2114869692691296349' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-merch { --navy: #33406b; --k: 1; position: relative; width: 100%; height: 100%; overflow: hidden; background: #e4e4e1 radial-gradient(circle, rgba(51,64,107,.09) 1px, transparent 1.4px) 0 0 / 22px 22px; color: var(--navy); font-family: ui-sans-serif, -apple-system, system-ui, sans-serif; user-select: none; -webkit-user-select: none; }
.ix-merch .fit { position: absolute; left: 50%; top: 50%; width: calc(100% / var(--k)); height: calc(100% / var(--k)); translate: -50% -50%; scale: var(--k); }
.ix-merch .top { position: absolute; top: 18px; left: 26px; right: 26px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; letter-spacing: .14em; transition: opacity .4s; }
.ix-merch .top button { all: unset; cursor: pointer; padding: 4px 0; }
.ix-merch .logo { font: 400 25px/.82 Yellowtail, "Brush Script MT", cursive; text-align: center; letter-spacing: 0; rotate: -6deg; }
.ix-merch .close { all: unset; cursor: pointer; position: absolute; top: 18px; right: 26px; font-size: 10px; letter-spacing: .14em; opacity: 0; pointer-events: none; transition: opacity .3s; }
.ix-merch .close:hover, .ix-merch .top button:hover { text-decoration: underline; text-underline-offset: 3px; }

/* The rail */
.ix-merch .rack { position: absolute; left: 50%; top: max(84px, calc(50% - 196px)); width: 660px; margin-left: -330px; transition: filter .5s, opacity .5s, scale .5s; }
.ix-merch .rail { position: relative; height: 9px; margin: 0 6px; border-radius: 5px; background: linear-gradient(#fdfdfd, #a9adb2 45%, #e9ebee 60%, #7d8187); box-shadow: 0 3px 6px rgba(0,0,0,.18); }
.ix-merch .rail::before, .ix-merch .rail::after { content: ""; position: absolute; top: -6px; width: 10px; height: 21px; border-radius: 3px; background: linear-gradient(90deg, #8a8e94, #f4f5f6 45%, #8a8e94); }
.ix-merch .rail::before { left: -8px; }
.ix-merch .rail::after { right: -8px; }
.ix-merch .row { display: flex; justify-content: center; height: 262px; margin-top: -8px; }
.ix-merch .slot { all: unset; position: relative; flex: 0 0 auto; width: 46px; height: 100%; cursor: pointer; perspective: 760px; transition: width .55s cubic-bezier(.3,.9,.3,1); }
.ix-merch .slot.on { width: 196px; z-index: 2; }
.ix-merch .g { position: absolute; left: 50%; top: 0; width: 176px; margin-left: -88px; transform: rotateY(-72deg); filter: brightness(.86); transition: transform .6s cubic-bezier(.3,.9,.3,1), filter .5s; }
.ix-merch .slot:nth-child(odd) .g { transform: rotateY(-70deg) rotateZ(.6deg); }
.ix-merch .slot.on .g { transform: rotateY(0deg); filter: drop-shadow(0 14px 14px rgba(0,0,0,.18)); }
.ix-merch .sw { transform-origin: 50% 4px; }
.ix-merch .slot.on .sw { animation: ix-merch-swing 1.6s ease-out; }
@keyframes ix-merch-swing { 0% { rotate: 0deg; } 18% { rotate: 3.5deg; } 42% { rotate: -2.2deg; } 66% { rotate: 1deg; } 100% { rotate: 0deg; } }
.ix-merch .slot:focus-visible .g { outline: 2px solid var(--navy); outline-offset: 4px; }
.ix-merch svg.tee { display: block; width: 100%; height: auto; overflow: visible; }
.ix-merch .cap { height: 16px; margin-top: 10px; text-align: center; font: italic 500 12px/16px ui-serif, Georgia, serif; transition: opacity .3s; }

.ix-merch .pill { all: unset; cursor: pointer; display: inline-block; padding: 5px 14px; border: 1px solid var(--navy); border-radius: 999px; font-size: 9px; letter-spacing: .14em; text-transform: uppercase; transition: background .2s, color .2s; }
.ix-merch .pill:hover { background: var(--navy); color: #e4e4e1; }
.ix-merch .avail { position: absolute; left: 50%; bottom: 66px; translate: -50% 0; transition: opacity .4s; }

/* Marquee */
.ix-merch .marquee { position: absolute; left: 0; right: 0; bottom: 0; height: 26px; overflow: hidden; background: var(--navy); color: #e8e9ee; font-size: 9px; letter-spacing: .16em; line-height: 26px; white-space: nowrap; transition: translate .5s; }
.ix-merch .marquee div { display: inline-block; animation: ix-merch-marq 26s linear infinite; }
@keyframes ix-merch-marq { to { transform: translateX(-50%); } }

/* Focus view: one garment off the rack */
.ix-merch .focus { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; pointer-events: none; transition: opacity .4s; }
.ix-merch .stagef { position: relative; width: 250px; margin-top: -40px; perspective: 900px; }
.ix-merch .stagef .g2 { animation: ix-merch-in .6s cubic-bezier(.3,.9,.3,1) both; filter: drop-shadow(0 20px 18px rgba(0,0,0,.2)); }
.ix-merch .stagef .g2.back { animation-name: ix-merch-in-back; }
@keyframes ix-merch-in { from { transform: translateX(60px) rotateY(-60deg); opacity: 0; } }
@keyframes ix-merch-in-back { from { transform: translateX(-60px) rotateY(60deg); opacity: 0; } }
.ix-merch .stagef .sw { animation: ix-merch-swing 1.8s ease-out .1s; }
.ix-merch .nav { all: unset; cursor: pointer; position: absolute; top: 50%; display: grid; place-items: center; width: 26px; height: 26px; margin-top: -60px; border: 1px solid var(--navy); border-radius: 50%; transition: background .2s, color .2s; }
.ix-merch .nav:hover { background: var(--navy); color: #e4e4e1; }
.ix-merch .nav svg { width: 12px; height: 12px; }
.ix-merch .prev { left: calc(50% - 230px); }
.ix-merch .next { left: calc(50% + 204px); }
.ix-merch .meta { position: absolute; left: 0; right: 0; top: calc(50% + 178px); display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ix-merch .num { font-size: 9px; letter-spacing: .16em; opacity: .7; }
.ix-merch .fname { font: 400 22px/1.1 Yellowtail, "Brush Script MT", cursive; }

.ix-merch.open .rack { filter: blur(7px); opacity: .32; scale: 1.04; pointer-events: none; }
.ix-merch.open .top, .ix-merch.open .avail { opacity: 0; pointer-events: none; }
.ix-merch.open .marquee { translate: 0 100%; }
.ix-merch.open .focus { opacity: 1; pointer-events: auto; }
.ix-merch.open .close { opacity: 1; pointer-events: auto; }

@media (prefers-reduced-motion: reduce) {
  .ix-merch .marquee div, .ix-merch .sw, .ix-merch .stagef .g2 { animation: none !important; }
}
`,
  mount(stage) {
    if (!document.getElementById('ix-yellowtail')) {
      const l = document.createElement('link');
      l.id = 'ix-yellowtail';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Yellowtail&display=swap';
      document.head.append(l);
    }

    // kind: tee | long | crew. print: what goes on the chest.
    const GARMENTS = [
      { name: 'Overgrown Camo Overshirt', kind: 'long', color: '#6d6252', print: 'camo' },
      { name: 'Night Shift Tee', kind: 'tee', color: '#1d1d1f', print: 'small', ink: '#e9e9e9', text: 'night shift' },
      { name: 'Wildflower Tee', kind: 'tee', color: '#f5f3f1', print: 'flowers' },
      { name: 'Static Long Sleeve', kind: 'long', color: '#232325', print: 'badge', ink: '#f1f1f1', text: 'static' },
      { name: 'Greenhouse Crew', kind: 'crew', color: '#24493a', print: 'stack', ink: '#f2efe6', text: 'Grow|Slow|Club' },
      { name: 'Late Bloomer Tee', kind: 'tee', color: '#1f1c1f', print: 'script', ink: '#f3f3f3', text: 'Late|Bloomer' },
      { name: 'Paper Moon Tee', kind: 'tee', color: '#f3f0f0', print: 'moon' },
      { name: 'Daydream Dollar Tee', kind: 'tee', color: '#f6f4f2', print: 'bill' },
      { name: 'Soft Hours Tee', kind: 'tee', color: '#f1eeee', print: 'script', ink: '#33406b', text: 'Soft|Hours' },
      { name: 'Fog Grey Tee', kind: 'tee', color: '#8d8f93', print: 'small', ink: '#2a2a2c', text: 'fog' },
    ];

    let uid = 0;
    const shapes = {
      tee: 'M72 32 Q100 50 128 32 L162 44 L189 92 L162 104 L150 84 L151 246 L49 246 L50 84 L38 104 L11 92 L38 44 Z',
      long: 'M72 32 Q100 50 128 32 L160 42 Q174 52 178 92 L186 228 L165 232 L152 112 L152 246 L48 246 L48 112 L35 232 L14 228 L22 92 Q26 52 40 42 Z',
    };
    shapes.crew = shapes.long;

    const printArt = (g, id) => {
      const ink = g.ink || '#222';
      const words = (g.text || '').split('|');
      switch (g.print) {
        case 'small':
          return `<text x="100" y="80" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="6" letter-spacing="1.5" fill="${ink}">${g.text.toUpperCase()}</text>`;
        case 'script':
          return words.map((w, i) => `<text x="100" y="${104 + i * 30}" text-anchor="middle" font-family="Yellowtail, 'Brush Script MT', cursive" font-size="31" fill="none" stroke="${ink}" stroke-width="1.1">${w}</text>`).join('')
            + `<text x="100" y="${118 + words.length * 30}" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="4.5" letter-spacing="1.2" fill="${ink}">EST. ROUTINE · SINCE NOW</text>`;
        case 'stack':
          return words.map((w, i) => `<text x="100" y="${102 + i * 25}" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="24" fill="${ink}">${w}</text>`).join('')
            + `<rect x="92" y="${112 + words.length * 25}" width="16" height="12" rx="2" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
        case 'badge':
          return `<text x="100" y="94" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="26" letter-spacing="1" fill="${ink}">${g.text}</text>
            <circle cx="100" cy="126" r="20" fill="none" stroke="${ink}" stroke-width="5"/><path d="M93 114 Q112 114 106 126 Q114 128 108 138 Q100 142 92 136" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
            <text x="100" y="164" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="5" letter-spacing="1.4" fill="${ink}">THIRD EDITION · ALL NIGHT</text>`;
        case 'flowers': {
          const cols = ['#e2483f', '#f2b630', '#ef7fb0', '#6c7fd8', '#f08a3a'];
          let s = '';
          for (let i = 0; i < 9; i++) {
            const x = 66 + (i % 3) * 30 + (i % 2) * 6, y = 100 + Math.floor(i / 3) * 24 + (i % 3) * 4, c = cols[i % cols.length];
            s += `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((r) => `<ellipse rx="4.4" ry="8" cy="-6" transform="rotate(${r})" fill="${c}"/>`).join('')}<circle r="3" fill="#2c2416"/></g>`;
          }
          return s + `<text x="100" y="98" text-anchor="middle" font-family="Yellowtail, 'Brush Script MT', cursive" font-size="34" fill="#222">Picked</text>`;
        }
        case 'moon':
          return `<circle cx="100" cy="118" r="32" fill="#ece3c4" stroke="#222" stroke-width="1.4"/><circle cx="114" cy="110" r="30" fill="${g.color}"/>
            <text x="100" y="176" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="#222">paper moon</text>`;
        case 'bill':
          return `<rect x="58" y="104" width="84" height="40" fill="#cfe1c6" stroke="#5d7d55" stroke-width="1.4" transform="rotate(-6 100 124)"/><circle cx="100" cy="124" r="11" fill="none" stroke="#5d7d55" stroke-width="1.2" transform="rotate(-6 100 124)"/>
            <text x="100" y="100" text-anchor="middle" font-family="Yellowtail, 'Brush Script MT', cursive" font-size="28" fill="none" stroke="#1f1f1f" stroke-width="1">Daydream</text>`;
        case 'camo': {
          const cols = ['#8b7a5f', '#4e4a3c', '#a99673', '#3a3b30', '#c2b08a'];
          let s = '';
          for (let i = 0; i < 46; i++) {
            const x = (i * 53) % 200, y = 30 + ((i * 89) % 220), r = 9 + ((i * 7) % 13);
            s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" transform="rotate(${(i * 37) % 180} ${x} ${y})" fill="${cols[i % 5]}"/>`;
          }
          return `<g clip-path="url(#c${id})">${s}</g><path d="M100 46 L100 246" stroke="#2c2a22" stroke-width="1" stroke-dasharray="1 9"/>`;
        }
        default: return '';
      }
    };

    const garmentSVG = (g) => {
      const id = `ixm${uid++}`;
      const d = shapes[g.kind];
      const dark = parseInt(g.color.slice(1, 3), 16) < 120;
      const rib = g.kind === 'crew' ? `<path d="M48 236 H152 V246 H48Z M165 220 L186 217 L186 228 L165 232Z M14 228 L35 232 L35 220 L14 217Z" fill="rgba(0,0,0,.18)"/>` : '';
      return `<svg class="tee" viewBox="0 -6 200 256" aria-hidden="true">
        <defs>
          <clipPath id="c${id}"><path d="${d}"/></clipPath>
          <linearGradient id="s${id}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity="${dark ? .06 : .12}"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
        </defs>
        <path d="${d}" fill="${g.color}"/>
        ${printArt(g, id)}
        ${rib}
        <path d="${d}" fill="url(#s${id})"/>
        <path d="M78 140 Q84 190 76 240 M126 120 Q118 180 128 238" stroke="#000" stroke-opacity=".04" stroke-width="7" fill="none" clip-path="url(#c${id})"/>
        <path d="M72 32 Q100 50 128 32" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="3"/>
        <path d="M100 6 C100 -2 108 -4 110 2 C112 8 104 10 100 14 L100 20" fill="none" stroke="#b9bdc2" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M100 20 L42 40 Q38 42 42 44 L158 44 Q162 42 158 40 Z" fill="#9a6a3e" stroke="#6e4826" stroke-width="1"/>
      </svg>`;
    };

    stage.innerHTML = `
      <div class="ix-merch">
        <div class="fit">
          <div class="top"><button type="button">ABOUT</button><div class="logo">Odd Lot<br>&nbsp;&nbsp;Merch</div><button type="button">CONTACT</button></div>
          <button class="close" type="button">CLOSE</button>
          <div class="rack"><div class="rail"></div><div class="row"></div><div class="cap" aria-live="polite"></div></div>
          <button class="pill avail" type="button">See availability</button>
          <div class="focus" role="group" aria-label="Garment detail">
            <div class="stagef"></div>
            <button class="nav prev" type="button" aria-label="Previous"><svg viewBox="0 0 12 12"><path d="M7.5 2 3.5 6l4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <button class="nav next" type="button" aria-label="Next"><svg viewBox="0 0 12 12"><path d="M4.5 2 8.5 6l-4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <div class="meta"><div class="num"></div><div class="fname"></div><button class="pill" type="button">See availability</button></div>
          </div>
          <div class="marquee" aria-hidden="true"><div></div></div>
        </div>
      </div>`;

    const root = stage.querySelector('.ix-merch');
    const row = root.querySelector('.row');
    const cap = root.querySelector('.cap');
    const stageF = root.querySelector('.stagef');
    const close = root.querySelector('.close');

    const marq = root.querySelector('.marquee div');
    marq.textContent = 'NEW DESIGNS DAILY  •  SUBSCRIBE TO OUR NEWSLETTER  •  '.repeat(8);

    const slots = GARMENTS.map((g, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'slot';
      b.setAttribute('aria-label', g.name);
      b.innerHTML = `<div class="g"><div class="sw">${garmentSVG(g)}</div></div>`;
      b.addEventListener('pointerenter', () => { hovering = true; setActive(i); });
      b.addEventListener('focus', () => setActive(i));
      b.addEventListener('click', () => openAt(i));
      row.append(b);
      return b;
    });
    row.addEventListener('pointerleave', () => { hovering = false; idleAt = performance.now(); });

    // ---------- rack: one garment turns to face you ----------
    let active = -1, hovering = false, idleAt = performance.now();
    const setActive = (i) => {
      if (i === active) return;
      if (active >= 0) slots[active].classList.remove('on');
      active = i;
      if (i >= 0) slots[i].classList.add('on');
      cap.textContent = i >= 0 ? GARMENTS[i].name : '';
    };

    // When nobody is browsing, the rack shows off a piece at a time
    let peek = 0;
    const peekTimer = setInterval(() => {
      if (hovering || root.classList.contains('open') || !root.isConnected) return;
      if (performance.now() - idleAt < 2200) return;
      if (root.contains(document.activeElement) && document.activeElement.classList.contains('slot')) return;
      peek = (peek + 3) % GARMENTS.length;
      setActive(peek);
    }, 2600);
    if (!stage.isConnected) clearInterval(peekTimer);

    // ---------- focus view ----------
    let cur = 0;
    const show = (i, dir = 1) => {
      cur = (i + GARMENTS.length) % GARMENTS.length;
      const g = GARMENTS[cur];
      stageF.innerHTML = `<div class="g2${dir < 0 ? ' back' : ''}"><div class="sw">${garmentSVG(g)}</div></div>`;
      root.querySelector('.num').textContent = `${String(cur + 1).padStart(2, '0')} / ${String(GARMENTS.length).padStart(2, '0')}`;
      root.querySelector('.fname').textContent = g.name;
    };
    const openAt = (i) => {
      show(i);
      root.classList.add('open');
      root.querySelector('.next').focus({ preventScroll: true });
    };
    const shut = () => {
      root.classList.remove('open');
      setActive(cur);
      slots[cur].focus({ preventScroll: true });
      idleAt = performance.now();
    };
    root.querySelector('.prev').addEventListener('click', () => show(cur - 1, -1));
    root.querySelector('.next').addEventListener('click', () => show(cur + 1, 1));
    close.addEventListener('click', shut);
    root.addEventListener('keydown', (e) => {
      if (!root.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); shut(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, -1); }
    });

    // Scale the 820×600 design to the stage, letting the canvas stretch to fill the extra room
    new ResizeObserver(() => {
      const w = root.clientWidth, h = root.clientHeight;
      if (w && h) root.style.setProperty('--k', Math.min(1.3, w / 820, h / 600));
    }).observe(root);
    root.ixOpen = openAt; // test hook
  },
});
