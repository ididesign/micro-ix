(() => {
  const grid = document.getElementById('grid');
  // Spread phone demos evenly through the grid so they never cluster side by side
  const items = (() => {
    const all = window.MicroIX.items;
    const phones = all.filter((it) => it.layout?.device);
    const rest = all.filter((it) => !it.layout?.device);
    phones.forEach((p, k) => {
      rest.splice(Math.floor(((k + 0.5) * all.length) / phones.length), 0, p);
    });
    return rest;
  })();
  const DESIGN_W = 820; // width wide demos are laid out at before scaling into a column
  const MIN_COL = 300;
  const DEVICE_SCALE = 0.7;
  const GAP = 16;
  const cards = [];

  // Each interaction ships its own CSS; inject it all once.
  const style = document.createElement('style');
  style.textContent = items.map((item) => item.css || '').join('\n');
  document.head.append(style);

  items.forEach((item, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.id = item.id;
    card.style.setProperty('--i', i);
    card.dataset.tags = item.tags.join(' ');
    card.innerHTML = `
      <div class="stage"></div>
      <div class="card-body">
        <h2 class="card-title"></h2>
        <p class="card-desc"></p>
        <div class="card-meta"><div class="tags"></div></div>
      </div>`;
    card.querySelector('.card-title').textContent = item.title;
    card.querySelector('.card-desc').textContent = item.description;

    const tags = card.querySelector('.tags');
    item.tags.forEach((t) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.append(span);
    });

    if (item.source) {
      const a = document.createElement('a');
      a.href = item.source.url;
      a.textContent = item.source.label || 'source ↗';
      a.target = '_blank';
      a.rel = 'noopener';
      card.querySelector('.card-meta').append(a);
    }

    // Optional per-interaction layout:
    //   { wide: true, stageHeight: 700 }          landscape demo, designed at DESIGN_W × stageHeight
    //   { device: { width: 320, height: 660 } }   phone screen at its real portrait size
    // In the masonry grid each demo renders at its natural size and is scaled down as one
    // piece, like a thumbnail, so narrow columns never squash a layout. On a phone (one
    // column) wide demos render natively at full width instead.
    const stage = card.querySelector('.stage');
    const screen = document.createElement('div');
    screen.className = 'stage-screen';
    let box = null;
    if (item.layout?.device) {
      box = document.createElement('div');
      box.className = 'device-box';
      box.append(screen);
      stage.classList.add('device');
      stage.append(box);
    } else {
      stage.append(screen);
    }
    cards.push({ card, stage, screen, box, layout: item.layout || {} });
    grid.append(card);
    item.mount(screen);
  });

  // ---------- fit each demo into its column ----------
  const fit = ({ stage, screen, box, layout }) => {
    const w = stage.clientWidth;
    if (!w) return;
    if (layout.device) {
      const { width: DW, height: DH } = layout.device;
      // Phones sit smaller in the grid (with air on either side) so tall tiles don't dominate
      const s = Math.min(cols === 1 ? 1 : DEVICE_SCALE, w / DW);
      Object.assign(box.style, { width: `${DW * s}px`, height: `${DH * s}px` });
      Object.assign(screen.style, { width: `${DW}px`, height: `${DH}px`, transform: `scale(${s})` });
      stage.style.height = `${DH * s}px`;
      return;
    }
    const NH = layout.stageHeight || 480;
    if (cols === 1) {
      const h = Math.min(NH, window.innerHeight * 0.75);
      Object.assign(screen.style, { width: '100%', height: `${h}px`, transform: '' });
      stage.style.height = `${h}px`;
      return;
    }
    const s = w / DESIGN_W;
    Object.assign(screen.style, { width: `${DESIGN_W}px`, height: `${NH}px`, transform: `scale(${s})` });
    stage.style.height = `${NH * s}px`;
  };

  // ---------- masonry: each card drops into the shortest column, in order ----------
  let cols = 0;
  const masonry = () => {
    const css = getComputedStyle(grid);
    const inner = grid.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
    const n = Math.max(1, Math.floor((inner + GAP) / (MIN_COL + GAP)));
    if (n !== cols) {
      cols = n;
      const columns = Array.from({ length: n }, () => {
        const c = document.createElement('div');
        c.className = 'col';
        return c;
      });
      grid.replaceChildren(...columns);
      cards.forEach((c) => {
        const shortest = columns.reduce((a, b) => (b.offsetHeight < a.offsetHeight ? b : a));
        shortest.append(c.card);
        fit(c);
      });
    } else {
      cards.forEach(fit);
    }
  };
  masonry();
  new ResizeObserver(masonry).observe(grid);

  document.getElementById('count').textContent = items.length;

  // Theme toggle (initial theme is set inline in <head>)
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const syncThemeLabel = () => themeBtn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  syncThemeLabel();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('micro-ix-theme', root.dataset.theme); } catch {}
    syncThemeLabel();
  });

  // Add a link: opens a pre-filled GitHub issue, which acts as the inbox.
  // GitHub Pages is static, so the issue is where the link gets stored.
  const REPO = 'ididesign/micro-ix';
  const addBtn = document.getElementById('add-btn');
  const panel = document.getElementById('add-panel');
  const urlInput = document.getElementById('add-url');
  const noteInput = document.getElementById('add-note');
  const setOpen = (open) => {
    panel.hidden = !open;
    addBtn.setAttribute('aria-expanded', String(open));
    if (open) urlInput.focus();
  };
  addBtn.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); addBtn.focus(); } });
  document.addEventListener('pointerdown', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !addBtn.contains(e.target)) setOpen(false);
  });
  panel.addEventListener('submit', (e) => {
    e.preventDefault();
    let url = urlInput.value.trim();
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    let host = url;
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch {}
    const note = noteInput.value.trim();
    const params = new URLSearchParams({
      title: `Add: ${host}`,
      body: `${url}${note ? `\n\n${note}` : ''}`,
      labels: 'inbox',
    });
    window.open(`https://github.com/${REPO}/issues/new?${params}`, '_blank', 'noopener');
    panel.reset();
    setOpen(false);
  });
})();
