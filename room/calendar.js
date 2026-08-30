/* The wall calendar. Demo page only — it reads what was made ahead of time
   and never asks anything to think. Namespaced mcal-. */
(function () {
  var DATA = window.__CALENDAR__;
  if (!DATA) { return; }
  var DAYS = DATA.days, MONTHS = DATA.months;
  var FENCE = '1915-10-29';
  var allowed = false;              // resets on every reload — look, don't touch

  var keys = Object.keys(DAYS).sort();
  var YEARS = [];
  keys.forEach(function (k) {
    var y = DAYS[k].y;
    if (YEARS.indexOf(y) === -1) { YEARS.push(y); }
  });
  var year = YEARS[0];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text != null) { n.textContent = text; }
    return n;
  }
  function paragraphs(md) {
    var frag = document.createDocumentFragment();
    md.replace(/^---[\s\S]*?---\s*/, '').split(/\n\s*\n/).forEach(function (block) {
      var t = block.replace(/\s+/g, ' ').trim();
      if (t) { frag.appendChild(el('p', null, t)); }
    });
    return frag;
  }

  var scrim = el('div'); scrim.id = 'mcal-scrim';
  var sheet = el('div', 'mcal-sheet');
  scrim.appendChild(sheet);
  document.body.appendChild(scrim);

  function close() {
    scrim.classList.remove('mcal-open');
    document.body.style.overflow = '';
  }
  scrim.addEventListener('click', function (e) { if (e.target === scrim) { close(); } });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && scrim.classList.contains('mcal-open')) { close(); }
  });

  function header(title, sub, backTo) {
    sheet.innerHTML = '';
    var top = el('div', 'mcal-top');
    var left = el('div');
    left.appendChild(el('h2', null, title));
    if (sub) { left.appendChild(el('p', 'mcal-sub', sub)); }
    top.appendChild(left);
    var b = el('button', 'mcal-btn', backTo ? 'back to the calendar' : 'back to the room');
    b.type = 'button';
    b.addEventListener('click', backTo ? openCalendar : close);
    top.appendChild(b);
    sheet.appendChild(top);
  }

  function openCalendar() {
    header('Katherine Mansfield’s days',
      standing
        ? ('You are standing in ' + DAYS[standing].title +
           '. The room holds only what she had written by then. ' +
           'Press another date to move.')
        : ('Press a date and you are in it; the room holds only what she had ' +
           'written by then. Everything here was made in advance, on one ' +
           'computer; nothing is thinking while you look.'));
    var years = el('div', 'mcal-years');
    YEARS.forEach(function (y) {
      var b = el('button', 'mcal-year', y);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(y === year));
      b.addEventListener('click', function () { year = y; openCalendar(); });
      years.appendChild(b);
    });
    sheet.appendChild(years);

    var mine = keys.filter(function (k) { return DAYS[k].y === year; });
    var grid = el('div', 'mcal-grid');
    mine.forEach(function (k) {
      var d = DAYS[k];
      var b = el('button', 'mcal-day', d.label);
      b.type = 'button';
      b.title = d.title;
      if (!d.d) { b.classList.add('mcal-wide'); }
      if (!d.rid) { b.classList.add('mcal-quiet'); }
      if (d.marked) { b.classList.add('mcal-marked'); }
      if (d.fence && !allowed) { b.classList.add('mcal-held'); }
      if (k === standing) { b.classList.add('mcal-here'); }
      b.addEventListener('click', function () { travel(k); });
      grid.appendChild(b);
    });
    sheet.appendChild(grid);

    var withR = mine.filter(function (k) { return DAYS[k].rid; }).length;
    sheet.appendChild(el('p', 'mcal-count',
      mine.length + ' days she wrote in ' + year + ' · ' + withR + ' the room had something to say about'));

    var lg = el('div', 'mcal-legend');
    [['mcal-k-day', 'a day she wrote'],
     ['mcal-k-quiet', 'the room had nothing to say'],
     ['mcal-k-held', 'held back']].forEach(function (row) {
      var s = el('span'); var i = el('i', row[0]);
      s.appendChild(i); s.appendChild(document.createTextNode(row[1])); lg.appendChild(s);
    });
    sheet.appendChild(lg);

    sheet.appendChild(fenceAside());
    scrim.classList.add('mcal-open');
    document.body.style.overflow = 'hidden';
  }

  function fenceAside() {
    var a = el('div', 'mcal-aside');
    a.appendChild(el('h3', null, '29 October 1915'));
    if (!allowed) {
      a.appendChild(el('p', null,
        'The room has not read her diary. It cannot see this day at all: ' +
        'not the words, not the date, not that it exists.'));
      var b = el('button', 'mcal-btn', 'let the librarian read this');
      b.type = 'button';
      b.addEventListener('click', function () {
        allowed = true; window.__FENCE_ALLOWED__ = true; travel(FENCE);
      });
      a.appendChild(b);
    } else {
      a.appendChild(el('p', null,
        'It has read it now, this one day, on one computer. ' +
        'Reload the page and it goes back to being held.'));
    }
    var m = el('div', 'mcal-moment');
    ['The room will hold your diary back the same way.',
     'This reflection was made in advance, not now.',
     'Pressing this changes nothing for anyone after you.'].forEach(function (t) {
      m.appendChild(el('span', null, t));
    });
    a.appendChild(m);
    return a;
  }

  /* ⭐⭐ Her ruling: pressing a date does not open a reader — it puts you IN
     that date. The room keeps only what she had written by then, and the
     candle hands back the most recent reflection from there. */
  var standing = null;
  function travel(key) {
    var d = DAYS[key];
    standing = key;
    window.__ROOM_TRAVEL__(d.datekey || key);
    close();
    // ⛔ NO RELOAD. A reload would empty the shelf the visitor is filling, and
    // it is not needed: every surface that shows her things re-reads the
    // library when it opens, so the next thing they look at is already the
    // room as it stood that day.
    if (window.__GUIDE__) { window.__GUIDE__.arrived(d.title); }
  }

  function openDay(key) {
    var d = DAYS[key];
    header(d.title, null, true);
    var read = el('div', 'mcal-read');
    sheet.appendChild(read);

    var hers = el('div');
    hers.appendChild(el('div', 'mcal-part-k', 'what she wrote'));
    var body = el('div', 'mcal-body'); body.appendChild(el('p', null, 'opening this one…'));
    hers.appendChild(body); read.appendChild(hers);

    var refl = el('div');
    refl.appendChild(el('div', 'mcal-part-k', 'the reflection'));
    var rbox = el('div'); refl.appendChild(rbox); read.appendChild(refl);

    fetch('lib/' + d.id + '.md').then(function (r) { return r.text(); })
      .then(function (md) { body.innerHTML = ''; body.appendChild(paragraphs(md)); })
      .catch(function () { body.textContent = 'this one would not open.'; });

    if (d.fence && !allowed) {
      rbox.appendChild(el('p', 'mcal-nothing',
        'The room has not read this day. Nothing is hidden here; it was never handed over.'));
    } else if (d.rid) {
      rbox.appendChild(el('p', 'mcal-rname', '“' + d.rname + '”'));
      var rb = el('div', 'mcal-body');
      rbox.appendChild(rb);
      fetch('lib/' + d.rid + '.md').then(function (r) { return r.text(); })
        .then(function (md) { rb.appendChild(paragraphs(md)); });
    } else {
      rbox.appendChild(el('p', 'mcal-nothing',
        'The room had nothing to say about this day. It will not write about someone ' +
        'it cannot speak to, so some of her days come back empty. Her writing is above, whole.'));
    }
    scrim.classList.add('mcal-open');
    document.body.style.overflow = 'hidden';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#room-obj-calendar');
    if (btn) { e.preventDefault(); e.stopPropagation(); openCalendar(); }
  }, true);
})();
