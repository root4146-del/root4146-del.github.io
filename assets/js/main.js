/* ------------------------------------------------------------------
 * 임형근 ♥ 신상은 — 모바일 청첩장
 * 외부 라이브러리 / API 키 없이 동작합니다.
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
  var timeEn = hour12 + (D.minute ? ':' + pad(D.minute) : '') + (D.hour < 12 ? 'AM' : 'PM');

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
    D.year + '년 ' + pad(D.month) + '월 ' + pad(D.day) + '일 ' +
    DOW[dowIndex] + '요일 ' + timeEn;

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
      msg = who + '의 결혼식이 <b>' + left + '일</b> 남았습니다.';
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

  (function buildMap() {
    var dLat = 0.0035, dLng = 0.0055;
    var bbox = [V.lng - dLng, V.lat - dLat, V.lng + dLng, V.lat + dLat].join('%2C');
    var src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox +
              '&layer=mapnik&marker=' + V.lat + '%2C' + V.lng;
    $('[data-map]').innerHTML =
      '<iframe src="' + src + '" loading="lazy" title="' + escapeHtml(V.name) + ' 위치"' +
      ' referrerpolicy="no-referrer-when-downgrade"></iframe>';
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
      return '<li><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
             ' stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg></span>' +
             '<div><p class="t-label">' + escapeHtml(t.label) + '</p>' +
             t.lines.map(function (l) { return '<p class="t-line">' + escapeHtml(l) + '</p>'; }).join('') +
             '</div></li>';
    }).join('');
    $('[data-transport]').innerHTML = html;
  })();

  /* ── 마음 전하실 곳 ──────────────────────────────────── */
  (function buildAccounts() {
    var wrap = $('[data-accounts]');
    wrap.innerHTML = W.accounts.map(function (g) {
      return '<div class="acct"><p class="acct__side">' + escapeHtml(g.side) + '</p>' +
        g.items.map(function (a) {
          return '<div class="acct__row">' +
            '<div class="acct__info">' +
              '<p class="acct__who">' + escapeHtml(a.role) + ' ' + escapeHtml(a.name) + '</p>' +
              '<p class="acct__num">' + escapeHtml(a.bank) + ' <b>' + escapeHtml(a.number) + '</b></p>' +
            '</div>' +
            '<button type="button" class="acct__copy" data-num="' + escapeHtml(a.number) + '">복사</button>' +
          '</div>';
        }).join('') +
      '</div>';
    }).join('');

    Array.prototype.forEach.call(wrap.querySelectorAll('[data-num]'), function (btn) {
      bindCopy(btn, btn.dataset.num, '계좌번호를 복사했어요.');
    });
  })();

  /* ── 공유 ────────────────────────────────────────────── */
  var shareUrl = location.href.split('#')[0];
  var shareTitle = W.groom.name + ' ♥ ' + W.bride.name + ' 결혼합니다';
  var shareText = D.year + '년 ' + D.month + '월 ' + D.day + '일 ' + DOW[dowIndex] + '요일 ' + timeKo +
                  '\n' + V.name + ' ' + V.hall;

  $('[data-share]').addEventListener('click', function () {
    if (navigator.share) {
      navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
        .catch(function () { /* 사용자가 취소한 경우 — 무시 */ });
    } else {
      copy(shareUrl).then(
        function () { toast('링크를 복사했어요. 붙여넣기로 전해주세요.'); },
        function () { toast('주소창의 링크를 복사해 주세요.'); }
      );
    }
  });
  bindCopy($('[data-copy-url]'), shareUrl, '링크를 복사했어요.');

  /* ── 푸터 ────────────────────────────────────────────── */
  $('[data-foot-date]').textContent =
    D.year + '. ' + pad(D.month) + '. ' + pad(D.day) + '.';

  /* ── 스크롤 등장 ─────────────────────────────────────── */
  (function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  })();

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
