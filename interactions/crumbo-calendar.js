MicroIX.register({
  id: 'crumbo-calendar',
  title: 'Sticker food calendar',
  description: 'A pink splash fades into a month of food stickers. Tap the shutter, snap a sausage roll, and the cut-out sticker pops off the photo and flies into today’s empty square. Tap the square and a sheet slides up over the blurred calendar with how often you eat it.',
  tags: ['camera', 'calendar', 'transition'],
  source: { label: '@louis_currie on X ↗', url: 'https://x.com/louis_currie/status/2117912477724008659' },
  layout: { device: { width: 320, height: 660 } },
  css: `
.ix-crumbo { position: relative; width: 100%; height: 100%; overflow: hidden; isolation: isolate; background: #f3f2fa; font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; user-select: none; -webkit-user-select: none; color: #1b1f4a; }
.ix-crumbo button { all: unset; cursor: pointer; }
.ix-crumbo .status { position: absolute; z-index: 20; top: 16px; left: 32px; right: 28px; display: flex; justify-content: space-between; font-size: 15px; font-weight: 600; color: #fff; pointer-events: none; }
.ix-crumbo .status i { width: 25px; height: 12px; border-radius: 4px; background: currentColor; opacity: .85; }

/* Splash */
.ix-crumbo .splash { position: absolute; z-index: 15; inset: 0; display: grid; place-items: center; background: linear-gradient(#ff4467, #ff3a5e); transition: opacity .5s .9s; }
.ix-crumbo .logo { font: 900 38px/1 ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif; letter-spacing: .5px; text-transform: uppercase; color: #fff; text-shadow: 0 0 0 #c92a4a, 2px 2px 0 #c92a4a, -2px 2px 0 #c92a4a, 2px -2px 0 #c92a4a, -2px -2px 0 #c92a4a, 0 4px 0 #c92a4a; animation: ix-crumbo-logo .8s var(--ease-spring, cubic-bezier(.3,1.5,.5,1)) both; }
@keyframes ix-crumbo-logo { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }
.ix-crumbo.ready .splash { opacity: 0; pointer-events: none; }

/* Calendar */
.ix-crumbo .cal { position: absolute; inset: 0; transition: filter .45s, scale .45s; transform-origin: 50% 40%; }
.ix-crumbo .awning { position: relative; height: 74px; background: #ff3a5e; filter: drop-shadow(0 3px 0 rgba(180,30,60,.25)); }
.ix-crumbo .awning::after { content: ''; position: absolute; left: 0; right: 0; bottom: -13px; height: 13px; background: radial-gradient(circle at 50% 0, #ff3a5e 12.5px, transparent 13.5px) 0 0 / 26px 13px repeat-x; }
.ix-crumbo .awning b { position: absolute; top: 40px; left: 0; right: 0; text-align: center; font: 900 15px/1 ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif; letter-spacing: .5px; color: #fff; text-transform: uppercase; }
.ix-crumbo .month { margin: 26px 0 8px; text-align: center; font: 700 22px/1 "Marker Felt", "Bradley Hand", ui-rounded, system-ui, sans-serif; color: #231f8f; }
.ix-crumbo .dow, .ix-crumbo .grid { display: grid; grid-template-columns: repeat(7, 1fr); margin: 0 10px; }
.ix-crumbo .dow span { text-align: center; font-size: 9px; font-weight: 700; color: #6f72b8; padding: 6px 0; }
.ix-crumbo .grid { border-top: 1px solid #cfd0ea; border-left: 1px solid #cfd0ea; background: #fbfbff; }
.ix-crumbo .cell { position: relative; aspect-ratio: 1 / 1.3; border-right: 1px solid #cfd0ea; border-bottom: 1px solid #cfd0ea; display: grid; place-items: center; font-size: 22px; }
.ix-crumbo .cell small { position: absolute; top: 2px; left: 3px; font-size: 7px; font-weight: 700; color: #8a8dc9; }
.ix-crumbo .cell.pop > span { animation: ix-crumbo-pop .5s cubic-bezier(.3,1.7,.5,1) both; }
@keyframes ix-crumbo-pop { from { scale: .2; opacity: 0; } to { scale: 1; opacity: 1; } }
.ix-crumbo .cell.today { cursor: pointer; }
.ix-crumbo .cell.today:not(.filled) { background: rgba(255,58,94,.08); }
.ix-crumbo .cell.today:not(.filled)::after { content: ''; position: absolute; inset: 4px; border-radius: 6px; border: 1.5px dashed #ff3a5e; animation: ix-crumbo-pulse 1.4s ease-in-out infinite; }
@keyframes ix-crumbo-pulse { 50% { opacity: .25; } }
.ix-crumbo .note { margin: 10px 14px 0; font: 700 12px/1 "Marker Felt", "Bradley Hand", ui-rounded, system-ui, sans-serif; color: #8a8dc9; letter-spacing: .5px; }
.ix-crumbo .dock { position: absolute; left: 0; right: 0; bottom: 0; height: 120px; display: flex; align-items: center; justify-content: center; background: linear-gradient(rgba(243,242,250,0), #e9e8f6 55%); }
.ix-crumbo .shutter { width: 58px; height: 58px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 4px rgba(35,31,143,.18), 0 6px 14px rgba(35,31,143,.2); transition: scale .2s; }
.ix-crumbo .shutter:active { scale: .9; }
.ix-crumbo .shutter-hint { position: absolute; bottom: 12px; font-size: 10px; font-weight: 600; color: #6f72b8; }

/* Sausage roll sprite, sized by font-size */
.ix-crumbo .roll { position: relative; display: block; width: 2.4em; height: 1em; border-radius: .5em; rotate: -38deg; background: linear-gradient(#efb55f, #c7792a 70%, #a85f1c); box-shadow: inset 0 .08em .1em rgba(255,255,255,.45), inset 0 -.1em .12em rgba(90,40,5,.35); overflow: hidden; }
.ix-crumbo .roll::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(115deg, transparent 0 .22em, rgba(110,50,8,.38) .22em .34em); }
.ix-crumbo .sticker { filter: drop-shadow(.05em 0 0 #fff) drop-shadow(-.05em 0 0 #fff) drop-shadow(0 .05em 0 #fff) drop-shadow(0 -.05em 0 #fff) drop-shadow(0 .08em .12em rgba(0,0,0,.3)); }

/* Camera */
.ix-crumbo .cam { position: absolute; z-index: 8; inset: 0; background: radial-gradient(70% 45% at 50% 62%, #e9e5df 0 38%, #8c8a86 39% 58%, #2a2826 85%); opacity: 0; pointer-events: none; transition: opacity .3s; }
.ix-crumbo.cam-on .cam { opacity: 1; pointer-events: auto; }
.ix-crumbo .cam .food { position: absolute; left: 50%; top: 56%; translate: -50% -50%; font-size: 62px; scale: 1; transition: scale .3s; }
.ix-crumbo .cam .close { position: absolute; top: 52px; left: 14px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,.7); display: grid; place-items: center; font-size: 16px; color: #333; }
.ix-crumbo .cam .shutter { position: absolute; left: 50%; bottom: 36px; translate: -50% 0; background: transparent; box-shadow: 0 0 0 4px #fff; }
.ix-crumbo .cam .shutter::after { content: ''; position: absolute; inset: 6px; border-radius: 50%; background: #fff; }
.ix-crumbo .flash { position: absolute; z-index: 12; inset: 0; background: #fff; opacity: 0; pointer-events: none; }
.ix-crumbo .flash.go { animation: ix-crumbo-flash .45s ease-out; }
@keyframes ix-crumbo-flash { 0% { opacity: .95; } 100% { opacity: 0; } }
.ix-crumbo .fly { transform-origin: 0 0; position: absolute; z-index: 13; left: 0; top: 0; font-size: 62px; pointer-events: none; display: none; }

/* Detail sheet */
.ix-crumbo.sheet-on .cal { filter: blur(7px) saturate(.8); scale: 1.03; }
.ix-crumbo .scrim { position: absolute; z-index: 9; inset: 0; background: rgba(240,240,250,.35); opacity: 0; pointer-events: none; transition: opacity .35s; }
.ix-crumbo.sheet-on .scrim { opacity: 1; pointer-events: auto; }
.ix-crumbo .sheet { position: absolute; z-index: 10; left: 8px; right: 8px; bottom: 8px; padding: 22px 18px 18px; border-radius: 30px; background: #fff; box-shadow: 0 -10px 40px rgba(30,30,90,.18); text-align: center; translate: 0 110%; transition: translate .5s cubic-bezier(.2,.9,.25,1); }
.ix-crumbo.sheet-on .sheet { translate: 0 0; }
.ix-crumbo .sheet .grab { position: absolute; top: 8px; left: 50%; translate: -50% 0; width: 34px; height: 4px; border-radius: 2px; background: #d6d6e4; }
.ix-crumbo .sheet .big { display: grid; place-items: center; height: 84px; font-size: 44px; }
.ix-crumbo .sheet h4 { margin: 6px 0 2px; font-size: 20px; font-weight: 700; }
.ix-crumbo .sheet p { margin: 0 0 14px; font-size: 11px; color: #9a9ab5; }
.ix-crumbo .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.ix-crumbo .stats div { padding: 12px 0 9px; border-radius: 12px; background: #f0f0f7; }
.ix-crumbo .stats b { display: block; font-size: 17px; }
.ix-crumbo .stats span { font-size: 9px; color: #9a9ab5; }
`,
  mount(stage) {
    const FOODS = ['🥐', '🍔', '🍕', '🥗', '🍜', '🌮', '🍩', '🥪', '🍣', '🍟', '🥞', '🍝'];
    const roll = (cls = '') => `<i class="roll sticker ${cls}"></i>`;
    // Oct 2026 starts on a Thursday and, with weeks starting Monday, ends on Saturday the 31st
    let cells = '<span class="cell"></span>'.repeat(3);
    for (let d = 1; d <= 31; d++) {
      const f = d === 31 ? '' : `<span>${FOODS[(d * 7 + (d >> 1)) % FOODS.length]}</span>`;
      cells += `<div class="cell${d === 31 ? ' today' : ''}"><small>${d}</small>${f}</div>`;
    }
    stage.innerHTML = `
      <div class="ix-crumbo">
        <div class="status"><span>11:06</span><i></i></div>
        <div class="cal">
          <div class="awning"><b>Nibbles</b></div>
          <div class="month">October</div>
          <div class="dow">${'MTWTFSS'.split('').map((c) => `<span>${c}</span>`).join('')}</div>
          <div class="grid">${cells}</div>
          <div class="note">no burgers</div>
          <div class="dock"><button class="shutter open-cam" aria-label="Open camera"></button><span class="shutter-hint">Tap to add today’s bite</span></div>
        </div>
        <div class="cam">
          <button class="close" aria-label="Close">✕</button>
          <div class="food" style="font-size:56px">${roll()}</div>
          <button class="shutter snap" aria-label="Take photo"></button>
        </div>
        <div class="flash"></div>
        <div class="fly">${roll()}</div>
        <div class="scrim"></div>
        <div class="sheet">
          <div class="grab"></div>
          <div class="big">${roll()}</div>
          <h4>Sausage roll</h4><p>Salty</p>
          <div class="stats"><div><b>1</b><span>/ week</span></div><div><b>2</b><span>/ month</span></div><div><b>3</b><span>/ year</span></div></div>
        </div>
        <div class="splash"><div class="logo">Nibbles</div></div>
      </div>`;

    const $ = (s) => stage.querySelector(s);
    const root = $('.ix-crumbo'), fly = $('.fly'), flash = $('.flash');
    const today = $('.cell.today');
    let busy = false;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    later(() => root.classList.add('ready'), 700);

    $('.open-cam').addEventListener('click', () => { if (!busy) root.classList.add('cam-on'); });
    $('.close').addEventListener('click', () => root.classList.remove('cam-on'));

    $('.snap').addEventListener('click', () => {
      if (busy) return;
      busy = true;
      // Scale-safe: the stage may be shrunk by a transform, so convert screen px back to local px
      const rr = root.getBoundingClientRect();
      const k = rr.width / root.offsetWidth || 1;
      const from = $('.cam .food').getBoundingClientRect();
      const fx = (from.left - rr.left) / k + from.width / k / 2, fy = (from.top - rr.top) / k + from.height / k / 2;
      flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
      today.classList.remove('filled');
      today.querySelector('span')?.remove();

      fly.style.display = 'block';
      fly.style.fontSize = '56px';
      fly.firstElementChild.style.translate = '-50% -50%';
      later(() => {
        root.classList.remove('cam-on');
        const to = today.getBoundingClientRect();
        const tx = (to.left - rr.left) / k + to.width / k / 2, ty = (to.top - rr.top) / k + to.height / k / 2;
        const a = fly.animate([
          { transform: `translate(${fx}px, ${fy}px) scale(1)` },
          { transform: `translate(${fx}px, ${fy - 40}px) scale(1.25)`, offset: .3 },
          { transform: `translate(${tx}px, ${ty}px) scale(.22)` },
        ], { duration: 900, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
        later(() => {
          fly.style.display = 'none';
          a.cancel();
          today.classList.add('filled', 'pop');
          const s = document.createElement('span');
          s.style.fontSize = '12px';
          s.innerHTML = roll();
          today.append(s);
          busy = false;
        }, 920);
      }, 420);
    });

    today.addEventListener('click', () => { if (today.classList.contains('filled')) root.classList.add('sheet-on'); });
    $('.scrim').addEventListener('click', () => root.classList.remove('sheet-on'));

    return () => timers.forEach(clearTimeout);
  },
});
