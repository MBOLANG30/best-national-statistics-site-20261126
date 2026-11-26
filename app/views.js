/* NusaStat — views.js
   Renders every page and draws every chart as hand-rolled SVG.
   No library, no network: everything comes from window.NUSA_DATA. */
(function () {
  "use strict";

  var D = window.NUSA_DATA;
  var PALETTE = ["#0e7c6b", "#e8a13a", "#3b6ea5", "#c25b4a", "#6a8f3c", "#7a5aa6"];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function fmt(n, d) {
    return Number(n).toLocaleString("id-ID", {
      minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 0 : d
    });
  }

  /* ---- SVG chart helpers ---- */

  function barChart(rows, valueKey, labelKey, opts) {
    opts = opts || {};
    var w = opts.width || 640, h = opts.height || 280, padL = 46, padB = 28, padT = 14;
    var max = 0, i;
    for (i = 0; i < rows.length; i++) max = Math.max(max, rows[i][valueKey]);
    max = max * 1.08;
    var bw = (w - padL - 16) / rows.length;
    var out = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Diagram batang">';
    var grid = 4, g;
    for (g = 0; g <= grid; g++) {
      var y = padT + (h - padB - padT) * g / grid;
      var v = max * (1 - g / grid);
      out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - 8) + '" y2="' + y.toFixed(1) +
        '" stroke="#e3e8e6" stroke-width="1"/><text x="' + (padL - 6) + '" y="' + (y + 4).toFixed(1) +
        '" text-anchor="end" font-size="11" fill="#6b7a76">' + fmt(v, opts.decimals || 0) + "</text>";
    }
    for (i = 0; i < rows.length; i++) {
      var r = rows[i], val = r[valueKey];
      var bh = (h - padB - padT) * val / max;
      var x = padL + i * bw + bw * 0.16;
      var y2 = h - padB - bh;
      var col = PALETTE[i % PALETTE.length];
      out += '<rect x="' + x.toFixed(1) + '" y="' + y2.toFixed(1) + '" width="' + (bw * 0.68).toFixed(1) +
        '" height="' + bh.toFixed(1) + '" rx="3" fill="' + col + '"/>' +
        '<text x="' + (x + bw * 0.34).toFixed(1) + '" y="' + (y2 - 5).toFixed(1) +
        '" text-anchor="middle" font-size="11" font-weight="600" fill="#1d2b28">' + fmt(val, opts.decimals || 0) + "</text>" +
        '<text x="' + (x + bw * 0.34).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="#41514c">' +
        esc(String(r[labelKey])) + "</text>";
    }
    return out + "</svg>";
  }

  function lineChart(series, opts) {
    /* series: [{label, color, points:[{x,y}]}] sharing one x axis. */
    opts = opts || {};
    var w = opts.width || 640, h = opts.height || 280, padL = 46, padB = 30, padT = 16;
    var xs = series[0].points.map(function (p) { return p.x; });
    var min = Infinity, max = -Infinity, s, i;
    series.forEach(function (ser) {
      ser.points.forEach(function (p) { min = Math.min(min, p.y); max = Math.max(max, p.y); });
    });
    var span = max - min || 1;
    min -= span * 0.12; max += span * 0.12;
    function X(i2) { return padL + (w - padL - 16) * i2 / (xs.length - 1); }
    function Y(v) { return padT + (h - padB - padT) * (1 - (v - min) / (max - min)); }
    var out = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Diagram garis">';
    for (var g = 0; g <= 4; g++) {
      var y = padT + (h - padB - padT) * g / 4;
      var v = max - (max - min) * g / 4;
      out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - 8) + '" y2="' + y.toFixed(1) +
        '" stroke="#e3e8e6"/><text x="' + (padL - 6) + '" y="' + (y + 4).toFixed(1) +
        '" text-anchor="end" font-size="11" fill="#6b7a76">' + fmt(v, opts.decimals || 1) + "</text>";
    }
    series.forEach(function (ser) {
      var d = "";
      ser.points.forEach(function (p, i2) {
        d += (i2 === 0 ? "M" : "L") + X(i2).toFixed(1) + "," + Y(p.y).toFixed(1) + " ";
      });
      out += '<path d="' + d + '" fill="none" stroke="' + ser.color + '" stroke-width="2.5" stroke-linejoin="round"/>';
      ser.points.forEach(function (p, i2) {
        out += '<circle cx="' + X(i2).toFixed(1) + '" cy="' + Y(p.y).toFixed(1) + '" r="3.5" fill="#fff" stroke="' + ser.color + '" stroke-width="2"/>';
      });
    });
    xs.forEach(function (x, i2) {
      out += '<text x="' + X(i2).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="#41514c">' + x + "</text>";
    });
    return out + "</svg>";
  }

  function donutChart(parts, opts) {
    opts = opts || {};
    /* Roomier viewBox so the percent labels sit inside the frame. */
    var size = opts.size || 300, cx = size / 2, cy = size / 2, r = size / 2 - 34, inner = r * 0.62;
    var total = 0, i;
    parts.forEach(function (p) { total += p.value; });
    var out = '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Diagram donat">';
    var a0 = -Math.PI / 2;
    for (i = 0; i < parts.length; i++) {
      var frac = parts[i].value / total;
      var a1 = a0 + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      var xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
      var xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
      out += '<path d="M' + x0.toFixed(1) + "," + y0.toFixed(1) + " A" + r + "," + r + " 0 " + large + " 1 " +
        x1.toFixed(1) + "," + y1.toFixed(1) + " L" + xi1.toFixed(1) + "," + yi1.toFixed(1) +
        " A" + inner + "," + inner + " 0 " + large + " 0 " + xi0.toFixed(1) + "," + yi0.toFixed(1) + ' Z" fill="' +
        PALETTE[i % PALETTE.length] + '"/>';
      var am = (a0 + a1) / 2;
      var lx = cx + (r + 26) * Math.cos(am), ly = cy + (r + 26) * Math.sin(am);
      out += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="600" fill="#1d2b28">' +
        fmt(parts[i].value, 1) + "%</text>";
      a0 = a1;
    }
    out += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#1d2b28">281,6 jt</text>' +
      '<text x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" font-size="11" fill="#6b7a76">penduduk 2024</text>';
    return out + "</svg>";
  }

  /* ---- Shared fragments ---- */

  function sourceLine(source) {
    return '<p class="src">Sumber: ' + esc(source) + "</p>";
  }

  function statCards(items) {
    var out = '<div class="cards">';
    items.forEach(function (it) {
      out += '<article class="card"><div class="card-label">' + esc(it.label) + '</div>' +
        '<div class="card-value">' + esc(it.value) + "</div>" +
        '<div class="card-sub">' + esc(it.sub) + "</div>" +
        (it.delta ? '<div class="card-delta">' + esc(it.delta) + "</div>" : "") +
        sourceLine(it.source) + "</article>";
    });
    return out + "</div>";
  }

  function legend(items) {
    var out = '<ul class="legend">';
    items.forEach(function (it, i) {
      out += '<li><span class="swatch" style="background:' + PALETTE[i % PALETTE.length] + '"></span>' +
        esc(it.group) + " — " + esc(it.note) + " (" + fmt(it.value, 1) + "%)</li>";
    });
    return out + "</ul>";
  }

  /* ---- Pages ---- */

  function pageOverview() {
    var trend = D.populationTrend.slice(-6);
    return '' +
      '<section class="hero"><h1>Indonesia dalam angka</h1>' +
      "<p>Satu tempat untuk angka-angka resmi Indonesia: penduduk, ekonomi, kesehatan, " +
      "pendidikan, dan 38 provinsi — setiap angka disertai sumber dan tahunnya.</p>" +
      '<p class="hero-meta">Data terakhir: 2024 &middot; ' + esc(D.meta.coverage) + " &middot; Diperbarui " + esc(D.meta.updated) +
      " &middot; " + esc(D.meta.worldRank) + "</p></section>" +
      statCards(D.headline) +
      '<section class="panel"><h2>Pertumbuhan penduduk, 2019–2024</h2>' +
      barChart(trend, "value", "year", { decimals: 1 }) +
      '<p class="note">Penduduk Indonesia bertambah sekitar 2–3 juta jiwa setiap tahun. ' +
      "Angka 2024 adalah estimasi pertengahan tahun.</p>" + sourceLine("BPS, 2024") + "</section>" +
      '<section class="panel"><h2>Struktur umur penduduk 2024</h2><div class="split">' +
      '<div>' + donutChart(D.ageStructure) + "</div>" +
      '<div><p>Indonesia masih menikmati bonus demografi: hampir tujuh dari sepuluh ' +
      "penduduk berada di usia kerja (15–64 tahun). Kelompok lansia (65+) kini 7,6% " +
      "dan terus naik — implikasinya besar untuk layanan kesehatan dan pensiun.</p>" +
      legend(D.ageStructure) + "</div></div>" + sourceLine("BPS, 2024") + "</section>" +
      '<section class="panel"><h2>Pertumbuhan ekonomi vs inflasi, 2019–2024</h2>' +
      lineChart([
        { label: "Pertumbuhan PDB", color: PALETTE[0], points: D.economyTrend.map(function (r) { return { x: r.year, y: r.growth }; }) },
        { label: "Inflasi", color: PALETTE[1], points: D.economyTrend.map(function (r) { return { x: r.year, y: r.inflation }; }) }
      ], { decimals: 1 }) +
      '<p class="legend-inline"><span class="swatch" style="background:' + PALETTE[0] + '"></span>Pertumbuhan PDB (%) &nbsp; ' +
      '<span class="swatch" style="background:' + PALETTE[1] + '"></span>Inflasi (%)</p>' +
      "<p class=\"note\">Ekonomi tumbuh di atas 5% selama tiga tahun berturut-turut (2022–2024), " +
      "sementara inflasi 2024 turun ke 1,57% — terendah dalam enam tahun.</p>" + sourceLine("BPS, 2024") + "</section>" +
      '<section class="panel"><h2>Jelajahi datanya</h2><div class="tiles">' +
      '<a class="tile" href="#/population"><strong>Penduduk</strong><span>281,6 juta jiwa &middot; struktur umur &middot; kota besar</span></a>' +
      '<a class="tile" href="#/economy"><strong>Ekonomi</strong><span>PDB, inflasi, pengangguran &middot; kemiskinan</span></a>' +
      '<a class="tile" href="#/health"><strong>Kesehatan</strong><span>Harapan hidup, stunting, JKN</span></a>' +
      '<a class="tile" href="#/education"><strong>Pendidikan</strong><span>Melek huruf, lama sekolah, partisipasi</span></a>' +
      '<a class="tile" href="#/regions"><strong>Provinsi</strong><span>Tabel 38 provinsi, bisa diurutkan &amp; dicari</span></a>' +
      '<a class="tile" href="#/methodology"><strong>Metodologi &amp; sumber</strong><span>Dari mana setiap angka berasal</span></a>' +
      "</div></section>";
  }

  function pagePopulation() {
    var cityRows = D.cities.map(function (c) {
      return { label: c.name, value: c.value };
    });
    return '' +
      "<h1>Penduduk</h1>" +
      "<p class=\"lede\">Indonesia adalah negara berpenduduk terbesar keempat di dunia. " +
      "Sebagian besar penduduk tinggal di Jawa — pulau yang luasnya hanya sekitar 7% " +
      "dari wilayah Indonesia tetapi menampung lebih dari separuh penduduknya.</p>" +
      statCards(D.headline.slice(0, 1).concat([
        { label: "Laju pertumbuhan", value: "0,84%", sub: "per tahun, 2023–2024", source: "BPS, 2024" },
        { label: "Kepadatan", value: "147/km²", sub: "rata-rata nasional, 2024", source: "BPS, 2024" },
        { label: "Penduduk Jawa", value: "56,4%", sub: "dari total penduduk, 2024", source: "BPS, 2024" }
      ])) +
      '<section class="panel"><h2>Penduduk Indonesia, 2015–2024 (juta jiwa)</h2>' +
      lineChart([{ label: "Penduduk", color: PALETTE[0],
        points: D.populationTrend.map(function (r) { return { x: r.year, y: r.value }; }) }], { decimals: 1 }) +
      sourceLine("BPS, 2015–2024 (estimasi pertengahan tahun)") + "</section>" +
      '<section class="panel"><h2>Struktur umur 2024</h2><div class="split">' +
      '<div>' + donutChart(D.ageStructure) + "</div>" +
      '<div><p>Bonus demografi: 68,3% penduduk berusia 15–64 tahun. Rasio ketergantungan ' +
      "sekitar 46 — setiap 100 penduduk usia kerja menanggung 46 penduduk non-usia kerja.</p>" +
      legend(D.ageStructure) + "</div></div>" + sourceLine("BPS, 2024") + "</section>" +
      '<section class="panel"><h2>Kota terbesar (juta jiwa, 2024)</h2>' +
      barChart(cityRows, "value", "label", { decimals: 2 }) +
      "<p class=\"note\">Angka kota adalah penduduk dalam batas administratif kota, bukan kawasan metropolitan.</p>" +
      sourceLine("BPS, 2024") + "</section>";
  }

  function pageEconomy() {
    return '' +
      "<h1>Ekonomi</h1>" +
      "<p class=\"lede\">PDB Indonesia 2024 mencapai Rp22.139 triliun dengan pertumbuhan 5,03%. " +
      "Inflasi terkendali di 1,57%, pengangguran turun ke 4,91%, dan kemiskinan ke level " +
      "terendah sepanjang sejarah: 8,57%.</p>" +
      statCards([
        { label: "PDB 2024", value: "Rp22.139 T", sub: "harga berlaku", source: "BPS, 2024", delta: "≈ US$1,40 triliun" },
        { label: "Pertumbuhan", value: "5,03%", sub: "2024 (y-on-y)", source: "BPS, 2024" },
        { label: "Inflasi", value: "1,57%", sub: "2024", source: "BPS, 2024" },
        { label: "Pengangguran", value: "4,91%", sub: "Agustus 2024", source: "BPS, 2024" },
        { label: "Kemiskinan", value: "8,57%", sub: "September 2024", source: "BPS, 2024" },
        { label: "PDB per kapita", value: "Rp78,6 jt", sub: "2024", source: "BPS, 2024" }
      ]) +
      '<section class="panel"><h2>Pertumbuhan PDB dan inflasi, 2019–2024 (%)</h2>' +
      lineChart([
        { label: "Pertumbuhan PDB", color: PALETTE[0], points: D.economyTrend.map(function (r) { return { x: r.year, y: r.growth }; }) },
        { label: "Inflasi", color: PALETTE[1], points: D.economyTrend.map(function (r) { return { x: r.year, y: r.inflation }; }) }
      ], { decimals: 1 }) +
      '<p class="legend-inline"><span class="swatch" style="background:' + PALETTE[0] + '"></span>Pertumbuhan PDB (%) &nbsp; ' +
      '<span class="swatch" style="background:' + PALETTE[1] + '"></span>Inflasi (%)</p>' +
      "<p class=\"note\">Kontraksi 2020 (-2,07%) adalah dampak pandemi COVID-19; pemulihan penuh " +
      "tercapai pada 2022 dengan pertumbuhan 5,31%.</p>" + sourceLine("BPS, 2019–2024") + "</section>" +
      '<section class="panel"><h2>Kemiskinan dan pengangguran, 2019–2024 (%)</h2>' +
      lineChart([
        { label: "Kemiskinan", color: PALETTE[3], points: D.economyTrend.map(function (r) { return { x: r.year, y: r.poverty }; }) },
        { label: "Pengangguran", color: PALETTE[2], points: D.economyTrend.map(function (r) { return { x: r.year, y: r.unemployment }; }) }
      ], { decimals: 1 }) +
      '<p class="legend-inline"><span class="swatch" style="background:' + PALETTE[3] + '"></span>Kemiskinan (%) &nbsp; ' +
      '<span class="swatch" style="background:' + PALETTE[2] + '"></span>Pengangguran terbuka (%)</p>' +
      sourceLine("BPS, 2019–2024") + "</section>" +
      '<section class="panel"><h2>Angka ekonomi lainnya</h2>' + statCards(D.economyFacts) + "</section>";
  }

  function pageHealth() {
    return '' +
      "<h1>Kesehatan</h1>" +
      "<p class=\"lede\">Harapan hidup orang Indonesia mencapai 74,15 tahun pada 2024 — naik lebih " +
      "dari dua tahun dibanding 2022. Tantangan terbesar yang tersisa: stunting pada " +
      "balita dan kematian ibu yang masih tinggi.</p>" +
      statCards(D.healthFacts) +
      '<section class="panel"><h2>Harapan hidup dan kematian bayi, 2020–2024</h2>' +
      lineChart([
        { label: "Harapan hidup", color: PALETTE[0], points: D.healthTrend.map(function (r) { return { x: r.year, y: r.life }; }) }
      ], { decimals: 1 }) +
      "<p class=\"note\">Harapan hidup (tahun) naik dari 71,47 pada 2020 menjadi 74,15 pada 2024. " +
      "Kematian bayi turun dari 16,9 menjadi 15,9 per 1.000 kelahiran hidup pada periode yang sama.</p>" +
      sourceLine("BPS dan World Bank, 2020–2024") + "</section>" +
      '<section class="panel"><h2>Apa yang perlu diperhatikan</h2><ul class="bullets">' +
      "<li><strong>Stunting 19,8%</strong> — hampir satu dari lima balita mengalami stunting (SSGI 2024). Target pemerintah: di bawah 14%.</li>" +
      "<li><strong>Kematian ibu 173 per 100.000 kelahiran</strong> (World Bank, 2020) — jauh di atas target SDG 70 per 100.000.</li>" +
      "<li><strong>JKN menjangkau ≈98% penduduk</strong> (BPJS Kesehatan, 2024) — salah satu program jaminan kesehatan terbesar di dunia.</li>" +
      "</ul></section>";
  }

  function pageEducation() {
    return '' +
      "<h1>Pendidikan</h1>" +
      "<p class=\"lede\">Hampir semua orang Indonesia usia 15 tahun ke atas kini bisa membaca " +
      "(96,9% pada 2024), dan rata-rata lama sekolah menembus 9 tahun. Tantangan " +
      "berikutnya adalah kualitas: partisipasi SMA masih 82,4%.</p>" +
      statCards(D.educationFacts) +
      '<section class="panel"><h2>Melek huruf dan lama sekolah, 2019–2024</h2>' +
      lineChart([
        { label: "Melek huruf", color: PALETTE[0], points: D.educationTrend.map(function (r) { return { x: r.year, y: r.literacy }; }) },
        { label: "Lama sekolah", color: PALETTE[1], points: D.educationTrend.map(function (r) { return { x: r.year, y: r.schooling }; }) }
      ], { decimals: 1 }) +
      '<p class="legend-inline"><span class="swatch" style="background:' + PALETTE[0] + '"></span>Melek huruf 15+ (%) &nbsp; ' +
      '<span class="swatch" style="background:' + PALETTE[1] + '"></span>Rata-rata lama sekolah (tahun)</p>' +
      sourceLine("BPS, 2019–2024") + "</section>" +
      '<section class="panel"><h2>Partisipasi sekolah menurut jenjang, 2024</h2>' +
      barChart([
        { label: "SD", value: 99.1 }, { label: "SMP", value: 95.3 }, { label: "SMA", value: 82.4 }
      ], "value", "label", { decimals: 1 }) +
      "<p class=\"note\">Angka partisipasi murni: persentase anak usia sekolah jenjang tersebut yang " +
      "benar-benar bersekolah di jenjang itu.</p>" + sourceLine("BPS, 2024") + "</section>";
  }

  function provinceRows(list) {
    var total = 0;
    D.provinces.forEach(function (p) { total += p.pop; });
    return list.map(function (p, i) {
      return "<tr><td>" + (i + 1) + "</td><td><strong>" + esc(p.name) + "</strong></td>" +
        "<td>" + esc(p.island) + "</td><td>" + fmt(p.pop, 2) + "</td>" +
        "<td>" + fmt(p.pop / total * 100, 1) + "%</td><td>" + fmt(p.density) + "</td></tr>";
    }).join("");
  }

  function pageRegions() {
    return '' +
      "<h1>Provinsi</h1>" +
      "<p class=\"lede\">Indonesia terdiri dari 38 provinsi di enam gugus pulau. " +
      "Jawa Barat adalah provinsi terpadat penduduknya (49,94 juta jiwa), sementara " +
      "DKI Jakarta adalah yang terpadat wilayahnya (15.927 jiwa per km²).</p>" +
      '<section class="panel"><h2>Tabel provinsi — penduduk 2024</h2>' +
      '<div class="controls"><input id="prov-search" type="search" placeholder="Cari provinsi atau pulau…" aria-label="Cari provinsi">' +
      '<label>Urutkan: <select id="prov-sort">' +
      '<option value="pop">Penduduk (terbanyak)</option>' +
      '<option value="name">Nama (A–Z)</option>' +
      '<option value="density">Kepadatan (tertinggi)</option>' +
      '<option value="island">Pulau (A–Z)</option></select></label></div>' +
      '<div class="table-wrap"><table id="prov-table"><thead><tr>' +
      "<th>#</th><th>Provinsi</th><th>Pulau</th><th>Penduduk (jt)</th><th>Pangsa</th><th>Kepadatan (/km²)</th>" +
      '</tr></thead><tbody id="prov-body">' + provinceRows(D.provinces.slice().sort(function (a, b) { return b.pop - a.pop; })) +
      "</tbody></table></div>" +
      '<p class="note" id="prov-count">Menampilkan 38 provinsi.</p>' +
      sourceLine("BPS, 2024 (estimasi pertengahan tahun; kepadatan dihitung dari luas wilayah)") + "</section>" +
      '<section class="panel"><h2>Lima provinsi terpadat</h2>' +
      barChart(D.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 5),
        "pop", "name", { decimals: 1 }) +
      sourceLine("BPS, 2024") + "</section>";
  }

  function pageMethodology() {
    var rows = D.sources.map(function (s) {
      return "<tr><td><strong>" + esc(s.name) + "</strong></td><td>" + esc(s.what) + "</td><td>" +
        esc(s.years) + "</td><td>" + esc(s.url) + "</td></tr>";
    }).join("");
    return '' +
      "<h1>Metodologi &amp; sumber</h1>" +
      "<p class=\"lede\">Setiap angka di situs ini berasal dari publikasi resmi dan dicantumkan " +
      "sumber beserta tahunnya di samping angka tersebut. Halaman ini merangkum semuanya.</p>" +
      '<section class="panel"><h2>Prinsip kami</h2><ul class="bullets">' +
      "<li><strong>Satu angka, satu sumber.</strong> Tidak ada angka tanpa sumber dan tahun.</li>" +
      "<li><strong>Publikasi resmi dulu.</strong> BPS adalah sumber utama; World Bank dipakai untuk estimasi antarnegara seperti kematian ibu.</li>" +
      "<li><strong>Pembulatan jujur.</strong> Angka dibulatkan ke satu atau dua desimal; nilai yang dibulatkan tetap merujuk ke publikasi aslinya.</li>" +
      "<li><strong>Tahun jelas.</strong> “2024” berarti angka tahun 2024 atau survei yang diterbitkan untuk 2024; periode survei (mis. Agustus/September) selalu dicantumkan.</li>" +
      "</ul></section>" +
      '<section class="panel"><h2>Daftar sumber</h2><div class="table-wrap"><table><thead><tr>' +
      "<th>Sumber</th><th>Data yang dipakai</th><th>Tahun</th><th>Situs</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div></section>" +
      '<section class="panel"><h2>Catatan metodologi</h2><ul class="bullets">' +
      "<li>Penduduk 2024 adalah estimasi pertengahan tahun BPS; sensus terakhir adalah Sensus Penduduk 2020.</li>" +
      "<li>Harapan hidup 2023–2024 memakai pembaruan metodologi BPS; perbandingan dengan 2020–2022 perlu kehati-hatian.</li>" +
      "<li>Kematian ibu 2020 adalah estimasi model World Bank (UN Maternal Mortality Estimation Inter-Agency Group), bukan hitungan registrasi.</li>" +
      "<li>PDB per kapita memakai PDB harga berlaku dibagi penduduk pertengahan tahun.</li>" +
      "<li>Situs ini adalah karya orisinal yang disusun dari angka-angka publik di atas; bukan situs resmi BPS atau pemerintah.</li>" +
      "</ul></section>";
  }

  var PAGES = {
    "/": pageOverview,
    "/population": pagePopulation,
    "/economy": pageEconomy,
    "/health": pageHealth,
    "/education": pageEducation,
    "/regions": pageRegions,
    "/methodology": pageMethodology
  };

  function render(route) {
    var fn = PAGES[route] || PAGES["/"];
    return fn();
  }

  window.NUSA_VIEWS = { render: render, PAGES: PAGES };
})();
