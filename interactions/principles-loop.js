MicroIX.register({
  id: 'principles-loop',
  title: 'Animation principles loop',
  description: 'A voxel critter hops across the keyframes of a floating timeline, and each animation principle checks off on the exact frame it happens: anticipation, squash & stretch, overlapping action, follow-through and arcs. The whole 8 s loop is a pure function of time, so you can scrub it or click a principle to jump to its frame.',
  tags: ['3d', 'motion', 'three.js'],
  source: { label: '@ai_funss on X ↗', url: 'https://x.com/ai_funss/status/2109258957776990434' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-loop { position: absolute; inset: 0; overflow: hidden; background: #f4f2ee; color: #0f0f0f; font-family: "Geist Mono", ui-monospace, Menlo, monospace; user-select: none; -webkit-user-select: none; }
.ix-loop canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; display: block; }
.ix-loop .fx { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(120% 90% at 50% 45%, transparent 60%, rgba(40,30,20,.18)); }
.ix-loop .fx::after { content: ""; position: absolute; inset: 0; opacity: .05; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E"); }
.ix-loop .labels { position: absolute; z-index: 2; left: 22px; top: 20px; display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; }
.ix-loop .labels button { display: flex; align-items: center; gap: 10px; padding: 0; border: 0; background: none; color: #8e8a83; font: 500 13px "Geist Mono", ui-monospace, Menlo, monospace; letter-spacing: .02em; cursor: pointer; transition: color .15s; }
.ix-loop .labels button:hover { color: #5a5751; }
.ix-loop .labels i { width: 8px; height: 8px; border: 1.2px solid currentColor; rotate: 45deg; transition: background .15s, border-color .15s; }
.ix-loop .labels .on { color: #0f0f0f; }
.ix-loop .labels .on i { border-color: #ff6a2b; background: #ff6a2b; box-shadow: 0 0 8px #ff6a2b; }
.ix-loop .labels em { font-style: normal; color: #d97757; }
.ix-loop .scrub { position: absolute; z-index: 2; left: 18px; right: 18px; bottom: 14px; display: flex; align-items: center; gap: 12px; font-size: 11px; color: #6d6a64; }
.ix-loop .play { display: grid; place-items: center; width: 28px; height: 28px; padding: 0; border: 0; border-radius: 50%; background: #fff; color: #0f0f0f; cursor: pointer; box-shadow: 0 2px 8px -4px rgba(0,0,0,.35); }
.ix-loop .play svg { width: 10px; height: 10px; fill: currentColor; }
.ix-loop .track { position: relative; flex: 1; height: 22px; cursor: ew-resize; touch-action: none; }
.ix-loop .track::before { content: ""; position: absolute; left: 0; right: 0; top: 10px; height: 2px; border-radius: 2px; background: rgba(0,0,0,.1); }
.ix-loop .track .fill { position: absolute; left: 0; top: 10px; height: 2px; border-radius: 2px; background: #ff6a2b; }
.ix-loop .track .key { position: absolute; top: 8px; width: 6px; height: 6px; margin-left: -3px; rotate: 45deg; background: #fff; border: 1px solid #0f0f0f; }
.ix-loop .track .head { position: absolute; top: 4px; width: 2px; height: 14px; margin-left: -1px; border-radius: 1px; background: #ff6a2b; }
.ix-loop .frame { min-width: 64px; text-align: right; font-variant-numeric: tabular-nums; }
.ix-loop .status { position: absolute; inset: 0; display: grid; place-items: center; font-size: 12px; color: #8e8a83; }
@media (max-width: 640px) {
  .ix-loop .labels button { font-size: 10px; gap: 7px; }
  .ix-loop .labels { left: 14px; top: 14px; }
}
`,
  mount(stage) {
    const LEN = 480; // frames in the loop, 60 fps
    const LABELS = [
      ['01 ANTICIPATION', 69],
      ['02 SQUASH <em>&amp;</em> STRETCH', 140],
      ['03 OVERLAPPING ACTION', 200],
      ['04 FOLLOW-THROUGH', 285],
      ['05 ARCS', 303],
    ];

    stage.innerHTML = `
      <div class="ix-loop">
        <div class="status">Loading three.js…</div>
        <div class="fx"></div>
        <ul class="labels">${LABELS.map(([t, f]) => `<li><button data-f="${f}"><i></i>${t}</button></li>`).join('')}</ul>
        <div class="scrub">
          <button class="play" aria-label="Pause"><svg viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8"/><rect x="6" y="1" width="3" height="8"/></svg></button>
          <div class="track" role="slider" aria-label="Frame" aria-valuemin="0" aria-valuemax="479" tabindex="0"><div class="fill"></div>${[105, 165, 225, 285, 384].map((f) => `<span class="key" style="left:${(f / LEN) * 100}%"></span>`).join('')}<div class="head"></div></div>
          <span class="frame">F 000</span>
        </div>
      </div>`;

    // Geist Mono, once
    if (!document.getElementById('ix-geist-mono')) {
      const l = document.createElement('link');
      l.id = 'ix-geist-mono';
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap';
      document.head.append(l);
    }

    const root = stage.querySelector('.ix-loop');
    const status = root.querySelector('.status');
    const labelBtns = [...root.querySelectorAll('.labels button')];
    const playBtn = root.querySelector('.play');
    const track = root.querySelector('.track');
    const fill = track.querySelector('.fill');
    const head = track.querySelector('.head');
    const frameEl = root.querySelector('.frame');

    const V = 'https://cdn.jsdelivr.net/npm/three@0.160.0';
    Promise.all([
      import(`${V}/build/three.module.js`),
    ]).then(([THREE]) => build(THREE)).catch(() => { status.textContent = 'Could not load three.js'; });

    function build(THREE) {
      status.remove();

      // ---------- helpers ----------
      const clamp01 = (v) => Math.max(0, Math.min(1, v));
      const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
      const lerp = (a, b, t) => a + (b - a) * t;
      const easeOut = (t) => 1 - (1 - t) ** 3;
      // Damped spring response: starts at 1, settles to 0
      const spring = (dt, w, z) => (dt < 0 ? 0 : Math.exp(-z * w * dt) * Math.cos(w * Math.sqrt(1 - z * z) * dt));
      const rand = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      const kelvin = { k3200: 0xffb877, k5000: 0xfff1e0, k7500: 0xcfdcff };

      // ---------- renderer / scene ----------
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      root.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf4f2ee);
      const camera = new THREE.PerspectiveCamera(18, 1, 1, 200);

      const hemi = new THREE.HemisphereLight(0xffffff, 0xd9d4cc, 1.1);
      scene.add(hemi);

      const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...o });
      const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);

      // Backdrop catches the slab's soft shadow
      const softTex = (() => {
        const c = document.createElement('canvas'); c.width = 256; c.height = 128;
        const g = c.getContext('2d');
        g.filter = 'blur(14px)';
        g.fillStyle = 'rgba(58,44,32,.5)';
        g.beginPath(); g.roundRect(40, 30, 176, 68, 30); g.fill();
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
      })();
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(17, 8.5), new THREE.MeshBasicMaterial({ map: softTex, transparent: true, depthWrite: false, opacity: 0.55 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(-0.6, -3.2, 0.4);
      scene.add(floor);

      // Floating slab
      const slab = box(12, 0.5, 6, mat(0xffffff, { roughness: 0.6 }));
      slab.position.y = -0.25;
      slab.castShadow = slab.receiveShadow = true;
      scene.add(slab);

      // Timeline tracks: 3 rows of cells. Instanced so the landing ripple is one buffer update.
      const COLS = 40, ROWS = [-0.95, 0, 0.95];
      const cells = new THREE.InstancedMesh(new THREE.BoxGeometry(0.23, 0.04, 0.8), mat(0xefeeea, { roughness: 0.9 }), COLS * ROWS.length);
      cells.receiveShadow = true;
      scene.add(cells);
      const cellX = (c) => -5 + 0.25 * c + 0.125;
      const m4 = new THREE.Matrix4();

      // Ruler with frame numbers, drawn into a texture
      const rc = document.createElement('canvas');
      rc.width = 2048; rc.height = 128;
      const rx = rc.getContext('2d');
      rx.fillStyle = '#ffffff'; rx.fillRect(0, 0, 2048, 128);
      rx.fillStyle = '#8e8a83'; rx.font = '500 44px ui-monospace, Menlo, monospace'; rx.textAlign = 'center';
      for (let i = 0; i <= 40; i++) {
        const x = (i / 40) * 2048;
        rx.fillRect(x - 1.5, 0, 3, i % 4 === 0 ? 40 : 20);
        if (i % 8 === 0) rx.fillText(String(i * 12), Math.min(2010, Math.max(38, x)), 100);
      }
      const rulerTex = new THREE.CanvasTexture(rc);
      rulerTex.colorSpace = THREE.SRGBColorSpace;
      rulerTex.anisotropy = 8;
      const ruler = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.62), new THREE.MeshStandardMaterial({ map: rulerTex, roughness: 0.9 }));
      ruler.rotation.x = -Math.PI / 2;
      ruler.position.set(0, 0.011, -1.85);
      ruler.receiveShadow = true;
      scene.add(ruler);

      // Keyframe diamonds on the middle track, 2 units apart
      const DX = [-4, -2, 0, 2, 4];
      const LIT = [384, 105, 165, 225, 285];
      const glowTex = (() => {
        const c = document.createElement('canvas'); c.width = c.height = 128;
        const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        r.addColorStop(0, 'rgba(255,140,70,1)'); r.addColorStop(0.35, 'rgba(255,106,43,.45)'); r.addColorStop(1, 'rgba(255,106,43,0)');
        g.fillStyle = r; g.fillRect(0, 0, 128, 128);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
      })();
      const diamonds = DX.map((x) => {
        const g = new THREE.Group();
        const m = mat(0xffffff, { roughness: 0.4, emissive: 0xff6a2b, emissiveIntensity: 0 });
        const d = box(0.34, 0.07, 0.34, m);
        d.castShadow = true;
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(d.geometry), new THREE.LineBasicMaterial({ color: 0x0f0f0f }));
        d.add(edge);
        g.add(d);
        g.rotation.y = Math.PI / 4;
        g.position.set(x, 0.07, 0);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
        glow.scale.set(1.6, 1.6, 1);
        glow.position.set(x, 0.12, 0);
        scene.add(g, glow);
        return { m, glow };
      });

      // Playhead line + a small point light at the front edge of the track
      const playhead = box(0.035, 0.03, 3.1, mat(0xff6a2b, { emissive: 0xff6a2b, emissiveIntensity: 2 }));
      playhead.position.y = 0.03;
      scene.add(playhead);
      const phLight = new THREE.PointLight(0xff6a2b, 0, 2.6, 2);
      scene.add(phLight);

      // ---------- stands + lights ----------
      const black = mat(0x151515, { roughness: 0.5 });
      // A thin bar between two points
      const rod = (a, b, r) => {
        const d = new THREE.Vector3().subVectors(b, a);
        const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 6), black);
        m.position.copy(a).addScaledVector(d, 0.5);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
        return m;
      };
      const tripod = (x, z, h) => {
        const g = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, h, 8), black);
        pole.position.y = h / 2;
        g.add(pole);
        for (let k = 0; k < 3; k++) {
          const a = (k / 3) * Math.PI * 2 + 0.5;
          g.add(rod(new THREE.Vector3(0, 0.6, 0), new THREE.Vector3(Math.cos(a) * 0.38, 0, Math.sin(a) * 0.38), 0.018));
        }
        g.position.set(x, 0, z);
        scene.add(g);
        return g;
      };
      const panel = (w, h, color) => {
        const g = new THREE.Group();
        const housing = box(w + 0.08, h + 0.08, 0.14, black);
        const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0x222222 }));
        face.position.z = 0.075;
        g.add(housing, face);
        housing.castShadow = true;
        return { g, face, color: new THREE.Color(color) };
      };

      // Key: softbox front-right
      tripod(5.3, 2.3, 2.1);
      const keyBox = panel(0.9, 0.9, kelvin.k3200);
      keyBox.g.position.set(5.3, 2.5, 2.3);
      keyBox.g.lookAt(0, 0.8, 0);
      scene.add(keyBox.g);
      const key = new THREE.DirectionalLight(kelvin.k3200, 0);
      key.position.set(Math.sin(0.49) * 16, 10, Math.cos(0.49) * 16); // ~28° from the front, right
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.radius = 6;
      key.shadow.bias = -0.0004;
      Object.assign(key.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 50 });
      scene.add(key);

      // Rim: strip light back-left, panel turned toward camera so its click reads
      tripod(-5.3, -2.3, 1.2);
      const rimBox = panel(0.22, 1.7, kelvin.k7500);
      rimBox.g.position.set(-5.3, 2.15, -2.3);
      rimBox.g.lookAt(-1.5, 2.1, 20);
      scene.add(rimBox.g);
      const rim = new THREE.DirectionalLight(kelvin.k7500, 0);
      rim.position.set(-10, 6, -10);
      scene.add(rim);

      // Top spot: boom from the back-right corner, lamp hanging at 5.8 over the flip
      tripod(5.3, -2.3, 5.9);
      scene.add(rod(new THREE.Vector3(5.3, 5.9, -2.3), new THREE.Vector3(-0.4, 6.05, 0.15), 0.022));
      scene.add(rod(new THREE.Vector3(0, 5.95, 0), new THREE.Vector3(0, 5.8, 0), 0.015));
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.45, 20), black);
      lamp.position.set(0, 5.6, 0);
      scene.add(lamp);
      const lens = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.035, 8, 32), new THREE.MeshBasicMaterial({ color: 0x222222 }));
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 5.37, 0);
      scene.add(lens);
      const spot = new THREE.SpotLight(kelvin.k5000, 0, 14, (34 / 2) * (Math.PI / 180), 0.45, 1.2);
      spot.position.set(0, 5.4, 0);
      spot.target.position.set(0, 0, 0);
      spot.castShadow = true;
      spot.shadow.mapSize.set(1024, 1024);
      scene.add(spot, spot.target);

      // ---------- the critter ----------
      const clay = new THREE.MeshPhysicalMaterial({ color: 0xd97757, roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 });
      const voxTex = (() => {
        // Faint voxel grid so the body reads as 0.1 cubes
        const c = document.createElement('canvas'); c.width = c.height = 140;
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 140, 140);
        g.strokeStyle = 'rgba(0,0,0,.09)'; g.lineWidth = 1.5;
        for (let i = 0; i <= 14; i++) { g.beginPath(); g.moveTo(i * 10, 0); g.lineTo(i * 10, 140); g.stroke(); g.beginPath(); g.moveTo(0, i * 10); g.lineTo(140, i * 10); g.stroke(); }
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
      })();
      clay.map = voxTex;
      const critter = new THREE.Group();     // at the feet; moves along the timeline
      const spin = new THREE.Group();        // pivot at the body centre for the flip
      spin.position.y = 0.65;
      const squash = new THREE.Group();      // pivot back at the feet for squash & stretch
      squash.position.y = -0.65;
      critter.add(spin); spin.add(squash);
      const body = box(1.4, 1.0, 0.8, clay);
      body.position.y = 0.3 + 0.5;
      body.castShadow = true;
      squash.add(body);
      const limb = (w, h, d) => { const m = box(w, h, d, clay); m.castShadow = true; return m; };
      const arms = [-1, 1].map((s) => {
        const pivot = new THREE.Group();
        pivot.position.set(s * 0.7, 0.85, 0);
        const a = limb(0.3, 0.2, 0.2);
        a.position.x = s * 0.15;
        pivot.add(a);
        squash.add(pivot);
        return { pivot, s };
      });
      const legs = [-0.5, -0.2, 0.2, 0.5].map((x) => {
        const pivot = new THREE.Group();
        pivot.position.set(x, 0.3, 0);
        const l = limb(0.2, 0.3, 0.2);
        l.position.y = -0.15;
        pivot.add(l);
        squash.add(pivot);
        return pivot;
      });
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.3 });
      const eyes = [-0.3, 0.3].map((x) => {
        const e = box(0.2, 0.3, 0.04, eyeMat);
        e.position.set(x, 0.9, 0.41);
        squash.add(e);
        return { e, x };
      });
      scene.add(critter);

      // Sparks: 12 voxels per landing
      const LANDS = [105, 165, 225, 285, 384];
      const LAND_X = [-2, 0, 2, 4, -4];
      const sparks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat(0xff6a2b, { emissive: 0xff6a2b, emissiveIntensity: 1.6 }), LANDS.length * 12);
      scene.add(sparks);
      const sparkSeed = LANDS.map((_, k) => {
        const r = rand(97 + k * 13);
        return Array.from({ length: 12 }, () => ({
          a: r() * Math.PI * 2, v: 1.6 + r() * 2.2, up: 2.2 + r() * 2.6, s: 0.075 + r() * 0.045, spin: r() * 6,
        }));
      });

      // Dotted arc for the flip, starts above the critter's head
      const ARC_N = 26;
      const dotMat = mat(0xff6a2b, { emissive: 0xff6a2b, emissiveIntensity: 1.2 });
      const arcDots = Array.from({ length: ARC_N }, (_, j) => {
        const u = j / (ARC_N - 1);
        const d = box(0.07, 0.07, 0.07, dotMat);
        d.position.set(lerp(4, -4, u), 1.55 + 3.5 * 4 * u * (1 - u), 0);
        scene.add(d);
        return d;
      });

      // ---------- motion, as pure functions of the frame ----------
      const EVENTS = [
        { crouch: 69, take: 80, land: 105, x0: -4, x1: -2, h: 1.15, depth: 1 },
        { crouch: 129, take: 140, land: 165, x0: -2, x1: 0, h: 1.15, depth: 1 },
        { crouch: 189, take: 200, land: 225, x0: 0, x1: 2, h: 1.15, depth: 1 },
        { crouch: 249, take: 260, land: 285, x0: 2, x1: 4, h: 1.15, depth: 1 },
        { crouch: 312, take: 330, land: 384, x0: 4, x1: -4, h: 3.5, depth: 1.5, flip: true },
      ];
      const W_BODY = 0.3, Z_BODY = 0.55;   // landing spring
      const W_ARM = (2 * Math.PI * 2.2) / 60, Z_ARM = 0.22; // arms: 2.2 Hz, light damping

      const pose = (f) => {
        let e = null;
        for (const ev of EVENTS) if (f >= ev.crouch) e = ev;
        const out = { x: -4, y: 0, sx: 1, sy: 1, rot: 0, arm: 0, leg: 0 };
        if (!e) {
          // Before the first hop: still settling from the flip landing of the previous loop
          const dt = f + LEN - 384;
          const k = spring(dt, W_BODY, Z_BODY) * 0.42;
          out.sy = 1 - k; out.sx = 1 + k * 0.6;
          out.arm = -spring(dt, W_ARM, Z_ARM) * 1.1;
          return out;
        }
        if (f < e.take) {
          // Anticipation: crouch, arms swing back
          const c = easeOut((f - e.crouch) / (e.take - e.crouch));
          const d = e.depth;
          out.x = e.x0;
          out.sx = 1 + 0.2 * c * d; out.sy = 1 - 0.25 * c * d;
          out.arm = 0.7 * c; out.leg = 0;
          // carry-over from the previous landing
          const prev = EVENTS[EVENTS.indexOf(e) - 1];
          if (prev) { const k = spring(f - prev.land, W_BODY, Z_BODY) * 0.3; out.sy -= k * (1 - c); out.sx += k * 0.6 * (1 - c); }
          return out;
        }
        if (f < e.land) {
          // In the air: stretch at takeoff, relax, a little stretch again coming down
          const u = (f - e.take) / (e.land - e.take);
          out.x = lerp(e.x0, e.x1, u);
          out.y = e.h * 4 * u * (1 - u);
          const st = Math.max(0, 1 - u / 0.35) + Math.max(0, (u - 0.8) / 0.2) * 0.35;
          out.sx = 1 - 0.15 * st; out.sy = 1 + 0.28 * st;
          if (e.flip) out.rot = Math.PI * 2 * smooth(0.05, 0.95, u);
          out.arm = -1.1 + 0.4 * u;
          out.leg = 0.5 * Math.sin(u * Math.PI);
          return out;
        }
        // Landing: squash 1.25 × 0.7, spring back; arms follow through on their own spring
        const dt = f - e.land;
        const big = e.flip ? 1.4 : 1;
        const k = spring(dt, W_BODY, Z_BODY) * 0.3 * big;
        out.x = e.x1;
        out.sy = 1 - k; out.sx = 1 + k * 0.85;
        out.arm = -spring(dt, W_ARM, Z_ARM) * 1.1 * big;
        out.leg = -spring(dt, W_BODY, Z_BODY) * 0.25;
        return out;
      };
      const wrapF = (f) => ((f % LEN) + LEN) % LEN;

      // Light switch with a 3-frame flicker; everything snaps off on frame 468
      const FLICK = [1, 0.15, 0.85, 0.05, 1];
      const lightOn = (f, at) => (f < at || f >= 468 ? 0 : f - at < FLICK.length ? FLICK[Math.floor(f - at)] : 1);

      // ---------- per-frame render ----------
      let W = 0, H = 0;
      const resize = () => {
        W = root.clientWidth; H = root.clientHeight;
        renderer.setSize(W, H, false);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
      };

      const renderAt = (t) => {
        const f = wrapF(t * 60);
        const P = pose(f);

        // Critter, with arms lagging 4 frames and legs 6 behind the body
        critter.position.set(P.x, P.y, 0);
        spin.rotation.z = P.rot;
        squash.scale.set(P.sx, P.sy, P.sx);
        const A = pose(wrapF(f - 4)), L6 = pose(wrapF(f - 6));
        arms.forEach(({ pivot, s }) => (pivot.rotation.z = s * A.arm * 0.9));
        legs.forEach((p, i) => (p.rotation.x = (i % 2 ? 1 : -1) * L6.leg));

        // Eyes glance at each light as it clicks on, and blink at 7.2 s
        const glance = (at) => smooth(at, at + 4, f) * (1 - smooth(at + 16, at + 26, f));
        const gx = glance(6) * 0.08 - glance(24) * 0.08;
        const gy = glance(42) * 0.06;
        const blink = f >= 432 && f < 440 ? 1 - Math.sin(((f - 432) / 8) * Math.PI) * 0.9 : 1;
        eyes.forEach(({ e, x }) => { e.position.x = x + gx; e.position.y = 0.9 + gy; e.scale.y = blink; });

        // Lights
        const kOn = lightOn(f, 6), rOn = lightOn(f, 24), sOn = lightOn(f, 42);
        key.intensity = 2.3 * kOn;
        rim.intensity = 1.6 * rOn;
        spot.intensity = 45 * sOn;
        hemi.intensity = 0.95 + 0.25 * Math.max(kOn, rOn, sOn);
        keyBox.face.material.color.copy(kOn ? keyBox.color : new THREE.Color(0x222222)).multiplyScalar(kOn ? 1.6 : 1);
        rimBox.face.material.color.copy(rOn ? rimBox.color : new THREE.Color(0x222222)).multiplyScalar(rOn ? 1.6 : 1);
        lens.material.color.set(sOn ? 0xfff1e0 : 0x222222);

        // Playhead: constant speed, crosses each diamond on its landing frame, rewinds under the flip
        let px = -4;
        if (f >= 45 && f < 285) px = -4 + (f - 45) / 30;
        else if (f >= 285 && f < 330) px = 4;
        else if (f >= 330 && f < 384) px = lerp(4, -4, smooth(330, 384, f));
        const live = f < 468;
        playhead.position.x = px;
        playhead.visible = live;
        phLight.position.set(px, 0.35, 1.7);
        phLight.intensity = live ? 2.2 : 0;

        // Diamonds light up on their landing
        diamonds.forEach((d, i) => {
          const on = f >= LIT[i] && f < 468;
          const pop = on ? 1 + 1.5 * Math.exp(-(f - LIT[i]) / 6) : 0;
          d.m.emissiveIntensity = on ? 2.2 * pop : 0;
          d.m.color.set(on ? 0xff6a2b : 0xffffff);
          d.glow.material.opacity = on ? Math.min(1, 0.55 * pop) : 0;
        });

        // Track cells ripple out from each landing
        let n = 0;
        ROWS.forEach((z) => {
          for (let c = 0; c < COLS; c++) {
            const x = cellX(c);
            let y = 0.02;
            LANDS.forEach((lf, k) => {
              const dt = f - lf;
              if (dt < 0 || dt > 60) return;
              const dist = Math.hypot(x - LAND_X[k], z);
              const front = dt * 0.11;
              y += 0.08 * Math.exp(-((dist - front) ** 2) / 0.12) * Math.exp(-dt / 22) * (k === 4 ? 1.4 : 1);
            });
            m4.makeTranslation(x, y, z);
            cells.setMatrixAt(n++, m4);
          }
        });
        cells.instanceMatrix.needsUpdate = true;

        // Sparks
        let s = 0;
        const q = new THREE.Quaternion(), e3 = new THREE.Euler(), v3 = new THREE.Vector3(), sc = new THREE.Vector3();
        LANDS.forEach((lf, k) => {
          const dt = (f - lf) / 60;
          sparkSeed[k].forEach((p) => {
            if (dt < 0 || dt > 0.7) { m4.makeScale(0, 0, 0); sparks.setMatrixAt(s++, m4); return; }
            const big = k === 4 ? 1.35 : 1;
            v3.set(LAND_X[k] + Math.cos(p.a) * p.v * dt * big, 0.15 + p.up * dt * big - 7 * dt * dt, Math.sin(p.a) * p.v * dt * big);
            e3.set(p.spin * dt * 4, p.spin * dt * 3, 0);
            q.setFromEuler(e3);
            const life = 1 - dt / 0.7;
            sc.setScalar(p.s * life);
            m4.compose(v3, q, sc);
            sparks.setMatrixAt(s++, m4);
          });
        });
        sparks.instanceMatrix.needsUpdate = true;

        // Dotted arc draws in from 303, fades after the flip lands
        arcDots.forEach((d, j) => {
          const at = 303 + (j / ARC_N) * 15;
          d.visible = f >= at && f < 468;
          d.scale.setScalar(f >= 400 ? 1 - smooth(400, 440, f) : 1);
        });

        // Camera: FOV 18, 30° up, gentle ±10° orbit, push in 25% tracking the hops,
        // a 4% punch on the flip landing
        const push = smooth(45, 100, f) - smooth(290, 360, f);
        const punch = f >= 384 ? 0.04 * Math.exp(-(f - 384) / 10) * Math.sin(Math.min(Math.PI / 2, (f - 384) / 3)) : 0;
        const dist = 44 * (1 - 0.25 * push) * (1 - punch) * (W < 640 ? 1.35 : 1);
        const az = (10 * Math.PI) / 180 * Math.sin((f / LEN) * Math.PI * 2);
        const el = (30 * Math.PI) / 180;
        const tx = P.x * 0.45 * push;
        camera.position.set(tx + Math.sin(az) * Math.cos(el) * dist, 0.6 + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);
        camera.lookAt(tx, 0.6, 0);

        renderer.render(scene, camera);

        // HTML: labels tick on their frames, scrubber follows
        labelBtns.forEach((b) => b.classList.toggle('on', f >= +b.dataset.f && f < 468));
        const pct = (f / LEN) * 100;
        fill.style.width = `${pct}%`;
        head.style.left = `${pct}%`;
        frameEl.textContent = `F ${String(Math.floor(f)).padStart(3, '0')}`;
        track.setAttribute('aria-valuenow', Math.floor(f));
      };

      // ---------- playback ----------
      let t = 0, playing = true, visible = false, last = 0;
      const tick = (now) => {
        if (!visible) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (playing && !scrubbing) t = (t + dt) % (LEN / 60);
        renderAt(t);
        requestAnimationFrame(tick);
      };
      new IntersectionObserver(([e]) => {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was) { last = performance.now(); requestAnimationFrame(tick); }
      }).observe(root);

      const setPlaying = (p) => {
        playing = p;
        playBtn.setAttribute('aria-label', p ? 'Pause' : 'Play');
        playBtn.innerHTML = p
          ? '<svg viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8"/><rect x="6" y="1" width="3" height="8"/></svg>'
          : '<svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z"/></svg>';
      };
      playBtn.addEventListener('click', () => setPlaying(!playing));

      let scrubbing = false;
      const seek = (e) => {
        const r = track.getBoundingClientRect();
        t = (clamp01((e.clientX - r.left) / r.width) * (LEN - 1)) / 60;
      };
      track.addEventListener('pointerdown', (e) => { scrubbing = true; track.setPointerCapture(e.pointerId); seek(e); });
      track.addEventListener('pointermove', (e) => scrubbing && seek(e));
      track.addEventListener('pointerup', () => (scrubbing = false));
      track.addEventListener('keydown', (e) => {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowRight') t = (wrapF(t * 60 + step)) / 60;
        else if (e.key === 'ArrowLeft') t = (wrapF(t * 60 - step)) / 60;
        else if (e.key === ' ') setPlaying(!playing);
        else return;
        e.preventDefault();
      });
      // Click a principle: jump a little before its frame so you see it happen
      labelBtns.forEach((b) => b.addEventListener('click', () => { t = Math.max(0, +b.dataset.f - 24) / 60; setPlaying(true); }));

      new ResizeObserver(resize).observe(root);
      resize();
      renderAt(0);
      // Jump to a frame and hold, e.g. root.ixSeek(384)
      root.ixSeek = (fr) => { t = fr / 60; setPlaying(false); };
    }
  },
});
