MicroIX.register({
  id: 'ask-carousel',
  title: 'Pill → card carousel',
  description: 'Prompt cards rest as slim pills and spring open when focused. The color at the top follows the open card. Swipe or tap to switch, and tap the open card to type its prompt into the composer.',
  tags: ['carousel', 'ai', 'input'],
  source: { label: 'Opera (iOS) via Mobbin ↗', url: 'https://mobbin.com/screens/ecef457f-d8b4-460b-882b-cbcd3a6a701f' },
  layout: { device: { width: 320, height: 660 } },
  css: `
@property --ix-a1 { syntax: '<color>'; inherits: true; initial-value: #7fc8b9; }
@property --ix-a2 { syntax: '<color>'; inherits: true; initial-value: #c79aa8; }

.ix-ask { position: relative; width: 100%; height: 100%; overflow: hidden; background: #fff; color: #111; font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; user-select: none; -webkit-user-select: none; transition: --ix-a1 .9s var(--ease-out), --ix-a2 .9s var(--ease-out); }
.ix-ask .ambient { position: absolute; inset: 0 0 auto; height: 120px; background: radial-gradient(120% 160% at 10% 0%, var(--ix-a1), transparent 70%), radial-gradient(120% 160% at 95% 0%, var(--ix-a2), transparent 70%), #8b909a; }
.ix-ask .status { position: absolute; z-index: 2; top: 16px; left: 32px; right: 28px; display: flex; justify-content: space-between; align-items: center; font-size: 15px; font-weight: 600; }
.ix-ask .battery { width: 25px; height: 12px; border-radius: 4px; background: #111; }

.ix-ask .sheet { position: absolute; inset: 48px 0 0; display: flex; flex-direction: column; border-radius: 34px 34px 0 0; background: #fff; }
.ix-ask .head { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid #ececee; }
.ix-ask .av { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #9a98a3; color: #fff; }
.ix-ask .head .name { flex: 1; font-size: 17px; }
.ix-ask .round { display: grid; place-items: center; flex: none; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; background: #f0f0f2; color: #333; }
.ix-ask svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.ix-ask .av svg { fill: currentColor; stroke: none; }

.ix-ask .hero { padding: 44px 16px 0; }
.ix-ask .hero svg { width: 26px; height: 26px; fill: #111; stroke: none; }
.ix-ask .hero h3 { margin: 10px 0 0; font: 800 38px/1 ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .02em; }
.ix-ask .hero p { margin: 12px 0 0; font: 700 12px ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .06em; }

/* Carousel */
.ix-ask .viewport { margin-top: 30px; padding: 0 16px; overflow: hidden; touch-action: pan-y; cursor: grab; outline: none; }
.ix-ask .track { display: flex; gap: 8px; transition: transform .6s var(--ease-spring); }
.ix-ask .track.dragging { transition: none; }
.ix-ask .viewport:has(.dragging) { cursor: grabbing; }
.ix-ask .card { position: relative; flex: none; width: 46px; height: 170px; padding: 0; overflow: hidden; border: 0; border-radius: 23px; background: linear-gradient(160deg, var(--c1), var(--c2)); cursor: pointer; transition: width .6s var(--ease-spring), border-radius .6s var(--ease-out), scale .2s var(--ease-out); -webkit-tap-highlight-color: transparent; }
.ix-ask .card.active { width: 184px; border-radius: 26px; }
.ix-ask .card:active { scale: .97; }
.ix-ask .card:focus-visible { outline: 3px solid #111; outline-offset: 2px; }
.ix-ask .card .art { position: absolute; left: 50%; top: 42%; font-size: 92px; line-height: 1; translate: -50% -50%; scale: .8; transition: scale .6s var(--ease-spring), rotate .6s var(--ease-spring); }
.ix-ask .card.active .art { scale: 1; rotate: -8deg; }
.ix-ask .card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(0,0,0,.4)); opacity: 0; transition: opacity .4s; }
.ix-ask .card.active::after { opacity: 1; }
/* Fixed width so the text doesn't reflow while the card animates open */
.ix-ask .card .q { position: absolute; z-index: 1; left: 14px; bottom: 14px; width: 156px; color: #fff; font-size: 14.5px; font-weight: 500; line-height: 1.35; text-align: left; opacity: 0; translate: 0 8px; transition: opacity .15s, translate .15s; }
.ix-ask .card.active .q { opacity: 1; translate: 0 0; transition: opacity .35s .22s, translate .5s var(--ease-out) .22s; }

/* Composer */
.ix-ask .composer { position: absolute; left: 14px; right: 14px; bottom: 26px; display: flex; align-items: flex-end; gap: 8px; padding: 6px; border-radius: 28px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04); }
.ix-ask .composer .round { width: 40px; height: 40px; cursor: pointer; transition: background .25s, color .25s, transform .15s var(--ease-out); }
.ix-ask .composer .round:active { transform: scale(.9); }
.ix-ask .field { flex: 1; min-width: 0; max-height: 4em; padding: 10px 0; overflow: hidden; font-size: 16px; line-height: 1.3; }
.ix-ask .field .ph { color: #aaa; }
.ix-ask .field.typing::after { content: ""; display: inline-block; width: 2px; height: 1.1em; margin-left: 1px; vertical-align: -3px; background: #111; animation: ix-ask-caret 1s steps(1) infinite; }
@keyframes ix-ask-caret { 50% { opacity: 0; } }
.ix-ask .send { position: relative; }
.ix-ask .send svg { position: absolute; transition: opacity .2s, transform .3s var(--ease-spring); }
.ix-ask .send .i-up { opacity: 0; transform: scale(.4) translateY(6px); }
.ix-ask .composer.has-text .send { background: #111; color: #fff; }
.ix-ask .composer.has-text .send .i-mic { opacity: 0; transform: scale(.4); }
.ix-ask .composer.has-text .send .i-up { opacity: 1; transform: none; }
`,
  mount(stage) {
    const PROMPTS = [
      { art: '🖌️', q: 'Teach me the basics of ink brush painting', c1: '#ece7df', c2: '#bfb3a2' },
      { art: '🌍', q: 'How did the French Revolution lead to Napoleon?', c1: '#86cdbd', c2: '#4f9a8d' },
      { art: '🎧', q: 'Which wireless earbuds are best for running?', c1: '#62a8c6', c2: '#2c5f78' },
      { art: '🍜', q: 'Quick ramen upgrades with what’s in my fridge', c1: '#f4bd86', c2: '#d4704a' },
      { art: '🚀', q: 'Explain orbital mechanics like I’m five', c1: '#7a6be0', c2: '#2a2366' },
      { art: '🌱', q: 'Why are my basil leaves turning yellow?', c1: '#a6d684', c2: '#4b8738' },
    ];
    const PILL = 46, OPEN = 184, GAP = 8;

    const icon = {
      sparkle: '<svg viewBox="0 0 24 24"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z"/></svg>',
      list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
      dots: '<svg viewBox="0 0 24 24"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg>',
      plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
      mic: '<svg class="i-mic" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
      up: '<svg class="i-up" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    };

    stage.innerHTML = `
      <div class="ix-ask">
        <div class="ambient"></div>
        <div class="status"><span>9:41</span><span class="battery"></span></div>
        <div class="sheet">
          <div class="head">
            <span class="av">${icon.sparkle}</span><span class="name">Assistant</span>
            <span class="round">${icon.list}</span><span class="round">${icon.dots}</span>
          </div>
          <div class="hero">${icon.sparkle}<h3>ASK AI</h3><p>SO WHAT’S ON YOUR MIND?</p></div>
          <div class="viewport" tabindex="0" aria-label="Suggested prompts. Use arrow keys to browse.">
            <div class="track">${PROMPTS.map((p, i) => `
              <button class="card" data-i="${i}" style="--c1:${p.c1};--c2:${p.c2}" aria-label="${p.q}">
                <span class="art" aria-hidden="true">${p.art}</span><span class="q">${p.q}</span>
              </button>`).join('')}
            </div>
          </div>
        </div>
        <div class="composer">
          <button class="round" aria-label="Attach">${icon.plus}</button>
          <div class="field" aria-live="polite"></div>
          <button class="round send" aria-label="Send">${icon.mic}${icon.up}</button>
        </div>
      </div>`;

    const root = stage.querySelector('.ix-ask');
    const viewport = root.querySelector('.viewport');
    const track = root.querySelector('.track');
    const cards = [...track.children];
    const composer = root.querySelector('.composer');
    const field = root.querySelector('.field');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let active = 1;
    let dragX = 0;

    const layout = () => {
      cards.forEach((c, i) => c.classList.toggle('active', i === active));
      // Centre the open card, clamped so the ends don't show empty space.
      const VIEW = viewport.clientWidth - 32; // minus the 2×16 padding
      const total = (cards.length - 1) * (PILL + GAP) + OPEN;
      const x = Math.min(0, Math.max(VIEW - total, VIEW / 2 - (active * (PILL + GAP) + OPEN / 2)));
      track.style.transform = `translateX(${x + dragX}px)`;
      root.style.setProperty('--ix-a1', PROMPTS[active].c1);
      root.style.setProperty('--ix-a2', PROMPTS[active].c2);
    };
    const go = (i) => {
      active = Math.max(0, Math.min(cards.length - 1, i));
      layout();
    };

    // Composer: typewriter fill, then the mic morphs into a send arrow.
    let typer;
    const clearField = () => {
      clearInterval(typer);
      field.classList.remove('typing');
      composer.classList.remove('has-text');
      field.innerHTML = '<span class="ph">Ask anything</span>';
    };
    const typeIn = (text) => {
      clearInterval(typer);
      field.textContent = '';
      field.classList.add('typing');
      composer.classList.add('has-text');
      let n = 0;
      typer = setInterval(() => {
        field.textContent = text.slice(0, ++n);
        if (n >= text.length) clearInterval(typer);
      }, 22);
    };
    root.querySelector('.send').addEventListener('click', () => {
      if (!composer.classList.contains('has-text')) return;
      field.animate([{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 -28px' }], { duration: 320, easing: 'ease-in' })
        .finished.then(clearField);
    });
    clearField();

    // Auto-advance until the user touches anything.
    let auto = reduced ? null : setInterval(() => go((active + 1) % cards.length), 3200);
    const stopAuto = () => { clearInterval(auto); auto = null; };
    root.addEventListener('pointerdown', stopAuto);
    root.addEventListener('keydown', stopAuto);

    // Drag / swipe
    let startX = null;
    let dragged = false;
    viewport.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      dragged = false;
      const move = (ev) => {
        const dx = ev.clientX - startX;
        if (!dragged && Math.abs(dx) < 6) return;
        dragged = true;
        track.classList.add('dragging');
        dragX = dx * 0.6;
        layout();
      };
      const up = (ev) => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        track.classList.remove('dragging');
        const dx = ev.clientX - startX;
        dragX = 0;
        if (dragged && Math.abs(dx) > 30) go(active + (dx < 0 ? 1 : -1));
        else layout();
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });

    cards.forEach((card, i) => card.addEventListener('click', () => {
      if (dragged) return;
      if (i === active) typeIn(PROMPTS[i].q);
      else go(i);
    }));

    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(active + 1);
      else if (e.key === 'ArrowLeft') go(active - 1);
      else return;
      e.preventDefault();
      if (document.activeElement?.classList.contains('card')) cards[active].focus();
    });

    // The screen is fluid, so re-centre the open card when the width changes.
    new ResizeObserver(() => layout()).observe(viewport);
  },
});
