/* TicTaxFlow — presentation engine: navigation, reveals, presenter panel, pacing. */
(function () {
  var S = (window.TTF = window.TTF || {});
  var CH = S.chapters, TOTAL = CH.length;

  var deck, sections, railEl, liveEl, progressEl, numEl;
  var current = 0;              /* 1-based once set */
  var motionOn = true, webglOK = false;
  var flashTimer = null, digitBuf = '', digitTimer = null, scrollRaf = 0;
  var timer = { running: false, base: 0, startedAt: 0 };

  function $(id) { return document.getElementById(id); }
  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function fmtTime(s) {
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function pad2(n) { return ('0' + n).slice(-2); }

  /* ---------------- rail ---------------- */
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

  /* ---------------- counters ---------------- */
  function runCounters(sec) {
    var els = sec.querySelectorAll('[data-count-to]');
    Array.prototype.forEach.call(els, function (el) {
      if (el.children.length) return;                    /* keep nested markup intact */
      var to = parseFloat(el.getAttribute('data-count-to'));
      if (isNaN(to)) return;
      var pre = el.getAttribute('data-count-prefix') || '';
      var suf = el.getAttribute('data-count-suffix') || '';
      var final = pre + to.toLocaleString('en-US') + suf;
      if (!motionOn) { el.textContent = final; return; }
      var t0 = performance.now(), dur = 1600;
      el.setAttribute('aria-label', final);
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(to * e).toLocaleString('en-US') + suf;
        if (p < 1 && sec.classList.contains('is-active')) requestAnimationFrame(step);
        else el.textContent = final;
      })(t0);
    });
  }

  /* ---------------- activation ---------------- */
  function setActive(n) {
    if (n === current) return;
    current = n;
    var sec = sections[n - 1];

    /* The outgoing chapter keeps its finished state for ~900 ms so nothing blinks
       out mid-transition; after that the class is dropped so a later revisit replays. */
    Array.prototype.forEach.call(sections, function (s, i) {
      if (i === n - 1) {
        if (s._off) { clearTimeout(s._off); s._off = null; }
        s.classList.add('is-active');
      } else if (s.classList.contains('is-active') && !s._off) {
        s._off = setTimeout(function () { s.classList.remove('is-active'); s._off = null; }, 900);
      }
    });

    document.body.dataset.ground = CH[n - 1].ground;   /* chrome flips ink / ivory */
    numEl.textContent = pad2(n);
    progressEl.style.width = (n / TOTAL * 100) + '%';
    Array.prototype.forEach.call(railEl.children, function (b, i) {
      if (i === n - 1) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    liveEl.textContent = 'Chapter ' + n + ' of ' + TOTAL + ': ' + CH[n - 1].name;
    if (history.replaceState) history.replaceState(null, '', '#ch-' + n);

    runCounters(sec);
    if (S.three && webglOK && motionOn) S.three.setChapter(n, CH[n - 1].ground);

    /* chapter 3 threshold flash — one flash, motion only */
    if (flashTimer) { clearTimeout(flashTimer); flashTimer = null; }
    var flash = $('flash3');
    if (flash) flash.classList.remove('fire');
    if (n === 3 && motionOn && flash) {
      flashTimer = setTimeout(function () {
        flash.classList.add('fire');
        setTimeout(function () { flash.classList.remove('fire'); }, 700);
      }, 2600);
    }

    setShots(n === 8);

    updatePresenter();
    if (n > 1) document.body.classList.add('moved');
  }

  /* ---------------- chapter 8: three product screens on one laptop ----------------
     The steps are real buttons, so the chapter works with a click or the keyboard
     alone. While the chapter is on screen and motion is on, they also advance on a
     timer; any click stops the timer so the presenter keeps control of the beat. */
  var shotTimer = 0, shotAuto = true, SHOT_MS = 4200;

  function showShot(k) {
    var steps = document.querySelectorAll('#ch8steps .step');
    var shots = document.querySelectorAll('#ch-8 .shot');
    var dots = document.querySelectorAll('#ch8dots i');
    if (!steps.length) return;
    k = ((k - 1) % steps.length + steps.length) % steps.length + 1;
    Array.prototype.forEach.call(steps, function (li, i) {
      var on = i === k - 1;
      li.classList.toggle('is-on', on);
      var b = li.querySelector('button');
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    Array.prototype.forEach.call(shots, function (s, i) { s.classList.toggle('is-on', i === k - 1); });
    Array.prototype.forEach.call(dots, function (d, i) { d.classList.toggle('is-on', i === k - 1); });
    shotAt = k;
  }
  var shotAt = 1;

  function setShots(on) {
    if (shotTimer) { clearInterval(shotTimer); shotTimer = 0; }
    if (!on) return;
    showShot(1); shotAt = 1;
    if (!shotAuto || !motionOn) return;
    shotTimer = setInterval(function () { showShot(shotAt + 1); }, SHOT_MS);
  }

  function wireShots() {
    var list = $('ch8steps');
    if (!list) return;
    list.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-step]') : null;
      if (!b) return;
      shotAuto = false;
      if (shotTimer) { clearInterval(shotTimer); shotTimer = 0; }
      showShot(parseInt(b.dataset.step, 10));
    });
  }

  function goTo(n) {
    n = Math.min(TOTAL, Math.max(1, n));
    var target = sections[n - 1];
    if (!target) return;
    document.body.classList.add('moved');
    if (motionOn && !prefersReduced()) deck.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    else deck.scrollTop = target.offsetTop;
    setActive(n);
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = 0;
      /* sections can be taller than the viewport on small screens, so pick the
         section whose start is nearest the current scroll position */
      var top = deck.scrollTop, best = 0, bd = Infinity;
      for (var i = 0; i < sections.length; i++) {
        var d = Math.abs(sections[i].offsetTop - top);
        if (d < bd) { bd = d; best = i; }
      }
      setActive(best + 1);
    });
  }

  /* ---------------- presenter ---------------- */
  function elapsed() {
    return timer.base + (timer.running ? (performance.now() - timer.startedAt) / 1000 : 0);
  }
  function cumulativeTarget(n) {
    var s = 0;
    for (var i = 0; i < n; i++) s += CH[i].target;
    return s;
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
    var due = cumulativeTarget(current);
    var pace = $('pPace'), diff = e - due;
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

  /* ---------------- modes ---------------- */
  function setMotion(on) {
    motionOn = on;
    document.body.classList.toggle('reduced', !on);
    $('btnMotion').setAttribute('aria-pressed', on ? 'true' : 'false');
    if (!S.three) return;
    if (on && webglOK) {
      document.body.classList.remove('no-webgl');
      S.three.start();
      if (current >= 1) S.three.setChapter(current, CH[current - 1].ground);
    }
    else { S.three.stop(); document.body.classList.add('no-webgl'); }
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
    } catch (e) { /* fullscreen may be blocked; presentation styling still applies */ }
    if (on && !timer.running) toggleTimer();
    setTimeout(function () { goTo(current); if (S.three) S.three.resize(); }, 120);
  }

  /* ---------------- input ---------------- */
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
      var t = e.changedTouches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now();
    }, { passive: true });
    deck.addEventListener('touchend', function (e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0;
      /* vertical swipes are handled natively by scroll-snap; horizontal is ours */
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - t0 < 700) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });
  }

  /* Publish the platform logos as CSS custom properties so the markup can use
     them without repeating a data URI in every element. */
  function publishBrandLogos() {
    var B = window.TTF_BRAND;
    if (!B) return;
    var root = document.documentElement;
    for (var k in B) {
      var key = k.toLowerCase();
      root.style.setProperty('--logo-' + key, 'url("' + B[k].uri + '")');
      root.style.setProperty('--logoar-' + key, (B[k].w / B[k].h).toFixed(3));
    }
    var U = window.TTF_UI;
    if (U) {
      for (var u in U) root.style.setProperty('--ui-' + u, 'url("' + U[u].uri + '")');
    }
    var T = window.TTF_TEAM;
    if (T) {
      for (var t in T) root.style.setProperty('--team-' + t, 'url("' + T[t] + '")');
    }
    var S = window.TTF_SELLER;
    if (S) {
      root.style.setProperty('--seller', 'url("' + S.uri + '")');
      root.style.setProperty('--seller-ar', S.w + '/' + S.h);
    }
  }

  /* ---------------- boot ---------------- */
  function boot() {
    publishBrandLogos();
    wireShots();
    deck = $('deck');
    sections = document.querySelectorAll('.chapter');
    railEl = $('rail'); liveEl = $('live'); progressEl = $('progressLine'); numEl = $('chapNum');

    buildRail();
    bindTouch();

    var reduced = prefersReduced();
    if (!reduced && S.three) webglOK = S.three.init($('stage'));
    if (!webglOK) document.body.classList.add('no-webgl');
    setMotion(!reduced);

    deck.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', function () { setTimeout(function () { goTo(current); }, 160); });

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
      if (S.three) S.three.resize();
    });
    setInterval(function () { if ($('presenter').dataset.open === 'true' || document.body.classList.contains('pres')) tickClock(); }, 1000);

    var m = /^#ch-(\d+)$/.exec(location.hash || '');
    var start = m ? Math.min(TOTAL, Math.max(1, parseInt(m[1], 10))) : 1;
    current = 0;
    if (start > 1) { deck.scrollTop = sections[start - 1].offsetTop; }
    setActive(start);
    if (start === 1) document.body.classList.remove('moved');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
