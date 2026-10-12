// Progressive enhancement only: the active command-menu row inverts to track the
// section in view. Without JavaScript the rows still work as plain in-page links.
(function () {
  // The window opens one text row at a time: size the wipe's step count to the rows it covers.
  document.documentElement.classList.add("js");
  var win = document.querySelector(".win");
  if (win) win.style.setProperty("--rows", String(Math.max(8, Math.round(Math.min(win.offsetHeight, window.innerHeight) / 24))));

  if (!("IntersectionObserver" in window)) return;
  var links = Array.prototype.slice.call(document.querySelectorAll(".menu a[href^='#']"));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if (!sections.length) return;

  var visible = {};
  function setActive(id) {
    links.forEach(function (a) {
      if (a === byId[id]) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  setActive(sections[0].id);
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.intersectionRatio; });
    var best = null;
    sections.forEach(function (s) {
      if (visible[s.id] > 0 && (best === null || visible[s.id] > visible[best])) best = s.id;
    });
    if (best) setActive(best);
  }, { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] });
  sections.forEach(function (s) { io.observe(s); });
})();
