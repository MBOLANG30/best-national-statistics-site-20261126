/* NusaStat — main.js
   Hash routing and page wiring. No network, no framework. */
(function () {
  "use strict";

  var D = window.NUSA_DATA;
  var VIEWS = window.NUSA_VIEWS;

  var NAV = [
    { route: "/", label: "Beranda" },
    { route: "/population", label: "Penduduk" },
    { route: "/economy", label: "Ekonomi" },
    { route: "/health", label: "Kesehatan" },
    { route: "/education", label: "Pendidikan" },
    { route: "/regions", label: "Provinsi" },
    { route: "/methodology", label: "Metodologi" }
  ];

  function currentRoute() {
    var h = window.location.hash || "#/";
    var r = h.slice(1);
    if (!r || r === "") r = "/";
    return VIEWS.PAGES[r] ? r : "/";
  }

  function fmt(n, d) {
    return Number(n).toLocaleString("id-ID", {
      minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 0 : d
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* Regions page: live search + sort, all client-side. */
  function wireRegions() {
    var search = document.getElementById("prov-search");
    var sort = document.getElementById("prov-sort");
    var body = document.getElementById("prov-body");
    var count = document.getElementById("prov-count");
    if (!search || !sort || !body) return;

    var total = 0;
    D.provinces.forEach(function (p) { total += p.pop; });

    function apply() {
      var q = search.value.trim().toLowerCase();
      var list = D.provinces.filter(function (p) {
        return !q || p.name.toLowerCase().indexOf(q) !== -1 ||
          p.island.toLowerCase().indexOf(q) !== -1;
      });
      var key = sort.value;
      list.sort(function (a, b) {
        if (key === "name") return a.name.localeCompare(b.name, "id");
        if (key === "density") return b.density - a.density;
        if (key === "island") return a.island.localeCompare(b.island, "id") || b.pop - a.pop;
        return b.pop - a.pop;
      });
      var html = "";
      list.forEach(function (p, i) {
        html += "<tr><td>" + (i + 1) + "</td><td><strong>" + esc(p.name) + "</strong></td>" +
          "<td>" + esc(p.island) + "</td><td>" + fmt(p.pop, 2) + "</td>" +
          "<td>" + fmt(p.pop / total * 100, 1) + "%</td><td>" + fmt(p.density) + "</td></tr>";
      });
      body.innerHTML = html || '<tr><td colspan="6">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>';
      count.textContent = "Menampilkan " + list.length + " dari 38 provinsi.";
    }

    search.addEventListener("input", apply);
    sort.addEventListener("change", apply);
  }

  var TITLES = {
    "/": "NusaStat — Statistik Indonesia",
    "/population": "Penduduk — NusaStat",
    "/economy": "Ekonomi — NusaStat",
    "/health": "Kesehatan — NusaStat",
    "/education": "Pendidikan — NusaStat",
    "/regions": "Provinsi — NusaStat",
    "/methodology": "Metodologi & sumber — NusaStat"
  };

  function render() {
    var route = currentRoute();
    document.title = TITLES[route] || TITLES["/"];
    var app = document.getElementById("app");
    app.innerHTML = VIEWS.render(route);

    var links = document.querySelectorAll("nav a");
    links.forEach(function (a) {
      var r = a.getAttribute("href").slice(1);
      if (r === route) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    if (route === "/regions") wireRegions();
    window.scrollTo(0, 0);
  }

  function buildNav() {
    var nav = document.getElementById("nav");
    var html = "";
    NAV.forEach(function (item) {
      html += '<a href="#' + item.route + '">' + item.label + "</a>";
    });
    nav.innerHTML = html;
  }

  buildNav();
  window.addEventListener("hashchange", render);
  render();
})();
