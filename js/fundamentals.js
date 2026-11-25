// Tabs, plus the Fundamentals tab: short motion guides, each with a live demo that
// replays while it is on screen. Demos use the Web Animations API so every number in
// the copy is the number actually running.
(() => {
  // ---------- tabs ----------
  const tabs = [...document.querySelectorAll('.tab')];
  const pill = document.querySelector('.tab-pill');
  const panels = { inspo: document.getElementById('panel-inspo'), fundamentals: document.getElementById('panel-fundamentals') };
  const placePill = (t) => {
    pill.style.width = `${t.offsetWidth}px`;
    pill.style.transform = `translateX(${t.offsetLeft}px)`;
  };
  const select = (name, focus = false) => {
    tabs.forEach((t) => {
      const on = t.id === `tab-${name}`;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { placePill(t); if (focus) t.focus(); }
    });
    Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== name; });
    // The add button belongs to Inspiration; the theme switch stays on both tabs.
    const add = document.getElementById('add-btn');
    add.hidden = name !== 'inspo';
    if (add.hidden && add.getAttribute('aria-expanded') === 'true') add.click();
    if (name === 'fundamentals') {
      build();
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    } else if (!location.hash || location.hash === '#fundamentals') {
      history.replaceState(null, '', '#inspo');
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t.id.slice(4)));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      select(tabs[(i + d + tabs.length) % tabs.length].id.slice(4), true);
    });
  });
  window.addEventListener('resize', () => placePill(tabs.find((t) => t.getAttribute('aria-selected') === 'true')));
  const tabFromHash = () => (!location.hash || location.hash === '#fundamentals' ? 'fundamentals' : 'inspo');
  window.addEventListener('hashchange', () => select(tabFromHash()));

  // ---------- demo helpers ----------
  const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
  const run = (el, frames, o) => el.animate(frames, { fill: 'both', ...o });
  const lanes = (rows) => rows.map((r) => `<div class="f-row"><span class="f-lbl">${r}</span><div class="f-lane"><i class="f-ball"></i></div></div>`).join('');
  const slide = (ball, o) => run(ball, [{ left: '0%' }, { left: 'calc(100% - 14px)' }], o);
  const EASE = {
    linear: [0, 0, 1, 1],
    'ease-in': [0.4, 0, 1, 1],
    'ease-out': [0, 0, 0.2, 1],
    'ease-in-out': [0.4, 0, 0.2, 1],
    spring: [0.34, 1.56, 0.64, 1],
  };
  const bez = (b) => `cubic-bezier(${b.join(',')})`;
  const curve = (b) => `<svg class="f-curve" viewBox="-2 -10 32 48" aria-hidden="true"><path d="M0 28 L28 0" class="f-diag"/><path d="M0 28 C${b[0] * 28} ${28 - b[1] * 28} ${b[2] * 28} ${28 - b[3] * 28} 28 0"/></svg>`;

  // ---------- the guides ----------
  const SECTIONS = [
    {
      name: 'Basics',
      guides: [
        {
          title: 'Anatomy of an animation',
          body: 'Every animation is the same five things: a property, where it starts, where it ends, how long it takes and the curve it follows. A delay decides when it starts.',
          tips: ['Name all five before you open a tool.', 'Most motion bugs are a wrong value in one of them, not a missing effect.'],
          demo(s) {
            s.innerHTML = `<div class="f-lane f-lane-lg"><i class="f-ball"></i></div>
              <div class="f-tl"><span class="f-seg f-delay" style="width:25%">delay 200ms</span><span class="f-seg" style="width:75%">duration 600ms · ease-out</span><b class="f-head"></b></div>
              <div class="f-legend"><span>property <b>position x</b></span><span>from <b>0</b></span><span>to <b>end</b></span></div>`;
            return () => {
              slide(s.querySelector('.f-ball'), { duration: 600, delay: 200, easing: bez(EASE['ease-out']) });
              run(s.querySelector('.f-head'), [{ left: '0%' }, { left: '100%' }], { duration: 800, easing: 'linear' });
              return 800;
            };
          },
        },
        {
          title: 'The four properties',
          body: 'Position, opacity, scale and rotation cover almost everything in a product UI. They are also the cheapest to animate, because the browser can move them without redrawing the layout.',
          tips: ['Animate transform and opacity; avoid width, height and top.', 'Pair opacity with a small move so the change has a direction.'],
          demo(s) {
            const P = [
              ['Position', [{ transform: 'translateX(-22px)' }, { transform: 'translateX(22px)' }]],
              ['Opacity', [{ opacity: 1 }, { opacity: 0.12 }]],
              ['Scale', [{ transform: 'scale(.6)' }, { transform: 'scale(1.2)' }]],
              ['Rotation', [{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }]],
            ];
            s.innerHTML = `<div class="f-quad">${P.map(([n]) => `<div class="f-cell"><i class="f-sq"></i><span class="f-lbl">${n}</span></div>`).join('')}</div>`;
            return () => {
              s.querySelectorAll('.f-sq').forEach((el, i) => run(el, P[i][1], { duration: 800, iterations: 2, direction: 'alternate', easing: bez(EASE['ease-in-out']) }));
              return 1600;
            };
          },
        },
        {
          title: 'Keyframes',
          body: 'Two values make a tween. Add keyframes in between when the motion needs a beat, like a pop that overshoots and settles. Each keyframe is a value pinned to a moment.',
          tips: ['Start with two keyframes and add more only when the motion needs another beat.', 'Space keyframes by feel, then snap them to round times.'],
          demo(s) {
            const K = [0, 0.3, 0.6, 1];
            s.innerHTML = `<div class="f-center"><i class="f-sq f-sq-lg"></i></div>
              <div class="f-tl f-tl-k">${K.map((k, i) => `<i class="f-key" style="left:${k * 100}%"><span>${['1', '1.4', '0.85', '1'][i]}</span></i>`).join('')}<b class="f-head"></b></div>`;
            return () => {
              run(s.querySelector('.f-sq'), [{ transform: 'scale(1)' }, { transform: 'scale(1.4)', offset: 0.3 }, { transform: 'scale(.85)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 1200, easing: 'ease-in-out' });
              run(s.querySelector('.f-head'), [{ left: '0%' }, { left: '100%' }], { duration: 1200, easing: 'linear' });
              return 1200;
            };
          },
        },
        {
          title: 'Enter and exit patterns',
          body: 'A handful of patterns cover most entrances and exits: fade, slide, scale, and their reverses. Start from a pattern, then tune its distance and timing instead of building every animation from zero.',
          tips: ['Enter with ease-out so things arrive and settle.', 'Exit with ease-in and a shorter duration, about two thirds of the enter.'],
          demo(s) {
            const P = [
              ['Fade in', [{ opacity: 0 }, { opacity: 1 }], 'ease-out'],
              ['Slide up', [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], 'ease-out'],
              ['Scale in', [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'none' }], 'spring'],
              ['Slide out', [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(34px)' }], 'ease-in'],
            ];
            s.innerHTML = `<div class="f-quad">${P.map(([n]) => `<div class="f-cell"><i class="f-card"></i><span class="f-lbl">${n}</span></div>`).join('')}</div>`;
            return () => {
              s.querySelectorAll('.f-card').forEach((el, i) => run(el, P[i][1], { duration: i === 3 ? 300 : 450, delay: 150, easing: bez(EASE[P[i][2]]) }));
              return 600;
            };
          },
        },
      ],
    },
    {
      name: 'Timing',
      guides: [
        {
          title: 'Duration',
          body: 'Duration should match how far something travels and how much attention it deserves. Small feedback is near instant; larger moves get more time so the eye can follow.',
          tips: ['100–200ms for hovers, toggles and presses.', '250–400ms for panels, sheets and page-level moves.', 'Past 500ms, it had better be worth waiting for.'],
          demo(s) {
            const D = [100, 200, 400, 700];
            s.innerHTML = lanes(D.map((d) => `${d}ms`));
            return () => {
              s.querySelectorAll('.f-ball').forEach((b, i) => slide(b, { duration: D[i], easing: bez(EASE['ease-out']) }));
              return 700;
            };
          },
        },
        {
          title: 'Easing',
          body: 'Easing is the personality of the motion. Real objects speed up and slow down, so linear movement reads as mechanical. Spring curves overshoot slightly, which feels playful and physical.',
          tips: ['Default to ease-out for UI responding to a user.', 'Use ease-in-out for things moving from one place to another on screen.', 'Save linear for progress, rotation loops and opacity.'],
          demo(s) {
            const N = Object.keys(EASE);
            s.innerHTML = N.map((n) => `<div class="f-row">${curve(EASE[n])}<span class="f-lbl">${n}</span><div class="f-lane"><i class="f-ball"></i></div></div>`).join('');
            return () => {
              s.querySelectorAll('.f-ball').forEach((b, i) => slide(b, { duration: 1000, easing: bez(EASE[N[i]]) }));
              return 1000;
            };
          },
        },
        {
          title: 'Delay and stagger',
          body: 'Offsetting start times turns a block of changes into a sequence the eye can read. A short stagger across a list feels like one gesture, not many separate ones.',
          tips: ['Keep stagger steps between 30 and 80ms.', 'Cap the total: after six or so items, start the rest together.'],
          demo(s) {
            const col = (t) => `<div class="f-col"><span class="f-lbl">${t}</span>${'<i class="f-bar"></i>'.repeat(5)}</div>`;
            s.innerHTML = `<div class="f-cols">${col('All at once')}${col('Stagger 70ms')}</div>`;
            return () => {
              s.querySelectorAll('.f-col').forEach((c, ci) => c.querySelectorAll('.f-bar').forEach((b, i) => run(b, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: 150 + (ci ? i * 70 : 0), easing: bez(EASE['ease-out']) })));
              return 830;
            };
          },
        },
        {
          title: 'Playback',
          body: 'Decide how an animation repeats. Play once for transitions, loop for ambient or loading states, and ping-pong when the motion should rock back and forth instead of jumping back to the start.',
          tips: ['Loops need a seamless last frame; ping-pong gets one for free.', 'Stop ambient loops when they leave the screen.'],
          demo(s) {
            s.innerHTML = lanes(['Play once', 'Loop', 'Ping-pong']);
            return () => {
              const b = s.querySelectorAll('.f-ball');
              const o = { duration: 700, easing: bez(EASE['ease-in-out']) };
              slide(b[0], o);
              slide(b[1], { ...o, iterations: 3, fill: 'none' });
              slide(b[2], { ...o, iterations: 3, direction: 'alternate' });
              return 2100;
            };
          },
        },
      ],
    },
    {
      name: 'Composition',
      guides: [
        {
          title: 'Layering animations',
          body: 'One element can run several animations at once, each on its own track. Move it and rotate it with different timings and you get motion that feels considered, not stamped out.',
          tips: ['Give secondary tracks a slight delay so the main action leads.', 'Keep each track to one property so it is easy to adjust alone.'],
          demo(s) {
            s.innerHTML = `<div class="f-lane f-lane-lg"><i class="f-mover"><i class="f-sq"></i></i></div>
              <div class="f-tracks"><div><span class="f-lbl">Position</span><span class="f-trk"><i style="left:0;width:100%"></i></span></div><div><span class="f-lbl">Rotation</span><span class="f-trk"><i style="left:20%;width:80%"></i></span></div><b class="f-head"></b></div>`;
            return () => {
              run(s.querySelector('.f-mover'), [{ left: '0%' }, { left: 'calc(100% - 28px)' }], { duration: 1200, easing: bez(EASE['ease-in-out']) });
              run(s.querySelector('.f-mover .f-sq'), [{ transform: 'rotate(0)' }, { transform: 'rotate(270deg)' }], { duration: 960, delay: 240, easing: bez(EASE['ease-out']) });
              run(s.querySelector('.f-tracks .f-head'), [{ left: '0%' }, { left: '100%' }], { duration: 1200, easing: 'linear' });
              return 1200;
            };
          },
        },
        {
          title: 'Animated components',
          body: 'Put motion inside the component, not on each screen. Define how a button presses, loads and confirms once, and every instance across the product moves the same way.',
          tips: ['Animate the transitions between states, not just the states.', 'Change the motion in the component and every instance updates.'],
          demo(s) {
            s.innerHTML = `<div class="f-btns">${['Save', 'Send', 'Pay'].map((t) => `<span class="f-btn"><span class="f-btn-t">${t}</span><i class="f-spin"></i><svg class="f-check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg></span>`).join('')}</div><p class="f-note">One component, three instances</p>`;
            return () => {
              const B = [...s.querySelectorAll('.f-btn')];
              const set = (c) => B.forEach((b, i) => setTimeout(() => { b.className = `f-btn ${c}`; }, i * 90));
              set('');
              setTimeout(() => set('press'), 200);
              setTimeout(() => set('load'), 420);
              setTimeout(() => set('done'), 1500);
              return 2300;
            };
          },
        },
      ],
    },
    {
      name: 'Systems',
      guides: [
        {
          title: 'Motion tokens',
          body: 'Treat timing and easing like color and spacing: a short list of named values everyone uses. Tokens keep motion consistent across teams and let you retune the whole product in one place.',
          tips: ['Three durations and three or four easings are usually enough.', 'Name tokens by role (enter, exit, emphasis), not by value.'],
          demo(s) {
            const T = [
              ['duration.fast', 150, 'easing.standard', [0.2, 0, 0, 1]],
              ['duration.base', 250, 'easing.enter', [0, 0, 0.2, 1]],
              ['duration.slow', 400, 'easing.emphasis', [0.34, 1.56, 0.64, 1]],
            ];
            s.innerHTML = T.map(([n, d, e]) => `<div class="f-row f-tok"><span class="f-lbl"><b>${n}</b> ${d}ms<br><b>${e}</b></span><div class="f-lane"><i class="f-ball"></i></div></div>`).join('')
              + '<pre class="f-code">--duration-fast: 150ms;\n--easing-standard: cubic-bezier(.2, 0, 0, 1);</pre>';
            return () => {
              s.querySelectorAll('.f-ball').forEach((b, i) => slide(b, { duration: T[i][1], delay: 150, easing: bez(T[i][3]) }));
              return 600;
            };
          },
        },
        {
          title: 'Respect reduced motion',
          body: 'Some people get dizzy or distracted by movement and ask their device to reduce it. Keep the feedback but drop the travel: swap slides and zooms for quick fades.',
          tips: ['Check the prefers-reduced-motion setting and pick an alternative, not nothing.', 'Never rely on motion alone to explain a change.'],
          demo(s) {
            s.innerHTML = `<div class="f-rm"><div class="f-sheet"><i></i><i></i><i></i></div></div>
              <button class="f-switch" type="button" aria-pressed="false"><span></span>Reduce motion</button>`;
            const sw = s.querySelector('.f-switch');
            const play = () => {
              const reduced = sw.getAttribute('aria-pressed') === 'true';
              run(s.querySelector('.f-sheet'), reduced
                ? [{ opacity: 0 }, { opacity: 1 }]
                : [{ opacity: 0, transform: 'translateX(60px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: reduced ? 200 : 500, delay: 150, easing: bez(EASE['ease-out']) });
              return 700;
            };
            sw.addEventListener('click', () => { sw.setAttribute('aria-pressed', String(sw.getAttribute('aria-pressed') !== 'true')); play(); });
            return play;
          },
        },
      ],
    },
    {
      name: 'Workflow',
      guides: [
        {
          title: 'Review on the timeline',
          body: 'Motion is hard to critique from a still frame. Scrub to the moment that feels off and pin feedback to that exact time, so everyone talks about the same frame.',
          tips: ['Review at full speed first, then scrub to the problem.', 'Comment with the time and the property: “at 320ms the fade starts too late”.'],
          demo(s) {
            const PINS = [[0.3, 'Starts a little late. Try 80ms less delay?'], [0.78, 'Love this settle.']];
            s.innerHTML = `<div class="f-center"><i class="f-card f-card-lg"></i></div>
              <div class="f-scrub"><input type="range" min="0" max="1000" value="0" aria-label="Scrub the animation">${PINS.map(([t], i) => `<button type="button" class="f-pin" style="left:${t * 100}%" aria-label="Comment ${i + 1}">${i + 1}</button>`).join('')}</div>
              <p class="f-bubble" aria-live="polite">Drag the playhead or tap a pin</p>`;
            const card = s.querySelector('.f-card');
            const range = s.querySelector('input');
            const bubble = s.querySelector('.f-bubble');
            let anim, raf = 0;
            const make = () => {
              anim = run(card, [{ opacity: 0, transform: 'translateY(26px) scale(.9)' }, { opacity: 1, transform: 'translateY(-4px) scale(1.02)', offset: 0.7 }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 250, easing: 'ease-out' });
              anim.pause();
            };
            const seek = (v) => {
              if (!anim) make();
              range.value = v;
              anim.currentTime = v * 1.25;
              const hit = PINS.findIndex(([t]) => Math.abs(v / 1000 - t) < 0.04);
              if (hit >= 0) bubble.textContent = `${Math.round(PINS[hit][0] * 1250)}ms · ${PINS[hit][1]}`;
            };
            range.addEventListener('input', () => { cancelAnimationFrame(raf); seek(+range.value); });
            s.querySelectorAll('.f-pin').forEach((p, i) => p.addEventListener('click', () => { cancelAnimationFrame(raf); seek(PINS[i][0] * 1000); }));
            return () => {
              make();
              cancelAnimationFrame(raf);
              const t0 = performance.now();
              const tick = (t) => {
                const k = Math.min(1, (t - t0) / 2000);
                seek(k * 1000);
                if (k < 1) raf = requestAnimationFrame(tick);
              };
              raf = requestAnimationFrame(tick);
              return 2000;
            };
          },
        },
        {
          title: 'Hand off as values, not videos',
          body: 'A video shows the feeling; the build needs numbers. Hand off the properties, durations, delays and curves as code, in the format the engineer will actually use.',
          tips: ['Export video or GIF for reviews and decks.', 'Give engineers code or tokens, so nobody has to guess at a curve by eye.'],
          demo(s) {
            const CODE = {
              CSS: `.ball {\n  animation: slide 600ms\n    cubic-bezier(0, 0, .2, 1) 200ms both;\n}\n@keyframes slide {\n  to { transform: translateX(240px); }\n}`,
              JS: `ball.animate(\n  [{ transform: 'none' },\n   { transform: 'translateX(240px)' }],\n  { duration: 600, delay: 200,\n    easing: 'cubic-bezier(0,0,.2,1)',\n    fill: 'both' });`,
              JSON: `{\n  "property": "x",\n  "from": 0, "to": 240,\n  "duration": 600, "delay": 200,\n  "easing": [0, 0, 0.2, 1]\n}`,
            };
            s.innerHTML = `<div class="f-lane"><i class="f-ball"></i></div>
              <div class="f-seg-tabs" role="tablist">${Object.keys(CODE).map((k, i) => `<button type="button" role="tab" aria-selected="${!i}">${k}</button>`).join('')}<button type="button" class="f-copy">Copy</button></div>
              <pre class="f-code f-code-lg"></pre>`;
            const pre = s.querySelector('pre');
            let cur = 'CSS';
            const show = (k) => { cur = k; pre.textContent = CODE[k]; s.querySelectorAll('[role="tab"]').forEach((b) => b.setAttribute('aria-selected', String(b.textContent === k))); };
            s.querySelectorAll('[role="tab"]').forEach((b) => b.addEventListener('click', () => show(b.textContent)));
            const copy = s.querySelector('.f-copy');
            copy.addEventListener('click', async () => {
              try { await navigator.clipboard.writeText(CODE[cur]); copy.textContent = 'Copied'; } catch { copy.textContent = 'Select to copy'; }
              setTimeout(() => { copy.textContent = 'Copy'; }, 1400);
            });
            show('CSS');
            return () => { slide(s.querySelector('.f-ball'), { duration: 600, delay: 200, easing: bez(EASE['ease-out']) }); return 800; };
          },
        },
        {
          title: 'Draft with an AI agent, finish by hand',
          body: 'Describing the intent is a fast way to get a first pass: the agent sets keyframes and timing across many layers at once. Then you tune it on the timeline, where taste comes in.',
          tips: ['Prompt with intent and rhythm: what moves, in what order, how it should feel.', 'Great for bulk work and quick variations; always review the curves.'],
          demo(s) {
            const PROMPT = 'Fade the cards up one after another';
            s.innerHTML = `<div class="f-prompt"><span class="f-typed"></span><i class="f-caret"></i></div>
              <div class="f-ai"><i class="f-card"></i><i class="f-card"></i><i class="f-card"></i></div>
              <div class="f-tracks f-ai-t">${[0, 1, 2].map((i) => `<div><span class="f-lbl">Card ${i + 1}</span><span class="f-trk"><i style="left:${i * 18}%;width:46%"></i></span></div>`).join('')}</div>`;
            const typed = s.querySelector('.f-typed');
            let timers = [];
            return () => {
              timers.forEach(clearTimeout);
              timers = [];
              typed.textContent = '';
              const cards = s.querySelectorAll('.f-ai .f-card');
              const bars = s.querySelectorAll('.f-ai-t .f-trk i');
              cards.forEach((c) => run(c, [{ opacity: 0 }, { opacity: 0 }], { duration: 1 }));
              bars.forEach((b) => run(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(0)' }], { duration: 1 }));
              [...PROMPT].forEach((ch, i) => timers.push(setTimeout(() => { typed.textContent += ch; }, i * 28)));
              const go = PROMPT.length * 28 + 300;
              timers.push(setTimeout(() => {
                cards.forEach((c, i) => run(c, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: i * 120, easing: bez(EASE['ease-out']) }));
                bars.forEach((b, i) => run(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 300, delay: i * 120, easing: bez(EASE['ease-out']) }));
              }, go));
              return go + 800;
            };
          },
        },
      ],
    },
  ];

  // ---------- build the tab once, on first visit ----------
  const panel = panels.fundamentals;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let built = false;
  function build() {
    if (built) return;
    built = true;
    let n = 0;
    SECTIONS.forEach((sec) => {
      const wrap = h(`<section class="f-section"><h2 class="f-h">${sec.name}</h2><div class="f-grid"></div></section>`);
      const grid = wrap.querySelector('.f-grid');
      sec.guides.forEach((g) => {
        n += 1;
        const card = h(`<article class="f-guide">
            <div class="f-stage"></div>
            <div class="f-body">
              <div class="f-top"><span class="f-num">${String(n).padStart(2, '0')}</span><h3></h3>
                <button class="f-replay" type="button" aria-label="Replay"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.55M13 2.5v3h-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
              <p class="f-text"></p><ul class="f-tips"></ul>
            </div></article>`);
        card.querySelector('h3').textContent = g.title;
        card.querySelector('.f-text').textContent = g.body;
        g.tips.forEach((t) => { const li = document.createElement('li'); li.textContent = t; card.querySelector('.f-tips').append(li); });
        const stage = card.querySelector('.f-stage');
        const play = g.demo(stage);
        // Loop the demo while it is visible; cancel leftovers so replays start clean
        let timer = 0, visible = false;
        const cycle = () => {
          clearTimeout(timer);
          stage.getAnimations({ subtree: true }).forEach((a) => a.cancel());
          const ms = play();
          if (visible && !reduce.matches) timer = setTimeout(cycle, ms + 1600);
        };
        card.querySelector('.f-replay').addEventListener('click', cycle);
        new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          if (visible) cycle();
          else clearTimeout(timer);
        }, { threshold: 0.4 }).observe(stage);
        grid.append(card);
      });
      panel.append(wrap);
    });
    panel.append(h(`<p class="f-credit">Adapted from a motion design playground shown at Config 2026. Guides are tool-agnostic: the same ideas apply in any design tool or codebase.</p>`));
  }

  select(tabFromHash());
  // Fonts can change tab widths after first paint
  document.fonts?.ready.then(() => placePill(tabs.find((t) => t.getAttribute('aria-selected') === 'true')));
})();
