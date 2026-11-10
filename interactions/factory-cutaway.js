MicroIX.register({
  id: 'factory-cutaway',
  title: 'Factory cutaway',
  description: 'A black and white ink cross-section of a hillside factory. Conveyors crawl, tanks bubble, tiny workers bob at their stations and smoke rolls out of the chimney. Hover or tab to a floor and it lights up while the rest dims, with a caption naming the stage.',
  tags: ['illustration', 'hover', 'ambient'],
  source: { label: '@mickeyxfriedman on X ↗', url: 'https://x.com/mickeyxfriedman/status/2113768150840012988' },
  layout: { wide: true, stageHeight: 560 },
  css: `
.ix-fac { position: relative; width: 100%; height: 100%; overflow: hidden; background: #f7f6f1; color: #111; font-family: ui-monospace, 'SF Mono', Menlo, monospace; user-select: none; -webkit-user-select: none; }
.ix-fac .fit { position: absolute; left: 50%; top: 50%; width: 800px; height: 520px; translate: -50% -50%; scale: var(--k, 1); }
.ix-fac svg { display: block; width: 800px; height: 520px; overflow: visible; }
.ix-fac .wall { fill: #111; }
.ix-fac .ln { fill: none; stroke: #111; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ix-fac .thin { fill: none; stroke: #111; stroke-width: .8; }
.ix-fac .paper { fill: #f7f6f1; stroke: #111; stroke-width: 1.4; }
.ix-fac .hatch { fill: url(#ix-fac-h); stroke: #111; stroke-width: 1.2; }
.ix-fac .room { cursor: pointer; outline: none; }
.ix-fac .room .glow { fill: #ffe27a; opacity: 0; transition: opacity .25s; }
.ix-fac .room .art { transition: opacity .25s; }
.ix-fac.focus .room:not(.on) .art { opacity: .28; }
.ix-fac .room.on .glow { opacity: .55; }
.ix-fac .room:focus-visible .glow { opacity: .55; }
.ix-fac .belt { fill: none; stroke: #111; stroke-width: 3; stroke-dasharray: 5 7; animation: ix-fac-belt 1.1s linear infinite; }
.ix-fac .belt.rev { animation-direction: reverse; }
@keyframes ix-fac-belt { to { stroke-dashoffset: -24; } }
.ix-fac .person { animation: ix-fac-bob 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
.ix-fac .person:nth-of-type(2n) { animation-delay: -.5s; animation-duration: 2s; }
.ix-fac .person:nth-of-type(3n) { animation-delay: -1s; }
@keyframes ix-fac-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
.ix-fac .puff { fill: #f7f6f1; stroke: #111; stroke-width: 1.2; animation: ix-fac-puff 6s ease-out infinite; opacity: 0; transform-box: fill-box; transform-origin: center; }
@keyframes ix-fac-puff { 0% { transform: translate(0, 0) scale(.4); opacity: 0; } 12% { opacity: 1; } 100% { transform: translate(120px, -80px) scale(1.7); opacity: 0; } }
.ix-fac .bubble { fill: none; stroke: #111; stroke-width: 1; animation: ix-fac-bub 2.4s ease-in infinite; opacity: 0; }
@keyframes ix-fac-bub { 0% { transform: translateY(8px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(-14px); opacity: 0; } }
.ix-fac .truck { animation: ix-fac-truck 9s ease-in-out infinite alternate; }
@keyframes ix-fac-truck { from { transform: translateX(0); } to { transform: translateX(26px); } }
.ix-fac .gear { transform-box: fill-box; transform-origin: center; animation: ix-fac-spin 6s linear infinite; }
@keyframes ix-fac-spin { to { transform: rotate(360deg); } }
.ix-fac .cap { position: absolute; left: 0; right: 0; bottom: 14px; text-align: center; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #555; }
.ix-fac .cap b { color: #111; font-weight: 600; }
@media (prefers-reduced-motion: reduce) { .ix-fac .belt, .ix-fac .person, .ix-fac .puff, .ix-fac .bubble, .ix-fac .truck, .ix-fac .gear { animation: none; } .ix-fac .puff { opacity: 1; } }
`,
  mount(stage) {
    const ROOMS = [
      { id: 'dock', name: 'Loading dock', note: 'Pallets in, finished crates out' },
      { id: 'pack', name: 'Packing hall', note: 'Robot arms box every bottle' },
      { id: 'fill', name: 'Bottling line', note: 'The carousel fills and caps' },
      { id: 'mix', name: 'Mixing floor', note: 'Silos feed the blending tanks' },
      { id: 'lab', name: 'Control room', note: 'Screens, dials and a clipboard' },
    ];
    // a tiny worker: head, body, optional hard hat
    const man = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="person"><circle cx="0" cy="-15" r="3.2" class="paper"/><path d="M-3.6 -13.5 h7.2" class="ln"/><path d="M-4 -11 q4 -2 8 0 l1 11 h-10z" class="paper"/><path d="M-2 0 v4 M2 0 v4" class="ln"/></g></g>`;
    const tank = (x, y, w, h) => `<path d="M${x} ${y} h${w} v${h} h${-w}z" class="paper"/><path d="M${x} ${y + 6} h${w} M${x} ${y + h - 6} h${w}" class="thin"/><path d="M${x + w / 2} ${y} v-6" class="ln"/>`;
    const puffs = Array.from({ length: 6 }, (_, i) => `<circle class="puff" cx="${566 + (i % 2) * 4}" cy="104" r="${12 + (i % 3) * 3}" style="animation-delay:${-i}s"/>`).join('');
    const bubbles = Array.from({ length: 4 }, (_, i) => `<circle class="bubble" cx="${126 + i * 26}" cy="268" r="2.4" style="animation-delay:${-i * .6}s"/>`).join('');

    stage.innerHTML = `<div class="ix-fac"><div class="fit"><svg viewBox="0 0 800 520" role="img" aria-label="Cross-section of a hillside factory">
      <defs><pattern id="ix-fac-h" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M1 0 V5 M3.5 0 V5" stroke="#111" stroke-width=".7"/></pattern></defs>
      <!-- outbuildings behind -->
      <path d="M130 232 V140 L172 118 L214 140 V232Z" class="hatch"/><path d="M232 232 V150 L320 104 L408 150 V232Z" class="hatch"/>
      <path d="M470 232 V170 L560 140 L650 170 V232Z" class="hatch"/><path d="M620 330 V206 L700 188 L744 214 V330Z" class="hatch"/>
      <!-- chimney + smoke -->
      <path d="M548 112 h26 l4 120 h-34z" class="paper"/><path d="M548 112 q13 -6 26 0" class="ln"/><path d="M561 150 q-5 -8 0 -12 q5 4 0 12z" class="ln"/>
      ${puffs}
      <!-- slabs and walls -->
      <path class="wall" d="M96 232 H560 V244 H96Z"/><path class="wall" d="M96 326 H548 V338 H96Z"/><path class="wall" d="M96 440 H548 V452 H96Z"/>
      <path class="wall" d="M96 498 H700 V510 H96Z"/><path class="wall" d="M96 232 H108 V510 H96Z"/>
      <path class="wall" d="M548 232 H560 V452 H548Z"/><path class="wall" d="M304 244 H316 V326 H304Z"/><path class="wall" d="M304 338 H316 V440 H304Z"/>
      <path class="wall" d="M676 452 H688 V510 H676Z"/><path class="wall" d="M548 440 H688 V452 H548Z"/>

      <!-- control room -->
      <g class="room" data-i="4" tabindex="0" role="button" aria-label="Control room"><rect class="glow" x="316" y="244" width="232" height="82"/><g class="art">
        <rect x="334" y="270" width="44" height="30" class="paper"/><rect x="340" y="276" width="14" height="10" class="hatch"/><path d="M344 304 h28 M358 300 v6" class="ln"/><rect x="326" y="304" width="62" height="22" class="paper"/>
        <rect x="402" y="262" width="62" height="40" class="paper"/><path d="M408 268 h50 M408 276 h36 M408 284 h44" class="thin"/>
        <circle cx="494" cy="276" r="13" class="paper"/><path d="M494 276 l6 -7" class="ln"/><rect x="480" y="302" width="40" height="24" class="paper"/>
        ${man(396, 322)}${man(468, 322, .9)}</g></g>

      <!-- mixing floor -->
      <g class="room" data-i="3" tabindex="0" role="button" aria-label="Mixing floor"><rect class="glow" x="108" y="244" width="196" height="82"/><g class="art">
        ${tank(118, 272, 34, 52)}${tank(160, 262, 34, 62)}${tank(202, 272, 34, 52)}
        <path d="M126 272 q30 -24 70 -24 h50" class="ln"/><rect x="246" y="298" width="30" height="26" class="paper"/><path d="M246 306 h30" class="thin"/>${man(286, 322, .9)}</g></g>

      <!-- bottling carousel -->
      <g class="room" data-i="2" tabindex="0" role="button" aria-label="Bottling line"><rect class="glow" x="316" y="338" width="232" height="102"/><g class="art">
        <ellipse cx="390" cy="362" rx="40" ry="9" class="paper"/><path d="M350 362 v26 q40 14 80 0 v-26" class="paper"/>
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${356 + i * 8.5} 368 v18" class="thin"/>`).join('')}
        <g class="gear"><circle cx="390" cy="362" r="5" class="paper"/><path d="M390 357 v10 M385 362 h10" class="ln"/></g>
        <path d="M326 428 H540" class="ln"/><path class="belt" d="M330 432 H536"/>
        ${[340, 372, 404, 436, 468, 500].map(x => `<path d="M${x} 428 v-16 h6 v16z" class="paper"/>`).join('')}
        <path d="M470 364 l22 -10 l14 14 l-24 10z" class="paper"/><circle cx="508" cy="370" r="3" class="paper"/>${man(528, 436, .85)}</g></g>

      <!-- loading dock -->
      <g class="room" data-i="0" tabindex="0" role="button" aria-label="Loading dock"><rect class="glow" x="108" y="338" width="196" height="102"/><g class="art">
        <g class="truck"><rect x="120" y="396" width="64" height="32" class="paper"/><path d="M184 404 h18 l8 10 v14 h-26z" class="paper"/><circle cx="140" cy="430" r="6" class="paper"/><circle cx="194" cy="430" r="6" class="paper"/></g>
        ${[236, 252, 268].map((x, i) => `<rect x="${x}" y="${422 - (i % 2) * 14}" width="14" height="14" class="paper"/>`).join('')}
        ${man(226, 436, .85)}<rect x="118" y="350" width="44" height="28" class="paper"/><path d="M118 358 h44 M118 366 h44 M118 372 h44" class="thin"/></g></g>

      <!-- packing hall -->
      <g class="room" data-i="1" tabindex="0" role="button" aria-label="Packing hall"><rect class="glow" x="108" y="452" width="568" height="46"/><g class="art">
        <path class="belt rev" d="M120 492 H660"/>
        ${[190, 320, 450, 580].map(x => `<path d="M${x} 490 v-32 l12 -10 l14 4" class="ln"/><circle cx="${x}" cy="458" r="3" class="paper"/>`).join('')}
        ${[140, 232, 262, 366, 396, 494, 524, 616].map(x => `<rect x="${x}" y="476" width="22" height="14" class="paper"/><path d="M${x} 482 h22" class="thin"/>`).join('')}
        ${man(650, 494, .8)}</g></g>

      ${bubbles}
      <!-- ground -->
      <path d="M30 520 q120 -10 240 -2 t260 0 t270 -4" class="ln"/>
    </svg></div><div class="cap" aria-live="polite"><b>Hover a floor</b></div></div>`;

    const root = stage.querySelector('.ix-fac'), fit = root.querySelector('.fit'), cap = root.querySelector('.cap');
    const rooms = [...root.querySelectorAll('.room')];
    const resize = () => root.style.setProperty('--k', Math.min(root.clientWidth / 820, root.clientHeight / 548));
    new ResizeObserver(resize).observe(root); resize();

    const on = (el) => {
      rooms.forEach(r => r.classList.toggle('on', r === el));
      root.classList.toggle('focus', !!el);
      cap.innerHTML = el ? `<b>${ROOMS[+el.dataset.i].name}</b> · ${ROOMS[+el.dataset.i].note}` : '<b>Hover a floor</b>';
    };
    rooms.forEach(r => {
      r.addEventListener('pointerenter', () => on(r));
      r.addEventListener('pointerleave', () => on(null));
      r.addEventListener('focus', () => on(r));
      r.addEventListener('blur', () => on(null));
      r.addEventListener('click', () => on(r));
    });
  },
});
