/* A stand-in for the room's server.
   This page has no server. Reads are answered from a snapshot taken ahead of
   time; anything that would write is kept in memory for this visit only and
   is gone the moment the page is reloaded. Look, don't touch. */
(function () {
  var SNAP = window.__ROOM_SNAPSHOT__ || {};

  /* ⭐ Her ruling 2026-08-27: EVERY VISITOR GETS A FRESH ROOM.
     Nothing on this page is written to a server — there isn't one — but the
     room does keep two small presentation keys in the browser (a display
     fence, and when the notebook was last seen). On a public link, and on a
     shared computer especially, those would follow the next person in. So
     browser storage is replaced with a stand-in that forgets on reload:
     the room behaves exactly as it does, and remembers nothing. */
  (function noMemory() {
    function fresh() {
      var m = {};
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
        setItem: function (k, v) { m[k] = String(v); },
        removeItem: function (k) { delete m[k]; },
        clear: function () { m = {}; },
        key: function (i) { return Object.keys(m)[i] || null; },
        get length() { return Object.keys(m).length; }
      };
    }
    ['localStorage', 'sessionStorage'].forEach(function (name) {
      try {
        Object.defineProperty(window, name, {value: fresh(), configurable: true});
      } catch (e) {
        // some browsers refuse to redefine it — then at least start clean
        try { window[name].clear(); } catch (e2) {}
      }
    });
  })();
  var STORE = JSON.parse(JSON.stringify(SNAP['/api/items'] || {items: {}}));
  var META  = STORE.meta || (STORE.meta = {});

  function itemsById() {
    var it = STORE.items;
    if (!Array.isArray(it)) { return it; }
    var m = {}; it.forEach(function (v) { m[v.id] = v; }); return m;
  }
  function json(obj, status) {
    return Promise.resolve(new Response(JSON.stringify(obj), {
      status: status || 200, headers: {'Content-Type': 'application/json'}
    }));
  }
  var realFetch = window.fetch.bind(window);

  function applyState(body) {
    var by = itemsById(), changes = (body && body.changes) || [];
    changes.forEach(function (c) {
      var it = by[c.id]; if (!it) { return; }
      if (c.to) { it.state = c.to; }
      ['last_opened_ms','resting_until_ms','trigger'].forEach(function (k) {
        if (c[k] !== undefined) { it[k] = c[k]; }
      });
    });
    return {ok: true, changed: changes.length};
  }

  /* ---- the librarian, replayed ------------------------------------------
     ⛔ NOTHING HERE ASKS A MODEL ANYTHING. Every reflection this hands back
     was written by the real room, on one computer, before this page existed.
     Tapping the candle replays a sitting so a visitor can see what one is:
     the flame quickens, the room looks through what is new, and a piece of
     writing comes back. The words are the room's own, verbatim. */
  /* the rotation starts somewhere different every visit, so two people
     arriving from the same link do not meet the same sitting */
  var SIT = {job: 0, at: 0, pick: null, n: Math.floor(Math.random() * 1000)};
  /* ⭐ Her ruling 2026-08-27: the shelf starts EMPTY and fills with what a
     visitor decides to keep. The bookshelf IS the reflections library, so
     this list is the shelf — one spine per sitting kept, gone on reload. */
  var KEPT = [];
  var THINK_MS = 4200;                     // long enough to read as looking

  function sittings() {
    var c = window.__CALENDAR__;
    return (c && c.sittings) || [];
  }
  function stageWord(ms) {
    if (ms < 1200) { return 'looking through what is new'; }
    if (ms < 2600) { return 'reading'; }
    return 'writing';
  }
  function librarian(path, method, body) {
    var list = sittings();

    if (path === '/api/librarian/session' && method === 'GET') {
      // the offer beat, and the draft read
      if (!SIT.pick) { return json({ok: true, state: 'none', offer: false}); }
      var done = (Date.now() - SIT.at) >= THINK_MS;
      if (!done) { return json({ok: true, state: 'working', offer: false}); }
      return realFetch('lib/' + SIT.pick.rid + '.md')
        .then(function (r) { return r.text(); })
        .then(function (md) {
          return new Response(JSON.stringify({
            ok: true, state: 'active', draft: md.trim(),
            name: SIT.pick.rname, chat: [], offer: false,
            reach_set_aside: 0, own_kept: 1, saved_kept: 0, photos_kept: 0,
            consented: true
          }), {status: 200, headers: {'Content-Type': 'application/json'}});
        });
    }

    if (path === '/api/librarian/session' && method === 'POST') {
      if (body && body.intent === 'discard') { SIT.pick = null; return json({ok: true}); }
      if (!list.length) { return json({ok: true, nothing_new: true}); }
      SIT.pick = list[SIT.n % list.length];
      SIT.n += 1;
      SIT.at = Date.now();
      return json({ok: true, available: true, nothing_new: false,
                   reach_set_aside: 0, own_kept: 1, saved_kept: 0});
    }

    if (path === '/api/librarian/session/close' && method === 'POST') {
      var outcome = (body && body.outcome) || 'save';
      var saved = false;
      if (outcome === 'save' && SIT.pick) {
        var already = KEPT.some(function (b) { return b.id === SIT.pick.rid; });
        if (!already) {
          KEPT.push({id: SIT.pick.rid, kind: 'reflection',
                     origin_path: 'items/' + SIT.pick.rid + '.md',
                     title: SIT.pick.rname, connected_ids: [], why: '',
                     allowed_ts: Date.now()});
        }
        saved = true;
      }
      SIT.pick = null;
      return json({ok: true, outcome: outcome, saved: saved, writeback: false,
                   book_id: saved ? KEPT[KEPT.length - 1].id : null,
                   title: saved ? KEPT[KEPT.length - 1].title : null});
    }

    if (path === '/api/librarian/books' && method === 'GET') {
      return json({ok: true, books: KEPT.slice()});
    }

    if (path === '/api/librarian/progress' && method === 'GET') {
      var base = JSON.parse(JSON.stringify(SNAP['/api/librarian/progress'] || {ok: true}));
      if (!SIT.pick) { base.state = 'idle'; base.stage = null; return json(base); }
      var ms = Date.now() - SIT.at;
      base.state = ms >= THINK_MS ? 'done' : 'running';
      base.stage = ms >= THINK_MS ? null : stageWord(ms);
      base.total = 1; base.done = ms >= THINK_MS ? 1 : 0;
      base.cost_usd = 0.0; base.usage = {}; base.message = null;
      return json(base);
    }

    if (method === 'GET' && Object.prototype.hasOwnProperty.call(SNAP, path)) {
      return json(SNAP[path]);
    }
    // refine, ask, connect, presort, clean, roster, jobs: none of it runs here
    return json({ok: false,
      error: 'the reading on this page was done in advance, on one computer.'});
  }

  window.fetch = function (input, init) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
    var body = {};
    try { body = JSON.parse((init && init.body) || '{}'); } catch (e) {}

    if (path.indexOf('/api/') !== 0 && path.indexOf('/lib/') !== 0) {
      return realFetch(input, init);
    }

    // an item's own bytes, and a note's attached picture — real files here
    var att = path.match(/^\/lib\/([^/]+)\/att\/(.+)$/);
    if (att) {
      return realFetch('lib/att/' + decodeURIComponent(att[1]) + '/' +
                       decodeURIComponent(att[2]));
    }
    var one = path.match(/^\/lib\/([^/]+)$/);
    if (one) { return realFetch('lib/' + decodeURIComponent(one[1]) + '.md'); }

    // ⛔ THE LIBRARIAN IS ROUTED FIRST, BEFORE THE GENERIC GET BRANCH.
    // It was below it once: every librarian GET was answered from the
    // snapshot, so `progress` read `idle` forever, the room concluded the
    // generation had died, and a tap on the candle ended in "try again".
    if (path.indexOf('/api/librarian/') === 0) { return librarian(path, method, body); }

    if (method === 'GET') {
      if (path === '/api/items') { return json(STORE); }
      if (Object.prototype.hasOwnProperty.call(SNAP, path)) { return json(SNAP[path]); }
      return json({ok: true});
    }

    // ---- anything that would write ----------------------------------------
    if (path === '/api/state') { return json(applyState(body)); }
    if (path === '/api/meta')  { Object.keys(body).forEach(function (k) { META[k] = body[k]; });
                                 return json({ok: true, meta: META}); }
    if (path === '/api/layout' || path === '/api/decorations') { return json({ok: true}); }
    // importing, scanning, collecting: there is nothing on this page to bring in
    return json({ok: false, error: 'this is a page, not a room on your computer.'}, 200);
  };
})();
