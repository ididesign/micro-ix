MicroIX.register({
  id: 'shader-cards',
  title: 'Mesh gradient cards',
  description: 'Five tall cards, each filled with a slow moving mesh gradient. Hover or tab to one and it widens while its neighbours squeeze in, the colour blobs speed up and drift toward the pointer, and its Get the code button comes forward. A tap on the button copies a snippet and the label confirms it.',
  tags: ['hover', 'gradient', 'cards'],
  source: { label: '@amananimates on X ↗', url: 'https://x.com/amananimates/status/2113599514103906657' },
  layout: { wide: true, stageHeight: 520 },
  css: `
.ix-sh { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 36px 28px 56px; background: #eeede7; font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; color: #111; overflow: hidden; }
.ix-sh .row { display: flex; gap: 14px; width: 100%; max-width: 860px; height: 100%; max-height: 400px; align-items: stretch; }
.ix-sh .c { position: relative; flex: 1 1 0; min-width: 0; border-radius: 16px; overflow: hidden; cursor: pointer; outline: none; background: var(--a); box-shadow: 0 14px 24px -16px #0006; transition: flex-grow .6s cubic-bezier(.2,.8,.2,1), translate .5s cubic-bezier(.2,.8,.2,1), box-shadow .4s; translate: 0 var(--off, 0px); isolation: isolate; }
.ix-sh .c:nth-child(2n) { --off: 22px; }
.ix-sh .c:nth-child(3) { --off: -10px; }
.ix-sh .c.on { flex-grow: 2.4; translate: 0 -8px; box-shadow: 0 30px 40px -18px #0008; }
.ix-sh .c:focus-visible { outline: 2px solid #111; outline-offset: 3px; }
.ix-sh .blob { position: absolute; width: 120%; aspect-ratio: 1; border-radius: 50%; filter: blur(32px); opacity: .95; z-index: -1; left: var(--x); top: var(--y); background: var(--col); translate: -50% -50%; animation: ix-sh-drift var(--t) ease-in-out infinite alternate; transition: left .8s ease-out, top .8s ease-out; }
.ix-sh .c.on .blob { animation-duration: calc(var(--t) * .45); }
@keyframes ix-sh-drift { from { transform: translate(-14%, -10%) scale(.8); } to { transform: translate(16%, 12%) scale(1.15); } }
.ix-sh .grain { position: absolute; inset: 0; z-index: -1; opacity: .18; mix-blend-mode: overlay; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>"); }
.ix-sh .tag { position: absolute; left: 14px; top: 14px; font: 500 9px/1 ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: .12em; color: var(--ink); opacity: .75; white-space: nowrap; }
.ix-sh .foot { position: absolute; left: 14px; right: 14px; bottom: 14px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; color: var(--ink); }
.ix-sh .nm { font-size: 17px; font-weight: 500; letter-spacing: -.01em; white-space: nowrap; }
.ix-sh .go { all: unset; box-sizing: border-box; padding: 7px 13px; border-radius: 999px; background: #111; color: #fff; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: scale .2s cubic-bezier(.2,.8,.2,1), background .2s; }
.ix-sh .c:not(.on) .go { scale: .92; }
.ix-sh .c.on .go { scale: 1.08; transform-origin: left bottom; }
.ix-sh .go:hover { background: #333; }
.ix-sh .go:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.ix-sh .go.ok { background: #1c8a4a; }
.ix-sh .cap { position: absolute; left: 0; right: 0; bottom: 18px; text-align: center; font: 500 10px ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: .08em; color: #888; text-transform: uppercase; }
@media (max-width: 640px) { .ix-sh { padding: 24px 12px 48px; } .ix-sh .row { gap: 8px; } .ix-sh .nm { font-size: 13px; } .ix-sh .tag { display: none; } }
@media (prefers-reduced-motion: reduce) { .ix-sh .blob { animation: none; } .ix-sh .c { transition: none; } }
`,
  mount(stage) {
    const C = [
      { n: 'Candy', a: '#f5c6e6', ink: '#3b1a33', b: ['#ff8fcf', '#ffe48a', '#c9b6ff'] },
      { n: 'Citrus', a: '#ffc23a', ink: '#3a1d00', b: ['#fff2b0', '#ff7a1a', '#ffb02e'] },
      { n: 'Lagoon', a: '#2f7ff0', ink: '#fff', b: ['#8ff0e0', '#1648c8', '#0b2a60'] },
      { n: 'Orchid', a: '#5a1fa8', ink: '#fff', b: ['#ff6fd0', '#2a0b66', '#9a4dff'] },
      { n: 'Graphite', a: '#5b5d63', ink: '#fff', b: ['#d9dbe0', '#2a2b2f', '#8a8d94'] },
    ];
    const POS = [[30, 30], [75, 40], [45, 85]];
    stage.innerHTML = `<div class="ix-sh"><div class="row">${C.map((c, i) => `<div class="c" tabindex="0" role="group" aria-label="${c.n} mesh gradient" style="--a:${c.a};--ink:${c.ink}">
      ${c.b.map((col, k) => `<i class="blob" style="--col:${col};--x:${POS[k][0]}%;--y:${POS[k][1]}%;--t:${7 + k * 2.5 + i * .6}s;animation-delay:${-k * 2.2}s"></i>`).join('')}<i class="grain"></i>
      <span class="tag">MESH / 0${i + 1}</span>
      <div class="foot"><span class="nm">${c.n}</span><button type="button" class="go">Get the code</button></div></div>`).join('')}</div>
      <div class="cap">Mesh gradient · five colourways</div></div>`;

    const cards = [...stage.querySelectorAll('.c')];
    const on = (el) => cards.forEach(c => c.classList.toggle('on', c === el));
    cards.forEach((c, i) => {
      c.addEventListener('pointerenter', () => on(c));
      c.addEventListener('focusin', () => on(c));
      c.addEventListener('pointerleave', () => on(null));
      c.addEventListener('focusout', (e) => { if (!c.contains(e.relatedTarget)) on(null); });
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * 100, py = ((e.clientY - r.top) / r.height) * 100;
        const b = c.querySelector('.blob'); b.style.setProperty('--x', px.toFixed(0) + '%'); b.style.setProperty('--y', py.toFixed(0) + '%');
      });
      const btn = c.querySelector('.go');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = `.hero { background: ${C[i].b.map((col, k) => `radial-gradient(at ${POS[k][0]}% ${POS[k][1]}%, ${col}, transparent 60%)`).join(', ')}, ${C[i].a}; }`;
        const done = () => { btn.textContent = 'Copied'; btn.classList.add('ok'); setTimeout(() => { btn.textContent = 'Get the code'; btn.classList.remove('ok'); }, 1400); };
        (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(code) : Promise.reject()).then(done, done);
      });
    });
  },
});
