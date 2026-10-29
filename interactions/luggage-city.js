MicroIX.register({
  id: 'luggage-city',
  title: 'Luggage city',
  description: 'An isometric clay town where suitcases make their own way to the airport. Click a house to send a bag: it rolls out the door, gets tagged as it passes a glowing gate, rides the conveyor into the terminal, and once six bags are on board the plane takes off.',
  tags: ['3d', 'isometric', 'three.js'],
  source: { label: 'Dribbble ↗', url: 'https://cdn.dribbble.com/userupload/16569515/file/original-d99071d642c8efd87400222a0c344e1a.mp4' },
  layout: { wide: true, stageHeight: 600 },
  css: `
.ix-bag { position: absolute; inset: 0; overflow: hidden; background: #e6f2f5; color: #13213a; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; user-select: none; -webkit-user-select: none; }
.ix-bag canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; display: block; }
.ix-bag canvas.hot { cursor: pointer; }
.ix-bag .top { position: absolute; z-index: 2; left: 18px; right: 18px; top: 16px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; }
.ix-bag .brand { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: .14em; color: #1b4fd8; }
.ix-bag .brand i { width: 18px; height: 18px; border-radius: 5px; background: linear-gradient(135deg, #2bc4f0, #5a3cf0); box-shadow: 0 0 12px rgba(43,196,240,.7); }
.ix-bag .board { display: flex; align-items: center; gap: 10px; padding: 7px 12px; border-radius: 999px; background: rgba(255,255,255,.75); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); box-shadow: 0 6px 20px -12px rgba(20,60,120,.5); font-size: 12px; }
.ix-bag .board span { display: flex; gap: 4px; }
.ix-bag .board b { width: 8px; height: 8px; border-radius: 2px; background: #d3e2e8; transition: background .3s, box-shadow .3s, transform .3s var(--ease-spring); }
.ix-bag .board b.on { background: #2bc4f0; box-shadow: 0 0 8px rgba(43,196,240,.9); transform: scale(1.25); }
.ix-bag .board.go { color: #5a3cf0; }
.ix-bag .hint { position: absolute; z-index: 2; left: 50%; bottom: 16px; translate: -50% 0; padding: 7px 14px; border-radius: 999px; background: rgba(19,33,58,.82); color: #fff; font-size: 12px; pointer-events: none; transition: opacity .4s; white-space: nowrap; }
.ix-bag .hint.gone { opacity: 0; }
.ix-bag .status { position: absolute; inset: 0; display: grid; place-items: center; font-size: 12px; color: #6c8796; }
`,
  mount(stage) {
    const SEATS = 6;
    stage.innerHTML = `
      <div class="ix-bag">
        <div class="top">
          <span class="brand"><i></i>BAGDROP</span>
          <span class="board">Bags on board <span>${'<b></b>'.repeat(SEATS)}</span></span>
        </div>
        <div class="hint">Click a house to send a suitcase</div>
        <div class="status">Loading three.js…</div>
      </div>`;

    const root = stage.querySelector('.ix-bag');
    const status = root.querySelector('.status');
    const hint = root.querySelector('.hint');
    const board = root.querySelector('.board');
    const seats = [...board.querySelectorAll('b')];

    const V = 'https://cdn.jsdelivr.net/npm/three@0.160.0';
    import(`${V}/build/three.module.js`)
      .then((THREE) => build(THREE))
      .catch((e) => { console.error(e); root.append(status); status.textContent = 'Could not load three.js'; });

    function build(THREE) {
      status.remove();
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const smooth = (t) => t * t * (3 - 2 * t);

      // ---------- renderer / scene ----------
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      root.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xe6f2f5);
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -50, 100);
      camera.position.set(10, 11, 10);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xd4ecf2, 2.3));
      const sun = new THREE.DirectionalLight(0xffffff, 1.9);
      sun.position.set(-4, 12, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 40 });
      sun.shadow.bias = -0.0005;
      sun.shadow.radius = 6;
      scene.add(sun);

      // Isometric: the camera looks down the diagonal, so x runs down-right and z down-left on screen
      const town = new THREE.Group();

      scene.add(town);

      const clay = (c = 0xf4f8fa) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 });
      const neon = (c, k = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });
      const box = (w, h, d, m, x, y, z) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
        b.position.set(x, y + h / 2, z);
        b.castShadow = b.receiveShadow = true;
        town.add(b);
        return b;
      };
      const canvasTex = (w, h, draw) => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        draw(c.getContext('2d'), w, h);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        return t;
      };
      // Soft additive halo for anything that glows
      const haloTex = canvasTex(128, 128, (g) => {
        const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = r; g.fillRect(0, 0, 128, 128);
      });
      const halo = (c, w, d, x, z, o = 0.6) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: haloTex, color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0.02, z);
        town.add(m);
        return m;
      };

      // ---------- ground ----------
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), clay(0xe9f4f7));
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      town.add(ground);
      // Raised pavements under the houses
      [[-5.2, 1.4, 3.6, 6.8], [6.0, -2.0, 3, 3.4], [-1.8, 6.6, 3, 3]].forEach(([x, z, w, d]) => box(w, 0.12, d, clay(0xf7fbfc), x, 0, z));

      // ---------- terminal and runway ----------
      const facade = canvasTex(1024, 320, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, w, h);
        gr.addColorStop(0, '#3b1fd9'); gr.addColorStop(1, '#6a4dff');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(190,200,255,.55)'; g.lineWidth = 3;
        for (let x = 0; x <= w; x += 46) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        for (let y = 0; y <= h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      });
      const term = box(8, 2.4, 2.4, [clay(), clay(), clay(), clay(), new THREE.MeshStandardMaterial({ map: facade, emissiveMap: facade, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.15, metalness: 0.2 }), clay()], -1.6, 0, -6.2);
      box(8.4, 0.18, 2.8, clay(0xffffff), -1.6, 2.4, -6.2);
      // Glowing skylights on the roof
      [-4, -2.2, -0.4].forEach((x) => {
        box(1.1, 0.3, 0.7, neon(0x7fe9ff, 1.4), x, 2.58, -6.3);
        halo(0x7fe9ff, 2.4, 1.8, x, -6.3, 0.0);
      });
      halo(0x6a4dff, 9, 2.2, -1.6, -4.6, 0.5);

      const runway = canvasTex(1024, 256, (g, w, h) => {
        g.fillStyle = '#2d333b'; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(255,255,255,.85)';
        for (let x = 30; x < w; x += 90) g.fillRect(x, h / 2 - 3, 50, 6);
        g.fillStyle = 'rgba(127,233,255,.9)';
        for (let x = 10; x < w; x += 40) { g.fillRect(x, 14, 8, 8); g.fillRect(x, h - 22, 8, 8); }
      });
      const rw = box(16, 0.06, 3.6, new THREE.MeshStandardMaterial({ map: runway, roughness: 0.9 }), 5, 0, -10.2);
      rw.receiveShadow = true;

      // ---------- plane ----------
      const plane = new THREE.Group();
      {
        const white = clay(0xffffff);
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 3.2, 8, 20), white);
        body.rotation.z = Math.PI / 2;
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 4.2), white);
        wing.position.set(0.1, -0.1, 0);
        wing.geometry.translate(0, 0, 0);
        const sweep = wing.geometry.attributes.position;
        for (let i = 0; i < sweep.count; i++) sweep.setX(i, sweep.getX(i) - Math.abs(sweep.getZ(i)) * 0.35);
        wing.geometry.computeVertexNormals();
        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 1.6), white);
        tail.position.set(-1.75, 0.1, 0);
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.06), white);
        fin.position.set(-1.8, 0.55, 0);
        fin.geometry.translate(0, 0, 0);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.73), new THREE.MeshStandardMaterial({ color: 0x5a3cf0, roughness: 0.5 }));
        stripe.position.set(0.1, 0.05, 0);
        const engines = [-1.1, 1.1].map((z) => { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 16), white); e.rotation.z = Math.PI / 2; e.position.set(0.2, -0.28, z); return e; });
        [body, wing, tail, fin, stripe, ...engines].forEach((m) => { m.castShadow = true; plane.add(m); });
      }
      const PARK = new THREE.Vector3(4.5, 0.62, -10.2);
      plane.position.copy(PARK);
      town.add(plane);

      // ---------- hub pad and conveyor ----------
      const padTex = canvasTex(512, 384, (g, w, h) => {
        g.fillStyle = '#1aa6e6'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#ffffff'; g.font = '700 74px "Helvetica Neue", Arial'; g.textAlign = 'center';
        g.fillText('BAGDROP', w / 2, h / 2 + 26);
        g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 6; g.strokeRect(18, 18, w - 36, h - 36);
      });
      const padTop = new THREE.MeshStandardMaterial({ map: padTex, emissiveMap: padTex, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.4 });
      const blue = new THREE.MeshStandardMaterial({ color: 0x1aa6e6, roughness: 0.4, emissive: 0x1aa6e6, emissiveIntensity: 0.25 });
      box(2.4, 0.3, 1.8, [blue, blue, padTop, blue, blue, blue], 2.2, 0, 0);
      halo(0x2bc4f0, 4.4, 3.6, 2.2, 0, 0.55);

      const beltTex = canvasTex(64, 256, (g, w, h) => {
        g.fillStyle = '#5a3cf0'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#8f7bff';
        for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 12);
      });
      beltTex.wrapS = beltTex.wrapT = THREE.RepeatWrapping;
      beltTex.repeat.set(1, 4);
      const beltTop = new THREE.MeshStandardMaterial({ map: beltTex, emissiveMap: beltTex, emissive: 0xffffff, emissiveIntensity: 0.6, roughness: 0.5 });
      box(0.9, 0.24, 4.1, [clay(), clay(), beltTop, clay(), clay(), clay()], 2.2, 0, -2.95);
      // Neon rails along the belt
      [-0.5, 0.5].forEach((dx) => box(0.06, 0.06, 4.1, neon(0x7fe9ff, 1.6), 2.2 + dx, 0.24, -2.95));
      halo(0x7fe9ff, 2.2, 4.8, 2.2, -2.95, 0.5);
      // Tunnel over the last stretch into the terminal
      const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.6, 28, 1, true, 0, Math.PI), clay(0xffffff));
      tunnel.material.side = THREE.DoubleSide;
      tunnel.rotation.set(Math.PI / 2, 0, Math.PI / 2);
      tunnel.position.set(2.2, 0, -4.2);
      tunnel.castShadow = true;
      town.add(tunnel);
      const tunnelRing = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.05, 8, 32, Math.PI), neon(0x7fe9ff, 1.8));
      tunnelRing.position.set(2.2, 0, -3.4);
      town.add(tunnelRing);

      // ---------- houses, gates, routes ----------
      const roofGeo = (() => {
        const s = new THREE.Shape();
        s.moveTo(-0.95, 0); s.lineTo(0, 0.95); s.lineTo(0.95, 0); s.lineTo(-0.95, 0);
        const g = new THREE.ExtrudeGeometry(s, { depth: 1.8, bevelEnabled: false });
        g.translate(0, 0, -0.9);
        return g;
      })();
      const doorMat = neon(0xff8a3d, 1.5);
      const gateMats = [];

      const gate = (x, z, rotY) => {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        g.rotation.y = rotY;
        const mat = neon(0x5fe3ff, 1.3);
        const curve = new THREE.CatmullRomCurve3([[-0.42, 0], [-0.42, 0.75], [-0.3, 0.98], [0, 1.05], [0.3, 0.98], [0.42, 0.75], [0.42, 0]].map(([a, b]) => new THREE.Vector3(a, b, 0)));
        g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.06, 10), mat));
        const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1), new THREE.MeshBasicMaterial({ color: 0x5fe3ff, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
        sheet.position.y = 0.5;
        g.add(sheet);
        town.add(g);
        const h = halo(0x5fe3ff, 1.8, 1.8, x, z, 0.5);
        gateMats.push({ mat, sheet: sheet.material, h, flash: 0 });
        return gateMats.length - 1;
      };

      const houses = [];
      const house = (x, z, rotY, doorOffset) => {
        const g = new THREE.Group();
        g.position.set(x, 0.12, z);
        g.rotation.y = rotY;
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.5, 1.8), clay(0xffffff));
        body.position.y = 0.75;
        const roof = new THREE.Mesh(roofGeo, clay(0xf1f6f8));
        roof.position.y = 1.5;
        const door = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.75), doorMat);
        door.position.set(0, 0.375, 0.905);
        const win = neon(0x9feaff, 0.9);
        const windows = [-0.55, 0.55].map((wx) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.38), win); m.position.set(wx, 1.0, 0.905); return m; });
        [body, roof].forEach((m) => { m.castShadow = m.receiveShadow = true; });
        g.add(body, roof, door, ...windows);
        town.add(g);
        const dir = new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY));
        const doorPos = new THREE.Vector3(x, 0, z).addScaledVector(dir, 1.05);
        halo(0xff8a3d, 1.4, 1.4, doorPos.x, doorPos.z, 0.6);
        houses.push({ g, body, doorPos, lift: 0, route: null });
        g.userData.house = houses.length - 1;
        return houses[houses.length - 1];
      };

      // Each route: door → gate (tagging) → paths → hub pad → belt → into the terminal
      const P = (x, z, y = 0) => new THREE.Vector3(x, y, z);
      const tail = [P(2.2, 0.5, 0.3), P(2.2, -0.75, 0.3), P(2.2, -1.0, 0.24), P(2.2, -4.9, 0.24)];
      const H1 = house(-5.2, -0.6, Math.PI / 2);
      H1.route = { pts: [P(-4.15, -0.6), P(-3.1, -0.6), P(-1.2, -0.6), P(-1.2, 0.5), P(1.0, 0.5), ...tail], gate: 1, g: gate(-3.1, -0.6, Math.PI / 2) };
      const H2 = house(-5.0, 3.4, Math.PI / 2);
      H2.route = { pts: [P(-3.95, 3.4), P(-2.9, 3.4), P(-1.2, 3.4), P(-1.2, 0.5), P(1.0, 0.5), ...tail], gate: 1, g: gate(-2.9, 3.4, Math.PI / 2) };
      // Every door faces the camera (+x or +z) so you can see the bags come out
      const H3 = house(6.0, -2.2, 0);
      H3.route = { pts: [P(6.0, -1.15), P(6.0, -0.2), P(6.0, 0.5), P(3.4, 0.5), ...tail], gate: 1, g: gate(6.0, -0.2, 0) };
      const H4 = house(-1.8, 6.6, Math.PI / 2);
      H4.route = { pts: [P(-0.75, 6.6), P(0.3, 6.6), P(2.2, 6.6), P(2.2, 1.3), P(2.2, 0.9, 0.3), ...tail], gate: 1, g: gate(0.3, 6.6, Math.PI / 2) };

      // Glowing path lines along every route
      const pathMat = neon(0x5fe3ff, 1.1);
      const seen = new Set();
      houses.forEach((h) => h.route.pts.slice(0, -3).forEach((a, i, arr) => {
        const b = h.route.pts[i + 1];
        if (!b || a.y || b.y) return;
        const key = [a.x, a.z, b.x, b.z].map((v) => v.toFixed(1)).join();
        if (seen.has(key)) return;
        seen.add(key);
        const len = a.distanceTo(b);
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, len + 0.07), pathMat);
        m.position.set((a.x + b.x) / 2, 0.01, (a.z + b.z) / 2);
        m.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
        town.add(m);
        const glow = halo(0x5fe3ff, 0.7, len + 0.6, m.position.x, m.position.z, 0.3);
        glow.rotation.z = -m.rotation.y;
      }));

      // Puffy clay trees
      [[-3.6, 7.8], [-6.4, 5.8], [4, 6.8], [6.6, 4.4], [-6.8, -3.4], [4.2, -4.8]].forEach(([x, z], i) => {
        const tr = new THREE.Group();
        tr.position.set(x, 0, z);
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.6), clay());
        trunk.position.y = 0.3;
        tr.add(trunk);
        [[0, 0.85, 0, 0.38], [0.25, 0.7, 0.1, 0.28], [-0.2, 0.75, -0.15, 0.3]].forEach(([a, b, c, r]) => {
          const s = new THREE.Mesh(new THREE.SphereGeometry(r * (1 + (i % 3) * 0.1), 20, 14), clay(0xffffff));
          s.position.set(a, b, c);
          s.castShadow = true;
          tr.add(s);
        });
        town.add(tr);
      });

      // ---------- suitcases ----------
      const TAGS = [0x5a3cf0, 0x22b5e6, 0x3b1fd9];
      const bags = [];
      const bagGeo = new THREE.BoxGeometry(0.34, 0.46, 0.2);
      const handleGeo = new THREE.TorusGeometry(0.07, 0.018, 6, 16, Math.PI);
      const wheelGeo = new THREE.SphereGeometry(0.035, 8, 6);
      const makeBag = (h) => {
        const g = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xf4f8fa, roughness: 0.35, emissive: 0x000000 });
        const body = new THREE.Mesh(bagGeo, mat);
        body.position.y = 0.27;
        body.castShadow = true;
        const handle = new THREE.Mesh(handleGeo, mat);
        handle.position.y = 0.5;
        g.add(body, handle);
        [[-0.12, -0.07], [0.12, -0.07], [-0.12, 0.07], [0.12, 0.07]].forEach(([x, z]) => {
          const w = new THREE.Mesh(wheelGeo, clay(0x223044));
          w.position.set(x, 0.035, z);
          g.add(w);
        });
        town.add(g);
        const pts = h.route.pts;
        const lens = pts.slice(1).map((p, i) => p.distanceTo(pts[i]));
        const tag = new THREE.Color(TAGS[Math.floor(Math.random() * TAGS.length)]);
        const bag = { g, mat, h, pts, lens, seg: 0, d: 0, tag, tagged: false, born: 0 };
        bags.push(bag);
        h.lift = 1;
        // Door flares as the bag leaves
        return bag;
      };

      // ---------- flight state ----------
      let boarded = 0;
      let flight = null; // {t}
      const setBoard = () => {
        seats.forEach((s, i) => s.classList.toggle('on', i < boarded));
        board.classList.toggle('go', boarded >= SEATS);
      };

      // ---------- input ----------
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const canvas = renderer.domElement;
      const houseMeshes = houses.map((h) => h.g);
      let hover = -1, lastClick = -1e9;
      const pick = (e) => {
        const r = canvas.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(houseMeshes, true)[0];
        let o = hit && hit.object;
        while (o && o.userData.house === undefined) o = o.parent;
        return o ? o.userData.house : -1;
      };
      canvas.addEventListener('pointermove', (e) => {
        hover = pick(e);
        canvas.classList.toggle('hot', hover >= 0);
      });
      canvas.addEventListener('pointerleave', () => { hover = -1; });
      canvas.addEventListener('click', (e) => {
        const i = pick(e);
        if (i < 0) return;
        lastClick = performance.now();
        hint.classList.add('gone');
        makeBag(houses[i]);
      });

      // ---------- frame ----------
      let W = 0, H = 0;
      const resize = () => {
        W = root.clientWidth; H = root.clientHeight;
        renderer.setSize(W, H, false);
        // Fit the town: wider frames show more, narrow ones zoom out so nothing is cropped
        const aspect = W / H;
        const hh = W < 640 ? 11.5 / aspect / 2 : Math.max(6.8, 8.5 / aspect);
        Object.assign(camera, { left: -hh * aspect, right: hh * aspect, top: hh, bottom: -hh });
        camera.updateProjectionMatrix();
      };
      // Aim slightly toward the terminal so the runway stays in shot
      camera.position.set(10 + 0.2, 11.5, 10 - 1.4);
      camera.lookAt(0.2, 0.5, -1.4);

      let visible = false, last = 0, clock = 0, nextAuto = 1.2;
      const tmp = new THREE.Vector3();
      const tick = (now) => {
        if (!visible) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        clock += dt;

        // Demo mode: send bags from random houses until someone clicks
        nextAuto -= dt;
        if (nextAuto <= 0) {
          nextAuto = 1.5 + Math.random() * 0.8;
          if (now - lastClick > 6000) makeBag(houses[Math.floor(Math.random() * houses.length)]);
        }

        beltTex.offset.y -= dt * 0.9;

        houses.forEach((h, i) => {
          h.lift = Math.max(0, h.lift - dt * 2.5);
          const target = (i === hover ? 0.12 : 0) + Math.sin(h.lift * Math.PI) * 0.1;
          h.g.position.y += (0.12 + target - h.g.position.y) * Math.min(1, dt * 14);
        });

        for (let k = bags.length - 1; k >= 0; k--) {
          const b = bags[k];
          b.born += dt;
          const onBelt = b.seg >= b.pts.length - 2;
          b.d += dt * (onBelt ? 1.25 : 1.7);
          while (b.seg < b.lens.length && b.d >= b.lens[b.seg]) {
            b.d -= b.lens[b.seg];
            b.seg++;
            if (b.seg === b.h.route.gate && !b.tagged) {
              b.tagged = true;
              gateMats[b.h.route.g].flash = 1;
            }
          }
          if (b.seg >= b.lens.length) {
            town.remove(b.g);
            bags.splice(k, 1);
            if (boarded < SEATS) { boarded++; setBoard(); }
            continue;
          }
          const a = b.pts[b.seg], c = b.pts[b.seg + 1];
          tmp.lerpVectors(a, c, b.d / b.lens[b.seg]);
          // Hop up onto the pad instead of sliding through it
          const hop = a.y !== c.y ? Math.sin((b.d / b.lens[b.seg]) * Math.PI) * 0.25 : 0;
          b.g.position.set(tmp.x, tmp.y + hop + Math.abs(Math.sin(b.born * 14)) * (onBelt ? 0 : 0.025), tmp.z);
          b.g.rotation.y = Math.atan2(c.x - a.x, c.z - a.z) + Math.PI / 2;
          const pop = clamp(b.born * 4, 0, 1);
          b.g.scale.setScalar(smooth(pop));
          if (b.tagged) { b.mat.color.lerp(b.tag, Math.min(1, dt * 6)); b.mat.emissive.copy(b.mat.color).multiplyScalar(0.25); }
        }

        gateMats.forEach((gm) => {
          gm.flash = Math.max(0, gm.flash - dt * 2.2);
          gm.mat.color.setHex(0x5fe3ff).multiplyScalar(1.3 + gm.flash * 2.5);
          gm.sheet.opacity = 0.12 + gm.flash * 0.5;
          gm.h.material.opacity = 0.5 + gm.flash * 0.5;
        });

        // Full plane: roll down the runway, lift off, then a fresh one taxis in
        if (!flight && boarded >= SEATS) flight = { t: 0 };
        if (flight) {
          flight.t += dt;
          const t = flight.t;
          if (t < 4.2) {
            const run = t < 0.6 ? 0 : (t - 0.6) ** 2 * 1.1;
            plane.position.set(PARK.x + run, PARK.y + Math.max(0, run - 4.5) ** 1.6 * 0.35, PARK.z);
            plane.rotation.z = clamp((run - 4.5) * 0.06, 0, 0.22);
          } else if (t < 4.3) {
            boarded = 0; setBoard();
            plane.rotation.z = 0;
          } else {
            const k = smooth(clamp((t - 4.3) / 2.4, 0, 1));
            plane.position.set(PARK.x - 13 * (1 - k), PARK.y, PARK.z);
            if (k >= 1) flight = null;
          }
        }

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
      setBoard();
      // Test hook: root.ixFill(n) pre-loads bags so the next ones trigger a take-off
      root.ixFill = (n) => { boarded = n; setBoard(); for (let i = 0; i < 8; i++) { const b = makeBag(houses[i % 4]); b.seg = 1 + (i % 3); b.born = 1; } };
    }
  },
});
