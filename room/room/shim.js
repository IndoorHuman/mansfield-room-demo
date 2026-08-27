/* A stand-in for the room's server.
   This page has no server. Reads are answered from a snapshot taken ahead of
   time; anything that would write is kept in memory for this visit only and
   is gone the moment the page is reloaded. Look, don't touch. */
(function () {
  var SNAP = window.__ROOM_SNAPSHOT__ || {};
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

  window.fetch = function (input, init) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];

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

    if (method === 'GET') {
      if (path === '/api/items') { return json(STORE); }
      if (Object.prototype.hasOwnProperty.call(SNAP, path)) { return json(SNAP[path]); }
      return json({ok: true});
    }

    // ---- anything that would write ----------------------------------------
    var body = {};
    try { body = JSON.parse((init && init.body) || '{}'); } catch (e) {}
    if (path === '/api/state') { return json(applyState(body)); }
    if (path === '/api/meta')  { Object.keys(body).forEach(function (k) { META[k] = body[k]; });
                                 return json({ok: true, meta: META}); }
    if (path === '/api/layout' || path === '/api/decorations') { return json({ok: true}); }
    // the librarian never runs here; the reading was done in advance
    if (path.indexOf('/api/librarian/') === 0) {
      return json({ok: false, error: 'the reading on this page was done in advance.'}, 200);
    }
    // importing, scanning, collecting: there is nothing on this page to bring in
    return json({ok: false, error: 'this is a page, not a room on your computer.'}, 200);
  };
})();
