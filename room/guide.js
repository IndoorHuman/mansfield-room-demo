/* The three steps, once, for someone who has never been in this room.
   ⚠ Stand-in wording throughout; hers is owed, like every sentence here.
   It points, it never blocks: every step can be ignored, and the whole thing
   can be closed. Law 3 — the room invites, it does not chase. */
(function () {
  var STEPS = [
    {key: 'date',   at: 'room-obj-calendar',
     say: 'This is a demo room, filled with Katherine Mansfield\'s diary instead of ' +
          'yours. Press a date on the calendar and you are standing in that day; ' +
          'the room holds only what she had written by then.'},
    {key: 'candle', at: 'room-obj-candle',
     say: 'Now press the candle. The librarian looks through what is new to ' +
          'her by that date, and writes one thing back.'},
    {key: 'keep',   at: null,
     say: 'Say yes when it asks, and then keep what it writes, and it goes on the ' +
          'shelf as a book. Let it go and nothing is kept. Either way, the next ' +
          'visitor starts with an empty shelf.'}
  ];
  var at = 0, dead = false, box, halo;

  function el(t, c, x) { var n = document.createElement(t); if (c) n.className = c;
    if (x != null) n.textContent = x; return n; }

  function build() {
    box = el('div'); box.id = 'mguide';
    box.appendChild(el('p', 'mguide-step'));
    var row = el('p', 'mguide-row');
    var skip = el('button', 'mguide-skip', 'i can look around myself');
    skip.type = 'button';
    skip.addEventListener('click', function () { dead = true; box.remove(); if (halo) halo.remove(); });
    row.appendChild(skip);
    box.appendChild(row);
    document.body.appendChild(box);
    halo = el('div'); halo.id = 'mguide-halo'; document.body.appendChild(halo);
  }

  function place() {
    var s = STEPS[at];
    if (!s || !s.at) { if (halo) { halo.style.display = 'none'; } return; }
    // the calendar covers the room; a ring pointing at what is underneath it
    // is just a stray box on the screen
    if (document.querySelector('#mcal-scrim.mcal-open') ||
        document.body.classList.contains('station-open')) {
      halo.style.display = 'none'; return;
    }
    var t = document.getElementById(s.at);
    if (!t) { halo.style.display = 'none'; return; }
    var r = t.getBoundingClientRect();
    if (!r.width) { halo.style.display = 'none'; return; }
    halo.style.display = 'block';
    halo.style.left = (r.left - 8) + 'px';
    halo.style.top = (r.top - 8) + 'px';
    halo.style.width = (r.width + 16) + 'px';
    halo.style.height = (r.height + 16) + 'px';
  }

  function paint() {
    if (dead) { return; }
    if (at >= STEPS.length) { box.remove(); if (halo) halo.remove(); dead = true; return; }
    box.querySelector('.mguide-step').textContent = STEPS[at].say;
    place();
  }

  function advance(key) {
    if (dead || !STEPS[at] || STEPS[at].key !== key) { return; }
    at += 1; paint();
  }

  window.__GUIDE__ = { arrived: function () { advance('date'); } };

  // the candle step is done when the writing is on the paper; the keep step
  // when a spine is on the shelf — both read off the room's own DOM rather
  // than off anything this file controls
  /* ⛔ THE GUIDE FOLLOWS THE ROOM, NOT THE POINTER. Advancing on the click
     itself would move the guide on even when the room ignored it (a press
     before the room has bound its objects is silently lost). Each step ends
     on something the ROOM does: the sitting's own paper appearing, and a
     spine appearing on the shelf. */
  function watch() {
    new MutationObserver(function () {
      if (dead) { return; }
      if (document.querySelector('.session-stage, .session-consent, .session-reach')) {
        advance('candle');
      }
      if (document.querySelector('.reflection-spine')) { advance('keep'); }
      place();
    }).observe(document.body, {childList: true, subtree: true, attributes: true});
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
  }

  window.addEventListener('load', function () {
    build(); paint(); watch();
    setInterval(place, 700);   // the room re-lays itself out; keep up with it
  });
})();
