/* TicTaxFlow — chapter 01 hero: the supplied iPhone model with a live screen.

   The body comes from the converted OBJ (window.TTF_PHONE). The screen is a
   plane carrying a canvas texture that draws a lock screen where order
   notifications keep arriving — the whole message of chapter 1, with no
   headline needed. Everything on that screen is illustrative concept UI. */
(function () {
  var S = (window.TTF = window.TTF || {});

  /* ---------- screen canvas ---------- */
  var W = 560, H = 1250;
  var PALETTE = {
    Shopee: '#D4AF37',
    Lazada: '#FFFFFF',
    Facebook: '#F0F0F3',
    LINE: '#F2CE6B'
  };
  var FEED = [
    { ch: 'Shopee', msg: 'คำสั่งซื้อใหม่', amt: 1290 },
    { ch: 'LINE', msg: 'โอนเงินเข้าบัญชีแล้ว', amt: 1180 },
    { ch: 'Lazada', msg: 'ออเดอร์ใหม่', amt: 860 },
    { ch: 'Facebook', msg: 'ลูกค้าสั่งซื้อผ่านแชท', amt: 2450 },
    { ch: 'Shopee', msg: 'คำสั่งซื้อใหม่ 2 รายการ', amt: 2380 },
    { ch: 'LINE', msg: 'ลูกค้าสั่งซื้อเพิ่ม', amt: 790 },
    { ch: 'Lazada', msg: 'ลูกค้าชำระเงินแล้ว', amt: 1540 },
    { ch: 'Facebook', msg: 'ออเดอร์จากไลฟ์สด', amt: 3120 },
    { ch: 'Shopee', msg: 'ลูกค้ากดสั่งซื้อแล้ว', amt: 640 },
    { ch: 'LINE', msg: 'สลิปโอนเงินใหม่', amt: 2050 }
  ];
  var TH = '"Noto Sans Thai","IBM Plex Sans Thai","Sarabun",Thonburi,"Leelawadee UI",' +
    '-apple-system,"Helvetica Neue",sans-serif';

  /* platform logos, decoded once; cards fall back to the channel name until ready */
  var LOGO = {};
  (function () {
    var B = window.TTF_BRAND || {};
    for (var k in B) {
      var im = new Image();
      im.src = B[k].uri;
      LOGO[k] = { img: im, ar: B[k].w / B[k].h };
    }
  })();

  function rr(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function makeScreen() {
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var g = cv.getContext('2d');
    var bg = document.createElement('canvas');
    bg.width = W; bg.height = H;
    var bgc = bg.getContext('2d');

    var state = { cards: [], next: 0.6, feed: 0, orders: 34, bgDirty: true, t: 0 };
    var LIST_TOP = 392, LIST_BOTTOM = H - 78, CARD_H = 128, GAP = 13;
    var STEP = CARD_H + GAP;

    function paintBg() {
      bgc.clearRect(0, 0, W, H);
      bgc.save();
      rr(bgc, 0, 0, W, H, 60); bgc.clip();      /* screen corner radius */
      /* wallpaper */
      var lg = bgc.createLinearGradient(0, 0, W * .7, H);
      lg.addColorStop(0, '#161618');
      lg.addColorStop(.42, '#0F0F11');
      lg.addColorStop(1, '#08080A');
      bgc.fillStyle = lg; bgc.fillRect(0, 0, W, H);
      var rg = bgc.createRadialGradient(W * .78, H * .12, 10, W * .78, H * .12, W * .95);
      rg.addColorStop(0, 'rgba(242,206,107,.30)');
      rg.addColorStop(.5, 'rgba(212,175,55,.08)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      bgc.fillStyle = rg; bgc.fillRect(0, 0, W, H);
      var rg2 = bgc.createRadialGradient(W * .1, H * .78, 10, W * .1, H * .78, W);
      rg2.addColorStop(0, 'rgba(212,175,55,.10)');
      rg2.addColorStop(1, 'rgba(0,0,0,0)');
      bgc.fillStyle = rg2; bgc.fillRect(0, 0, W, H);

      /* status bar */
      bgc.fillStyle = 'rgba(255,255,255,.92)';
      bgc.font = '600 22px ' + TH;
      bgc.textAlign = 'left'; bgc.textBaseline = 'middle';
      bgc.fillText('20:26', 46, 40);
      /* signal + battery, right side */
      var bx = W - 52;
      bgc.fillStyle = 'rgba(255,255,255,.9)';
      rr(bgc, bx, 31, 34, 17, 5); bgc.fill();
      bgc.fillStyle = 'rgba(255,255,255,.35)';
      bgc.fillRect(bx + 36, 36, 4, 7);
      bgc.fillStyle = 'rgba(255,255,255,.9)';
      bgc.font = '600 18px ' + TH;
      bgc.textAlign = 'right';
      bgc.fillText('LTE', bx - 14, 40);
      for (var i = 0; i < 4; i++) {
        bgc.fillStyle = 'rgba(255,255,255,' + (i < 3 ? '.9' : '.35') + ')';
        bgc.fillRect(bx - 66 + i * 8, 46 - (i + 1) * 3.4, 5, (i + 1) * 3.4);
      }

      /* notch */
      bgc.fillStyle = '#000';
      rr(bgc, W / 2 - 104, -26, 208, 74, 26); bgc.fill();

      /* clock */
      bgc.textAlign = 'center';
      bgc.fillStyle = 'rgba(255,255,255,.97)';
      bgc.font = '200 122px ' + TH;
      bgc.textBaseline = 'alphabetic';
      bgc.fillText('20:26', W / 2, 216);
      bgc.font = '400 25px ' + TH;
      bgc.fillStyle = 'rgba(255,255,255,.74)';
      bgc.fillText('วันพฤหัสบดี 2 ตุลาคม', W / 2, 258);

      /* orders-today pill */
      var label = 'วันนี้ ' + state.orders + ' ออเดอร์';
      bgc.font = '700 24px ' + TH;
      var tw = bgc.measureText(label).width;
      bgc.fillStyle = 'rgba(212,175,55,.16)';
      rr(bgc, W / 2 - tw / 2 - 22, 282, tw + 44, 46, 23); bgc.fill();
      bgc.strokeStyle = 'rgba(212,175,55,.45)'; bgc.lineWidth = 1.5; bgc.stroke();
      bgc.fillStyle = '#F2CE6B';
      bgc.textBaseline = 'middle';
      bgc.fillText(label, W / 2, 306);
      bgc.restore();
      state.bgDirty = false;
    }

    function bagGlyph(x, y, s, color) {
      g.save();
      g.translate(x, y);
      g.strokeStyle = color; g.lineWidth = s * .09; g.lineCap = 'round';
      g.beginPath();
      g.moveTo(-s * .34, -s * .16); g.lineTo(-s * .26, s * .38);
      g.lineTo(s * .26, s * .38); g.lineTo(s * .34, -s * .16);
      g.closePath(); g.stroke();
      g.beginPath();
      g.arc(0, -s * .16, s * .19, Math.PI, 0);
      g.stroke();
      g.restore();
    }

    function drawCard(c) {
      var y = LIST_BOTTOM - (c.slot + 1) * STEP;
      var a = c.alpha;
      if (y + CARD_H < LIST_TOP - 40) return;
      /* fade anything creeping above the list top */
      if (y < LIST_TOP) a *= Math.max(0, 1 - (LIST_TOP - y) / 90);
      if (a <= .01) return;
      g.save();
      g.globalAlpha = a;
      var x = 26, w = W - 52;
      rr(g, x, y, w, CARD_H, 30);
      g.fillStyle = 'rgba(22,22,25,.72)';
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,.13)'; g.lineWidth = 1.4; g.stroke();

      /* the platform's own logo, drawn straight onto the card at a common height.
         A soft white bloom sits behind it so a mark with dark parts (Lazada's navy
         wordmark) still separates from the dark card, without recolouring it. */
      var col = PALETTE[c.ch] || '#F0F0F3';
      var L = LOGO[c.ch], TILE_H = 48, LH = 30, PAD = 13, ty = y + 12;
      var ready = L && L.img.complete && L.img.naturalWidth > 0;
      g.textBaseline = 'middle'; g.textAlign = 'left';
      if (ready && L.ar < 1.3) {
        /* a square app icon: let it sit at tile size, the way it does on a home screen */
        rr(g, x + 18, ty, TILE_H, TILE_H, 13);
        g.save(); g.clip();
        g.drawImage(L.img, x + 18, ty, TILE_H, TILE_H);
        g.restore();
      } else {
        var lw = ready ? LH * L.ar : 0;
        if (!ready) { g.font = '800 24px ' + TH; lw = g.measureText(c.ch).width; }
        if (ready) {
          g.save();
          g.shadowColor = 'rgba(255,255,255,.92)'; g.shadowBlur = 4;
          g.drawImage(L.img, x + 18 + PAD, ty + (TILE_H - LH) / 2, lw, LH);
          g.shadowBlur = 2;
          g.drawImage(L.img, x + 18 + PAD, ty + (TILE_H - LH) / 2, lw, LH);
          g.restore();
        } else {
          g.fillStyle = col; g.fillText(c.ch, x + 18 + PAD, ty + TILE_H / 2);
        }
      }

      g.textAlign = 'right';
      g.fillStyle = 'rgba(255,255,255,.42)';
      g.font = '500 19px ' + TH;
      g.fillText(c.time, x + w - 22, ty + TILE_H / 2);

      g.textAlign = 'left';
      g.fillStyle = 'rgba(255,255,255,.88)';
      g.font = '500 22px ' + TH;
      g.fillText(c.msg, x + 20, y + 84);

      g.fillStyle = '#FFFFFF';
      g.font = '800 27px ' + TH;
      g.fillText('+฿' + c.amt.toLocaleString('en-US'), x + 20, y + 112);
      g.restore();
    }

    function push() {
      var f = FEED[state.feed % FEED.length];
      state.feed++;
      state.orders++;
      state.bgDirty = true;
      state.cards.forEach(function (c) { c.slot += 1; });
      state.cards.push({
        ch: f.ch, msg: f.msg, amt: f.amt, time: 'ตอนนี้',
        slot: -0.85, targetSlot: 0, alpha: 0
      });
      state.cards.forEach(function (c, i) { c.targetSlot = state.cards.length - 1 - i; });
      if (state.cards.length > 8) state.cards.shift();
    }

    function update(dt) {
      state.t += dt;
      state.next -= dt;
      if (state.next <= 0) { push(); state.next = 0.72 + Math.random() * 0.42; }
      state.cards.forEach(function (c) {
        c.slot += (c.targetSlot - c.slot) * Math.min(1, dt * 7);
        c.alpha += (1 - c.alpha) * Math.min(1, dt * 5.5);
      });

      if (state.bgDirty) paintBg();
      g.clearRect(0, 0, W, H);
      g.drawImage(bg, 0, 0);
      g.save();
      g.beginPath(); g.rect(0, LIST_TOP - 44, W, H - LIST_TOP + 44); g.clip();
      state.cards.forEach(drawCard);
      g.restore();

      /* home indicator */
      g.fillStyle = 'rgba(255,255,255,.5)';
      rr(g, W / 2 - 64, H - 26, 128, 7, 4); g.fill();
    }

    /* prime the stack so the screen is never empty on arrival */
    paintBg();
    for (var i = 0; i < 4; i++) { push(); }
    state.cards.forEach(function (c) { c.slot = c.targetSlot; c.alpha = 1; });
    update(0.001);

    return { canvas: cv, update: update, reset: function () {
      state.cards.length = 0; state.feed = 0; state.orders = 34; state.next = 0.35;
      state.bgDirty = true;
      for (var i = 0; i < 4; i++) push();
      state.cards.forEach(function (c) { c.slot = c.targetSlot; c.alpha = 1; });
      update(0.001);
    } };
  }

  /* ---------- model ---------- */
  function decode(b64) {
    var bin = atob(b64), n = bin.length, out = new Uint8Array(n);
    for (var i = 0; i < n; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  S.buildPhone = function (THREE, renderer) {
    var M = window.TTF_PHONE;
    if (!M) return null;
    var bytes = decode(M.b64);
    var V = M.v, T = M.tri;
    var posBytes = V * 6, norBytes = V * 3;

    var qp = new Uint16Array(bytes.buffer.slice(0, posBytes));
    var qn = new Int8Array(bytes.buffer.slice(posBytes, posBytes + norBytes));
    var qi = new Uint16Array(bytes.buffer.slice(posBytes + norBytes, posBytes + norBytes + T * 6));

    /* normalise: centre on the bounding box, height 1 */
    var sx = M.size[0], sy = M.size[1], sz = M.size[2];
    var inv = 1 / sy;
    var pos = new Float32Array(V * 3), nor = new Float32Array(V * 3);
    for (var i = 0; i < V; i++) {
      pos[i * 3] = ((qp[i * 3] / 65535) - .5) * sx * inv;
      pos[i * 3 + 1] = ((qp[i * 3 + 1] / 65535) - .5) * sy * inv;
      pos[i * 3 + 2] = ((qp[i * 3 + 2] / 65535) - .5) * sz * inv;
      nor[i * 3] = qn[i * 3] / 127;
      nor[i * 3 + 1] = qn[i * 3 + 1] / 127;
      nor[i * 3 + 2] = qn[i * 3 + 2] / 127;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setIndex(new THREE.BufferAttribute(qi, 1));
    M.groups.forEach(function (grp) { geo.addGroup(grp.start, grp.count, grp.slot); });
    geo.rotateY(Math.PI);          /* the model faces -Z; turn the screen to camera */

    function std(color, metal, rough) {
      return new THREE.MeshStandardMaterial({
        color: color, metalness: metal, roughness: rough, transparent: true, opacity: 1
      });
    }
    var mats = [
      std(0x141416, .78, .42),   /* 0 body shell        */
      std(0x8E8E94, .95, .28),   /* 1 frame / buttons   */
      std(0x121214, .70, .18),   /* 2 camera bump glass */
      std(0x0A0A0C, .60, .10),   /* 3 lens glass        */
      std(0x2A2A2E, .90, .35)    /* 4 lens ring         */
    ];

    var group = new THREE.Group();
    var body = new THREE.Mesh(geo, mats);
    group.add(body);

    /* screen: a plane just proud of the front face, carrying the canvas */
    var screen = makeScreen();
    var tex = new THREE.CanvasTexture(screen.canvas);
    /* no mipmaps: the texture is re-uploaded ~24 times a second and regenerating
       a mip chain for a 560x1250 canvas every upload is the single most expensive
       thing in the whole deck. */
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 1;
    var sw = 0.4160, sh = 0.9290, sz2 = (sz * inv) / 2 + 0.0016;
    var smat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 1 });
    var smesh = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), smat);
    smesh.position.set(0, 0, sz2);
    group.add(smesh);

    /* light spilling off the screen */
    var spill = new THREE.PointLight(0xFFD98A, 0.9, 3.2, 2);
    spill.position.set(0, .1, sz2 + .35);
    group.add(spill);

    group.scale.setScalar(40);
    group.visible = false;

    var allMats = mats.concat([smat]);
    var base = { rx: 0.045, ry: -0.24 };
    var acc = 0;                    /* the screen canvas redraws at ~30 fps, not 60 */

    return {
      obj: group,
      materials: allMats,
      setOpacity: function (a) {
        for (var k = 0; k < allMats.length; k++) allMats[k].opacity = a;
      },
      texture: tex,
      reset: screen.reset,
      update: function (t, dt, ptr) {
        acc += Math.min(dt, .06);
        if (acc > 1 / 24) { screen.update(acc); tex.needsUpdate = true; acc = 0; }
        group.rotation.y = base.ry + Math.sin(t * .22) * .085 + (ptr ? ptr.x * .10 : 0);
        group.rotation.x = base.rx + Math.cos(t * .27) * .035 - (ptr ? ptr.y * .07 : 0);
        group.rotation.z = Math.sin(t * .19) * .018;
        group.position.y = Math.sin(t * .5) * .8;
      }
    };
  };
})();
