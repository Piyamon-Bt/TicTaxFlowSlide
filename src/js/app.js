/* TicTaxFlow — presentation engine.

   Scroll model: every chapter is a tall <section class="scene"> whose .stage is
   sticky for the length of the scene. Each frame we publish the scene's own
   scroll progress as --p (0 → 1), and from it a per-element entry (--t) and
   exit (--x). Nothing is on a timer: every frame is exactly where the scrollbar
   says it should be, which is what makes the motion feel attached to the hand.

   Presenting: chapters declare beat stops. The arrow keys glide to the next
   beat — inside the current chapter if it has one left, otherwise the first
   beat of the next chapter — so a live pitch keeps precise control while the
   page still scrolls freely for anyone reading it on their own. */
(function () {
  var S = (window.TTF = window.TTF || {});
  var CH = S.chapters, TOTAL = CH.length;

  var deck, scenes = [], railEl, liveEl, progressEl, numEl;
  var current = 0;                     /* 1-based chapter once set */
  var motionOn = true, webglOK = false;
  var stops = [];                      /* flat list of beats across the deck */
  var raf = 0, tween = null, flashFired = false;
  var digitBuf = '', digitTimer = null;
  var timer = { running: false, base: 0, startedAt: 0 };

  function $(id) { return document.getElementById(id); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function prefersReduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function fmtTime(s) {
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function pad2(n) { return ('0' + n).slice(-2); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIO(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  /* progress of v through [a,b], 0 outside */
  function span(v, a, b) { return b <= a ? (v >= b ? 1 : 0) : clamp01((v - a) / (b - a)); }

  /* ============================================================
     scene registry
     ============================================================ */
  function measure() {
    var vh = deck.clientHeight;
    scenes.forEach(function (sc) {
      sc.top = sc.el.offsetTop;
      sc.range = Math.max(1, sc.el.offsetHeight - vh);   /* the pinned distance */
    });
    buildStops();
  }

  function buildStops() {
    stops = [];
    scenes.forEach(function (sc) {
      /* With motion off every scene collapses to one screen, so its beats
         collapse with it — otherwise the arrow keys would step through four
         stops that are all the same pixel. */
      var beats = motionOn ? sc.beats : [0];
      sc.stopY = beats.map(function (b) { return sc.top + b * sc.range; });
      sc.stopY.forEach(function (y, i) { stops.push({ y: y, ch: sc.n, beat: i }); });
    });
    stops.sort(function (a, b) { return a.y - b.y; });
  }

  function collect() {
    scenes = [];
    Array.prototype.forEach.call(document.querySelectorAll('.scene'), function (el) {
      var beats = (el.dataset.stops || '0').trim().split(/\s+/).map(parseFloat)
        .filter(function (v) { return !isNaN(v); });
      if (!beats.length) beats = [0];
      var anims = Array.prototype.map.call(el.querySelectorAll('[data-r]'), function (node) {
        var r = node.dataset.r.trim().split(/\s+/).map(parseFloat);
        return { el: node, a: r[0], b: r[1], c: r.length > 2 ? r[2] : null, d: r.length > 3 ? r[3] : null };
      });
      scenes.push({
        el: el, n: parseInt(el.dataset.ch, 10), ground: el.dataset.ground || 'dark',
        stage: el.querySelector('.stage'), beats: beats, anims: anims,
        scrub: el.dataset.scrub || '', top: 0, range: 1, p: -1, live: false
      });
    });
    scenes.sort(function (a, b) { return a.n - b.n; });
  }

  /* ============================================================
     the frame loop
     ============================================================ */
  function paint() {
    raf = 0;
    var y = deck.scrollTop, vh = deck.clientHeight;
    var near = null, nearD = Infinity;

    for (var i = 0; i < scenes.length; i++) {
      var sc = scenes[i];
      /* is any part of this scene within a viewport of the fold? */
      var visible = sc.top - vh < y && sc.top + sc.el.offsetHeight + vh > y;
      /* With motion off there is no pinned range to scrub, so every scene is
         rendered in its finished state and the scrub hooks print final values. */
      var p = motionOn ? clamp01((y - sc.top) / sc.range) : 1;

      if (!visible) {
        /* park it at whichever end it left through, then stop touching it */
        if (sc.p !== p && (p === 0 || p === 1)) applyScene(sc, p);
        setLive(sc, false);
        continue;
      }
      setLive(sc, true);
      if (p !== sc.p) applyScene(sc, p);

      /* the chapter the audience is actually looking at is the one whose stage
         is filling the viewport — i.e. whose scene contains the fold centre */
      var d = Math.abs((sc.top + sc.range / 2) - y);
      if (y >= sc.top - vh * .5 && y < sc.top + sc.el.offsetHeight - vh * .5 && d < nearD) {
        nearD = d; near = sc;
      }
    }

    if (near && near.n !== current) setChapter(near.n);
    var total = deck.scrollHeight - vh;
    progressEl.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
  }

  function setLive(sc, on) {
    if (sc.live === on) return;
    sc.live = on;
    if (sc.stage) sc.stage.classList.toggle('is-live', on);
  }

  function applyScene(sc, p) {
    sc.p = p;
    sc.el.style.setProperty('--p', p.toFixed(4));
    for (var i = 0; i < sc.anims.length; i++) {
      var an = sc.anims[i];
      var t = easeOut(span(p, an.a, an.b));
      var x = an.c === null ? 0 : smooth(span(p, an.c, an.d === null ? an.c + .12 : an.d));
      an.el.style.setProperty('--t', t.toFixed(4));
      an.el.style.setProperty('--x', x.toFixed(4));
    }
    if (sc.scrub && SCRUB[sc.scrub]) SCRUB[sc.scrub](sc, p);
    /* the depth layer dollies with the same number, so canvas and DOM never
       disagree about how far into a chapter we are */
    if (S.three && webglOK && motionOn && S.three.setProgress) S.three.setProgress(sc.n, p);
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(paint); }

  /* ============================================================
     per-chapter scrub hooks
     Everything here is a pure function of the chapter's own scroll
     progress, so scrubbing backwards is identical to scrubbing forward.
     ============================================================ */
  var STEPS = [
    { p: 0.00, v: 0 },
    { p: 0.18, v: 420000 },
    { p: 0.36, v: 870000 },
    { p: 0.54, v: 1340000 },
    { p: 0.70, v: 1720000 },
    { p: 0.84, v: 1800000 }
  ];

  var SCRUB = {
    /* 01 — the seller's day filling up. Rows land across the first three
       quarters of the scene and the two counters are simply the sum of what
       is on screen, so the number the audience sees is always the number the
       rows add up to. */
    hero: function (sc, p) {
      var rows = sc.el.querySelectorAll('.frow');
      if (!rows.length) return;
      var shown = Math.round(clamp01(p / 0.78) * rows.length);
      if (sc._shown === shown) return;
      sc._shown = shown;
      var amt = 0, ord = 0;
      for (var i = 0; i < rows.length; i++) {
        var on = i < shown;
        rows[i].classList.toggle('is-in', on);
        if (on) { amt += +rows[i].dataset.amt; ord += +rows[i].dataset.ord; }
      }
      var o = sc.el.querySelector('[data-orders]'), t = sc.el.querySelector('[data-take]');
      if (o) o.textContent = ord;
      if (t) t.textContent = amt.toLocaleString('en-US');
    },

    /* 05 — the tax year passing. The fifteen month cells sweep in left to
       right, so the two filing windows arrive in the order the seller meets
       them rather than both at once. */
    calendar: function (sc, p) {
      var cells = sc.el.querySelectorAll('.ybmonths i');
      if (!cells.length) return;
      var k = clamp01(span(p, 0.2, 0.46)) * cells.length;
      for (var i = 0; i < cells.length; i++) {
        cells[i].style.opacity = clamp01(k - i).toFixed(3);
      }
    },

    /* 03 — the accumulation. The number, the track and the marks are all one
       reading of p, and the brand flash fires the moment it reaches 1.80M. */
    number: function (sc, p) {
      var el = sc.el.querySelector('[data-num]');
      var bar = sc.el.querySelector('.track .bar');
      if (!el) return;
      var v = 0;
      for (var i = 1; i < STEPS.length; i++) {
        var s0 = STEPS[i - 1], s1 = STEPS[i];
        if (p >= s1.p) { v = s1.v; continue; }
        v = s0.v + (s1.v - s0.v) * easeOut(span(p, s0.p, s1.p));
        break;
      }
      if (p >= STEPS[STEPS.length - 1].p) v = 1800000;
      el.textContent = Math.round(v).toLocaleString('en-US');
      if (bar) bar.style.setProperty('--fill', (v / 1800000).toFixed(4));

      var marks = sc.el.querySelectorAll('.track .marks span');
      Array.prototype.forEach.call(marks, function (m, i) {
        m.classList.toggle('on', p >= STEPS[i + 1].p - .02);
      });

      var hit = p >= .84;
      if (hit && !flashFired && motionOn && sc.live) {
        flashFired = true;
        var f = $('flash3');
        if (f) { f.classList.remove('fire'); void f.offsetWidth; f.classList.add('fire'); }
      }
      if (!hit) flashFired = false;
    },

    /* 04 — three questions cross-fading in place, then the headline */
    questions: function (sc, p) {
      var qs = sc.el.querySelectorAll('.qswap .q');
      if (qs.length) {
        var papers = sc.el.querySelectorAll('.paperfall span');
        Array.prototype.forEach.call(papers, function (el, i) {
          var k = (i % 6) / 5;
          el.style.transform = 'translate3d(0,' + ((p * 130 + k * 90) % 160 - 30).toFixed(1) +
            'px,0) rotate(' + (-14 + k * 28 + p * 22).toFixed(1) + 'deg)';
        });
      }
    },

    /* 07 — the machine rises out of the dark and fills the frame */
    device: function (sc, p) {
      var mb = sc.el.querySelector('.macbook');
      if (!mb) return;
      var g = easeOut(span(p, 0, .46));
      mb.style.transform = 'scale(' + (0.72 + g * 0.28).toFixed(4) + ') translate3d(0,' +
        ((1 - g) * 46).toFixed(1) + 'px,0)';
      var bar = sc.el.querySelector('.fc-bar');
      var rev = sc.el.querySelector('[data-rev]');
      var k = easeOut(span(p, .52, .82));
      if (bar) bar.style.setProperty('--fill', (0.9124 * k).toFixed(4));
      if (rev) rev.textContent = '฿' + Math.round(1642350 * k).toLocaleString('en-US');
      var left = sc.el.querySelector('[data-left]');
      if (left) left.textContent = '฿' + Math.round(157650 * k).toLocaleString('en-US');
      /* 1,642,350 / 1,800,000 = 91.24 % -> 91 %, the figure in the source deck */
      var pct = sc.el.querySelector('[data-pct]');
      if (pct) pct.textContent = Math.round(91.24 * k) + '%';
    },

    /* 08 — scroll picks the screen, so the presenter can hold any one of them */
    screens: function (sc, p) {
      var k = p < .34 ? 1 : p < .64 ? 2 : 3;
      if (sc._shot === k) return;
      sc._shot = k;
      showShot(k);
    },

    /* 09 — the funnel narrows as the scene plays */
    funnel: function (sc, p) {
      var tiers = sc.el.querySelectorAll('.ftier');
      Array.prototype.forEach.call(tiers, function (el, i) {
        var w = [100, 78, 56][i] || 100;
        var k = easeOut(span(p, .1 + i * .14, .34 + i * .14));
        el.style.width = (100 - (100 - w) * k) + '%';
      });
    }
  };

  /* ---------------- chapter 08 screens ---------------- */
  function showShot(k) {
    var steps = document.querySelectorAll('#ch9steps .step');
    var shots = document.querySelectorAll('#ch-9 .shot');
    var dots = document.querySelectorAll('#ch9dots i');
    if (!steps.length) return;
    k = Math.min(steps.length, Math.max(1, k));
    Array.prototype.forEach.call(steps, function (li, i) {
      var on = i === k - 1;
      li.classList.toggle('is-on', on);
      var b = li.querySelector('button');
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    Array.prototype.forEach.call(shots, function (s, i) { s.classList.toggle('is-on', i === k - 1); });
    Array.prototype.forEach.call(dots, function (d, i) { d.classList.toggle('is-on', i === k - 1); });
  }

  /* Clicking a step scrolls to the part of chapter 08 that shows it — the
     screens stay a pure function of scroll position, never a second source
     of truth that could disagree with it. */
  function wireShots() {
    var list = $('ch8steps');
    if (!list) return;
    list.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-step]') : null;
      if (!b) return;
      var sc = sceneOf(9); if (!sc) return;
      var mid = [0.17, 0.49, 0.82][parseInt(b.dataset.step, 10) - 1];
      glide(sc.top + mid * sc.range);
    });
  }
  function sceneOf(n) {
    for (var i = 0; i < scenes.length; i++) if (scenes[i].n === n) return scenes[i];
    return null;
  }

  /* ============================================================
     navigation — a hand-rolled tween so the glide has Apple's
     ease rather than the browser's linear-ish smooth scroll
     ============================================================ */
  function glide(to, dur) {
    var from = deck.scrollTop;
    var max = deck.scrollHeight - deck.clientHeight;
    to = Math.max(0, Math.min(max, to));
    var dist = Math.abs(to - from);
    if (tween) tween.cancelled = true;
    if (!motionOn || prefersReduced() || dist < 2) { deck.scrollTop = to; schedule(); return; }
    var ms = dur || Math.max(520, Math.min(1150, 380 + dist * 0.42));
    var t0 = performance.now(), me = tween = { cancelled: false };
    (function step(now) {
      if (me.cancelled) return;
      var k = clamp01((now - t0) / ms);
      deck.scrollTop = from + (to - from) * easeIO(k);
      schedule();
      if (k < 1) requestAnimationFrame(step); else tween = null;
    })(t0);
  }

  function nearestStopIndex() {
    var y = deck.scrollTop, best = 0, bd = Infinity;
    for (var i = 0; i < stops.length; i++) {
      var d = Math.abs(stops[i].y - y);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  function next() {
    var y = deck.scrollTop;
    for (var i = 0; i < stops.length; i++) if (stops[i].y > y + 8) return glide(stops[i].y);
    glide(deck.scrollHeight);
  }
  function prev() {
    var y = deck.scrollTop;
    for (var i = stops.length - 1; i >= 0; i--) if (stops[i].y < y - 8) return glide(stops[i].y);
    glide(0);
  }
  function goTo(n) {
    n = Math.min(TOTAL, Math.max(1, n));
    var sc = sceneOf(n);
    if (sc) glide(sc.stopY ? sc.stopY[0] : sc.top);
  }

  /* ============================================================
     chapter state — chrome, rail, ground, presenter, WebGL
     ============================================================ */
  function setChapter(n) {
    current = n;
    var c = CH[n - 1];
    document.body.dataset.ground = (sceneOf(n) || {}).ground === 'light' ? 'light' : 'dark';
    numEl.textContent = pad2(n);
    Array.prototype.forEach.call(railEl.children, function (b, i) {
      if (i === n - 1) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    liveEl.textContent = 'Chapter ' + n + ' of ' + TOTAL + ': ' + c.name;
    if (history.replaceState) history.replaceState(null, '', '#ch-' + n);
    if (S.three && webglOK && motionOn) S.three.setChapter(n, (sceneOf(n) || {}).ground);
    updatePresenter();
    if (n > 1) document.body.classList.add('moved');
  }

  function buildRail() {
    railEl.innerHTML = '';
    CH.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Chapter ' + pad2(c.n) + ': ' + c.name);
      b.innerHTML = '<span class="name">' + pad2(c.n) + ' ' + c.name + '</span><span class="tick"></span>';
      b.addEventListener('click', function () { goTo(c.n); });
      railEl.appendChild(b);
    });
  }

  /* ============================================================
     presenter panel
     ============================================================ */
  function elapsed() {
    return timer.base + (timer.running ? (performance.now() - timer.startedAt) / 1000 : 0);
  }
  function cumulativeTarget(n) {
    var s = 0; for (var i = 0; i < n; i++) s += CH[i].target; return s;
  }
  function updatePresenter() {
    var c = CH[current - 1]; if (!c) return;
    $('pNum').textContent = pad2(c.n) + ' / ' + TOTAL;
    $('pTitle').textContent = c.name;
    $('pCue').textContent = c.cue;
    $('pScript').textContent = c.script;
    $('pTarget').textContent = fmtTime(c.target);
    var nx = CH[current];
    $('pNext').innerHTML = nx
      ? 'Next — <b>' + pad2(nx.n) + ' ' + nx.name + '</b><br>' + nx.title
      : 'Last chapter. Total target 10:00.';
    tickClock();
  }
  function tickClock() {
    var e = elapsed();
    $('pElapsed').textContent = fmtTime(e);
    var due = cumulativeTarget(current), pace = $('pPace'), diff = e - due;
    if (diff < -20) { pace.dataset.state = 'ahead'; pace.textContent = 'Ahead ' + fmtTime(-diff); }
    else if (diff > 20) { pace.dataset.state = 'behind'; pace.textContent = 'Behind ' + fmtTime(diff); }
    else { pace.dataset.state = 'on'; pace.textContent = 'On pace'; }
  }
  function toggleTimer() {
    if (timer.running) { timer.base = elapsed(); timer.running = false; }
    else { timer.startedAt = performance.now(); timer.running = true; }
    tickClock();
  }
  function resetTimer() { timer.base = 0; timer.running = false; timer.startedAt = 0; tickClock(); }

  function setPanel(open) {
    var p = $('presenter');
    p.dataset.open = open ? 'true' : 'false';
    p.setAttribute('aria-hidden', open ? 'false' : 'true');
    $('btnNotes').setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && !timer.running && timer.base === 0) toggleTimer();
  }
  function setHelp(open) {
    $('help').dataset.open = open ? 'true' : 'false';
    $('btnHelp').setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  /* ============================================================
     modes
     ============================================================ */
  function setMotion(on) {
    motionOn = on;
    document.body.classList.toggle('reduced', !on);
    $('btnMotion').setAttribute('aria-pressed', on ? 'true' : 'false');
    if (S.three) {
      if (on && webglOK) {
        document.body.classList.remove('no-webgl');
        S.three.start();
        if (current >= 1) S.three.setChapter(current, (sceneOf(current) || {}).ground);
      } else { S.three.stop(); document.body.classList.add('no-webgl'); }
    }
    /* scene heights change with the reduced class, so everything must be re-measured */
    setTimeout(function () { measure(); schedule(); }, 60);
  }
  function setPres(on) {
    document.body.classList.toggle('pres', on);
    $('btnPres').setAttribute('aria-pressed', on ? 'true' : 'false');
    try {
      if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else if (!on && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    } catch (e) { /* fullscreen may be blocked; the presentation styling still applies */ }
    if (on && !timer.running) toggleTimer();
    setTimeout(function () {
      measure(); goTo(current); if (S.three) S.three.resize();
    }, 140);
  }

  /* ============================================================
     input
     ============================================================ */
  function onKey(e) {
    var k = e.key;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (k === 'Escape') {
      if ($('help').dataset.open === 'true') return setHelp(false);
      if ($('presenter').dataset.open === 'true') return setPanel(false);
      if (document.body.classList.contains('pres')) return setPres(false);
      return;
    }
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Spacebar') {
      e.preventDefault(); next(); return;
    }
    if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); prev(); return; }
    if (k === 'Home') { e.preventDefault(); goTo(1); return; }
    if (k === 'End') { e.preventDefault(); goTo(TOTAL); return; }
    if (k === 'p' || k === 'P') { setPanel($('presenter').dataset.open !== 'true'); return; }
    if (k === 'f' || k === 'F') { setPres(!document.body.classList.contains('pres')); return; }
    if (k === 'm' || k === 'M') { setMotion(!motionOn); return; }
    if (k === '?' || (k === '/' && e.shiftKey)) { setHelp($('help').dataset.open !== 'true'); return; }
    if (/^[0-9]$/.test(k)) {
      digitBuf += k;
      var v = parseInt(digitBuf, 10);
      if (digitBuf === '0') v = 10;
      if (v >= 1 && v <= TOTAL) goTo(v);
      clearTimeout(digitTimer);
      digitTimer = setTimeout(function () { digitBuf = ''; }, 600);
    }
  }

  function bindTouch() {
    var x0 = 0, y0 = 0, t0 = 0;
    deck.addEventListener('touchstart', function (e) {
      if (tween) tween.cancelled = true;              /* the hand always wins */
      var t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now();
    }, { passive: true });
    deck.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      /* vertical is native scrolling; a horizontal swipe steps a beat */
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - t0 < 700) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });
    deck.addEventListener('wheel', function () { if (tween) tween.cancelled = true; }, { passive: true });
  }

  /* Publish the supplied images as CSS custom properties so the markup can use
     them without repeating a data URI in every element. */
  function publishAssets() {
    var root = document.documentElement, B = window.TTF_BRAND, U = window.TTF_UI,
      T = window.TTF_TEAM, SE = window.TTF_SELLER, k;
    if (B) for (k in B) {
      root.style.setProperty('--logo-' + k.toLowerCase(), 'url("' + B[k].uri + '")');
      root.style.setProperty('--logoar-' + k.toLowerCase(), (B[k].w / B[k].h).toFixed(3));
    }
    if (U) for (k in U) root.style.setProperty('--ui-' + k, 'url("' + U[k].uri + '")');
    if (T) for (k in T) root.style.setProperty('--team-' + k, 'url("' + T[k] + '")');
    if (SE) {
      root.style.setProperty('--seller', 'url("' + SE.uri + '")');
      root.style.setProperty('--seller-ar', SE.w + '/' + SE.h);
    }
  }

  /* ============================================================
     boot
     ============================================================ */
  function boot() {
    publishAssets();
    deck = $('deck');
    railEl = $('rail'); liveEl = $('live'); progressEl = $('progressLine'); numEl = $('chapNum');
    var totEl = $('chapTot');
    if (totEl) totEl.textContent = ' / ' + TOTAL;

    collect();
    buildRail();
    bindTouch();
    wireShots();

    var reduced = prefersReduced();
    if (!reduced && S.three) webglOK = S.three.init($('stage'));
    if (!webglOK) document.body.classList.add('no-webgl');
    setMotion(!reduced);

    deck.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', function () {
      clearTimeout(boot._rz);
      boot._rz = setTimeout(function () { measure(); schedule(); }, 140);
    });
    if (window.ResizeObserver) {
      new ResizeObserver(function () { measure(); schedule(); }).observe(deck);
    }

    $('btnNotes').addEventListener('click', function () { setPanel($('presenter').dataset.open !== 'true'); });
    $('pClose').addEventListener('click', function () { setPanel(false); });
    $('btnHelp').addEventListener('click', function () { setHelp($('help').dataset.open !== 'true'); });
    $('helpClose').addEventListener('click', function () { setHelp(false); });
    $('help').addEventListener('click', function (e) { if (e.target === $('help')) setHelp(false); });
    $('btnMotion').addEventListener('click', function () { setMotion(!motionOn); });
    $('btnPres').addEventListener('click', function () { setPres(!document.body.classList.contains('pres')); });
    $('pStart').addEventListener('click', toggleTimer);
    $('pReset').addEventListener('click', resetTimer);
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement) document.body.classList.remove('pres');
      $('btnPres').setAttribute('aria-pressed', document.body.classList.contains('pres') ? 'true' : 'false');
      setTimeout(function () { measure(); schedule(); if (S.three) S.three.resize(); }, 120);
    });
    setInterval(function () {
      if ($('presenter').dataset.open === 'true' || document.body.classList.contains('pres')) tickClock();
    }, 1000);

    measure();
    var m = /^#ch-(\d+)$/.exec(location.hash || '');
    var start = m ? Math.min(TOTAL, Math.max(1, parseInt(m[1], 10))) : 1;
    if (start > 1) { var sc = sceneOf(start); if (sc) deck.scrollTop = sc.top; }
    setChapter(start);
    schedule();
    if (start === 1) document.body.classList.remove('moved');

    /* images decode after first paint and can change scene heights */
    window.addEventListener('load', function () {
      setTimeout(function () { measure(); schedule(); }, 120);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
