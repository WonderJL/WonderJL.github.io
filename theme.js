/* Signal: theme toggle + scroll reveal.
   Loaded once per page (deferred, same-origin → CSP `script-src 'self'`). */
(function () {
  function wire() {
    // ---- theme toggle ----
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        var next = dark ? 'light' : 'dark';
        if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        try {
          localStorage.setItem('signal-theme', next);
        } catch (e) {}
      });
    }

    // ---- scroll reveal ----
    // Content is visible by default. We hide ONLY elements that start below the
    // fold, then slide them in on scroll. No-JS / above-fold => always visible.
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (reduce || !reveals.length) return;

    function inView(el) {
      var r = el.getBoundingClientRect();
      var h = window.innerHeight || document.documentElement.clientHeight || 800;
      return r.top < h * 0.9 && r.bottom > 0;
    }

    // hide the below-the-fold ones
    var pending = reveals.filter(function (el) {
      var below = !inView(el);
      if (below) el.classList.add('pre');
      return below;
    });

    function show(el) {
      var sibs = Array.prototype.slice.call(el.parentElement.querySelectorAll(':scope > .reveal'));
      var i = Math.max(0, sibs.indexOf(el));
      setTimeout(function () {
        el.classList.add('in');
      }, i * 70);
    }
    function check() {
      for (var j = pending.length - 1; j >= 0; j--) {
        if (inView(pending[j])) {
          show(pending[j]);
          pending.splice(j, 1);
        }
      }
    }

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    // ultimate safety: never leave content hidden
    setTimeout(function () {
      pending.forEach(function (el) {
        el.classList.add('in');
      });
    }, 2600);
  }
  if (document.readyState !== 'loading') wire();
  else document.addEventListener('DOMContentLoaded', wire);
})();
