/* ------------------------------------------------------------------
 * 임형근 ♥ 신상은 — 모바일 청첩장
 * API 키 없이 동작합니다. (지도만 Leaflet 을 CDN 에서 불러옵니다)
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var W = window.WEDDING;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];
  var DOW_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  var pad = function (n) { return n < 10 ? '0' + n : String(n); };

  /* ── 날짜 ────────────────────────────────────────────────
     뷰어의 시간대와 무관하게 "2027-01-23" 이라는 달력상의 날짜를
     그대로 쓰기 위해 UTC 기준으로 계산합니다. */
  var D = W.date;
  var dowIndex = new Date(Date.UTC(D.year, D.month - 1, D.day)).getUTCDay();
  var ampm = D.hour < 12 ? '오전' : '오후';
  var hour12 = D.hour % 12 || 12;
  var timeKo = ampm + ' ' + hour12 + '시' + (D.minute ? ' ' + D.minute + '분' : '');

  /* ── 토스트 ──────────────────────────────────────────── */
  var toastEl = $('[data-toast]');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-on');
      setTimeout(function () { toastEl.hidden = true; }, 300);
    }, 1800);
  }

  /* ── 클립보드 (구형 브라우저 대비 fallback 포함) ─────── */
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  function bindCopy(el, text, msg) {
    el.addEventListener('click', function () {
      copy(text).then(
        function () { toast(msg); },
        function () { toast('복사에 실패했어요. 길게 눌러 복사해 주세요.'); }
      );
    });
  }

  /* ── 표지 ────────────────────────────────────────────── */
  $('[data-cover-date]').textContent =
    D.year + '년 ' + D.month + '월 ' + D.day + '일 ' +
    DOW[dowIndex] + '요일 ' + timeKo;

  /* ── 인사말 ──────────────────────────────────────────── */
  $('[data-greeting]').innerHTML = W.greeting
    .map(function (line) { return escapeHtml(line); })
    .join('<br>');

  var parentsEl = $('[data-parents]');
  [W.groom, W.bride].forEach(function (p) {
    parentsEl.insertAdjacentHTML('beforeend',
      '<span class="p-pair">' + escapeHtml(p.father) +
        '<i class="parents__dot">·</i>' + escapeHtml(p.mother) + '</span>' +
      '<span class="p-of">의 ' + escapeHtml(p.relation) + '</span>' +
      '<span class="p-child">' + escapeHtml(p.name) + '</span>'
    );
  });

  /* ── 예식 안내 ───────────────────────────────────────── */
  $('[data-day-title]').innerHTML =
    '<b>' + D.year + '년 ' + D.month + '월 ' + D.day + '일</b> ' +
    DOW[dowIndex] + '요일 ' + timeKo +
    '<span class="sub">' + escapeHtml(
      (W.venue.area ? W.venue.area + ' ' : '') + W.venue.name + ' ' + W.venue.hall) + '</span>';

  /* 달력 */
  (function buildCalendar() {
    var first = new Date(Date.UTC(D.year, D.month - 1, 1)).getUTCDay();
    var days = new Date(Date.UTC(D.year, D.month, 0)).getUTCDate();
    var html = '<div class="cal__grid">';

    DOW_EN.forEach(function (name, i) {
      html += '<div class="cal__head' + (i === 0 ? ' is-sun' : '') + '">' + name.charAt(0) + '</div>';
    });
    for (var b = 0; b < first; b++) html += '<div class="cal__cell"></div>';
    for (var d = 1; d <= days; d++) {
      var dow = (first + d - 1) % 7;
      var cls = 'cal__cell' + (dow === 0 ? ' is-sun' : '') + (d === D.day ? ' is-mark' : '');
      html += '<div class="' + cls + '"><span>' + d + '</span></div>';
    }
    html += '</div>';
    $('[data-calendar]').innerHTML = html;
  })();

  /* D-day — 한국 시간 기준 */
  (function countdown() {
    var now = new Date();
    var kst = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 3600000);
    var today = Date.UTC(kst.getFullYear(), kst.getMonth(), kst.getDate());
    var target = Date.UTC(D.year, D.month - 1, D.day);
    var left = Math.round((target - today) / 86400000);
    var who = W.groom.name + ' ♥ ' + W.bride.name;
    var msg;

    if (left > 0) {
      msg = who + '의 결혼식이 <b><span data-count="' + left + '">' + left + '</span>일</b> 남았습니다.';
    } else if (left === 0) {
      msg = '오늘은 <b>' + who + '</b>의 결혼식 날입니다.';
    } else {
      msg = '함께해 주셔서 진심으로 감사합니다.';
    }
    $('[data-dday]').innerHTML = msg;
  })();

  /* ── 갤러리 ──────────────────────────────────────────── */
  var G = W.gallery;
  var names = [];
  for (var i = 1; i <= G.count; i++) names.push(G.prefix + pad(i) + G.ext);

  (function buildGallery() {
    var wrap = $('[data-gallery]');

    /* 첫 장(가로 사진)은 전체 너비. 3열로 깔고 남는 자투리는
       절반 크기로 채워 마지막 줄이 비어 보이지 않게 합니다. */
    var rest = names.length - 1;
    var over = rest % 3;                       // 0, 1, 2
    var halfFrom = over === 2 ? names.length - 2
                 : over === 1 ? names.length - 4
                 : names.length;

    var html = names.map(function (file, idx) {
      var mod = idx === 0 ? ' grid__item--wide'
              : idx >= halfFrom ? ' grid__item--half' : '';
      return '<button type="button" class="grid__item' + mod +
             '" data-idx="' + idx + '" aria-label="사진 ' + (idx + 1) + '번 크게 보기">' +
             '<img src="assets/img/thumb/' + file + '" alt="웨딩 사진 ' + (idx + 1) + '"' +
             (idx === 0 ? '' : ' loading="lazy"') + ' decoding="async"></button>';
    }).join('');
    wrap.innerHTML = html;

    /* 썸네일이 다 받아지면 부드럽게 나타나게 합니다. */
    Array.prototype.forEach.call(wrap.querySelectorAll('img'), function (img) {
      var done = function () { img.classList.add('is-loaded'); };
      if (img.complete) done();
      else { img.addEventListener('load', done); img.addEventListener('error', done); }
    });

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.grid__item');
      if (btn) openLightbox(+btn.dataset.idx);
    });
  })();

  /* 확대 보기 */
  var lb = $('[data-lightbox]');
  var lbImg = $('[data-lb-img]');
  var lbCount = $('[data-lb-count]');
  var cur = 0;
  var scrollY = 0;

  function preload(idx) {
    var n = names[(idx + names.length) % names.length];
    var im = new Image();
    im.src = 'assets/img/gallery/' + n;
  }

  function render(idx) {
    cur = (idx + names.length) % names.length;
    lbImg.src = 'assets/img/gallery/' + names[cur];
    lbImg.alt = '웨딩 사진 ' + (cur + 1);
    lbCount.textContent = (cur + 1) + ' / ' + names.length;
    preload(cur + 1);
    preload(cur - 1);
  }

  function openLightbox(idx) {
    scrollY = window.scrollY;
    document.body.style.cssText =
      'position:fixed;top:' + -scrollY + 'px;left:0;right:0;width:100%;overflow:hidden';
    lb.hidden = false;
    render(idx);
    lb.focus({ preventScroll: true });
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.cssText = '';
    window.scrollTo(0, scrollY);
  }

  $('[data-lb-close]').addEventListener('click', closeLightbox);
  $('[data-lb-prev]').addEventListener('click', function () { render(cur - 1); });
  $('[data-lb-next]').addEventListener('click', function () { render(cur + 1); });
  $('[data-lb-stage]').addEventListener('click', function (e) {
    if (e.target === e.currentTarget) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') render(cur - 1);
    else if (e.key === 'ArrowRight') render(cur + 1);
  });

  /* 스와이프 */
  var sx = 0, sy = 0, swiping = false;
  lb.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { swiping = false; return; }
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    swiping = true;
  }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (!swiping) return;
    swiping = false;
    var t = e.changedTouches[0];
    var dx = t.clientX - sx;
    var dy = t.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      render(dx < 0 ? cur + 1 : cur - 1);
    }
  }, { passive: true });

  /* ── 오시는 길 ───────────────────────────────────────── */
  var V = W.venue;
  var fullAddress = V.address + (V.addressDetail ? ' ' + V.addressDetail : '');

  $('[data-place]').textContent = V.name + ' ' + V.hall;
  $('[data-address]').textContent = fullAddress;

  /* 지도 — 화면에 가까워졌을 때 불러옵니다.
     카카오맵 → (실패 시) Leaflet + OpenStreetMap → (실패 시) OpenStreetMap 기본 지도 순서로 씁니다. */
  (function buildMap() {
    var box = $('[data-map]');
    var zoom = V.mapZoom || 17;
    var LEAFLET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/';
    var K = W.kakao || {};
    var touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var PIN = '<span class="map-pin__label">' + escapeHtml(V.name) + '</span>' +
              '<svg viewBox="0 0 30 38" aria-hidden="true">' +
              '<path d="M15 37s12-12.6 12-22A12 12 0 0 0 3 15c0 9.4 12 22 12 22z" fill="#5F6941"/>' +
              '<circle cx="15" cy="15" r="4.6" fill="#FDFCF8"/></svg>';

    function homeButton(onClick) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'map-home';
      b.textContent = '예식장 위치';
      b.addEventListener('click', onClick);
      return b;
    }

    function drawKakao() {
      var kmap = window.kakao.maps;
      var center = new kmap.LatLng(V.lat, V.lng);
      var level = K.mapLevel || 3;
      box.classList.add('map--kakao');
      var map = new kmap.Map(box, { center: center, level: level });

      /* 휴대폰에서는 한 손가락 스크롤이 페이지를 내리도록 끌기를 막습니다.
         확대·축소는 오른쪽 버튼으로 합니다. */
      if (touch) map.setDraggable(false);
      map.setZoomable(false);
      map.addControl(new kmap.ZoomControl(), kmap.ControlPosition.RIGHT);

      var pin = document.createElement('div');
      pin.className = 'map-pin';
      pin.style.cssText = 'width:160px;height:66px';
      pin.innerHTML = PIN;
      new kmap.CustomOverlay({ map: map, position: center, content: pin, xAnchor: 0.5, yAnchor: 1 });

      var home = homeButton(function () { map.setLevel(level); map.panTo(center); });
      home.classList.add('map-home--float');
      box.appendChild(home);

      /* 화면 폭이 바뀌면 지도 크기를 다시 맞추고 가운데로 되돌립니다. */
      var rt;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { map.relayout(); map.setCenter(center); }, 200);
      });
    }

    function loadKakao() {
      if (!K.jsKey) { load(); return; }
      var done = false;
      var giveUp = function () { if (!done) { done = true; load(); } };
      var timer = setTimeout(giveUp, 7000);
      var js = document.createElement('script');
      js.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + K.jsKey + '&autoload=false';
      js.onerror = function () { clearTimeout(timer); giveUp(); };   /* 도메인 미등록 등 */
      js.onload = function () {
        if (!window.kakao || !window.kakao.maps) { clearTimeout(timer); giveUp(); return; }
        window.kakao.maps.load(function () {
          clearTimeout(timer);
          if (done) return;
          done = true;
          try { drawKakao(); } catch (e) { box.innerHTML = ''; box.className = 'map'; load(); }
        });
      };
      document.head.appendChild(js);
    }

    function fallback() {
      /* 확대 단계에 맞춰 보이는 범위를 줄입니다 (한 단계마다 절반) */
      var k = Math.pow(2, zoom - 15);
      var dLat = 0.0035 / k, dLng = 0.0055 / k;
      var r6 = function (n) { return n.toFixed(6); };
      var bbox = [r6(V.lng - dLng), r6(V.lat - dLat),
                  r6(V.lng + dLng), r6(V.lat + dLat)].join('%2C');
      box.innerHTML =
        '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=' + bbox +
        '&layer=mapnik&marker=' + V.lat + '%2C' + V.lng + '" title="' + escapeHtml(V.name) + ' 위치"' +
        ' referrerpolicy="no-referrer-when-downgrade"></iframe>';
    }

    function draw() {
      var L = window.L;
      var map = L.map(box, {
        center: [V.lat, V.lng],
        zoom: zoom,
        scrollWheelZoom: false,
        /* 휴대폰에서는 한 손가락 스크롤이 페이지를 내리도록 끌기를 막고,
           두 손가락으로만 확대·이동합니다. */
        dragging: !touch,
        tap: false,
        zoomControl: false,
        attributionControl: true
      });
      L.control.zoom({ position: 'bottomright', zoomInTitle: '확대', zoomOutTitle: '축소' }).addTo(map);
      map.attributionControl.setPrefix(false);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      }).addTo(map);

      var icon = L.divIcon({
        className: 'map-pin',
        iconSize: [160, 66],
        iconAnchor: [80, 66],
        html: PIN
      });
      L.marker([V.lat, V.lng], { icon: icon, keyboard: false, interactive: false }).addTo(map);

      /* 확대/이동해도 버튼 한 번으로 예식장 위치로 돌아옵니다. */
      var Home = L.Control.extend({
        options: { position: 'topright' },
        onAdd: function () {
          var b = homeButton(function () { map.flyTo([V.lat, V.lng], zoom, { duration: .6 }); });
          L.DomEvent.disableClickPropagation(b);
          return b;
        }
      });
      new Home().addTo(map);
    }

    function load() {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = LEAFLET + 'leaflet.min.css';
      document.head.appendChild(css);

      var js = document.createElement('script');
      js.src = LEAFLET + 'leaflet.min.js';
      js.onload = function () {
        try { draw(); } catch (e) { fallback(); }
      };
      js.onerror = fallback;
      document.head.appendChild(js);
    }

    if (!('IntersectionObserver' in window)) { loadKakao(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); loadKakao(); }
    }, { rootMargin: '600px 0px' });
    io.observe(box);
  })();

  (function buildMapLinks() {
    var q = encodeURIComponent(V.searchKeyword || V.name);
    var ml = V.mapLinks || {};

    /* 지도 앱 로고 (각 서비스의 브랜드 색으로 그린 아이콘) */
    var LOGO = {
      naver:
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<rect width="24" height="24" rx="5.5" fill="#03C75A"/>' +
        '<path fill="#fff" d="M7 7h4.2l3.6 5.6V7H19v10h-4.2l-3.6-5.6V17H7V7z"/></svg>',
      kakao:
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<rect width="24" height="24" rx="5.5" fill="#FEE500"/>' +
        '<path fill="#2B1F17" d="M12 5.2c-3.1 0-5.6 2.4-5.6 5.3 0 4 5.6 8.3 5.6 8.3s5.6-4.3 5.6-8.3c0-2.9-2.5-5.3-5.6-5.3z"/>' +
        '<circle cx="12" cy="10.4" r="1.95" fill="#FEE500"/></svg>',
      tmap:
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<rect width="24" height="24" rx="5.5" fill="#0F5CF0"/>' +
        '<path fill="#fff" d="M6.8 7.1h10.4v3.3h-3.4V17h-3.6v-6.6H6.8V7.1z"/></svg>'
    };

    var links = [
      { key: 'naver', label: '네이버지도',
        href: ml.naver || 'https://map.naver.com/p/search/' + q },
      { key: 'kakao', label: '카카오맵',
        href: ml.kakao || 'https://map.kakao.com/?q=' + q },
      { key: 'tmap', label: '티맵',
        href: ml.tmap || 'tmap://route?goalname=' + q + '&goalx=' + V.lng + '&goaly=' + V.lat }
    ];

    var html = links.map(function (l) {
      return '<a class="btn btn--map" href="' + l.href + '" target="_blank" rel="noopener">' +
             LOGO[l.key] + '<span>' + l.label + '</span></a>';
    }).join('');
    html += '<button type="button" class="btn" data-copy-addr>주소 복사</button>';
    if (V.tel) {
      html += '<a class="btn" href="tel:' + V.tel.replace(/[^0-9+]/g, '') + '">예식장 전화</a>';
    }
    var row = $('[data-map-links]');
    row.innerHTML = html;
    bindCopy($('[data-copy-addr]', row), fullAddress, '주소를 복사했어요.');
  })();

  (function buildTransport() {
    var ICONS = {
      subway: '<path d="M6 2h12a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a2 2 0 0 1 2-2Z"/><path d="M4 8h16M8.5 12.5h.01M15.5 12.5h.01M7.5 21l2-4M16.5 21l-2-4"/>',
      bus: '<path d="M5 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M3 9h18M7.5 13h.01M16.5 13h.01M7 17v3M17 17v3"/>',
      car: '<path d="M5 17h14M4 17v2M20 17v2"/><path d="M3.5 12 5 7.5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5L20.5 12"/><path d="M3.5 12h17v3.2a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8V12Z"/><path d="M7 14.5h.01M17 14.5h.01"/>'
    };
    var html = (V.transport || []).map(function (t) {
      var p = ICONS[t.icon] || ICONS.car;
      var body = t.lines.map(function (l) {
        if (typeof l === 'string') {
          return '<p class="t-line">' + escapeHtml(l) + '</p>';
        }
        /* { name, desc } — 정류장 이름과 버스 번호처럼 둘로 나뉘는 줄 */
        return '<p class="t-line t-line--pair">' +
               '<span class="t-name">' + escapeHtml(l.name) + '</span>' +
               '<span class="t-desc">' + escapeHtml(l.desc) + '</span></p>';
      }).join('');

      return '<li><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
             ' stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg></span>' +
             '<div class="t-body"><p class="t-label">' + escapeHtml(t.label) + '</p>' +
             body + '</div></li>';
    }).join('');
    $('[data-transport]').innerHTML = html;
  })();

  /* ── 마음 전하실 곳 ──────────────────────────────────── */
  (function buildAccounts() {
    var wrap = $('[data-accounts]');
    var CHEV = '<svg class="acct__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
               ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
               '<path d="M5 8.5 12 15.5 19 8.5"/></svg>';

    wrap.innerHTML = W.accounts.map(function (g, i) {
      var id = 'acct-panel-' + i;
      return '<div class="acct">' +
        '<button type="button" class="acct__head" aria-expanded="false" aria-controls="' + id + '">' +
          '<span>' + escapeHtml(g.side) + '</span>' + CHEV +
        '</button>' +
        '<div class="acct__panel" id="' + id + '"><div class="acct__inner">' +
          g.items.map(function (a) {
            return '<div class="acct__row">' +
              '<div class="acct__info">' +
                '<p class="acct__who">' + escapeHtml(a.role) + ' ' + escapeHtml(a.name) + '</p>' +
                '<p class="acct__num">' + escapeHtml(a.bank) + ' <b>' + escapeHtml(a.number) + '</b></p>' +
              '</div>' +
              '<button type="button" class="acct__copy" data-num="' + escapeHtml(a.number) + '">복사</button>' +
            '</div>';
          }).join('') +
        '</div></div>' +
      '</div>';
    }).join('');

    /* 열기 / 닫기 — 양쪽을 따로 여닫을 수 있습니다. */
    Array.prototype.forEach.call(wrap.querySelectorAll('.acct__head'), function (head) {
      var panel = document.getElementById(head.getAttribute('aria-controls'));
      head.addEventListener('click', function () {
        var open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (open) {
          panel.style.maxHeight = panel.scrollHeight + 'px';   /* 현재 높이 고정 후 */
          requestAnimationFrame(function () { panel.style.maxHeight = '0px'; });
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
      /* 화면 크기가 바뀌어 내용 높이가 달라져도 잘리지 않도록 */
      panel.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'max-height' &&
            head.getAttribute('aria-expanded') === 'true') {
          panel.style.maxHeight = 'none';
        }
      });
    });

    Array.prototype.forEach.call(wrap.querySelectorAll('[data-num]'), function (btn) {
      bindCopy(btn, btn.dataset.num, '계좌번호를 복사했어요.');
    });
  })();

  /* ── 공유 ────────────────────────────────────────────── */
  var shareUrl = location.href.split('#')[0];
  var shareTitle = W.groom.name + ' ♥ ' + W.bride.name + ' 결혼합니다';
  var shareText = D.year + '년 ' + D.month + '월 ' + D.day + '일 ' + DOW[dowIndex] + '요일 ' + timeKo +
                  '\n' + V.name + ' ' + V.hall;

  /* 카카오톡 공유 — 사진 · 제목 · 날짜가 들어간 카드로 보냅니다.
     로컬에서 미리 볼 때도 실제 주소가 공유되도록 canonical 주소를 씁니다. */
  var KAKAO_SDK = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
  var KAKAO_SRI = 'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy';
  var siteUrl = ($('link[rel="canonical"]') || {}).href || shareUrl;
  var ogImage = ($('meta[property="og:image"]') || {}).content;

  function kakaoReady() {
    return window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized();
  }

  (function loadKakaoShare() {
    var key = W.kakao && W.kakao.jsKey;
    if (!key) return;
    var inject = function () {
      var js = document.createElement('script');
      js.src = KAKAO_SDK;
      js.integrity = KAKAO_SRI;
      js.crossOrigin = 'anonymous';
      js.onload = function () {
        try { if (!window.Kakao.isInitialized()) window.Kakao.init(key); } catch (e) {}
      };
      document.head.appendChild(js);
    };
    /* 첫 화면을 그리는 데 방해되지 않도록 페이지를 다 불러온 뒤 받습니다. */
    if (document.readyState === 'complete') setTimeout(inject, 300);
    else window.addEventListener('load', function () { setTimeout(inject, 300); });
  })();

  function shareKakao() {
    var link = { mobileWebUrl: siteUrl, webUrl: siteUrl };
    var mapLink = { mobileWebUrl: siteUrl + '#location', webUrl: siteUrl + '#location' };
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: shareTitle,
        description: shareText,
        imageUrl: ogImage,
        imageWidth: 1200,
        imageHeight: 630,
        link: link
      },
      buttons: [
        { title: '청첩장 보기', link: link },
        { title: '오시는 길', link: mapLink }
      ]
    });
  }

  $('[data-share-kakao]').addEventListener('click', function () {
    if (kakaoReady()) {
      try { shareKakao(); return; } catch (e) { /* 아래 기본 공유로 */ }
    }
    shareNative();
  });

  function shareNative() {
    if (navigator.share) {
      navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
        .catch(function () { /* 사용자가 취소한 경우 — 무시 */ });
    } else {
      copy(shareUrl).then(
        function () { toast('링크를 복사했어요. 붙여넣기로 전해주세요.'); },
        function () { toast('주소창의 링크를 복사해 주세요.'); }
      );
    }
  }
  bindCopy($('[data-copy-url]'), shareUrl, '링크를 복사했어요.');

  /* ── 배경음악 ────────────────────────────────────────── */
  (function bgm() {
    var audio = document.getElementById('bgm');
    var btn = $('[data-bgm]');
    if (!audio || !btn) return;

    var KEY = 'wedding-bgm-off';
    var stopped = false;
    try { stopped = sessionStorage.getItem(KEY) === '1'; } catch (e) {}

    function paint(on) {
      btn.classList[on ? 'add' : 'remove']('is-playing');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? '배경음악 끄기' : '배경음악 켜기');
    }

    try { audio.volume = 0.45; } catch (e) {}   /* iOS 는 무시합니다 */
    audio.addEventListener('play', function () { paint(true); });
    audio.addEventListener('pause', function () { paint(false); });

    function start() {
      var p = audio.play();
      return p && p.catch ? p : { catch: function () {} };
    }

    btn.addEventListener('click', function () {
      if (audio.paused) {
        stopped = false;
        try { sessionStorage.removeItem(KEY); } catch (e) {}
        start().catch(function () { toast('브라우저가 음악 재생을 막고 있어요.'); });
      } else {
        audio.pause();
        stopped = true;
        try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      }
    });

    /* 모바일 브라우저는 자동 재생을 막습니다.
       막히면 화면을 처음 한 번 터치할 때 재생을 시작합니다. */
    if (!stopped) {
      start().catch(function () {
        var EVENTS = ['touchend', 'click', 'keydown'];
        var off = function () {
          EVENTS.forEach(function (ev) { document.removeEventListener(ev, once); });
        };
        var once = function () {
          if (!stopped && audio.paused) start().catch(function () {});
          off();
        };
        EVENTS.forEach(function (ev) { document.addEventListener(ev, once); });
      });
    }
  })();

  /* ── 푸터 ────────────────────────────────────────────── */
  $('[data-foot-date]').textContent =
    D.year + '. ' + pad(D.month) + '. ' + pad(D.day) + '.';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* D-day 숫자가 0부터 차오르는 효과 */
  function countUp(el) {
    var to = +el.dataset.count;
    if (reduceMotion || !(to > 0)) return;
    var t0 = null, DUR = 1400;
    el.textContent = '0';
    requestAnimationFrame(function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / DUR, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    });
  }

  /* ── 스크롤 등장 ─────────────────────────────────────── */
  /* 섹션 안의 요소들이 위에서부터 차례로 떠오릅니다. */
  (function reveal() {
    var items = document.querySelectorAll('.reveal');
    Array.prototype.forEach.call(items, function (sec) {
      Array.prototype.forEach.call(sec.children, function (el, i) {
        el.style.setProperty('--i', Math.min(i, 6));
      });
    });
    function show(el) {
      el.classList.add('is-in');
      var n = el.querySelector('[data-count]');
      if (n) setTimeout(function () { countUp(n); }, 350);
    }
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, show);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          show(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  })();

  /* ── 꽃잎 흩날리기 ───────────────────────────────────── */
  (function petals() {
    if (reduceMotion || (W.effects && W.effects.petals === false)) return;
    var cv = document.createElement('canvas');
    var ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;
    cv.className = 'petals';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);

    var COLORS = ['#F2C9C4', '#F6D8D3', '#EDBAB5', '#F4CFCA'];
    var COUNT = 16;
    var w = 0, h = 0, list = [], last = 0, raf = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(p, first) {
      p.x = Math.random() * w;
      p.y = first ? -Math.random() * h * 1.2 - 10 : -14;   /* 처음엔 위에서 하나씩 들어옵니다 */
      p.r = 4.5 + Math.random() * 4.5;
      p.vy = 0.35 + Math.random() * 0.45;
      p.vx = -0.12 + Math.random() * 0.3;
      p.sway = 0.4 + Math.random() * 0.9;
      p.ph = Math.random() * 6.283;
      p.rot = Math.random() * 6.283;
      p.vr = (Math.random() - 0.5) * 0.03;
      p.flip = Math.random() * 6.283;
      p.vf = 0.015 + Math.random() * 0.03;
      p.c = COLORS[(Math.random() * COLORS.length) | 0];
      p.a = 0.6 + Math.random() * 0.3;
      return p;
    }

    /* 벚꽃잎 모양 — 끝이 살짝 파인 물방울 */
    function petal(p) {
      var r = p.r;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.35 + Math.abs(Math.cos(p.flip)) * 0.65);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(0, r);
      ctx.bezierCurveTo(-r, r * 0.35, -r * 0.85, -r * 0.9, -r * 0.2, -r);
      ctx.quadraticCurveTo(0, -r * 0.72, r * 0.2, -r);
      ctx.bezierCurveTo(r * 0.85, -r * 0.9, r, r * 0.35, 0, r);
      ctx.fill();
      ctx.restore();
    }

    function tick(t) {
      var dt = last ? Math.min((t - last) / 16.67, 3) : 1;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        p.ph += 0.02 * dt;
        p.x += (p.vx + Math.sin(p.ph) * p.sway * 0.5) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.flip += p.vf * dt;
        if (p.y > h + 16 || p.x < -20 || p.x > w + 20) spawn(p, false);
        if (p.y > -12) petal(p);
      }
      raf = requestAnimationFrame(tick);
    }

    function start() { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } }
    function stop() { cancelAnimationFrame(raf); raf = 0; }

    size();
    for (var i = 0; i < COUNT; i++) list.push(spawn({}, true));

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(size, 150);
    });
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    /* 표지 등장 효과가 끝날 즈음 시작합니다. */
    setTimeout(function () { cv.classList.add('is-on'); start(); }, 1600);
  })();

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
