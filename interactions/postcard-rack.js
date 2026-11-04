MicroIX.register({
  id: 'postcard-rack',
  title: 'Postcard spinner',
  description: 'A travel journal laid out as a wire postcard rack. Drag to spin it round its pole and it settles on the nearest side. Tap a card to pull it out of its pocket, then tap again to flip it over and read the stamp, postmark and handwritten note on the back.',
  tags: ['3d', 'drag', 'card'],
  source: { label: '@mehdi_made on X ↗', url: 'https://x.com/mehdi_made/status/2117961219210608905' },
  layout: { device: { width: 320, height: 660 } },
  css: `
.ix-pc { --ink: #3b2a20; position: relative; width: 100%; height: 100%; overflow: hidden; isolation: isolate; color: var(--ink); font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; user-select: none; -webkit-user-select: none;
  background: radial-gradient(50% 30% at 75% 12%, rgba(255,236,214,.9), transparent 70%), radial-gradient(60% 40% at 15% 70%, rgba(255,226,196,.7), transparent 70%), linear-gradient(170deg, #efcfaa, #e3b68c 55%, #d9a87e); }
.ix-pc .light { position: absolute; inset: -20%; pointer-events: none; filter: blur(16px); opacity: .55;
  background: repeating-linear-gradient(115deg, transparent 0 46px, rgba(150,90,50,.22) 46px 70px, transparent 70px 120px),
              radial-gradient(14% 9% at 30% 30%, rgba(255,246,230,.9), transparent), radial-gradient(10% 7% at 66% 52%, rgba(255,246,230,.8), transparent), radial-gradient(12% 8% at 40% 82%, rgba(255,246,230,.7), transparent);
  animation: ix-pc-sway 9s ease-in-out infinite alternate; }
@keyframes ix-pc-sway { to { transform: translate(12px, -8px) rotate(1deg); } }
.ix-pc .status { position: absolute; z-index: 9; top: 16px; left: 32px; right: 28px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 15px; pointer-events: none; }
.ix-pc .battery { width: 25px; height: 12px; border-radius: 4px; background: currentColor; }
.ix-pc .head { position: absolute; z-index: 6; top: 54px; left: 22px; right: 22px; pointer-events: none; }
.ix-pc .kick { font: 500 7.5px/1 ui-monospace, Menlo, monospace; letter-spacing: .22em; text-transform: uppercase; opacity: .55; }
.ix-pc h3 { margin: 6px 0 9px; font: 400 27px/1 "Instrument Serif", Georgia, serif; letter-spacing: -.01em; }
.ix-pc .pill { display: inline-block; padding: 5px 9px; border-radius: 6px; background: rgba(255,248,238,.42); font: 500 8px/1 ui-monospace, Menlo, monospace; letter-spacing: .06em; transition: background .3s; }

/* The rack: every card and wire is its own 3D-transformed child of the perspective container */
.ix-pc .scene { position: absolute; inset: 0; perspective: 900px; perspective-origin: 50% 24%; touch-action: none; cursor: grab; transition: filter .5s, opacity .5s, scale .5s; }
.ix-pc .scene.drag { cursor: grabbing; }
.ix-pc .scene > * { position: absolute; left: 50%; }
.ix-pc .pole { top: 126px; width: 8px; height: 392px; margin-left: -4px; z-index: 100; border-radius: 3px; background: linear-gradient(90deg, #8d9095, #f1f2f3 40%, #b3b6ba 60%, #85888d); box-shadow: 0 0 8px rgba(90,50,20,.18); }
.ix-pc .pole::before { content: ""; position: absolute; left: -3px; top: -8px; width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff, #a9acb0 60%, #7d8085); }
.ix-pc .base { top: 470px; width: 220px; height: 100px; margin-left: -110px; z-index: 99; overflow: visible; }
.ix-pc .frame { top: 136px; height: 348px; border: 1.5px solid rgba(238,240,242,.85); border-bottom: 0; box-shadow: 0 0 0 .5px rgba(110,80,60,.25); pointer-events: none; }
.ix-pc .pocket { height: 32px; border: 1.5px solid rgba(240,242,244,.95); border-top-color: rgba(240,242,244,.6); box-shadow: 0 1px 0 .5px rgba(110,80,60,.25), inset 0 0 0 .5px rgba(110,80,60,.18); pointer-events: none; }
.ix-pc .pocket::before { content: ""; position: absolute; left: 50%; top: -1px; bottom: -1px; width: 1.5px; background: rgba(240,242,244,.9); }
.ix-pc .pocket::after { content: ""; position: absolute; left: 0; right: 0; top: 13px; height: 1.2px; background: rgba(240,242,244,.75); }
.ix-pc .card { all: unset; position: absolute; left: 50%; box-sizing: border-box; width: 66px; height: 92px; margin-left: -33px; transform-origin: 50% 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; cursor: pointer; box-shadow: 0 3px 6px rgba(70,40,20,.28); transition: translate .25s cubic-bezier(.3,.9,.3,1); }
.ix-pc .card:hover, .ix-pc .card:focus-visible { translate: 0 -6px; }
.ix-pc .card:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.ix-pc .card.gone { visibility: hidden; }
.ix-pc svg.art { display: block; width: 100%; height: 100%; }

/* Pulled-out card */
.ix-pc .pick { position: absolute; z-index: 20; left: 70px; top: 150px; width: 180px; height: 252px; perspective: 1100px; transform-origin: 0 0; visibility: hidden; cursor: pointer; }
.ix-pc .pick > div { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; transition: transform .75s cubic-bezier(.3,.8,.25,1); box-shadow: 0 22px 30px -8px rgba(70,35,15,.45), 0 2px 5px rgba(70,35,15,.2); }
.ix-pc .pick:focus { outline: none; }
.ix-pc .pick:focus-visible > div { outline: 2px solid #fff; outline-offset: 3px; }
.ix-pc .pick .pb { transform: rotateY(180deg); }
.ix-pc .pick.flip .pf { transform: rotateY(-180deg); }
.ix-pc .pick.flip .pb { transform: rotateY(0deg); }
.ix-pc .pb { box-sizing: border-box; padding: 12px 13px; background: #ecdfc6 radial-gradient(circle at 70% 30%, rgba(255,255,255,.35), transparent 60%); font-family: Caveat, "Bradley Hand", cursive; color: #2c2a4a; }
.ix-pc .pb .pc-h { font: 600 7px/1 ui-monospace, Menlo, monospace; letter-spacing: .2em; color: #6b5a44; }
.ix-pc .pb .stamp { position: absolute; top: 10px; right: 11px; width: 40px; height: 48px; padding: 3px; background: #fbf7ee; box-shadow: 0 1px 2px rgba(0,0,0,.2); border: 1.5px dashed rgba(120,100,80,.35); box-sizing: border-box; }
.ix-pc .pb .stamp svg { display: block; width: 100%; height: 100%; }
.ix-pc .pb .mark { position: absolute; top: 14px; right: 36px; width: 56px; height: 44px; overflow: visible; color: rgba(40,40,70,.6); }
.ix-pc .pb .addr { margin-top: 44px; font-size: 13px; line-height: 17px; }
.ix-pc .pb .addr div { width: 92px; border-bottom: 1px solid rgba(80,60,40,.3); }
.ix-pc .pb hr { margin: 16px 0 12px; border: 0; border-top: 1px solid rgba(80,60,40,.35); }
.ix-pc .pb .msg { font-size: 16px; line-height: 17px; }
.ix-pc .pb .sig { margin-top: 8px; text-align: right; font-size: 16px; }

.ix-pc .putback { all: unset; position: absolute; z-index: 21; left: 50%; bottom: 38px; translate: -50% 12px; padding: 8px 15px; border-radius: 999px; background: #241a16; color: #f6ebdd; font-size: 11px; font-weight: 600; cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .3s, translate .3s; }
.ix-pc .putback:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.ix-pc .tip { position: absolute; z-index: 21; left: 0; right: 0; top: 414px; text-align: center; font: 500 8px/1 ui-monospace, Menlo, monospace; letter-spacing: .12em; opacity: 0; transition: opacity .3s; pointer-events: none; }
.ix-pc.out .scene { filter: blur(5px); opacity: .6; scale: 1.03; pointer-events: none; }
.ix-pc.out .putback { opacity: 1; translate: -50% 0; pointer-events: auto; }
.ix-pc.out .tip { opacity: .55; }
.ix-pc.out .pick { visibility: visible; }

@media (prefers-reduced-motion: reduce) {
  .ix-pc .light { animation: none; }
  .ix-pc .pick > div { transition-duration: .01s; }
}
`,
  mount(stage) {
    if (!document.getElementById('ix-caveat')) {
      const l = document.createElement('link');
      l.id = 'ix-caveat';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap';
      document.head.append(l);
    }

    // scene, palette [sky top, sky bottom, accent, ground/sea, extra], title ink
    const CARDS = [
      ['Zanzibar', 'Tanzania', 'palm', ['#f3d9a4', '#9fd3c7', '#fbe9b0', '#2f9fa6', '#e7c28c'], '#fff7e6', 'Mango for breakfast, lunch and dinner.', 'Ana'],
      ['Kyoto', 'Japan', 'gate', ['#f7c9a3', '#f08a6a', '#ffe1b8', '#6a4b6e', '#9a6c86'], '#fff4ea', 'Walked under a thousand red gates today. Legs gone, heart full.', 'Jun'],
      ['Lisbon', 'Portugal', 'tram', ['#9cc9e6', '#e9f1ee', '#f4c12f', '#c9b8a2', '#e48a5a'], '#20304a', 'The yellow tram nearly took my elbow off. Pastéis worth it.', 'Rui'],
      ['Santorini', 'Greece', 'city', ['#7fb4e3', '#d6ebf5', '#2c63b5', '#1f5f9e', '#f6f3ee'], '#123a6b', 'Everything is white and blue, even my sunburn.', 'Eleni'],
      ['Marrakech', 'Morocco', 'desert', ['#f5b46a', '#f7dfae', '#e7542e', '#d9874a', '#b8602f'], '#fff4e2', 'Bought a rug I cannot carry. Send help (and a bigger bag).', 'Sam'],
      ['Banff', 'Canada', 'mountain', ['#a8d4ef', '#e8f4f7', '#5d7fa6', '#3f7a5c', '#25503d'], '#1d3550', 'Saw an elk. It did not care about me at all.', 'Mara'],
      ['Amalfi', 'Italy', 'sea', ['#f4a86b', '#fbd9a0', '#ffd36b', '#2f6aa0', '#c4744a'], '#fff3df', 'Lemons the size of my fist. Swam every morning.', 'Gio'],
      ['Tromsø', 'Norway', 'lake', ['#0d1838', '#26406b', '#6ef0b0', '#14284d', '#0a1530'], '#d9fff0', 'The sky went green at 2am. Nobody slept.', 'Ingrid'],
      ['Bali', 'Indonesia', 'palm', ['#f6b88e', '#f8dcb6', '#ffd08a', '#3c9aa8', '#e9c999'], '#fff6ea', 'Rice terraces, rain at four, every single day.', 'Kadek'],
      ['Valparaíso', 'Chile', 'tram', ['#f2c4b0', '#f6e6cf', '#d9433a', '#8f8f99', '#3d8fc2'], '#2b2440', 'Every house is a different colour. Climbed every hill.', 'Tomás'],
      ['Big Sur', 'USA', 'sea', ['#e98a73', '#f6c39a', '#ffe3a8', '#3b5b86', '#6f5a4a'], '#fff2e4', 'Pulled over eleven times in one afternoon.', 'Dee'],
      ['Patagonia', 'Argentina', 'mountain', ['#bcd7ea', '#eef2ef', '#7b8ea8', '#c7a46b', '#8b6a3f'], '#1f2c3d', 'Wind so strong my hat is now in Chile.', 'Lu'],
      ['Wadi Rum', 'Jordan', 'desert', ['#e8875b', '#f6c48d', '#fde4b4', '#cf6f3e', '#a3492a'], '#fff1df', 'Slept under more stars than I knew existed.', 'Omar'],
      ['Nara', 'Japan', 'gate', ['#bfd9e8', '#f2e1d1', '#fff1d8', '#7c9c8a', '#a8b9a4'], '#22323b', 'A deer bowed at me, so I bowed back.', 'Aki'],
      ['Mykonos', 'Greece', 'city', ['#f3b48d', '#f9e1c3', '#d0453e', '#2878b7', '#fbf7f1'], '#3a2030', 'Windmills, cats and too much feta.', 'Nikos'],
      ['Bled', 'Slovenia', 'lake', ['#2b2e5c', '#a47aa6', '#f5c3c8', '#2f3f6e', '#1d2448'], '#ffeef2', 'Rowed out to the island church at dusk.', 'Maja'],
      ['Tulum', 'Mexico', 'palm', ['#8fd0d8', '#e9f5ec', '#fff2c2', '#29a5b3', '#efd9b0'], '#1f4450', 'Ruins on the beach. Tacos at every corner.', 'Paz'],
      ['Dubrovnik', 'Croatia', 'sea', ['#7ab3d9', '#cfe6ef', '#f7e2a8', '#1c5f8f', '#c9784c'], '#fff', 'Walked the whole city wall, twice.', 'Ivo'],
      ['Zermatt', 'Switzerland', 'mountain', ['#6f9fd6', '#d5e8f6', '#eef3f8', '#55835e', '#2d4e37'], '#fff', 'The mountain looks exactly like the chocolate.', 'Lea'],
      ['Merzouga', 'Morocco', 'desert', ['#f2945e', '#fbd09a', '#fff0c0', '#e48a4b', '#c06a37'], '#fff6e8', 'Rode a camel named Jimi Hendrix.', 'Yas'],
      ['San Francisco', 'USA', 'tram', ['#f5b6a0', '#fbe5d3', '#c9473c', '#9aa0a8', '#7fb2c9'], '#2b2233', 'Fog ate the bridge by lunch. Still pretty.', 'Kit'],
      ['Rovaniemi', 'Finland', 'lake', ['#162447', '#3b5b8c', '#9ef0d8', '#1e335c', '#e9f0f6'], '#e6fff7', 'Minus 24 and the sauna was worth every step.', 'Aino'],
      ['Seychelles', 'Republic of', 'palm', ['#79c4e0', '#e1f3f2', '#fff6cf', '#1aa0b8', '#f1e1c2'], '#173c4a', 'Giant tortoise followed me for an hour.', 'Rosa'],
      ['Cinque Terre', 'Italy', 'city', ['#f7b38a', '#fde0bf', '#e9603c', '#2c6fa3', '#f2d27a'], '#2c2230', 'Five villages, one very steep hike.', 'Bea'],
    ].map(([place, country, scene, pal, tc, msg, sig]) => ({ place, country, scene, pal, tc, msg, sig }));

    let uid = 0;
    const sceneArt = (c, g) => {
      const [a, b, x, d, e] = c.pal;
      const sky = `<rect width="100" height="140" fill="url(#${g})"/>`;
      switch (c.scene) {
        case 'sea': {
          let r = '';
          for (let i = 0; i < 6; i++) r += `<rect x="${50 - (26 - i * 4) / 2}" y="${86 + i * 7}" width="${26 - i * 4}" height="2.2" rx="1" fill="${x}" opacity=".7"/>`;
          return `${sky}<circle cx="50" cy="80" r="19" fill="${x}"/><rect y="82" width="100" height="58" fill="${d}"/>${r}
            <path d="M-2 58 L10 56 L18 66 L26 72 L34 84 L-2 84Z" fill="${e}"/><path d="M102 64 L90 66 L84 76 L76 84 L102 84Z" fill="${e}" opacity=".85"/>
            <path d="M6 60 h4v4h-4z M12 64 h4v4h-4z" fill="#fff" opacity=".7"/>`;
        }
        case 'palm':
          return `${sky}<circle cx="70" cy="48" r="12" fill="${x}"/><rect y="74" width="100" height="22" fill="${d}"/>
            <path d="M0 80 q6 -2 12 0 t12 0 t12 0 M40 86 q6 -2 12 0 t12 0" stroke="#fff" stroke-opacity=".6" fill="none" stroke-width="1"/>
            <path d="M0 96 Q50 90 100 96 V140 H0Z" fill="${e}"/>
            <path d="M80 140 Q70 104 82 62" stroke="#5b3b22" stroke-width="3.4" fill="none"/>
            <g fill="#2f6b3a"><path d="M82 62 Q62 50 46 62 Q64 56 82 64Z"/><path d="M82 62 Q90 44 106 46 Q92 52 83 64Z"/><path d="M82 62 Q70 40 58 38 Q72 48 81 63Z"/><path d="M82 62 Q102 58 108 72 Q96 62 82 64Z"/><path d="M82 62 Q66 64 58 78 Q70 66 82 64Z"/></g>
            <line x1="30" y1="104" x2="30" y2="124" stroke="#6b4a32" stroke-width="1.2"/>
            <path d="M16 106 Q30 92 44 106Z" fill="#e2483f"/><path d="M23 106 Q30 93 30 106 M37 106 Q30 93 30 106" fill="#fff6ea"/>
            <ellipse cx="30" cy="126" rx="10" ry="2" fill="#000" opacity=".12"/>`;
        case 'mountain':
          return `${sky}<path d="M-10 112 L38 44 L56 70 L74 52 L112 112Z" fill="${x}"/>
            <path d="M38 44 L30 56 L36 54 L40 59 L45 53 L49 58Z M74 52 L68 61 L73 59 L77 63 L81 60Z" fill="#fff"/>
            <path d="M0 108 Q40 92 100 104 V140 H0Z" fill="${d}"/>
            <g fill="${e}">${[10, 20, 82, 90, 70].map((t, i) => `<path d="M${t} ${116 + (i % 2) * 4} l5 -16 l5 16Z"/>`).join('')}</g>
            <path d="M0 126 Q50 118 100 128 V140 H0Z" fill="${e}" opacity=".7"/>`;
        case 'gate':
          return `${sky}<circle cx="50" cy="72" r="24" fill="${x}"/>
            <path d="M0 98 Q24 82 50 94 T100 88 V140 H0Z" fill="${e}" opacity=".75"/><path d="M0 108 Q30 98 60 106 T100 104 V140 H0Z" fill="${d}"/>
            <g fill="#c8321f"><rect x="31" y="62" width="4" height="54"/><rect x="65" y="62" width="4" height="54"/><path d="M20 58 Q50 53 80 58 L82 65 Q50 60 18 65Z"/><rect x="26" y="71" width="48" height="3.4"/><rect x="48" y="65" width="4" height="7"/></g>
            <path d="M28 116 h10 M62 116 h10" stroke="#3a2420" stroke-width="2"/>`;
        case 'tram':
          return `${sky}
            ${[[0, 46, 18, e], [18, 56, 16, '#f2e3c9'], [34, 40, 20, x === '#f4c12f' ? '#d98b6b' : '#e9b44c'], [54, 52, 18, '#9fc0c9'], [72, 44, 28, e]].map(([bx, by, bw, bc]) => `<rect x="${bx}" y="${by}" width="${bw}" height="${100 - by}" fill="${bc}"/><g fill="#fff" opacity=".55">${[0, 1, 2, 3].map((k) => `<rect x="${bx + 3}" y="${by + 6 + k * 11}" width="4" height="6"/><rect x="${bx + bw - 7}" y="${by + 6 + k * 11}" width="4" height="6"/>`).join('')}</g>`).join('')}
            <rect y="98" width="100" height="42" fill="${d}"/>
            <path d="M0 40 L100 34" stroke="#2a2a2a" stroke-width=".6"/><path d="M50 37 L46 82 M50 37 L56 82" stroke="#2a2a2a" stroke-width=".6"/>
            <rect x="16" y="80" width="68" height="32" rx="5" fill="${x}"/><rect x="16" y="102" width="68" height="4" fill="#fff" opacity=".85"/>
            <g fill="#e9f3f6">${[0, 1, 2, 3, 4].map((k) => `<rect x="${21 + k * 12.4}" y="85" width="9" height="11" rx="1.5"/>`).join('')}</g>
            <circle cx="28" cy="114" r="3" fill="#2a2a2a"/><circle cx="72" cy="114" r="3" fill="#2a2a2a"/>
            <path d="M0 124 L100 120 M0 130 L100 127" stroke="#6b6b6b" stroke-width="1"/>`;
        case 'desert':
          return `${sky}<circle cx="50" cy="84" r="27" fill="${x}"/>
            <path d="M66 96 v-18 a6 6 0 0 1 12 0 v18Z M80 96 v-26 h2 v-4 h2 v4 h2 v26Z" fill="${e}"/>
            <path d="M0 100 Q30 84 60 98 T100 92 V140 H0Z" fill="${d}"/><path d="M0 118 Q40 104 70 118 T100 114 V140 H0Z" fill="${e}"/>
            <path d="M18 104 q4 -6 8 0 q2 -3 4 0 l1 6 M22 104 v6 M28 104 v6" stroke="#4a2a1a" stroke-width="1.2" fill="none"/>`;
        case 'city':
          return `${sky}<rect y="94" width="100" height="46" fill="${d}"/>
            <path d="M0 98 q8 -2 16 0 t16 0 t16 0" stroke="#fff" stroke-opacity=".4" fill="none"/>
            ${[[4, 62, 22, 30], [24, 54, 18, 36], [40, 66, 20, 26], [58, 50, 16, 40], [72, 60, 26, 30]].map(([bx, by, bw, bh], i) => `<rect x="${bx}" y="${by}" width="${bw}" height="${bh + 4}" fill="${e}"/><rect x="${bx + bw - 4}" y="${by}" width="4" height="${bh + 4}" fill="#000" opacity=".08"/><rect x="${bx + bw / 2 - 2.5}" y="${by + bh - 8}" width="5" height="8" fill="${x}" opacity=".85"/>${i % 2 ? `<path d="M${bx + 2} ${by} a${bw / 2 - 2} ${bw / 2 - 2} 0 0 1 ${bw - 4} 0Z" fill="${x}"/>` : ''}`).join('')}
            <path d="M58 50 v-8 M55 45 h6" stroke="${e}" stroke-width="1.2"/>`;
        case 'lake': {
          let s = '';
          for (let i = 0; i < 26; i++) s += `<circle cx="${(i * 37) % 100}" cy="${(i * 53) % 70}" r="${i % 4 ? .45 : .8}" fill="#fff" opacity="${.5 + (i % 3) * .2}"/>`;
          return `${sky}${s}<path d="M-6 64 Q30 30 60 52 T110 36 L110 52 Q70 46 50 66 T-6 78Z" fill="${x}" opacity=".45"/><path d="M0 70 Q40 46 100 58" stroke="${x}" stroke-width="3" opacity=".6" fill="none"/>
            <path d="M0 98 L22 70 L36 86 L56 62 L78 88 L90 78 L100 90 V98Z" fill="${e}"/><rect y="98" width="100" height="42" fill="${d}"/>
            <path d="M0 98 L22 126 L36 110 L56 134 L78 108 L90 118 L100 106 V98Z" fill="${e}" opacity=".45"/>
            <path d="M10 112 h20 M60 120 h24 M30 128 h14" stroke="${x}" stroke-opacity=".4" stroke-width=".8"/>`;
        }
        default: return sky;
      }
    };
    const frontSVG = (c) => {
      const id = `ixpc${uid++}`;
      const fs = Math.min(17, 84 / (0.42 * c.place.length));
      return `<svg class="art" viewBox="0 0 100 140" aria-hidden="true">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.pal[0]}"/><stop offset="1" stop-color="${c.pal[1]}"/></linearGradient><clipPath id="${id}c"><rect x="4" y="4" width="92" height="132"/></clipPath></defs>
        <rect width="100" height="140" fill="#f5eedf"/>
        <g clip-path="url(#${id}c)"><g transform="translate(4 4) scale(.92 .943)">${sceneArt(c, id)}</g></g>
        <text x="10" y="16" font-family="-apple-system, Helvetica, Arial, sans-serif" font-weight="700" font-size="4.6" letter-spacing=".5" fill="${c.tc}" opacity=".9">GREETINGS FROM</text>
        <text x="9" y="${18 + fs}" font-family="'Instrument Serif', Georgia, serif" font-style="italic" font-size="${fs.toFixed(1)}" fill="${c.tc}">${c.place}</text>
        <rect x="4" y="4" width="92" height="132" fill="none" stroke="#000" stroke-opacity=".08"/>
      </svg>`;
    };
    const stampSVG = (c) => {
      const id = `ixpc${uid++}`;
      return `<svg viewBox="0 0 34 42" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.pal[0]}"/><stop offset="1" stop-color="${c.pal[1]}"/></linearGradient></defs>
        <rect width="34" height="42" fill="url(#${id})"/><circle cx="17" cy="22" r="8" fill="${c.pal[2]}"/><rect y="28" width="34" height="14" fill="${c.pal[3]}"/>
        <text x="3" y="8" font-family="ui-monospace, Menlo, monospace" font-size="4.6" font-weight="700" fill="${c.tc}">1.20</text></svg>`;
    };

    stage.innerHTML = `
      <div class="ix-pc">
        <div class="light"></div>
        <div class="status"><span>9:41</span><span class="battery"></span></div>
        <div class="head"><div class="kick">Travel journal / photo memories</div><h3>Postcard Rack</h3><div class="pill" aria-live="polite"></div></div>
        <div class="scene">
          <div class="pole"></div>
          <svg class="base" viewBox="0 0 220 100" aria-hidden="true"><g stroke="#cdd0d4" stroke-width="2.2" stroke-linecap="round" fill="none">
            <path d="M110 40 L20 82 M110 40 L200 82 M110 40 L72 92 M110 40 L148 92"/><ellipse cx="110" cy="40" rx="30" ry="6"/></g>
            <g fill="#7a7d82"><ellipse cx="20" cy="83" rx="6" ry="2.4"/><ellipse cx="200" cy="83" rx="6" ry="2.4"/><ellipse cx="72" cy="93" rx="6" ry="2.4"/><ellipse cx="148" cy="93" rx="6" ry="2.4"/></g>
            <ellipse cx="110" cy="96" rx="96" ry="6" fill="#6b3a1c" opacity=".14"/></svg>
        </div>
        <div class="pick" role="button" tabindex="-1" aria-label="Flip postcard"><div class="pf"></div><div class="pb"></div></div>
        <div class="tip">tap to flip</div>
        <button class="putback" type="button">Put back</button>
      </div>`;

    const root = stage.querySelector('.ix-pc');
    const scene = root.querySelector('.scene');
    const pill = root.querySelector('.pill');
    const pick = root.querySelector('.pick');
    const putback = root.querySelector('.putback');

    // ---------- build the rack: 4 sides × 3 tiers × 2 pockets ----------
    const R = 72;
    const TIERS = [144, 264, 384];
    const layers = []; // { el, face, z, extra }
    for (let f = 0; f < 4; f++) {
      const frame = document.createElement('div');
      frame.className = 'frame';
      Object.assign(frame.style, { width: `${2 * R}px`, marginLeft: `${-R}px` });
      scene.append(frame);
      layers.push({ el: frame, face: f, z: R + 5, bias: 2 });
      TIERS.forEach((top, t) => {
        [-37, 37].forEach((x, s) => {
          const i = f * 6 + t * 2 + s;
          const c = CARDS[i];
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'card';
          b.style.top = `${top}px`;
          b.setAttribute('aria-label', `Postcard from ${c.place}`);
          b.innerHTML = frontSVG(c);
          b.addEventListener('click', (e) => { if (e.detail === 0) pullOut(i); }); // keyboard; pointer taps are handled on the scene
          b.addEventListener('focus', () => { if (!dragging) spinTo(-f * 90); });
          scene.append(b);
          c.el = b;
          layers.push({ el: b, face: f, z: R - 3, x, tilt: -7 + (s ? 1.5 : -1) + t * .6, bias: 0 });
        });
        const p = document.createElement('div');
        p.className = 'pocket';
        Object.assign(p.style, { top: `${top + 62}px`, width: `${2 * R - 4}px`, marginLeft: `${-(R - 2)}px` });
        scene.append(p);
        layers.push({ el: p, face: f, z: R + 5, bias: 1 });
      });
    }

    let angle = 0, vel = 0, target = null, dragging = false, raf = 0;
    const side = () => ((Math.round(-angle / 90) % 4) + 4) % 4;
    const syncPill = () => {
      if (root.classList.contains('out')) return;
      pill.textContent = `${CARDS.length} postcards · side ${side() + 1} of 4`;
    };
    const pose = () => {
      layers.forEach((l) => {
        const th = angle + l.face * 90;
        const cos = Math.cos((th * Math.PI) / 180);
        l.el.style.transform = `rotateY(${th}deg) translateZ(${l.z}px)${l.x ? ` translateX(${l.x}px)` : ''}${l.tilt ? ` rotateX(${l.tilt}deg)` : ''}`;
        l.el.style.zIndex = 100 + Math.round(cos * 60) * 3 + l.bias;
        if (l.bias === 0) l.el.tabIndex = cos > .7 ? 0 : -1;
      });
      syncPill();
    };

    const tick = () => {
      raf = 0;
      if (!dragging) {
        if (target === null && Math.abs(vel) < .35) target = Math.round(angle / 90) * 90;
        if (target === null) { angle += vel; vel *= .95; }
        else {
          vel = vel * .78 + (target - angle) * .06;
          angle += vel;
          if (Math.abs(target - angle) < .05 && Math.abs(vel) < .05) { angle = target; vel = 0; pose(); return; }
        }
      }
      pose();
      if (!dragging) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const spinTo = (a) => {
      // take the short way round to the requested side
      target = angle + ((((a - angle) % 360) + 540) % 360) - 180;
      kick();
    };

    // ---------- drag to spin; a tap without movement pulls a card ----------
    let sx = 0, lx = 0, lt = 0, moved = false, downCard = null;
    const scale = () => root.getBoundingClientRect().width / root.offsetWidth || 1;
    scene.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      dragging = true; moved = false; target = null; vel = 0;
      sx = lx = e.clientX; lt = performance.now();
      downCard = e.target.closest('.card');
      scene.setPointerCapture(e.pointerId);
    });
    scene.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      if (Math.abs(e.clientX - sx) > 5 * scale()) { moved = true; scene.classList.add('drag'); }
      if (!moved) return;
      const now = performance.now();
      const d = (e.clientX - lx) / scale() * .55;
      angle += d;
      vel = vel * .5 + (d / Math.max(8, now - lt)) * 16 * .5;
      lx = e.clientX; lt = now;
      pose();
    });
    const up = () => {
      if (!dragging) return;
      dragging = false;
      scene.classList.remove('drag');
      if (!moved && downCard) {
        const i = CARDS.findIndex((c) => c.el === downCard);
        if (i >= 0) pullOut(i);
        return;
      }
      if (performance.now() - lt > 90) vel = 0;
      kick();
    };
    scene.addEventListener('pointerup', up);
    scene.addEventListener('pointercancel', up);
    scene.addEventListener('lostpointercapture', up);

    // ---------- pull out, flip, put back ----------
    let cur = -1, busy = false;
    const PW = 180, PL = 70, PT = 150;
    const fromCard = (c) => {
      const k = scale();
      const r0 = root.getBoundingClientRect(), r = c.el.getBoundingClientRect();
      const s = r.width / k / PW;
      return `translate(${(r.left - r0.left) / k - PL}px, ${(r.top - r0.top) / k - PT}px) scale(${s})`;
    };
    const run = (frames, dur) => {
      if (!dur || !pick.animate) return Promise.resolve();
      return pick.animate(frames, { duration: dur, easing: 'cubic-bezier(.3,.85,.25,1)' }).finished.catch(() => {});
    };
    const pullOut = async (i, dur = 560) => {
      if (busy || cur >= 0) return;
      busy = true; cur = i;
      const c = CARDS[i];
      vel = 0; target = Math.round(angle / 90) * 90; kick();
      pick.classList.remove('flip');
      pick.querySelector('.pf').innerHTML = frontSVG(c);
      pick.querySelector('.pb').innerHTML = `
        <div class="pc-h">POST CARD</div>
        <svg class="mark" viewBox="0 0 56 44" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><circle cx="20" cy="22" r="15"/><circle cx="20" cy="22" r="11"/><path d="M34 14 q5 -3 10 0 t10 0 M34 20 q5 -3 10 0 t10 0 M34 26 q5 -3 10 0 t10 0 M34 32 q5 -3 10 0 t10 0"/></g>
          <text x="20" y="20" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="4.2" fill="currentColor">${c.place.toUpperCase().slice(0, 10)}</text><text x="20" y="27" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="4.2" fill="currentColor">${12 + (i % 17)} JUN</text></svg>
        <div class="stamp">${stampSVG(c)}</div>
        <div class="addr"><div>Noor &amp; Ellis</div><div>14 Linden Row</div><div>Bristol BS6 5QA</div></div>
        <hr>
        <div class="msg"></div>
        <div class="sig"></div>`;
      pick.querySelector('.msg').textContent = c.msg;
      pick.querySelector('.sig').textContent = `— love, ${c.sig}`;
      pill.textContent = `${c.place}, ${c.country}`;
      const from = fromCard(c);
      c.el.classList.add('gone');
      root.classList.add('out');
      pick.setAttribute('aria-label', `Postcard from ${c.place}. Flip it over`);
      pick.tabIndex = 0;
      await run([{ transform: from }, { transform: 'none' }], dur);
      busy = false;
      pick.focus({ preventScroll: true });
    };
    const flip = () => {
      if (busy || cur < 0) return;
      const on = pick.classList.toggle('flip');
      const c = CARDS[cur];
      pill.textContent = `${c.place}, ${c.country}${on ? ' · the back' : ''}`;
      root.querySelector('.tip').textContent = on ? 'tap to turn back' : 'tap to flip';
    };
    const putBack = async (dur = 480) => {
      if (busy || cur < 0) return;
      busy = true;
      const c = CARDS[cur];
      pick.classList.remove('flip');
      root.classList.remove('out');
      pick.style.visibility = 'visible';
      await run([{ transform: 'none' }, { transform: fromCard(c) }], dur);
      pick.style.visibility = '';
      pick.tabIndex = -1;
      c.el.classList.remove('gone');
      cur = -1; busy = false;
      root.querySelector('.tip').textContent = 'tap to flip';
      syncPill();
      c.el.focus({ preventScroll: true });
    };
    pick.addEventListener('click', flip);
    putback.addEventListener('click', () => putBack());
    root.addEventListener('keydown', (e) => {
      if (cur >= 0 && e.key === 'Escape') { e.preventDefault(); putBack(); }
      else if (cur >= 0 && e.target === pick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); flip(); }
      else if (cur < 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); spinTo((target ?? angle) + (e.key === 'ArrowLeft' ? -90 : 90)); }
    });

    pose();
    // test hooks
    root.ixAngle = (a) => { angle = a; target = a; vel = 0; pose(); };
    root.ixPull = (i) => pullOut(i, 0);
    root.ixFlip = flip;
  },
});
