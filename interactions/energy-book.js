MicroIX.register({
  id: 'energy-book',
  title: 'Energy textbook in 3D',
  description: 'A pen-hatched lab pops out of an open physics book. Drag the ball up the half-pipe and let go: the gravitational beaker drains into the kinetic one at the bottom of every swing, and friction slowly fills the thermal beaker until the ball settles. Turn friction off to watch energy stay conserved.',
  tags: ['3d', 'education', 'three.js'],
  source: { label: '@techartist_ on X ↗', url: 'https://x.com/techartist_/status/2114035463153742180' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-book { position: absolute; inset: 0; overflow: hidden; background: #d9c8ad; color: #2b2925; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; user-select: none; -webkit-user-select: none; touch-action: pan-y; }
.ix-book canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; display: block; }
.ix-book canvas.grab { cursor: grab; }
.ix-book canvas.grabbing { cursor: grabbing; }
.ix-book .fx { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(130% 100% at 55% 40%, transparent 55%, rgba(60,40,20,.28)); }
.ix-book .hint { position: absolute; z-index: 2; left: 18px; top: 16px; display: flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px; background: rgba(255,255,255,.72); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); font-size: 12px; transition: opacity .4s; }
.ix-book .hint i { width: 7px; height: 7px; border-radius: 50%; background: #ff7a2f; animation: ix-book-ping 1.6s ease-out infinite; }
@keyframes ix-book-ping { 0% { box-shadow: 0 0 0 0 rgba(255,122,47,.6); } 100% { box-shadow: 0 0 0 9px rgba(255,122,47,0); } }
.ix-book .hint.gone { opacity: 0; }
.ix-book .bar { position: absolute; z-index: 2; left: 50%; bottom: 16px; translate: -50% 0; display: flex; align-items: center; gap: 4px; padding: 5px; border-radius: 999px; background: rgba(255,255,255,.82); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); box-shadow: 0 8px 24px -12px rgba(40,30,10,.45); font-size: 12px; white-space: nowrap; }
.ix-book .bar .ttl { padding: 0 12px 0 10px; }
.ix-book .bar .ttl b { font-weight: 500; }
.ix-book .bar .ttl span { color: #8a857c; }
.ix-book .bar button { display: inline-flex; align-items: center; gap: 7px; height: 28px; padding: 0 12px; border: 0; border-radius: 999px; background: #efece6; color: #2b2925; font: 500 12px "Helvetica Neue", Helvetica, Arial, sans-serif; cursor: pointer; transition: background .15s, transform .15s; }
.ix-book .bar button:hover { background: #e4e0d8; }
.ix-book .bar button:active { transform: scale(.96); }
.ix-book .bar .sw { position: relative; width: 22px; height: 12px; border-radius: 999px; background: #c9c4ba; transition: background .2s; }
.ix-book .bar .sw::after { content: ""; position: absolute; left: 2px; top: 2px; width: 8px; height: 8px; border-radius: 50%; background: #fff; transition: translate .25s var(--ease-spring); }
.ix-book .bar [aria-pressed=true] .sw { background: #ff7a2f; }
.ix-book .bar [aria-pressed=true] .sw::after { translate: 10px 0; }
.ix-book .status { position: absolute; inset: 0; display: grid; place-items: center; font-size: 12px; color: #6f6656; }
@media (max-width: 640px) {
  .ix-book .bar .ttl span { display: none; }
}
`,
  mount(stage) {
    stage.innerHTML = `
      <div class="ix-book">
        <div class="fx"></div>
        <div class="hint"><i></i>Drag the ball up the track</div>
        <div class="bar">
          <span class="ttl"><span>Lesson 2 · </span><b>Up and down</b></span>
          <button class="fric" aria-pressed="true"><span class="sw"></span>Friction</button>
          <button class="reset">Reset</button>
        </div>
        <div class="status">Loading three.js…</div>
      </div>`;

    if (!document.getElementById('ix-caveat')) {
      const l = document.createElement('link');
      l.id = 'ix-caveat';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap';
      document.head.append(l);
    }

    const root = stage.querySelector('.ix-book');
    const status = root.querySelector('.status');
    const hint = root.querySelector('.hint');
    const fricBtn = root.querySelector('.fric');
    const resetBtn = root.querySelector('.reset');

    const V = 'https://cdn.jsdelivr.net/npm/three@0.160.0';
    Promise.all([
      import(`${V}/build/three.module.js`),
      document.fonts.load('600 40px Caveat').catch(() => {}),
    ]).then(([THREE]) => build(THREE)).catch((e) => { console.error(e); root.append(status); status.textContent = 'Could not load three.js'; });

    function build(THREE) {
      status.remove();

      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

      // ---------- renderer / scene ----------
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      root.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xd9c8ad);
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xb59f80, 1.1));
      const sun = new THREE.DirectionalLight(0xfff0dc, 2.6);
      sun.position.set(-5, 9, -3.5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
      sun.shadow.bias = -0.0004;
      sun.shadow.radius = 4;
      scene.add(sun);
      // Window frame above the table, out of shot: only its shadow lands on the book
      const winMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
      [[0, 0, 0.18, 6], [0, 0, 6, 0.18], [1.5, 0, 0.12, 6]].forEach(([x, z, w, d]) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), winMat);
        m.position.set(-5.6 + x, 5.4, -2.6 + z);
        m.castShadow = true;
        scene.add(m);
      });

      const canvasTex = (w, h, draw) => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        draw(c.getContext('2d'), w, h);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        return t;
      };

      // Pen hatching: fine diagonal strokes on warm paper
      const hatchImg = canvasTex(256, 256, (g, w, h) => {
        g.fillStyle = '#f7f4ec'; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(55,50,44,.42)'; g.lineWidth = 1.6;
        for (let i = -h; i < w; i += 9) { g.beginPath(); g.moveTo(i, h); g.lineTo(i + h, 0); g.stroke(); }
      });
      hatchImg.wrapS = hatchImg.wrapT = THREE.RepeatWrapping;
      const hatchMat = (rx, ry = rx) => {
        const t = hatchImg.clone();
        t.repeat.set(rx, ry);
        t.needsUpdate = true;
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.92, side: THREE.DoubleSide });
      };
      const inkMat = new THREE.LineBasicMaterial({ color: 0x3a3631 });
      const ink = (mesh, angle = 25) => {
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, angle), inkMat));
        return mesh;
      };
      const shade = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

      // ---------- table, mat, book ----------
      const wood = canvasTex(1024, 1024, (g, w, h) => {
        g.fillStyle = '#d8c6a9'; g.fillRect(0, 0, w, h);
        for (let i = 0; i < 160; i++) {
          const y = Math.random() * h;
          g.strokeStyle = `rgba(${Math.random() < 0.5 ? '150,120,80' : '240,225,200'},${0.05 + Math.random() * 0.08})`;
          g.lineWidth = 1 + Math.random() * 4;
          g.beginPath(); g.moveTo(0, y);
          g.bezierCurveTo(w * 0.3, y + Math.random() * 20 - 10, w * 0.7, y + Math.random() * 20 - 10, w, y + Math.random() * 10 - 5);
          g.stroke();
        }
      });
      const table = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ map: wood, roughness: 0.8 }));
      wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
      wood.repeat.set(5, 5);
      table.rotation.x = -Math.PI / 2;
      table.receiveShadow = true;
      scene.add(table);

      const mat = shade(new THREE.Mesh(new THREE.BoxGeometry(13, 0.03, 8.4), new THREE.MeshStandardMaterial({ color: 0x9fb2a4, roughness: 1 })));
      mat.position.set(0.4, 0.015, -0.2);
      scene.add(mat);

      const book = new THREE.Group();
      book.position.y = 0.03;
      scene.add(book);
      const cover = shade(new THREE.Mesh(new THREE.BoxGeometry(8.9, 0.07, 5.9), new THREE.MeshStandardMaterial({ color: 0xd8a33a, roughness: 0.6 })));
      cover.position.y = 0.035;
      book.add(cover);

      // Pages curve down into the spine
      const PW = 4.2, PD = 5.55;
      const pageY = (d) => 0.34 - 0.2 * Math.exp(-d / 0.28) + 0.025 * Math.sin(Math.min(1, d / PW) * Math.PI);
      const edgeTex = canvasTex(64, 64, (g, w, h) => {
        g.fillStyle = '#efe9dc'; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(120,110,95,.25)';
        for (let y = 1; y < h; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      });
      const pageTexts = [drawLeftPage, drawRightPage].map((fn) => canvasTex(1024, 1352, fn));
      [-1, 1].forEach((side, k) => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.07);
        for (let i = 0; i <= 40; i++) { const d = (i / 40) * PW; shape.lineTo(d, pageY(d) - 0.004); }
        shape.lineTo(PW, 0.07);
        const block = shade(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: PD, bevelEnabled: false }), new THREE.MeshStandardMaterial({ map: edgeTex, roughness: 0.95 })));
        block.scale.x = side;
        block.position.set(side * 0.02, 0, -PD / 2);
        book.add(block);

        const geo = new THREE.PlaneGeometry(PW, PD, 60, 1);
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const d = p.getX(i) + PW / 2; // 0 at the spine
          p.setXYZ(i, side * (d + 0.02), pageY(d), -p.getY(i));
        }
        geo.computeVertexNormals();
        if (side < 0) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i)); }
        const page = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: pageTexts[k], roughness: 0.95, side: THREE.DoubleSide }));
        page.receiveShadow = true;
        book.add(page);
      });

      function drawLeftPage(g, w, h) {
        g.fillStyle = '#fbf9f3'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#2b2925';
        g.font = '500 26px "Helvetica Neue", Arial'; g.fillStyle = '#9a948a'; g.fillText('LESSON 2  ·  ENERGY STORES', 110, 150);
        g.fillStyle = '#2b2925'; g.font = 'italic 86px Georgia, serif'; g.fillText('Up and down', 104, 250);
        g.font = '34px Georgia, serif';
        const para = (lines, y) => lines.forEach((l, i) => g.fillText(l, 110, y + i * 50));
        para(['Lift a ball up a curved track and you', 'fill its gravitational store. Let go and', 'that energy pours into its kinetic store', 'at the bottom, then climbs back again.'], 340);
        g.font = 'italic 48px Georgia, serif';
        g.fillText('Eₚ = m g h', 150, 600);
        g.fillText('Eₖ = ½ m v²', 150, 680);
        g.font = '34px Georgia, serif';
        para(['Every swing loses a little to friction,', 'so the thermal store slowly fills and', 'the ball never quite reaches its start.'], 790);
        g.strokeStyle = '#2b2925'; g.lineWidth = 2;
        g.strokeRect(110, 990, 640, 170);
        g.font = 'italic 36px Georgia, serif'; g.fillText('Try it', 140, 1045);
        g.font = '32px Georgia, serif'; g.fillText('Drag the ball up the track, then let go.', 140, 1100);
        g.font = '600 46px Caveat, cursive'; g.fillStyle = '#4a4640'; g.fillText('m = 0.5 kg', 760, 1080);
        g.font = '24px Georgia, serif'; g.fillStyle = '#9a948a'; g.fillText('34', 110, 1290);
      }
      function drawRightPage(g, w, h) {
        g.fillStyle = '#fbf9f3'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#6c665d'; g.font = 'italic 28px Georgia, serif';
        g.fillText('Fig. 2.1  A ball on a curved track. Heights from the lowest point.', 140, 1230);
        g.font = '24px Georgia, serif'; g.fillStyle = '#9a948a'; g.fillText('35', 880, 1290);
      }

      // ---------- apparatus on the right page ----------
      const app = new THREE.Group();
      app.position.set(2.25, pageY(2.2), 0.15);
      book.add(app);

      const base = shade(ink(new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.1, 1.55), hatchMat(2.6, 1.2))));
      base.position.set(0, 0.05, 0.25);
      app.add(base);

      // Half-pipe: floor plus two low walls, built as strips so the hatching follows the curve
      const K = 0.74, X1 = 1.45, TZ = 0.62, TW = 0.42, Y0 = 0.36;
      const hgt = (x) => Y0 + K * x * x;
      const slope = (x) => 2 * K * x;
      const strip = (fa, fb, n = 90) => {
        const pos = [], uv = [], idx = [];
        let s = 0;
        for (let i = 0; i <= n; i++) {
          const x = -X1 + (2 * X1 * i) / n;
          if (i) s += Math.hypot((2 * X1) / n, hgt(x) - hgt(x - (2 * X1) / n));
          const a = fa(x), b = fb(x);
          pos.push(...a, ...b);
          uv.push(s * 0.75, 0, s * 0.75, Math.hypot(a[1] - b[1], a[2] - b[2]) * 0.75);
          if (i) { const o = (i - 1) * 2; idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
      };
      const trackMat = hatchMat(1);
      const z0 = TZ - TW / 2, z1 = TZ + TW / 2, WALL = 0.11, TH = 0.05;
      const trackParts = [
        strip((x) => [x, hgt(x), z0], (x) => [x, hgt(x), z1]),
        strip((x) => [x, hgt(x) - TH, z0], (x) => [x, hgt(x) - TH, z1]),
        strip((x) => [x, hgt(x) - TH, z0], (x) => [x, hgt(x) + WALL, z0]),
        strip((x) => [x, hgt(x) - TH, z1], (x) => [x, hgt(x) + WALL, z1]),
      ].map((g) => { const m = shade(ink(new THREE.Mesh(g, trackMat), 20)); app.add(m); return m; });
      // End caps and posts
      [-X1, X1].forEach((x) => {
        const cap = shade(ink(new THREE.Mesh(new THREE.BoxGeometry(0.03, TH + WALL, TW), hatchMat(1))));
        cap.position.set(x, hgt(x) + (WALL - TH) / 2, TZ);
        app.add(cap);
      });
      [-1.12, -0.5, 0.5, 1.12].forEach((x) => {
        const top = hgt(x) - TH;
        const post = shade(ink(new THREE.Mesh(new THREE.BoxGeometry(0.07, top - 0.1, 0.07), hatchMat(0.3, 2))));
        post.position.set(x, 0.1 + (top - 0.1) / 2, TZ);
        app.add(post);
      });

      // Shelf with three beakers behind the track
      const SH = 1.32, SZ = -0.22;
      const shelfTop = shade(ink(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 0.55), hatchMat(1.6, 0.5))));
      shelfTop.position.set(0, SH, SZ);
      app.add(shelfTop);
      const apron = shade(ink(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.3, 0.04), hatchMat(1.6, 0.3))));
      apron.position.set(0, SH - 0.18, SZ + 0.26);
      app.add(apron);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
        const leg = shade(ink(new THREE.Mesh(new THREE.BoxGeometry(0.06, SH - 0.1, 0.06), hatchMat(0.3, 2))));
        leg.position.set(sx * 0.98, 0.1 + (SH - 0.13) / 2, SZ + sz * 0.22);
        app.add(leg);
      });

      const STORES = [
        { name: 'Gravitational', color: 0x6d4aff, css: '#6d4aff' },
        { name: 'Kinetic', color: 0x2f6bff, css: '#2f6bff' },
        { name: 'Thermal', color: 0xff7a2f, css: '#ff7a2f' },
      ];
      const BH = 0.58, BR = 0.19;
      const glass = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
      const ring = (r, y) => {
        const pts = [];
        for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); }
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), inkMat);
      };
      STORES.forEach((st, i) => {
        const g = new THREE.Group();
        g.position.set((i - 1) * 0.62, SH + 0.03, SZ);
        app.add(g);
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(BR, BR, BH, 40, 1, true), glass);
        tube.position.y = BH / 2;
        tube.renderOrder = 2;
        g.add(tube, ring(BR, 0.002), ring(BR, BH), ring(BR * 1.06, BH));
        [-1, 1].forEach((s) => {
          const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(s * BR, 0, 0), new THREE.Vector3(s * BR, BH, 0)]), inkMat);
          g.add(l);
        });
        const liqGeo = new THREE.CylinderGeometry(BR * 0.9, BR * 0.9, 1, 40);
        liqGeo.translate(0, 0.5, 0);
        const liquid = new THREE.Mesh(liqGeo, new THREE.MeshStandardMaterial({ color: st.color, emissive: st.color, emissiveIntensity: 0.55, roughness: 0.3, transparent: true, opacity: 0.92 }));
        liquid.position.y = 0.01;
        g.add(liquid);
        const glow = new THREE.PointLight(st.color, 0, 1.6, 1.6);
        glow.position.set(0, 0.15, 0.25);
        g.add(glow);

        // Hand-written readout card on the apron
        const c = document.createElement('canvas');
        c.width = 320; c.height = 150;
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        const card = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.263), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }));
        card.position.set((i - 1) * 0.62, SH - 0.17, SZ + 0.285);
        app.add(card);
        Object.assign(st, { liquid, glow, ctx: c.getContext('2d'), tex, shown: null });
      });
      const drawCard = (st, val) => {
        const g = st.ctx;
        g.fillStyle = '#fbf9f3'; g.fillRect(0, 0, 320, 150);
        g.strokeStyle = '#3a3631'; g.lineWidth = 3; g.strokeRect(5, 5, 310, 140);
        g.fillStyle = st.css; g.fillRect(22, 30, 14, 14);
        g.fillStyle = '#4a4640'; g.font = 'italic 26px Georgia, serif'; g.fillText(st.name, 46, 44);
        g.fillStyle = '#2b2925'; g.font = '600 66px Caveat, cursive'; g.fillText(`${val.toFixed(1)} J`, 22, 120);
        st.tex.needsUpdate = true;
      };

      // Pipes between the beakers: they light up in the colour of the energy flowing through
      const pipe = (i) => {
        const a = new THREE.Vector3((i - 1) * 0.62, SH + BH + 0.02, SZ);
        const b = new THREE.Vector3(i * 0.62, SH + BH + 0.02, SZ);
        const curve = new THREE.QuadraticBezierCurve3(a, new THREE.Vector3((a.x + b.x) / 2, a.y + 0.42, SZ), b);
        const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.028, 10), new THREE.MeshStandardMaterial({ color: 0xf2efe8, emissive: 0x000000, roughness: 0.4 }));
        m.castShadow = true;
        app.add(m);
        return m;
      };
      const pipeGK = pipe(0), pipeKT = pipe(1);

      // The ball
      const BALL_R = 0.13;
      const ball = shade(new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 40, 24), Object.assign(hatchMat(2, 1), { roughness: 0.45 })));
      app.add(ball);

      // ---------- physics ----------
      const M = 0.5, G = 9.8;
      const Ep = (x) => M * G * (hgt(x) - Y0);
      const Ek = (x, v) => 0.5 * M * v * v * (1 + slope(x) ** 2);
      const EMAX = Ep(X1);
      const S = { x: -1.25, v: 0, e0: 0, heat: 0, friction: true, held: true };
      S.e0 = Ep(S.x);

      const step = (dt) => {
        const n = 10, h = dt / n;
        for (let i = 0; i < n; i++) {
          const s = slope(S.x);
          const acc = -(G * s + s * 2 * K * S.v * S.v) / (1 + s * s) - (S.friction ? 0.32 : 0) * S.v;
          S.v += acc * h;
          S.x += S.v * h;
          if (Math.abs(S.x) > X1 - 0.05) { S.x = Math.sign(S.x) * (X1 - 0.05); S.v = 0; }
        }
        // Whatever left the mechanical stores went into heat
        const lost = S.e0 - Ep(S.x) - Ek(S.x, S.v);
        if (lost > 0) { S.heat += lost; S.e0 -= lost; }
      };

      const placeBall = () => {
        const s = slope(S.x), l = Math.hypot(1, s);
        ball.position.set(S.x - (s / l) * BALL_R, hgt(S.x) + BALL_R / l, TZ);
        ball.rotation.z = -S.x / BALL_R;
      };

      // ---------- input ----------
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const plane = new THREE.Plane();
      const hit = new THREE.Vector3();
      const canvas = renderer.domElement;
      let dragging = false, lastTouch = -1e9, auto = null;
      const pointerTo = (e) => {
        const r = canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
      };
      const overBall = () => ray.intersectObjects([ball, ...trackParts], false).length > 0;
      const dragTo = () => {
        const wz = app.localToWorld(new THREE.Vector3(0, 0, TZ)).z;
        plane.set(new THREE.Vector3(0, 0, 1), -wz);
        if (!ray.ray.intersectPlane(plane, hit)) return;
        const local = app.worldToLocal(hit.clone());
        S.x = clamp(local.x, -X1 + 0.06, X1 - 0.06);
        S.v = 0;
        S.e0 = Ep(S.x);
      };
      canvas.addEventListener('pointerdown', (e) => {
        pointerTo(e);
        if (!overBall()) return;
        dragging = true; S.held = true; auto = null;
        canvas.setPointerCapture(e.pointerId);
        canvas.classList.add('grabbing');
        hint.classList.add('gone');
        dragTo();
      });
      canvas.addEventListener('pointermove', (e) => {
        pointerTo(e);
        if (dragging) dragTo();
        else canvas.classList.toggle('grab', overBall());
      });
      const release = () => {
        if (!dragging) return;
        dragging = false; S.held = false; lastTouch = performance.now();
        canvas.classList.remove('grabbing');
      };
      canvas.addEventListener('pointerup', release);
      canvas.addEventListener('pointercancel', release);

      fricBtn.addEventListener('click', () => {
        S.friction = !S.friction;
        fricBtn.setAttribute('aria-pressed', S.friction);
      });
      resetBtn.addEventListener('click', () => {
        Object.assign(S, { x: -1.25, v: 0, heat: 0, held: true });
        S.e0 = Ep(S.x);
        auto = { from: S.x, to: S.x, t: 0, dur: 0.6 };
      });

      // ---------- frame ----------
      let W = 0, H = 0;
      const target = new THREE.Vector3();
      const resize = () => {
        W = root.clientWidth; H = root.clientHeight;
        renderer.setSize(W, H, false);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
      };

      let rest = 0, visible = false, last = 0, clock = 0;
      auto = { from: S.x, to: S.x, t: 0, dur: 1.2 };
      const tick = (now) => {
        if (!visible) return;
        const dt = Math.min(0.04, (now - last) / 1000);
        last = now;
        clock += dt;

        // Demo mode: once the ball settles and nobody is touching, lift it up again
        if (auto) {
          auto.t += dt;
          const k = clamp(auto.t / auto.dur, 0, 1);
          S.x = auto.from + (auto.to - auto.from) * ease(k);
          S.v = 0; S.e0 = Ep(S.x);
          if (k >= 1) { auto = null; S.held = false; }
        } else if (!S.held) {
          step(dt * 0.8);
          const still = Math.abs(S.v) < 0.03 && Math.abs(S.x) < 0.05;
          rest = still ? rest + dt : 0;
          if (rest > 1.6 && now - lastTouch > 4000) {
            S.held = true; rest = 0;
            const side = Math.random() < 0.5 ? -1 : 1;
            auto = { from: S.x, to: side * (0.95 + Math.random() * 0.35), t: 0, dur: 1.4 };
          }
        }
        // Heat leaks out to the room once the ball is resting
        if (rest > 0.4 || S.held) S.heat *= Math.exp(-dt * 0.5);

        placeBall();
        const vals = [Ep(S.x), Ek(S.x, S.v), S.heat];
        STORES.forEach((st, i) => {
          const f = clamp(vals[i] / EMAX, 0, 1);
          st.liquid.scale.y = Math.max(0.004, f * (BH - 0.04));
          st.glow.intensity = 0.15 + f * 1.4;
          const r = Math.round(vals[i] * 10) / 10;
          if (r !== st.shown) { st.shown = r; drawCard(st, r); }
        });
        // Power through each pipe
        const pGK = Math.abs(2 * M * G * K * S.x * S.v) / EMAX;
        const pKT = S.friction && !S.held ? (0.32 * M * S.v * S.v * (1 + slope(S.x) ** 2)) / EMAX * 4 : 0;
        pipeGK.material.emissive.setHex(S.x * S.v < 0 ? STORES[0].color : STORES[1].color);
        pipeGK.material.emissiveIntensity = clamp(pGK * 0.9, 0, 1.2);
        pipeKT.material.emissive.setHex(STORES[2].color);
        pipeKT.material.emissiveIntensity = clamp(pKT, 0, 1.2);

        // Camera drifts very slightly, like a hand-held shot
        const narrow = W < 640;
        target.set(narrow ? 2.25 : 1.85, 1.1, 0.3);
        const az = -0.24 + Math.sin(clock * 0.18) * 0.03, el = 0.5 + Math.sin(clock * 0.13) * 0.015;
        const R = narrow ? 13 : 8.9;
        camera.position.set(target.x + Math.sin(az) * Math.cos(el) * R, target.y + Math.sin(el) * R, target.z + Math.cos(az) * Math.cos(el) * R);
        camera.lookAt(target);
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      };
      new IntersectionObserver(([e]) => {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was) { last = performance.now(); requestAnimationFrame(tick); }
      }).observe(root);

      new ResizeObserver(resize).observe(root);
      resize();
      // Test hook: root.ixBall(x, v) places the ball mid-swing
      root.ixBall = (x, v) => { auto = null; Object.assign(S, { x, v, held: false }); S.e0 = Ep(x) + Ek(x, v); };
    }
  },
});
