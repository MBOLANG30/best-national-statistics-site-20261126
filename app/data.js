/* NusaStat — data.js
   Figures for Indonesia, each with its source and year.
   Sources: Badan Pusat Statistik (BPS) and World Bank, 2019–2025.
   Values are rounded public figures; see the Methodology page for
   the exact publication behind every number. */
(function () {
  "use strict";

  var SRC = {
    bps: "BPS (Badan Pusat Statistik)",
    wb: "World Bank",
    kemenkes: "Kemenkes RI / SSGI",
    bps2024: "BPS, 2024",
    bps2023: "BPS, 2023"
  };

  var DATA = {
    meta: {
      country: "Indonesia",
      updated: "November 2025",
      coverage: "38 provinsi",
      worldRank: "Penduduk terbesar ke-4 di dunia (PBB, 2024)"
    },

    /* Headline indicators shown on the overview page. */
    headline: [
      { label: "Penduduk", value: "281,6 jt", sub: "jiwa, pertengahan 2024", source: SRC.bps2024, delta: "+0,8% per tahun" },
      { label: "PDB", value: "Rp22.139 T", sub: "harga berlaku, 2024", source: SRC.bps2024, delta: "≈ US$1,40 triliun" },
      { label: "Pertumbuhan ekonomi", value: "5,03%", sub: "tahun 2024 (y-on-y)", source: SRC.bps2024, delta: "2023: 5,05%" },
      { label: "Inflasi", value: "1,57%", sub: "tahun kalender 2024", source: SRC.bps2024, delta: "2023: 2,61%" },
      { label: "Pengangguran terbuka", value: "4,91%", sub: "Agustus 2024", source: SRC.bps2024, delta: "2023: 5,32%" },
      { label: "Kemiskinan", value: "8,57%", sub: "September 2024", source: SRC.bps2024, delta: "2023: 9,36%" },
      { label: "Harapan hidup", value: "74,15 thn", sub: "angka harapan hidup, 2024", source: SRC.bps2024, delta: "2023: 73,93 thn" },
      { label: "Indeks Pembangunan Manusia", value: "75,02", sub: "IPM 2024 (skala 0–100)", source: SRC.bps2024, delta: "2023: 74,39" }
    ],

    /* Population 2015–2024, millions (BPS mid-year estimates). */
    populationTrend: [
      { year: 2015, value: 255.6 }, { year: 2016, value: 258.7 },
      { year: 2017, value: 261.9 }, { year: 2018, value: 265.0 },
      { year: 2019, value: 268.1 }, { year: 2020, value: 271.3 },
      { year: 2021, value: 273.9 }, { year: 2022, value: 276.4 },
      { year: 2023, value: 278.7 }, { year: 2024, value: 281.6 }
    ],

    /* Age structure 2024, percent of population (BPS). */
    ageStructure: [
      { group: "0–14 tahun", value: 24.1, note: "anak-anak" },
      { group: "15–64 tahun", value: 68.3, note: "usia kerja" },
      { group: "65+ tahun", value: 7.6, note: "lansia" }
    ],

    /* Five largest cities by metro population, 2024 (BPS / city estimates). */
    cities: [
      { name: "Jakarta", value: 10.56, note: "DKI Jakarta, 2024" },
      { name: "Surabaya", value: 2.92, note: "Kota Surabaya, 2024" },
      { name: "Medan", value: 2.48, note: "Kota Medan, 2024" },
      { name: "Bandung", value: 2.47, note: "Kota Bandung, 2024" },
      { name: "Bekasi", value: 2.45, note: "Kota Bekasi, 2024" }
    ],

    /* GDP growth, inflation, poverty and unemployment, 2019–2024 (BPS). */
    economyTrend: [
      { year: 2019, growth: 5.02, inflation: 2.72, poverty: 9.22, unemployment: 5.28 },
      { year: 2020, growth: -2.07, inflation: 1.68, poverty: 9.78, unemployment: 7.07 },
      { year: 2021, growth: 3.70, inflation: 1.87, poverty: 9.71, unemployment: 6.49 },
      { year: 2022, growth: 5.31, inflation: 5.51, poverty: 9.54, unemployment: 5.86 },
      { year: 2023, growth: 5.05, inflation: 2.61, poverty: 9.36, unemployment: 5.32 },
      { year: 2024, growth: 5.03, inflation: 1.57, poverty: 8.57, unemployment: 4.91 }
    ],

    economyFacts: [
      { label: "PDB per kapita", value: "Rp78,6 jt", sub: "2024, harga berlaku", source: SRC.bps2024 },
      { label: "Rasio Gini", value: "0,379", sub: "Maret 2024 — ketimpangan pengeluaran", source: SRC.bps2024 },
      { label: "Ekspor", value: "US$264,7 miliar", sub: "2024 (fob)", source: SRC.bps2024 },
      { label: "Cadangan devisa", value: "US$155,7 miliar", sub: "akhir 2024", source: "Bank Indonesia, 2024" },
      { label: "Pekerja informal", value: "58,0%", sub: "dari pekerja, Agustus 2024", source: SRC.bps2024 },
      { label: "UMR tertinggi", value: "Rp5,40 jt", sub: "UMP DKI Jakarta 2025", source: "Pemprov DKI Jakarta, 2024" }
    ],

    /* Health, 2019–2024 (BPS, World Bank, Kemenkes). */
    healthTrend: [
      { year: 2020, life: 71.47, infant: 16.9 },
      { year: 2021, life: 71.60, infant: 16.6 },
      { year: 2022, life: 71.85, infant: 16.3 },
      { year: 2023, life: 73.93, infant: 16.0 },
      { year: 2024, life: 74.15, infant: 15.9 }
    ],

    healthFacts: [
      { label: "Harapan hidup", value: "74,15 thn", sub: "2024", source: SRC.bps2024 },
      { label: "Kematian bayi", value: "15,9", sub: "per 1.000 kelahiran hidup, 2024", source: SRC.wb + ", 2024" },
      { label: "Kematian ibu", value: "173", sub: "per 100.000 kelahiran hidup, 2020", source: SRC.wb + ", 2020" },
      { label: "Prevalensi stunting", value: "19,8%", sub: "balita, 2024", source: SRC.kemenkes },
      { label: "Peserta JKN (BPJS)", value: "≈98%", sub: "penduduk terdaftar, 2024", source: "BPJS Kesehatan, 2024" },
      { label: "Rumah sakit", value: "3.100+", sub: "unit di seluruh Indonesia, 2024", source: SRC.kemenkes }
    ],

    /* Education, 2019–2024 (BPS). */
    educationTrend: [
      { year: 2019, literacy: 95.9, schooling: 8.50 },
      { year: 2020, literacy: 96.0, schooling: 8.54 },
      { year: 2021, literacy: 96.2, schooling: 8.66 },
      { year: 2022, literacy: 96.6, schooling: 8.78 },
      { year: 2023, literacy: 96.8, schooling: 8.93 },
      { year: 2024, literacy: 96.9, schooling: 9.06 }
    ],

    educationFacts: [
      { label: "Melek huruf 15+", value: "96,9%", sub: "angka melek huruf, 2024", source: SRC.bps2024 },
      { label: "Rata-rata lama sekolah", value: "9,06 thn", sub: "penduduk 25+, 2024", source: SRC.bps2024 },
      { label: "Harapan lama sekolah", value: "13,21 thn", sub: "2024", source: SRC.bps2024 },
      { label: "Partisipasi SD", value: "99,1%", sub: "angka partisipasi murni SD, 2024", source: SRC.bps2024 },
      { label: "Partisipasi SMP", value: "95,3%", sub: "angka partisipasi murni SMP, 2024", source: SRC.bps2024 },
      { label: "Partisipasi SMA", value: "82,4%", sub: "angka partisipasi murni SMA, 2024", source: SRC.bps2024 }
    ],

    /* Provinces: 2024 mid-year population (millions), density per km2,
       island group. BPS 2024 estimates, rounded. */
    provinces: [
      { name: "Jawa Barat", pop: 49.94, density: 1416, island: "Jawa" },
      { name: "Jawa Timur", pop: 41.81, density: 874, island: "Jawa" },
      { name: "Jawa Tengah", pop: 37.89, density: 1162, island: "Jawa" },
      { name: "Sumatera Utara", pop: 16.03, density: 220, island: "Sumatera" },
      { name: "Banten", pop: 12.43, density: 1287, island: "Jawa" },
      { name: "DKI Jakarta", pop: 10.56, density: 15927, island: "Jawa" },
      { name: "Sulawesi Selatan", pop: 9.36, density: 200, island: "Sulawesi" },
      { name: "Lampung", pop: 9.18, density: 265, island: "Sumatera" },
      { name: "Sumatera Selatan", pop: 9.02, density: 99, island: "Sumatera" },
      { name: "Riau", pop: 6.76, density: 78, island: "Sumatera" },
      { name: "Sumatera Barat", pop: 5.86, density: 139, island: "Sumatera" },
      { name: "Kalimantan Barat", pop: 5.79, density: 39, island: "Kalimantan" },
      { name: "Nusa Tenggara Timur", pop: 5.66, density: 117, island: "Nusa Tenggara" },
      { name: "Aceh", pop: 5.55, density: 96, island: "Sumatera" },
      { name: "Bali", pop: 4.41, density: 764, island: "Bali" },
      { name: "Kalimantan Selatan", pop: 4.24, density: 110, island: "Kalimantan" },
      { name: "Kalimantan Timur", pop: 4.01, density: 31, island: "Kalimantan" },
      { name: "DI Yogyakarta", pop: 3.76, density: 1204, island: "Jawa" },
      { name: "Sulawesi Utara", pop: 2.70, density: 194, island: "Sulawesi" },
      { name: "Sulawesi Tengah", pop: 3.10, density: 50, island: "Sulawesi" },
      { name: "Sulawesi Tenggara", pop: 2.79, density: 73, island: "Sulawesi" },
      { name: "Kalimantan Tengah", pop: 2.77, density: 18, island: "Kalimantan" },
      { name: "Nusa Tenggara Barat", pop: 5.60, density: 302, island: "Nusa Tenggara" },
      { name: "Jambi", pop: 3.66, density: 73, island: "Sumatera" },
      { name: "Papua", pop: 1.06, density: 13, island: "Papua" },
      { name: "Papua Tengah", pop: 1.35, density: 22, island: "Papua" },
      { name: "Papua Pegunungan", pop: 1.46, density: 28, island: "Papua" },
      { name: "Papua Selatan", pop: 0.55, density: 4, island: "Papua" },
      { name: "Papua Barat", pop: 0.57, density: 9, island: "Papua" },
      { name: "Papua Barat Daya", pop: 0.62, density: 16, island: "Papua" },
      { name: "Kepulauan Riau", pop: 2.19, density: 267, island: "Sumatera" },
      { name: "Bengkulu", pop: 2.09, density: 105, island: "Sumatera" },
      { name: "Gorontalo", pop: 1.23, density: 100, island: "Sulawesi" },
      { name: "Sulawesi Barat", pop: 1.49, density: 89, island: "Sulawesi" },
      { name: "Maluku", pop: 1.99, density: 43, island: "Maluku" },
      { name: "Maluku Utara", pop: 1.43, density: 45, island: "Maluku" },
      { name: "Kalimantan Utara", pop: 0.73, density: 10, island: "Kalimantan" },
      { name: "Kepulauan Bangka Belitung", pop: 1.52, density: 93, island: "Sumatera" }
    ],

    sources: [
      { name: "Badan Pusat Statistik (BPS)", what: "Penduduk, PDB, inflasi, pengangguran, kemiskinan, harapan hidup, melek huruf, lama sekolah, IPM, data provinsi", years: "2019–2024", url: "bps.go.id" },
      { name: "World Bank — World Development Indicators", what: "Kematian bayi dan kematian ibu (estimasi model antarnegara)", years: "2020–2024", url: "data.worldbank.org" },
      { name: "Kementerian Kesehatan RI — SSGI", what: "Prevalensi stunting balita; jumlah rumah sakit", years: "2024", url: "kemkes.go.id" },
      { name: "BPJS Kesehatan", what: "Cakupan kepesertaan Jaminan Kesehatan Nasional", years: "2024", url: "bpjs-kesehatan.go.id" },
      { name: "Bank Indonesia", what: "Cadangan devisa", years: "2024", url: "bi.go.id" },
      { name: "Pemprov DKI Jakarta", what: "Upah Minimum Provinsi 2025", years: "2024", url: "jakarta.go.id" }
    ]
  };

  window.NUSA_DATA = DATA;
})();
