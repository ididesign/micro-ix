MicroIX.register({
  id: 'globe-dive',
  title: 'Globe dive to map',
  description: 'A toy planet spins in space with pink clouds drifting over it. Tap it and the camera swings round, dives through dusk and a bank of clouds, and lands on a detailed city square where your plans pop up as pins. Drag to spin the globe, tap the back button to rise out again.',
  tags: ['3d', 'map', 'transition'],
  source: { label: '@nal_uh on X ↗', url: 'https://x.com/nal_uh/status/2117021997163221359' },
  layout: { device: { width: 320, height: 660 } },
  css: `
.ix-globe { position: relative; width: 100%; height: 100%; overflow: hidden; isolation: isolate; background: radial-gradient(120% 70% at 50% 45%, #0b1430 0%, #04060f 60%, #000 100%); font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; user-select: none; -webkit-user-select: none; }
.ix-globe canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.ix-globe .px { cursor: grab; touch-action: none; }
.ix-globe .px.drag { cursor: grabbing; }
.ix-globe .ov { pointer-events: none; }
.ix-globe .status { position: absolute; z-index: 9; top: 16px; left: 32px; right: 28px; display: flex; justify-content: space-between; align-items: center; color: #fff; font-weight: 600; font-size: 15px; pointer-events: none; transition: color .6s; }
.ix-globe .battery { width: 25px; height: 12px; border-radius: 4px; background: currentColor; }
.ix-globe.map-on .status { color: #1d2333; }
.ix-globe .hint { position: absolute; z-index: 4; left: 50%; bottom: 34px; translate: -50% 0; padding: 9px 14px; border-radius: 999px; background: rgba(255,255,255,.12); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); color: #fff; font-size: 12px; font-weight: 500; white-space: nowrap; pointer-events: none; transition: opacity .4s; }
.ix-globe.diving .hint, .ix-globe.map-on .hint { opacity: 0; }

/* Cloud bank between space and street level */
.ix-globe .fog { position: absolute; z-index: 5; inset: -20%; opacity: 0; pointer-events: none; background: radial-gradient(60% 40% at 50% 50%, #f1ecf6, #dcd6ea 70%, #cfd2e6); }
.ix-globe .fog i { position: absolute; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #fff, rgba(255,255,255,.85) 40%, rgba(236,232,246,0) 70%); }
.ix-globe .fog.in { animation: ix-globe-fog-in .6s ease-in forwards; }
.ix-globe .fog.out { animation: ix-globe-fog-out 1s ease-out forwards; }
@keyframes ix-globe-fog-in { from { opacity: 0; transform: scale(.45); } to { opacity: 1; transform: scale(1); } }
@keyframes ix-globe-fog-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(2.4); } }

/* Street-level map */
.ix-globe .map { position: absolute; z-index: 3; inset: 0; overflow: hidden; perspective: 640px; opacity: 0; pointer-events: none; transition: opacity .5s; }
.ix-globe .plane { position: absolute; left: -80px; top: -120px; width: 480px; height: 900px; transform-origin: 50% 46%; transform: rotateX(58deg) rotateZ(-26deg) scale(2.3); transition: transform 1.8s cubic-bezier(.2,.75,.2,1); }
.ix-globe .plane svg { display: block; width: 100%; height: 100%; }
.ix-globe.map-on .map { opacity: 1; pointer-events: auto; }
.ix-globe.map-on .plane { transform: none; }
.ix-globe .car { animation: ix-globe-drive var(--d) linear infinite; animation-delay: var(--dl); }
@keyframes ix-globe-drive { from { transform: translateY(var(--from)); } to { transform: translateY(var(--to)); } }

.ix-globe .back { all: unset; position: absolute; z-index: 8; top: 52px; left: 16px; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,.82); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 14px rgba(20,30,60,.18); color: #1d2333; cursor: pointer; opacity: 0; scale: .6; pointer-events: none; transition: opacity .3s, scale .4s cubic-bezier(.3,1.6,.5,1); }
.ix-globe .back svg { width: 20px; height: 20px; }
.ix-globe.map-on .back { opacity: 1; scale: 1; pointer-events: auto; }

/* Pins */
.ix-globe .pin { position: absolute; z-index: 6; display: flex; flex-direction: column; align-items: center; gap: 5px; translate: -50% -100%; pointer-events: none; opacity: 0; scale: .3; transform-origin: 50% 100%; transition: opacity .25s, scale .5s cubic-bezier(.3,1.7,.5,1); }
.ix-globe .pin.show { opacity: 1; scale: 1; }
.ix-globe .badge { position: relative; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 10px; background: #fff; box-shadow: 0 0 0 3px #7cb6ff, 0 6px 14px rgba(20,40,90,.35); color: #1d2333; font-weight: 700; font-size: 14px; }
.ix-globe .badge::after { content: ""; position: absolute; top: -9px; left: 50%; width: 12px; height: 9px; margin-left: -6px; border-radius: 6px 6px 2px 2px; background: #7cb6ff; }
.ix-globe .label { padding: 5px 9px; border-radius: 9px; background: #fff; box-shadow: 0 6px 16px rgba(20,30,60,.25); text-align: center; white-space: nowrap; }
.ix-globe .label b { display: block; font-size: 11px; color: #1d2333; }
.ix-globe .label span { display: block; font-size: 9.5px; color: #6b7184; }

/* Calendar sheet */
.ix-globe .sheet { position: absolute; z-index: 7; left: 8px; right: 8px; bottom: 8px; padding: 16px 14px 10px; border-radius: 26px; background: rgba(248,248,252,.9); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 -6px 30px rgba(20,30,60,.2); translate: 0 115%; transition: translate .6s cubic-bezier(.2,.9,.25,1); }
.ix-globe.sheet-on .sheet { translate: 0 0; }
.ix-globe .sheet h3 { margin: 0 0 12px 4px; font-size: 15px; font-weight: 600; color: #1d2333; }
.ix-globe .sheet button { all: unset; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 44px; margin-bottom: 8px; border-radius: 14px; background: #3a3f4c; color: #fff; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: background .2s, scale .15s; }
.ix-globe .sheet button:hover { background: #2a2e38; }
.ix-globe .sheet button:active { scale: .97; }
.ix-globe .sheet button svg { width: 16px; height: 16px; }
.ix-globe .sheet .later { height: 30px; margin: 0; background: none; color: #4b5162; font-size: 12.5px; }
.ix-globe .sheet .later:hover { background: none; text-decoration: underline; }

@media (prefers-reduced-motion: reduce) {
  .ix-globe .car { animation: none; }
  .ix-globe .plane { transition-duration: .01s; }
}
`,
  mount(stage) {
    stage.innerHTML = `
      <div class="ix-globe">
        <canvas class="px"></canvas>
        <canvas class="ov"></canvas>
        <div class="map"><div class="plane"></div></div>
        <div class="fog"></div>
        <div class="status"><span>9:41</span><span class="battery"></span></div>
        <div class="hint">Tap the globe to fly in</div>
        <button class="back" type="button" aria-label="Back to globe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17"/></svg></button>
        <div class="pin p1"><div class="badge">2</div><div class="label"><b>Morning parade</b><span>Tomorrow · 11:00</span></div></div>
        <div class="pin p2"><div class="badge">1</div><div class="label"><b>Picnic in the park</b><span>Sat · 13:30</span></div></div>
        <div class="sheet">
          <h3>See your plans on your map</h3>
          <button type="button" class="cal"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="11" rx="2.5"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3"/></svg>Phone calendar</button>
          <button type="button" class="cal"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="11" rx="2.5"/><path d="M5 9.5l2 2 4-4.5"/></svg>Work calendar</button>
          <button type="button" class="later">Not now</button>
        </div>
      </div>`;

    const root = stage.querySelector('.ix-globe');
    const px = root.querySelector('.px'), ov = root.querySelector('.ov');
    const pctx = px.getContext('2d'), octx = ov.getContext('2d');
    const fog = root.querySelector('.fog');
    const W = 320, H = 660;

    // ---------- seeded noise ----------
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const perm = new Uint8Array(512);
    { const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
    const hash = (x, y, z) => perm[(perm[(perm[x & 255] + y) & 255] + z) & 255] / 255;
    const sm = (t) => t * t * (3 - 2 * t);
    const noise = (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      const xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
      const l = (a, b, t) => a + (b - a) * t;
      return l(
        l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), xf), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), xf), yf),
        l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), xf), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), xf), yf), zf);
    };
    const fbm = (x, y, z) => { let s = 0, a = .5, f = 1; for (let o = 0; o < 5; o++) { s += a * noise(x * f + 31, y * f + 17, z * f + 5); a *= .5; f *= 2.03; } return s; };
    const vec = (lon, lat) => [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];

    // ---------- planet texture (equirectangular) ----------
    const D = Math.PI / 180;
    const TARGET = { lon: -4 * D, lat: 48 * D }; // the square we land on
    const blobs = [[TARGET.lon, TARGET.lat, .5], [-95 * D, 42 * D, .55], [-60 * D, -15 * D, .45], [20 * D, 5 * D, .5], [90 * D, 45 * D, .55], [135 * D, -25 * D, .35]].map(([lo, la, w]) => [vec(lo, la), w]);
    const TW = 512, TH = 256;
    const tr = new Uint8Array(TW * TH), tg = new Uint8Array(TW * TH), tb = new Uint8Array(TW * TH), city = new Uint8Array(TW * TH);
    for (let v = 0; v < TH; v++) {
      const lat = (.5 - (v + .5) / TH) * Math.PI;
      for (let u = 0; u < TW; u++) {
        const lon = ((u + .5) / TW - .5) * Math.PI * 2;
        const [x, y, z] = vec(lon, lat);
        let h = fbm(x * 1.7, y * 1.7, z * 1.7) - .5;
        blobs.forEach(([b, w]) => { const d = 1 - (x * b[0] + y * b[1] + z * b[2]); h += w * Math.exp(-d / .1) * .8; });
        const i = v * TW + u, alat = Math.abs(lat) / D;
        let r, g, b;
        if (h < .13) {
          const sh = Math.max(0, Math.min(1, (h - .04) / .09)); // shallows near the coast
          r = 18 + sh * 50; g = 66 + sh * 96; b = 168 + sh * 46;
        } else {
          const m = fbm(x * 4 + 9, y * 4, z * 4);
          const dry = alat < 28 && m < .44;
          if (dry) { r = 214; g = 176; b = 110; }
          else { const t = Math.min(1, (h - .13) * 3); r = 96 - t * 34; g = 178 - t * 40; b = 64 - t * 16; }
          if (!dry && rnd() < .09) { r *= .75; g *= .85; b *= .75; } // trees
          if (m > .52 && rnd() < (alat > 30 && alat < 62 ? .3 : .1) * (m - .45) * 4) city[i] = 1; // towns cluster in a few regions
        }
        if (alat > 72 + noise(x * 6, y * 6, z * 6) * 6) { r = 236; g = 242; b = 250; }
        tr[i] = r; tg[i] = g; tb[i] = b;
      }
    }

    // ---------- canvases ----------
    let dpr = 1, img = null, buf = null, pw = 0, ph = 0, scale = 1;
    const sizeCanvases = (s) => {
      scale = s;
      pw = Math.round(W * s); ph = Math.round(H * s);
      px.width = pw; px.height = ph;
      img = pctx.createImageData(pw, ph);
      buf = new Uint32Array(img.data.buffer);
    };
    dpr = Math.min(2, window.devicePixelRatio || 1);
    ov.width = W * dpr; ov.height = H * dpr;
    sizeCanvases(Math.min(1.5, dpr));

    const stars = Array.from({ length: 90 }, () => [rnd() * W, rnd() * H, rnd() * 1.1 + .2, rnd()]);
    const clouds = Array.from({ length: 13 }, () => ({ lon: (rnd() * 2 - 1) * Math.PI, lat: (rnd() * 1.6 - .8), s: .06 + rnd() * .08, sp: .02 + rnd() * .03 }));

    // ---------- camera ----------
    let lon0 = 60 * D, lat0 = 18 * D, R = 128, vLon = 0;
    const R0 = 128, CY = 300;
    let dusk = 0;
    const L = (() => { const l = [-.55, .45, .7]; const n = Math.hypot(...l); return l.map((c) => c / n); })();

    const project = (lon, lat, alt = 1) => {
      let [x, y, z] = vec(lon, lat);
      const cl = Math.cos(lon0), sl = Math.sin(lon0);
      const x1 = x * cl - z * sl, z1 = x * sl + z * cl;
      const ca = Math.cos(lat0), sa = Math.sin(lat0);
      const y2 = y * ca - z1 * sa, z2 = y * sa + z1 * ca;
      return { x: W / 2 + x1 * R * alt, y: CY - y2 * R * alt, z: z2 };
    };

    const drawGlobe = () => {
      buf.fill(0);
      const cx = W / 2 * scale, cy = CY * scale, r = R * scale;
      const ca = Math.cos(lat0), sa = Math.sin(lat0), cl = Math.cos(lon0), sl = Math.sin(lon0);
      const smooth = R > R0 * 1.6;
      const y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(ph, Math.ceil(cy + r));
      for (let py = y0; py < y1; py++) {
        const y = (py + .5 - cy) / r;
        const span = Math.sqrt(Math.max(0, 1 - y * y));
        const x0 = Math.max(0, Math.floor(cx - span * r)), x1 = Math.min(pw, Math.ceil(cx + span * r));
        const vy = -y;
        for (let pxl = x0; pxl < x1; pxl++) {
          const x = (pxl + .5 - cx) / r;
          const zz = 1 - x * x - y * y;
          if (zz <= 0) continue;
          const z = Math.sqrt(zz);
          // view -> world: undo tilt, then undo spin
          const wy = vy * ca + z * sa, z1 = -vy * sa + z * ca;
          const wx = x * cl + z1 * sl, wz = -x * sl + z1 * cl;
          const fu = (Math.atan2(wx, wz) / (Math.PI * 2) + .5) * TW - .5;
          let fv = (.5 - Math.asin(wy > 1 ? 1 : wy < -1 ? -1 : wy) / Math.PI) * TH - .5;
          fv = fv < 0 ? 0 : fv > TH - 1.001 ? TH - 1.001 : fv;
          const u0 = Math.floor(fu), v0 = fv | 0;
          const i = v0 * TW + ((u0 + TW) % TW);
          const sh = x * L[0] + vy * L[1] + z * L[2];
          const lam = .38 + .8 * (sh > 0 ? sh : 0);
          let night = (.12 - sh) / .45;
          night = night < dusk ? dusk : night > 1 ? 1 : night;
          const dk = 1 - night * .8;
          let cr = tr[i], cg = tg[i], cb = tb[i], lit = city[i];
          if (smooth) {
            // bilinear once the texels get big on screen
            const ax = fu - u0, ay = fv - v0, i2 = v0 * TW + ((u0 + 1 + TW) % TW), i3 = i + TW, i4 = i2 + TW;
            const w1 = (1 - ax) * (1 - ay), w2 = ax * (1 - ay), w3 = (1 - ax) * ay, w4 = ax * ay;
            cr = tr[i] * w1 + tr[i2] * w2 + tr[i3] * w3 + tr[i4] * w4;
            cg = tg[i] * w1 + tg[i2] * w2 + tg[i3] * w3 + tg[i4] * w4;
            cb = tb[i] * w1 + tb[i2] * w2 + tb[i3] * w3 + tb[i4] * w4;
            lit = city[i] * w1 + city[i2] * w2 + city[i3] * w3 + city[i4] * w4;
          }
          let rr = cr * lam * dk, gg = cg * lam * dk, bb = cb * lam * dk;
          if (lit && night > 0) { const k = lit * night; rr += 255 * k; gg += 165 * k; bb += 60 * k; }
          const rim = (1 - z) * (1 - z) * (1 - z);
          rr += rim * 90; gg += rim * 150; bb += rim * 255;
          buf[py * pw + pxl] = 0xff000000 | (Math.min(255, bb) << 16) | (Math.min(255, gg) << 8) | Math.min(255, rr);
        }
      }
      pctx.putImageData(img, 0, 0);
    };

    const puff = (x, y, s, a) => {
      octx.globalAlpha = a;
      [[0, 0, 1], [-.9, .25, .7], [.9, .3, .75], [.35, -.45, .7], [-.4, -.35, .6]].forEach(([dx, dy, k]) => {
        const g = octx.createRadialGradient(x + dx * s - s * .2 * k, y + dy * s - s * .3 * k, 0, x + dx * s, y + dy * s, s * k);
        g.addColorStop(0, '#fff6fb'); g.addColorStop(.6, '#f6c9dc'); g.addColorStop(1, '#e7a7c6');
        octx.fillStyle = g;
        octx.beginPath(); octx.arc(x + dx * s, y + dy * s, s * k, 0, Math.PI * 2); octx.fill();
      });
      octx.globalAlpha = 1;
    };

    const drawOverlay = (t) => {
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, W, H);
      const zoom = R / R0;
      // stars fall away as we dive
      octx.fillStyle = '#fff';
      stars.forEach(([x, y, s, ph2]) => {
        octx.globalAlpha = (.35 + .5 * Math.abs(Math.sin(t * .8 + ph2 * 9))) * Math.max(0, 1.6 - zoom);
        octx.fillRect(x, y, s, s);
      });
      octx.globalAlpha = 1;
      if (R < 900) {
        // atmosphere halo
        // stops start transparent so the fill inside the inner radius doesn't wash over the globe
        const g = octx.createRadialGradient(W / 2, CY, R * .9, W / 2, CY, R * 1.16);
        g.addColorStop(0, 'rgba(120,190,255,0)'); g.addColorStop(.38, 'rgba(120,190,255,.5)'); g.addColorStop(.6, 'rgba(90,150,255,.16)'); g.addColorStop(1, 'rgba(60,90,255,0)');
        octx.fillStyle = g;
        octx.beginPath(); octx.arc(W / 2, CY, R * 1.16, 0, Math.PI * 2); octx.fill();
      }
      // clouds riding above the surface
      clouds.forEach((c) => {
        const p = project(c.lon, c.lat, 1.05);
        if (p.z < .08) return;
        puff(p.x, p.y, c.s * R * (.55 + .45 * p.z), Math.min(1, p.z * 2.5) * (zoom > 3 ? Math.max(0, 1 - (zoom - 3) / 3) : 1));
      });
      // the destination pin pulses
      if (zoom < 2.2) {
        const p = project(TARGET.lon, TARGET.lat, 1.01);
        if (p.z > .15) {
          const k = (t * .9) % 1;
          octx.strokeStyle = `rgba(255,255,255,${(1 - k) * .9})`;
          octx.lineWidth = 2;
          octx.beginPath(); octx.arc(p.x, p.y, 4 + k * 16, 0, Math.PI * 2); octx.stroke();
          octx.fillStyle = '#fff';
          octx.beginPath(); octx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); octx.fill();
          octx.fillStyle = '#ff5a7a';
          octx.beginPath(); octx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); octx.fill();
        }
      }
    };

    // ---------- street map ----------
    const map = root.querySelector('.plane');
    {
      const parts = [];
      const keep = (x, y) => {
        if (x > 110 && x < 370 && y > 240 && y < 445) return false; // palace + forecourt
        if (Math.hypot(x - 240, y - 525) < 105) return false; // roundabout
        if (Math.abs(x - 240) < 30 && y > 520) return false; // avenue
        if (y < 125) return false; // lake
        const dl = Math.abs((y - 525) - (240 - x) * .55), dr = Math.abs((y - 525) - (x - 240) * .55);
        if ((x < 240 && dl < 22 && y > 525) || (x > 240 && dr < 22 && y > 525)) return false; // diagonal roads
        return true;
      };
      const greens = ['#3d7638', '#4a8840', '#5a9a48', '#6aa651'];
      let n = 0;
      while (n < 420) {
        const x = rnd() * 480, y = rnd() * 900;
        if (!keep(x, y)) continue;
        const r = 5 + rnd() * 7;
        parts.push(`<circle cx="${(x + 2).toFixed(1)}" cy="${(y + 3).toFixed(1)}" r="${r.toFixed(1)}" fill="#2c5a2a" opacity=".45"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${greens[n % 4]}"/><circle cx="${(x - r * .3).toFixed(1)}" cy="${(y - r * .35).toFixed(1)}" r="${(r * .45).toFixed(1)}" fill="#8cc06a" opacity=".55"/>`);
        n++;
      }
      const windows = Array.from({ length: 30 }, (_, i) => `<rect x="${128 + i * 7.9}" y="387" width="3" height="7" fill="#8a7e6a"/>`).join('');
      const beds = [-1, 1].map((sd) => `<path d="M${240 + sd * 36} 615 Q${240 + sd * 120} 610 ${240 + sd * 170} 560" fill="none" stroke="#c94a45" stroke-width="7" stroke-dasharray="14 5"/><path d="M${240 + sd * 36} 640 Q${240 + sd * 135} 640 ${240 + sd * 200} 580" fill="none" stroke="#b83f3d" stroke-width="6" stroke-dasharray="10 6"/>`).join('');
      const cars = Array.from({ length: 7 }, (_, i) => {
        const down = i % 2;
        return `<rect class="car" x="${down ? 247 : 228}" y="0" width="5" height="9" rx="1.5" fill="${['#fff', '#2d3646', '#d9e2ef', '#c33'][i % 4]}" style="--d:${7 + i}s;--dl:${-i * 1.7}s;--from:${down ? '610px' : '900px'};--to:${down ? '900px' : '610px'}"/>`;
      }).join('');
      map.innerHTML = `<svg viewBox="0 0 480 900" aria-hidden="true">
        <rect width="480" height="900" fill="#83b45f"/>
        <path d="M0 0 H480 V88 Q400 120 300 96 Q200 74 120 108 Q50 132 0 110Z" fill="#5f98cf"/>
        <path d="M0 110 Q50 132 120 108 Q200 74 300 96 Q400 120 480 88" fill="none" stroke="#a8d0ef" stroke-width="4"/>
        <g stroke="#c98575" stroke-linecap="round" fill="none">
          <path d="M240 525 L-20 668 M240 525 L500 668" stroke-width="26"/>
          <path d="M240 525 L240 920" stroke-width="40"/>
          <path d="M140 440 L-10 360 M340 440 L490 360" stroke-width="16"/>
          <circle cx="240" cy="525" r="74" stroke-width="24"/>
        </g>
        <path d="M240 600 L240 900" stroke="#f3dcd4" stroke-width="1.5" stroke-dasharray="8 8"/>
        <text x="236" y="760" fill="#fff" font-size="8" font-weight="700" letter-spacing="2" transform="rotate(-90 236 760)" opacity=".8">THE LONG WALK</text>
        <circle cx="240" cy="525" r="62" fill="#d9c7a6"/>
        <circle cx="240" cy="525" r="36" fill="#6fb0e2" stroke="#f4f1ea" stroke-width="4"/>
        <circle cx="240" cy="525" r="16" fill="#f4f1ea"/>
        <circle cx="240" cy="521" r="7" fill="#d6b257"/>
        ${beds}
        <rect x="110" y="400" width="260" height="44" fill="#d3bd93"/>
        <path d="M110 400 H370" stroke="#bfa57a" stroke-width="2"/>
        <rect x="118" y="244" width="244" height="150" rx="3" fill="#6c78ac"/>
        <rect x="168" y="274" width="144" height="76" fill="#bfae8f"/>
        <rect x="174" y="280" width="132" height="64" fill="#ccbb9c"/>
        <path d="M118 244 H362 V394 H118Z M168 274 H312 V350 H168Z" fill="none" stroke="#97a1cb" stroke-width="3"/>
        <rect x="114" y="238" width="40" height="40" fill="#5e6a9e"/><rect x="326" y="238" width="40" height="40" fill="#5e6a9e"/>
        <rect x="216" y="236" width="48" height="26" fill="#7c88bc"/><rect x="224" y="224" width="32" height="16" rx="3" fill="#8fc2b0"/>
        <rect x="118" y="380" width="244" height="22" fill="#e6dcc4"/>${windows}
        <rect x="212" y="376" width="56" height="28" fill="#efe6d0"/><path d="M212 376 L240 366 L268 376Z" fill="#d8ccb0"/>
        ${parts.join('')}
        ${cars}
      </svg>`;
    }

    // ---------- interaction ----------
    let phase = 'globe', timers = [];
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    let anim = null; // { from, to, start, dur }
    const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const shortest = (a, b) => a + ((((b - a) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);

    const dive = () => {
      if (phase !== 'globe') return;
      phase = 'dive';
      root.classList.add('diving');
      anim = { lon: [lon0, shortest(lon0, TARGET.lon)], lat: [lat0, TARGET.lat], r: [R, R0 * 7], dusk: [0, .8], start: performance.now(), dur: 2000 };
      sizeCanvases(.75);
      later(1350, () => { fog.className = 'fog in'; });
      later(2000, () => { root.classList.add('map-on'); phase = 'map'; });
      later(2150, () => { fog.className = 'fog out'; });
      later(3300, () => root.querySelector('.p1').classList.add('show'));
      later(4300, () => root.classList.add('sheet-on'));
    };

    const rise = () => {
      if (phase !== 'map') return;
      clearTimers();
      phase = 'rise';
      root.classList.remove('sheet-on');
      root.querySelectorAll('.pin').forEach((p) => p.classList.remove('show'));
      fog.className = 'fog in';
      later(550, () => {
        root.classList.remove('map-on');
        fog.className = 'fog out';
        anim = { lon: [lon0, lon0 + .6], lat: [lat0, 18 * D], r: [R, R0], dusk: [dusk, 0], start: performance.now(), dur: 1700 };
      });
    };

    root.querySelector('.back').addEventListener('click', rise);
    root.querySelectorAll('.sheet button').forEach((b) => b.addEventListener('click', () => {
      root.classList.remove('sheet-on');
      if (b.classList.contains('cal')) later(350, () => root.querySelector('.p2').classList.add('show'));
    }));

    // Drag to spin, tap to dive
    let drag = null;
    px.addEventListener('pointerdown', (e) => {
      if (phase !== 'globe') return;
      drag = { x: e.clientX, y: e.clientY, lon: lon0, lat: lat0, moved: 0, lastX: e.clientX, lastT: performance.now(), v: 0 };
      px.setPointerCapture(e.pointerId);
      px.classList.add('drag');
    });
    px.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const k = px.getBoundingClientRect().width / W || 1;
      const dx = (e.clientX - drag.x) / k, dy = (e.clientY - drag.y) / k;
      drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
      lon0 = drag.lon - dx / R;
      lat0 = Math.max(-60 * D, Math.min(60 * D, drag.lat + dy / R));
      const now = performance.now();
      drag.v = -((e.clientX - drag.lastX) / k / R) / Math.max(1, now - drag.lastT) * 1000;
      drag.lastX = e.clientX; drag.lastT = now;
    });
    const up = () => {
      if (!drag) return;
      px.classList.remove('drag');
      if (drag.moved < 6) dive();
      else vLon = drag.v;
      drag = null;
    };
    px.addEventListener('pointerup', up);
    px.addEventListener('pointercancel', up);
    px.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dive(); } });
    px.tabIndex = 0;
    px.setAttribute('role', 'button');
    px.setAttribute('aria-label', 'Spinning globe. Press to fly in to the map');

    // ---------- loop ----------
    let raf = 0, visible = false, last = performance.now();
    const tick = (now) => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      if (anim) {
        const k = Math.min(1, (now - anim.start) / anim.dur);
        const e = ease(k);
        const zk = phase === 'dive' ? Math.pow(k, 1.7) : 1 - Math.pow(1 - e, 2);
        lon0 = anim.lon[0] + (anim.lon[1] - anim.lon[0]) * Math.min(1, e * 1.25);
        lat0 = anim.lat[0] + (anim.lat[1] - anim.lat[0]) * Math.min(1, e * 1.25);
        R = anim.r[0] * Math.pow(anim.r[1] / anim.r[0], zk);
        dusk = anim.dusk[0] + (anim.dusk[1] - anim.dusk[0]) * e;
        if (k >= 1) {
          anim = null;
          if (phase === 'rise') { phase = 'globe'; root.classList.remove('diving'); sizeCanvases(Math.min(1.5, dpr)); }
        }
      } else if (phase === 'globe' && !drag) {
        lon0 += (.12 + vLon) * dt;
        vLon *= Math.pow(.15, dt);
      }
      clouds.forEach((c) => { c.lon += c.sp * dt; });
      if (phase !== 'map') { drawGlobe(); drawOverlay(t); }
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }).observe(root);
    drawGlobe(); drawOverlay(0);

    // fog puffs
    for (let i = 0; i < 14; i++) {
      const b = document.createElement('i');
      const s = 160 + rnd() * 220;
      Object.assign(b.style, { width: `${s}px`, height: `${s * .8}px`, left: `${rnd() * 100}%`, top: `${rnd() * 100}%`, marginLeft: `${-s / 2}px`, marginTop: `${-s * .4}px` });
      fog.append(b);
    }

    const pos = (el, x, y) => Object.assign(el.style, { left: `${x}px`, top: `${y}px` });
    pos(root.querySelector('.p1'), 160, 262);
    pos(root.querySelector(".p2"), 92, 606);

    root.ixDive = dive; // test hooks
    root.ixRise = rise;
    root.ixPose = (o) => { ({ lon0 = lon0, lat0 = lat0, R = R, dusk = dusk } = o); if (o.small) sizeCanvases(.75); drawGlobe(); drawOverlay(0); };
  },
});
