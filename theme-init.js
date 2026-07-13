/* No-flash theme init. Runs synchronously in <head> before first paint.
   Defaults to the visitor's OS preference, persists the choice under the
   `signal-theme` localStorage key. Served same-origin so it satisfies the
   `script-src 'self'` CSP in both dev and prod. */
(function () {
  try {
    var stored = localStorage.getItem('signal-theme');
    var dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) {}
})();
