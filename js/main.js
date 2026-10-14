(() => {
  const grid = document.getElementById('grid');
  const items = window.MicroIX.items;

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
    //   { wide: true, stageHeight: 700 }          full-width card, fixed stage height
    //   { device: { width: 320, height: 660 } }   phone screen that fills the card edge to edge
    const stage = card.querySelector('.stage');
    if (item.layout?.wide) card.classList.add('wide');
    if (item.layout?.stageHeight) {
      stage.style.height = `${item.layout.stageHeight}px`;
      stage.style.setProperty('--stage-h', `${item.layout.stageHeight}px`);
    }

    grid.append(card);

    if (item.layout?.device) {
      // Phone UI keeps its real proportions: centred in the grey frame, never stretched,
      // and only scaled down (uniformly) when the card is narrower than the device.
      const { width: DW, height: DH } = item.layout.device;
      const box = document.createElement('div');
      box.className = 'device-box';
      const screen = document.createElement('div');
      screen.className = 'device-screen';
      screen.style.width = `${DW}px`;
      screen.style.height = `${DH}px`;
      box.append(screen);
      stage.classList.add('device');
      stage.append(box);
      const fit = () => {
        const s = Math.min(1, stage.clientWidth / DW);
        box.style.width = `${DW * s}px`;
        box.style.height = `${DH * s}px`;
        screen.style.transform = `scale(${s})`;
        stage.style.height = `${DH * s}px`;
      };
      fit();
      new ResizeObserver(fit).observe(stage);
      item.mount(screen);
    } else {
      item.mount(stage);
    }
  });

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
})();
