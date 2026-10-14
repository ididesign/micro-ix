MicroIX.register({
  id: 'pool-import',
  title: 'Underwater import',
  description: 'Screenshots splash into a sunlit pool. They sink and wobble under moving light while a rubber duck rides the ripples. Tap the water to drop another.',
  tags: ['onboarding', 'loading', 'ambient'],
  source: { label: 'Pool (iOS) via Mobbin ↗', url: 'https://mobbin.com/screens/4c61931e-2e3d-4a8c-bd50-9b4720feeaa1' },
  layout: { device: { width: 320, height: 660 } },
  css: `
.ix-pool { position: relative; width: 100%; height: 100%; overflow: hidden; isolation: isolate; background: linear-gradient(180deg, #3d9bff 0%, #2a7fe8 55%, #4aa8ff 100%); font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; user-select: none; -webkit-user-select: none; }
.ix-pool > svg.defs { position: absolute; width: 0; height: 0; }

/* Status bar + headline */
.ix-pool .status { position: absolute; z-index: 6; top: 16px; left: 32px; right: 28px; display: flex; justify-content: space-between; align-items: center; color: #fff; font-weight: 600; font-size: 15px; pointer-events: none; }
.ix-pool .battery { width: 25px; height: 12px; border-radius: 4px; background: #fff; }
.ix-pool .title { position: absolute; z-index: 6; top: 64px; left: 20px; right: 20px; margin: 0; color: #fff; font: 400 42px/.95 "Instrument Serif", "New York", Georgia, serif; letter-spacing: -.02em; text-align: center; text-shadow: 0 2px 12px rgba(0,60,160,.25); pointer-events: none; }
.ix-pool .dots i { font-style: normal; animation: ix-pool-dot 1.4s infinite; }
.ix-pool .dots i:nth-child(2) { animation-delay: .2s; }
.ix-pool .dots i:nth-child(3) { animation-delay: .4s; }
@keyframes ix-pool-dot { 0%, 60%, 100% { opacity: .25; } 30% { opacity: 1; } }

/* Screenshots: the wrapper handles drop + sinking, the inner card bobs + warps */
.ix-pool .tank { position: absolute; z-index: 1; inset: 170px 0 100px; display: grid; place-items: center; perspective: 900px; }
.ix-pool .shot-wrap { grid-area: 1 / 1; transition: translate 1.4s var(--ease-out), scale 1.4s var(--ease-out), opacity 1.4s var(--ease-out); }
.ix-pool .shot-wrap.falling { animation: ix-pool-drop 1.1s cubic-bezier(.2,.7,.2,1) backwards; }
@keyframes ix-pool-drop {
  0% { scale: 1.8; rotate: 10deg; opacity: 0; translate: 0 -30px; }
  20% { opacity: 1; }
}
.ix-pool .shot-wrap[data-depth="1"] { translate: 0 22px; scale: .86; opacity: .75; }
.ix-pool .shot-wrap[data-depth="2"] { translate: 0 40px; scale: .74; opacity: .35; }
.ix-pool .shot-wrap[data-depth="3"] { translate: 0 54px; scale: .64; opacity: 0; }

.ix-pool .shot { position: relative; display: flex; flex-direction: column; gap: 8px; width: 188px; height: 330px; padding: 16px 14px; overflow: hidden; border-radius: 26px; background: #f7faff; box-shadow: 0 24px 40px -12px rgba(0,40,120,.5); transform: rotateX(16deg) rotateZ(var(--z)); filter: url(#ix-pool-wobble); animation: ix-pool-bob 6s ease-in-out infinite; }
@keyframes ix-pool-bob {
  0%, 100% { transform: rotateX(16deg) rotateZ(var(--z)) translateY(0); }
  50% { transform: rotateX(8deg) rotateZ(calc(var(--z) * .4)) translateY(-8px); }
}
/* Water tint over the card; a deeper tint fades in as it sinks */
.ix-pool .shot::before, .ix-pool .shot::after { content: ""; position: absolute; inset: 0; pointer-events: none; }
.ix-pool .shot::before { z-index: 1; background: linear-gradient(180deg, rgba(90,180,255,.06), rgba(30,120,240,.28)); }
.ix-pool .shot::after { z-index: 1; background: rgba(30,120,240,.55); opacity: 0; transition: opacity 1.4s; }
.ix-pool .shot-wrap[data-depth] .shot::after { opacity: 1; }

/* Fake screenshot content */
.ix-pool .sb { display: flex; justify-content: space-between; margin-bottom: 6px; }
.ix-pool .sb i { width: 22px; height: 5px; border-radius: 3px; background: #1d2533; }
.ix-pool .ln { flex: none; height: 7px; border-radius: 4px; background: #c9d6e8; }
.ix-pool .ln.dark { height: 9px; background: #2a3344; }
.ix-pool .w40 { width: 40%; } .ix-pool .w50 { width: 50%; } .ix-pool .w60 { width: 60%; }
.ix-pool .w70 { width: 70%; } .ix-pool .w80 { width: 80%; } .ix-pool .w90 { width: 90%; }
.ix-pool .row { display: flex; align-items: center; gap: 10px; }
.ix-pool .row > div { flex: 1; display: grid; gap: 6px; }
.ix-pool .icon { flex: none; width: 52px; height: 52px; border-radius: 13px; background: linear-gradient(135deg, hsl(var(--h) 80% 62%), hsl(calc(var(--h) + 40) 80% 48%)); }
.ix-pool .pill { width: 48px; height: 16px; border-radius: 999px; background: hsl(var(--h) 85% 55%); }
.ix-pool .stats { display: flex; justify-content: space-between; padding: 8px 0; border-block: 1px solid #e3eaf4; }
.ix-pool .stats span { width: 34px; height: 22px; border-radius: 5px; background: #e3eaf4; }
.ix-pool .img { flex: 1; min-height: 60px; border-radius: 14px; background: linear-gradient(160deg, hsl(var(--h) 85% 72%), hsl(calc(var(--h) + 60) 80% 55%)); }
.ix-pool .bubble { flex: none; height: 22px; border-radius: 12px; background: #e3eaf4; }
.ix-pool .bubble.me { align-self: flex-end; background: hsl(var(--h) 85% 58%); }
.ix-pool .li { display: flex; align-items: center; gap: 8px; padding: 7px 0; border-bottom: 1px solid #e3eaf4; }
.ix-pool .li b { flex: none; width: 22px; height: 22px; border-radius: 7px; background: hsl(var(--h) 80% 62%); }

/* Moving light lines over everything underwater */
.ix-pool .caustics { position: absolute; z-index: 2; inset: 0; width: 100%; height: 100%; opacity: .5; pointer-events: none; }

/* Splash rings */
.ix-pool .fx { position: absolute; z-index: 3; inset: 0; pointer-events: none; }
.ix-pool .ring { position: absolute; left: 50%; top: 370px; width: 240px; height: 240px; margin: -120px; border: 2px solid rgba(255,255,255,.85); border-radius: 50%; filter: url(#ix-pool-wobble); animation: ix-pool-ring 1.3s var(--ease-out) both; }
@keyframes ix-pool-ring {
  from { transform: scale(.35, .3); opacity: 1; }
  to { transform: scale(1.6, 1.35); opacity: 0; }
}
.ix-pool .flash { position: absolute; left: 50%; top: 370px; width: 260px; height: 260px; margin: -130px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.55), transparent 65%); animation: ix-pool-flash .7s ease-out both; }
@keyframes ix-pool-flash { from { transform: scale(.4); opacity: 1; } to { transform: scale(1.2); opacity: 0; } }

/* Rubber duck */
.ix-pool .duck-drift { position: absolute; z-index: 4; left: calc(50% + 8px); top: 352px; pointer-events: none; animation: ix-pool-drift 11s ease-in-out infinite alternate; }
@keyframes ix-pool-drift { to { translate: -36px 14px; } }
.ix-pool .duck { display: block; width: 72px; height: 72px; filter: drop-shadow(0 10px 8px rgba(0,50,140,.35)); animation: ix-pool-duck 3.2s ease-in-out infinite; }
@keyframes ix-pool-duck {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-5px) rotate(6deg); }
}

/* Tap target + glass button */
.ix-pool .drop-zone { position: absolute; z-index: 5; inset: 0; padding: 0; border: 0; background: none; cursor: pointer; }
.ix-pool .drop-zone:focus-visible { outline: 3px solid #fff; outline-offset: -10px; border-radius: 40px; }
.ix-pool .continue { position: absolute; z-index: 7; left: 50%; width: min(calc(100% - 40px), 380px); translate: -50% 0; bottom: 30px; height: 56px; border: 1px solid rgba(255,255,255,.45); border-radius: 999px; background: rgba(255,255,255,.18); -webkit-backdrop-filter: blur(12px) saturate(1.4); backdrop-filter: blur(12px) saturate(1.4); box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 8px 24px -10px rgba(0,50,140,.4); color: #fff; font: 600 17px -apple-system, ui-sans-serif, system-ui, sans-serif; cursor: pointer; transition: transform .2s var(--ease-out), background .2s; }
.ix-pool .continue:hover { background: rgba(255,255,255,.26); }
.ix-pool .continue:active { transform: scale(.97); }

@media (prefers-reduced-motion: reduce) {
  .ix-pool .shot, .ix-pool .duck, .ix-pool .duck-drift, .ix-pool .dots i { animation: none; }
}
`,
  mount(stage) {
    const SHOTS = [
      `<div class="sb"><i></i><i></i></div>
       <div class="row"><div class="icon"></div><div><div class="ln dark w90"></div><div class="ln w60"></div><div class="pill"></div></div></div>
       <div class="stats"><span></span><span></span><span></span></div>
       <div class="ln dark w50"></div><div class="ln w90"></div><div class="ln w70"></div>
       <div class="img"></div>`,
      `<div class="sb"><i></i><i></i></div>
       <div class="img"></div>
       <div class="ln dark w70"></div><div class="ln w90"></div><div class="ln w80"></div><div class="ln w40"></div>`,
      `<div class="sb"><i></i><i></i></div>
       <div class="ln dark w40"></div>
       <div class="bubble w60"></div><div class="bubble me w70"></div><div class="bubble w80"></div>
       <div class="bubble me w40"></div><div class="bubble w70"></div><div class="bubble me w60"></div>`,
      `<div class="sb"><i></i><i></i></div>
       <div class="ln dark w60"></div>
       ${'<div class="li"><b></b><div class="ln w70"></div></div>'.repeat(6)}`,
    ];
    const HUES = [210, 340, 28, 150];

    // Turbulence → thin ridges → white lines with alpha = light pattern.
    const ridges = '0 0 0 0 0 0 0 0 .9 0 0 0 .9 0 0 0 0 0 0 0 0';

    stage.innerHTML = `
      <div class="ix-pool">
        <svg class="defs" aria-hidden="true">
          <filter id="ix-pool-wobble" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="t">
              <animate attributeName="baseFrequency" dur="9s" values="0.012 0.02;0.017 0.013;0.012 0.02" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="t" scale="14" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="ix-pool-caustics" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.016 0.024" numOctaves="2" seed="2">
              <animate attributeName="baseFrequency" dur="14s" values="0.016 0.024;0.021 0.018;0.016 0.024" repeatCount="indefinite"/>
            </feTurbulence>
            <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"/>
            <feComponentTransfer>
              <feFuncR type="table" tableValues="${ridges}"/>
              <feFuncG type="table" tableValues="${ridges}"/>
              <feFuncB type="table" tableValues="${ridges}"/>
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="1.1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0"/>
          </filter>
        </svg>

        <div class="status"><span>9:41</span><span class="battery"></span></div>
        <h3 class="title">Importing your screenshots<span class="dots"><i>.</i><i>.</i><i>.</i></span></h3>

        <div class="tank"></div>
        <svg class="caustics" aria-hidden="true"><rect width="100%" height="100%" filter="url(#ix-pool-caustics)"/></svg>
        <div class="fx"></div>

        <div class="duck-drift">
          <svg class="duck" viewBox="0 0 64 64" aria-hidden="true">
            <ellipse cx="35" cy="43" rx="24" ry="14" fill="#ffc21a"/>
            <path d="M54 36c6-6 8-1 5 6z" fill="#ffc21a"/>
            <circle cx="24" cy="25" r="13" fill="#ffc21a"/>
            <path d="M13 24Q4 23 2 28q6 4 12 1z" fill="#ff7a1a"/>
            <circle cx="20" cy="21.5" r="2" fill="#1a1a1a"/>
            <ellipse cx="39" cy="41" rx="11" ry="6.5" fill="#f2a900" transform="rotate(-14 39 41)"/>
            <ellipse cx="29" cy="17" rx="4.5" ry="2.5" fill="#fff" opacity=".55"/>
          </svg>
        </div>

        <button class="drop-zone" aria-label="Drop a screenshot into the pool"></button>
        <button class="continue">Continue</button>
      </div>`;

    const pool = stage.querySelector('.ix-pool');
    const tank = pool.querySelector('.tank');
    const fx = pool.querySelector('.fx');
    const duck = pool.querySelector('.duck-drift');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let n = 0;
    let timer;

    const splash = () => {
      const flash = document.createElement('span');
      flash.className = 'flash';
      flash.addEventListener('animationend', () => flash.remove());
      fx.append(flash);
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('span');
        ring.className = 'ring';
        ring.style.animationDelay = `${i * 150}ms`;
        ring.addEventListener('animationend', () => ring.remove());
        fx.append(ring);
      }
      // The duck gets rocked by the wave (composes with its idle bob).
      duck.animate(
        [{ rotate: '0deg', scale: 1 }, { rotate: '-16deg', scale: 1.06 }, { rotate: '11deg' }, { rotate: '-5deg' }, { rotate: '0deg', scale: 1 }],
        { duration: 1500, easing: 'ease-out' }
      );
    };

    const drop = () => {
      // Push the existing shots one level deeper; the deepest fades out and is removed.
      [...tank.children].reverse().forEach((el, i) => {
        el.dataset.depth = i + 1;
        if (i >= 2) setTimeout(() => el.remove(), 1500);
      });

      const wrap = document.createElement('div');
      wrap.className = 'shot-wrap falling';
      wrap.style.setProperty('--z', n % 2 ? '4deg' : '-5deg');
      wrap.style.setProperty('--h', HUES[n % HUES.length]);
      wrap.innerHTML = `<div class="shot">${SHOTS[n % SHOTS.length]}</div>`;
      tank.append(wrap);
      n++;
      setTimeout(splash, 260);
    };

    // Auto-drop so the demo stays alive; a tap drops one now and resets the clock.
    const schedule = () => {
      clearTimeout(timer);
      if (!reduced) timer = setTimeout(() => { drop(); schedule(); }, 4000);
    };

    pool.querySelector('.drop-zone').addEventListener('click', () => { drop(); schedule(); });
    drop();
    schedule();
  },
});
