/* TicTaxFlow — environmental depth layer (Three.js r149, inlined).
   Decorative only: every fact, number and diagram lives in the HTML above this canvas.
   Draw calls at any moment stay at or below six; hidden systems skip their update. */
(function () {
  var S = (window.TTF = window.TTF || {});

  /* Apple-neutral grounds. Both naming schemes resolve so the layer keeps
     working whichever vocabulary the markup uses. */
  var GROUND = { dark: 0x0B0D1A, light: 0xF8FAFC, ink: 0x0B0D1A, ivory: 0xF8FAFC };
  var DUST_ON_INK = 0xD9DCF2, DUST_ON_IVORY = 0x8E93AD;

  var renderer, scene, camera, clock = 0, raf = 0, live = false;
  var systems = [], dpr = 1;
  var ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  var cam = { x: 0, y: 0, z: 60, tx: 0, ty: 0, tz: 60, vx: 0, vy: 0, vz: 0 };
  var ground = null, groundTarget = null;
  var chapter = 1, chapterAt = 0, slow = 0;
  var base = { x: 0, y: 0, z: 60 };

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---------- generated textures (no external files) ---------- */
  function discTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(.45, 'rgba(255,255,255,.55)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  function paperTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(18, 10, 28, 44);
    g.fillStyle = 'rgba(0,0,0,.35)';
    for (var i = 0; i < 4; i++) g.fillRect(22, 18 + i * 8, 20 - i * 3, 2);
    return new THREE.CanvasTexture(c);
  }
  function softTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 6, 64, 64, 62);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(.6, 'rgba(255,255,255,.6)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  function glowTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(242,206,107,.9)');
    r.addColorStop(.4, 'rgba(242,206,107,.28)');
    r.addColorStop(1, 'rgba(242,206,107,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  function points(count, size, color, texture, opacity) {
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3));
    var mat = new THREE.PointsMaterial({
      size: size, map: texture, color: color, transparent: true, opacity: opacity,
      depthWrite: false, sizeAttenuation: true
    });
    var p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    return p;
  }

  /* ---------- systems ---------- */
  function buildDust() {
    var N = 900, p = points(N, 1.15, DUST_ON_INK, discTexture(), .5);
    var a = p.geometry.attributes.position.array, seed = [];
    for (var i = 0; i < N; i++) {
      var x = rand(-70, 70), y = rand(-38, 38), z = rand(-60, 18);
      a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z;
      seed.push({ x: x, y: y, s: rand(.2, .8), ph: rand(0, 6.28) });
    }
    p.geometry.attributes.position.needsUpdate = true;
    return {
      name: 'dust', obj: p, alpha: .5, target: .5, always: true,
      update: function (t) {
        var arr = p.geometry.attributes.position.array;
        for (var i = 0; i < N; i++) {
          arr[i * 3] = seed[i].x + Math.sin(t * .12 * seed[i].s + seed[i].ph) * 2.4;
          arr[i * 3 + 1] = seed[i].y + Math.cos(t * .1 * seed[i].s + seed[i].ph) * 1.8;
        }
        p.geometry.attributes.position.needsUpdate = true;
      }
    };
  }

  function buildStreams() {
    var LANES = [[0, 21, -4], [-32, 4, -4], [32, 4, -4], [0, -21, -4]];
    var PER = 120, N = LANES.length * PER;
    var p = points(N, 1.5, 0x5B4BE8, discTexture(), 0);
    var u = [];
    for (var i = 0; i < N; i++) u.push(Math.random());
    return {
      name: 'streams', obj: p, alpha: 0, target: 0, peak: .45, chapters: [2],
      update: function (t, dt) {
        var arr = p.geometry.attributes.position.array;
        for (var i = 0; i < N; i++) {
          var lane = LANES[(i / PER) | 0];
          u[i] += dt * (.16 + (i % 7) * .012);
          if (u[i] > 1) u[i] -= 1;
          var e = u[i] * u[i] * (3 - 2 * u[i]);
          var bow = Math.sin(u[i] * Math.PI) * 6 * ((i % 2) ? 1 : -1) * .18;
          arr[i * 3] = lane[0] * (1 - e) + bow;
          arr[i * 3 + 1] = lane[1] * (1 - e) + bow * .4;
          arr[i * 3 + 2] = lane[2] * (1 - e) + e * 5;
        }
        p.geometry.attributes.position.needsUpdate = true;
      }
    };
  }

  function buildRevenue() {
    var N = 620, p = points(N, 1.05, 0xFFFFFF, discTexture(), 0);
    var tgt = [];
    for (var i = 0; i < N; i++) {
      tgt.push({ x: rand(-38, 38), y: rand(-24, -4), z: rand(-12, 2), d: rand(0, .55), sp: rand(.5, 1) });
    }
    return {
      name: 'revenue', obj: p, alpha: 0, target: 0, peak: .34, chapters: [3],
      update: function (t, dt, since) {
        var arr = p.geometry.attributes.position.array;
        var prog = Math.min(1, Math.max(0, (since - .4) / 2.6));
        for (var i = 0; i < N; i++) {
          var q = Math.min(1, Math.max(0, (prog - tgt[i].d) / .45));
          var e = q * q * (3 - 2 * q);
          arr[i * 3] = tgt[i].x;
          arr[i * 3 + 1] = -34 + (tgt[i].y + 34) * e + Math.sin(t * tgt[i].sp + i) * .4;
          arr[i * 3 + 2] = tgt[i].z;
        }
        p.geometry.attributes.position.needsUpdate = true;
      }
    };
  }

  function buildClutter() {
    var N = 210, p = points(N, 3.4, 0xF0F0F3, paperTexture(), 0);
    var seed = [];
    var arr = p.geometry.attributes.position.array;
    for (var i = 0; i < N; i++) {
      var x = rand(-62, 62), y = rand(-34, 34), z = rand(-40, 8);
      arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
      seed.push({ x: x, y: y, z: z, sp: rand(.3, 1.1), ph: rand(0, 6.28) });
    }
    p.geometry.attributes.position.needsUpdate = true;
    return {
      name: 'clutter', obj: p, alpha: 0, target: 0, peak: .5, chapters: [4],
      update: function (t, dt, since, leaving) {
        var a = p.geometry.attributes.position.array;
        var burst = leaving ? Math.min(1, leaving * 1.6) : 0;
        for (var i = 0; i < N; i++) {
          var s = seed[i];
          a[i * 3] = s.x * (1 + burst * .9) + Math.sin(t * .5 * s.sp + s.ph) * 1.6;
          a[i * 3 + 1] = s.y * (1 + burst * .9) + Math.cos(t * .42 * s.sp + s.ph) * 1.4;
          a[i * 3 + 2] = s.z + burst * 22;
        }
        p.geometry.attributes.position.needsUpdate = true;
      }
    };
  }

  /* studio lighting + a soft environment, used only by the phone's PBR materials */
  function addStudio() {
    scene.add(new THREE.AmbientLight(0x45454C, 0.8));
    var key = new THREE.DirectionalLight(0xFFFFFF, 2.7); key.position.set(30, 36, 48);
    var rim = new THREE.DirectionalLight(0xFFDCA0, 0.7); rim.position.set(-38, 12, -22);
    var fill = new THREE.DirectionalLight(0xFFFFFF, 0.45); fill.position.set(-26, -18, 34);
    scene.add(key); scene.add(rim); scene.add(fill);

    var c = document.createElement('canvas'); c.width = 256; c.height = 128;
    var g = c.getContext('2d');
    var lg = g.createLinearGradient(0, 0, 0, 128);
    lg.addColorStop(0, '#FFFFFF');
    lg.addColorStop(.30, '#B8B8BE');
    lg.addColorStop(.52, '#333338');
    lg.addColorStop(1, '#08080A');
    g.fillStyle = lg; g.fillRect(0, 0, 256, 128);
    var hi = g.createRadialGradient(64, 44, 2, 64, 44, 52);
    hi.addColorStop(0, 'rgba(255,255,255,.95)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hi; g.fillRect(0, 0, 256, 128);
    var hi2 = g.createRadialGradient(196, 70, 2, 196, 70, 46);
    hi2.addColorStop(0, 'rgba(255,214,140,.7)'); hi2.addColorStop(1, 'rgba(255,214,140,0)');
    g.fillStyle = hi2; g.fillRect(0, 0, 256, 128);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    try {
      var pm = new THREE.PMREMGenerator(renderer);
      var rt = pm.fromEquirectangular(tex);
      scene.environment = rt.texture;
      pm.dispose();
    } catch (e) { /* env map is a nicety; lighting alone still reads */ }
    tex.dispose();
  }


  /* ---------- props: the presenter's own parcel and banknote models ----------
     Two InstancedMeshes, a handful of copies each, drifting far behind the copy:
     parcels on chapter 02 (orders arriving from four places) and note stacks on
     chapter 03 (the revenue nobody is adding up). Deliberately few and deliberately
     back — they are scenery, not the subject. */
  function propGeometry(M) {
    var bin = atob(M.b64), n = bin.length, bytes = new Uint8Array(n);
    for (var i = 0; i < n; i++) bytes[i] = bin.charCodeAt(i);
    var V = M.v, T = M.tri, posBytes = V * 6, norBytes = V * 3;
    var qp = new Uint16Array(bytes.buffer.slice(0, posBytes));
    var qn = new Int8Array(bytes.buffer.slice(posBytes, posBytes + norBytes));
    var qi = new Uint16Array(bytes.buffer.slice(posBytes + norBytes, posBytes + norBytes + T * 6));
    var sx = M.size[0], sy = M.size[1], sz = M.size[2];
    var inv = 1 / Math.max(sx, sy, sz);            /* longest side = 1 unit */
    var pos = new Float32Array(V * 3), nor = new Float32Array(V * 3);
    for (var j = 0; j < V; j++) {
      pos[j * 3] = ((qp[j * 3] / 65535) - .5) * sx * inv;
      pos[j * 3 + 1] = ((qp[j * 3 + 1] / 65535) - .5) * sy * inv;
      pos[j * 3 + 2] = ((qp[j * 3 + 2] / 65535) - .5) * sz * inv;
      nor[j * 3] = qn[j * 3] / 127;
      nor[j * 3 + 1] = qn[j * 3 + 1] / 127;
      nor[j * 3 + 2] = qn[j * 3 + 2] / 127;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setIndex(new THREE.BufferAttribute(qi, 1));
    return geo;
  }

  function buildProp(key, opt) {
    var P = window.TTF_PROPS && window.TTF_PROPS[key];
    if (!P || !THREE.InstancedMesh) return null;
    var geo, mat, mesh;
    try {
      geo = propGeometry(P);
      /* Phong, not Standard: these are background scenery at low opacity, and a
         full PBR shader with an environment map costs several times as much per
         pixel — which is exactly what a venue laptop without a real GPU cannot
         afford. The look at this size and opacity is indistinguishable. */
      mat = new THREE.MeshPhongMaterial({
        color: opt.color, specular: opt.spec, shininess: opt.shine, flatShading: false,
        transparent: true, opacity: 0, depthWrite: false
      });
      mesh = new THREE.InstancedMesh(geo, mat, opt.slots.length);
    } catch (e) { return null; }

    var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    var pos = new THREE.Vector3(), scl = new THREE.Vector3();
    mesh.frustumCulled = false;

    return {
      name: 'prop-' + key, obj: mesh, alpha: 0, target: 0, peak: opt.peak, chapters: opt.chapters,
      applyAlpha: function (a) { mat.opacity = opt.peak * a; },
      update: function (t) {
        for (var i = 0; i < opt.slots.length; i++) {
          var s = opt.slots[i];
          pos.set(s[0] + Math.sin(t * s[6] + i) * 1.1,
                  s[1] + Math.cos(t * s[6] * .82 + i * 1.7) * 1.4,
                  s[2]);
          e.set(s[3] + t * s[7], s[4] + t * s[7] * 1.35, s[5] + Math.sin(t * .3 + i) * .12);
          q.setFromEuler(e);
          scl.setScalar(s[8]);
          m4.compose(pos, q, scl);
          mesh.setMatrixAt(i, m4);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    };
  }

  /* x, y, z, rx, ry, rz, bob speed, spin speed, scale.
     All four sit far back and outside the copy column — corners of the frame, so
     they read as depth rather than as objects competing with the text. */
  var BOX_SLOTS = [
    [-62, 29, -48, .5, .9, .1, .26, .06, 8],
    [64, 33, -54, -.4, 2.1, -.2, .21, .04, 9],
    [57, -34, -50, .2, 1.2, -.4, .18, .035, 8]
  ];
  var MONEY_SLOTS = [
    [-64, -26, -42, .3, .6, 0, .28, .07, 6],
    [66, 28, -46, -.2, 2.4, .2, .23, .06, 7],
    [-58, 32, -50, .6, 4.1, -.3, .19, .045, 6],
    [60, -32, -44, .1, 1.7, .4, .33, .065, 5]
  ];


  function buildPhone() {
    if (!S.buildPhone) return null;
    var ph = S.buildPhone(THREE, renderer);
    if (!ph) return null;
    return {
      name: 'phone', obj: ph.obj, alpha: 0, target: 0, chapters: [1],
      applyAlpha: function (a) { ph.setOpacity(a); },
      onEnter: ph.reset,
      update: function (t, dt) { ph.update(t, dt, ptr); }
    };
  }

  function buildGlow() {
    var m = new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, opacity: 0, depthWrite: false });
    var s = new THREE.Sprite(m);
    s.scale.set(46, 46, 1); s.position.set(0, 0, -12);
    return {
      name: 'glow', obj: s, alpha: 0, target: 0, peak: .85, chapters: [7],
      update: function (t) { var k = 1 + Math.sin(t * .9) * .07; s.scale.set(46 * k, 46 * k, 1); }
    };
  }

  function buildPlanes() {
    var g = new THREE.Group(), meshes = [], soft = softTexture();
    /* x, y, z, w, h, colour, peak opacity */
    var conf = [
      [-40, 14, -34, 30, 20, 0x5B4BE8, .11],
      [38, -10, -28, 26, 34, 0xF0F0F3, .08],
      [-16, -22, -20, 24, 14, 0xF2CE6B, .08],
      [22, 20, -44, 36, 22, 0x6E5BEA, .07]
    ];
    conf.forEach(function (c) {
      var m = new THREE.MeshBasicMaterial({ color: c[5], map: soft, transparent: true, opacity: 0, depthWrite: false });
      var mesh = new THREE.Mesh(new THREE.PlaneGeometry(c[3], c[4]), m);
      mesh.position.set(c[0], c[1], c[2]);
      mesh.userData = { bx: c[0], by: c[1], peak: c[6] };
      g.add(mesh); meshes.push(mesh);
    });
    return {
      name: 'planes', obj: g, alpha: 0, target: 0, chapters: [1, 12],
      applyAlpha: function (a) {
        meshes.forEach(function (m) { m.material.opacity = m.userData.peak * a; });
      },
      update: function (t) {
        meshes.forEach(function (m, i) {
          m.position.x = m.userData.bx + ptr.x * (2 + i * 1.6);
          m.position.y = m.userData.by + ptr.y * (1.4 + i) + Math.sin(t * .18 + i) * .9;
        });
      }
    };
  }

  /* ---------- lifecycle ---------- */
  function init(canvas) {
    if (!window.THREE) return false;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, powerPreference: 'high-performance' });
    } catch (e) { return false; }
    if (!renderer || !renderer.getContext()) return false;

    /* the layer is soft blobs, so 1.5x is indistinguishable from 2x and much cheaper */
    dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth > 2560 ? 1.25 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(GROUND.dark, 1);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(48, 1, 1, 260);
    camera.position.set(0, 0, 60);
    ground = new THREE.Color(GROUND.dark);
    groundTarget = new THREE.Color(GROUND.dark);

    addStudio();
    systems = [buildDust(), buildStreams(), buildRevenue(), buildClutter(), buildGlow(), buildPlanes()];
    var boxes = buildProp('box', {
      color: 0xE4E4E9, spec: 0x151518, shine: 6, peak: .30, chapters: [2], slots: BOX_SLOTS
    });
    if (boxes) systems.push(boxes);
    var money = buildProp('money', {
      color: 0x6E5BEA, spec: 0xC9BFFF, shine: 42, peak: .40, chapters: [3], slots: MONEY_SLOTS
    });
    if (money) systems.push(money);
    var phone = buildPhone();
    if (phone) systems.push(phone);
    systems.forEach(function (s) { scene.add(s.obj); s.obj.visible = !!s.always; });

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (live) start();
    });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); stop(); }, false);
    return true;
  }

  function onPointer(e) {
    ptr.tx = (e.clientX / window.innerWidth - .5) * 2;
    ptr.ty = (e.clientY / window.innerHeight - .5) * -2;
  }

  function resize() {
    if (!renderer) return;
    /* On the wide layout the chapter-2 diagram sits left of centre; nudge the
       converging streams so they meet over it rather than over the copy. */
    for (var i = 0; i < systems.length; i++) {
      if (systems[i].name === 'streams') systems[i].obj.position.x = window.innerWidth > 900 ? -15 : 0;
    }
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  var CAMS = {
    1: [0, 0, 58], 2: [0, 0, 52], 3: [0, -2, 46], 4: [2, 1, 50], 5: [0, 0, 66],
    6: [0, 0, 62], 7: [0, 0, 48], 8: [0, 0, 64], 9: [0, -1, 56], 10: [0, 0, 63],
    11: [-2, 0, 54], 12: [0, 0, 60]
  };

  function setChapter(n, groundName) {
    chapter = n; chapterAt = clock;
    var c = CAMS[n] || [0, 0, 58];
    base.x = c[0]; base.y = c[1]; base.z = c[2];
    cam.tx = base.x; cam.ty = base.y; cam.tz = base.z;
    groundTarget.setHex(GROUND[groundName] || GROUND.dark);
    var onInk = groundName !== 'ivory' && groundName !== 'light';
    systems.forEach(function (s) {
      if (s.name === 'dust') {
        s.obj.material.color.setHex(onInk ? DUST_ON_INK : DUST_ON_IVORY);
        s.target = onInk ? .5 : .34;
      } else if (s.chapters) {
        var on = s.chapters.indexOf(n) >= 0;
        if (on && s.target === 0 && s.onEnter) s.onEnter();
        s.target = on ? 1 : 0;
      }
    });
  }

  /* Scroll position inside the current chapter, 0 -> 1. The camera pushes in
     across the chapter and drifts up slightly, so the depth layer moves with
     the hand instead of on its own clock. DOLLY is per chapter: the opening
     gets the strongest push because the phone is the only lit object in it. */
  var DOLLY = { 1: -16, 2: -7, 3: -6, 4: -5, 7: -8 };

  function setProgress(n, p) {
    if (n !== chapter) return;
    var d = DOLLY[n] || -4;
    cam.tz = base.z + d * p;
    cam.ty = base.y + p * 1.6;
  }

  function frame(ms) {
    raf = requestAnimationFrame(frame);
    var t = ms / 1000, real = t - clock || .016, dt = Math.min(.05, real);
    clock = t;
    real = Math.min(.4, real);        /* wall-clock step, used for fades */

    /* self-throttle: after a run of slow frames, halve the pixel ratio once */
    if (dt > .032) slow++; else slow = Math.max(0, slow - 1);
    if (slow === 14 && dpr > 1) { dpr = 1; renderer.setPixelRatio(1); resize(); }

    /* camera spring (critically damped) */
    var w0 = 4.5;
    ['x', 'y', 'z'].forEach(function (k) {
      var d = cam[k] - cam['t' + k];
      var a = -w0 * w0 * d - 2 * w0 * cam['v' + k];
      cam['v' + k] += a * dt;
      cam[k] += cam['v' + k] * dt;
    });
    ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 2.2);
    ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 2.2);
    camera.position.set(cam.x + ptr.x * 1.6, cam.y + ptr.y * 1.1, cam.z);
    camera.lookAt(0, 0, 0);

    /* ground colour easing */
    ground.lerp(groundTarget, Math.min(1, dt * 9));
    renderer.setClearColor(ground, 1);

    var since = clock - chapterAt;
    for (var i = 0; i < systems.length; i++) {
      var s = systems[i];
      /* fade on wall-clock time, and snap systems that are more than one chapter
         away, so a slow frame can never keep an expensive object alive */
      if (s.chapters && s.target === 0 && s.alpha > 0) {
        var near = false;
        for (var q = 0; q < s.chapters.length; q++) {
          if (Math.abs(s.chapters[q] - chapter) <= 1) near = true;
        }
        if (!near) s.alpha = 0;
      }
      s.alpha += (s.target - s.alpha) * Math.min(1, real * 3.2);
      var vis = s.alpha > .012;
      s.obj.visible = vis;
      if (!vis) continue;
      if (s.applyAlpha) s.applyAlpha(s.alpha);
      else if (s.obj.material) s.obj.material.opacity = s.alpha * (s.peak || 1);
      var leaving = (s.chapters && s.chapters.indexOf(chapter) < 0) ? (1 - s.alpha) : 0;
      s.update(clock, dt, since, leaving);
    }
    renderer.render(scene, camera);
  }

  function start() { if (!renderer || raf) return; live = true; raf = requestAnimationFrame(frame); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function dispose() {
    stop(); live = false;
    if (renderer) { renderer.dispose(); }
  }

  S.three = { init: init, start: start, stop: stop, dispose: dispose,
    setChapter: setChapter, setProgress: setProgress, resize: resize };
})();
