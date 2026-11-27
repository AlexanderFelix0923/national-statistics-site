"use strict";
/*
 * Atlas in Numbers — country dataset.
 * Figures are rounded public statistics for ~2024, of the kind published by the
 * World Bank, the UN Population Division and the IMF. They are rounded on
 * purpose (population to 0.1M, GDP to the nearest billion) and the site says so
 * on its About panel: this is an explorer for orientation, not an official
 * statistical release.
 *
 * Fields per country:
 *   code, name, capital, region
 *   popM      population, millions
 *   gdpBn     GDP, billions of USD
 *   gdpPc     GDP per capita, USD
 *   lifeExp   life expectancy at birth, years
 *   medianAge median age, years
 *   urbanPct  urban population, %
 *   areaKm2   land area, km2
 *   unempPct  unemployment, % of labour force
 *   literacy  adult literacy, %
 *   internet  internet users, % of population
 *   co2Pc     CO2 emissions per capita, tonnes
 *   popHist   population in millions in [1990, 2000, 2010, 2020, 2024]
 */
const COUNTRIES = [
  { code: "CHN", name: "China", capital: "Beijing", region: "Asia", popM: 1408.0, gdpBn: 18532, gdpPc: 13160, lifeExp: 78.0, medianAge: 39.0, urbanPct: 66, areaKm2: 9388211, unempPct: 5.1, literacy: 97, internet: 78, co2Pc: 8.0, popHist: [1135, 1267, 1340, 1411, 1408] },
  { code: "IND", name: "India", capital: "New Delhi", region: "Asia", popM: 1451.0, gdpBn: 3913, gdpPc: 2697, lifeExp: 70.8, medianAge: 28.4, urbanPct: 37, areaKm2: 2973190, unempPct: 4.2, literacy: 78, internet: 55, co2Pc: 2.0, popHist: [873, 1058, 1234, 1396, 1451] },
  { code: "USA", name: "United States", capital: "Washington, D.C.", region: "North America", popM: 340.1, gdpBn: 29168, gdpPc: 85810, lifeExp: 78.5, medianAge: 38.5, urbanPct: 83, areaKm2: 9147593, unempPct: 4.2, literacy: 99, internet: 93, co2Pc: 13.8, popHist: [250, 282, 310, 332, 340] },
  { code: "IDN", name: "Indonesia", capital: "Jakarta", region: "Asia", popM: 283.5, gdpBn: 1396, gdpPc: 4925, lifeExp: 71.1, medianAge: 30.1, urbanPct: 59, areaKm2: 1811570, unempPct: 5.3, literacy: 96, internet: 69, co2Pc: 2.3, popHist: [182, 212, 242, 274, 284] },
  { code: "PAK", name: "Pakistan", capital: "Islamabad", region: "Asia", popM: 251.3, gdpBn: 375, gdpPc: 1492, lifeExp: 67.4, medianAge: 20.8, urbanPct: 38, areaKm2: 770880, unempPct: 5.5, literacy: 62, internet: 33, co2Pc: 1.0, popHist: [108, 142, 179, 220, 251] },
  { code: "NGA", name: "Nigeria", capital: "Abuja", region: "Africa", popM: 232.7, gdpBn: 375, gdpPc: 1611, lifeExp: 54.6, medianAge: 18.1, urbanPct: 54, areaKm2: 910768, unempPct: 5.3, literacy: 62, internet: 39, co2Pc: 0.6, popHist: [95, 122, 160, 206, 233] },
  { code: "BRA", name: "Brazil", capital: "Brasília", region: "South America", popM: 216.4, gdpBn: 2171, gdpPc: 10032, lifeExp: 75.4, medianAge: 34.0, urbanPct: 88, areaKm2: 8358140, unempPct: 6.8, literacy: 94, internet: 84, co2Pc: 2.2, popHist: [150, 175, 196, 214, 216] },
  { code: "BGD", name: "Bangladesh", capital: "Dhaka", region: "Asia", popM: 173.6, gdpBn: 451, gdpPc: 2598, lifeExp: 74.7, medianAge: 27.6, urbanPct: 42, areaKm2: 130170, unempPct: 4.7, literacy: 76, internet: 45, co2Pc: 0.7, popHist: [106, 128, 148, 166, 174] },
  { code: "RUS", name: "Russia", capital: "Moscow", region: "Europe", popM: 144.8, gdpBn: 2021, gdpPc: 13957, lifeExp: 70.5, medianAge: 40.3, urbanPct: 75, areaKm2: 16376870, unempPct: 2.6, literacy: 100, internet: 90, co2Pc: 11.4, popHist: [148, 146, 143, 144, 145] },
  { code: "MEX", name: "Mexico", capital: "Mexico City", region: "North America", popM: 129.7, gdpBn: 1848, gdpPc: 14248, lifeExp: 75.1, medianAge: 29.6, urbanPct: 82, areaKm2: 1943950, unempPct: 2.8, literacy: 95, internet: 81, co2Pc: 3.4, popHist: [86, 99, 114, 127, 130] },
  { code: "JPN", name: "Japan", capital: "Tokyo", region: "Asia", popM: 123.8, gdpBn: 4026, gdpPc: 32515, lifeExp: 84.0, medianAge: 49.1, urbanPct: 92, areaKm2: 364555, unempPct: 2.6, literacy: 99, internet: 93, co2Pc: 8.0, popHist: [124, 127, 128, 126, 124] },
  { code: "ETH", name: "Ethiopia", capital: "Addis Ababa", region: "Africa", popM: 126.5, gdpBn: 129, gdpPc: 1020, lifeExp: 67.0, medianAge: 19.5, urbanPct: 23, areaKm2: 1000000, unempPct: 3.4, literacy: 52, internet: 19, co2Pc: 0.2, popHist: [48, 66, 88, 115, 127] },
  { code: "PHL", name: "Philippines", capital: "Manila", region: "Asia", popM: 114.9, gdpBn: 462, gdpPc: 4021, lifeExp: 72.2, medianAge: 25.3, urbanPct: 48, areaKm2: 298170, unempPct: 4.3, literacy: 96, internet: 73, co2Pc: 1.3, popHist: [62, 78, 94, 109, 115] },
  { code: "EGY", name: "Egypt", capital: "Cairo", region: "Africa", popM: 114.5, gdpBn: 380, gdpPc: 3318, lifeExp: 70.2, medianAge: 24.0, urbanPct: 43, areaKm2: 995450, unempPct: 7.2, literacy: 74, internet: 72, co2Pc: 2.2, popHist: [56, 68, 82, 102, 115] },
  { code: "VNM", name: "Vietnam", capital: "Hanoi", region: "Asia", popM: 100.3, gdpBn: 476, gdpPc: 4746, lifeExp: 74.6, medianAge: 32.5, urbanPct: 40, areaKm2: 310070, unempPct: 2.3, literacy: 96, internet: 79, co2Pc: 3.9, popHist: [68, 79, 88, 97, 100] },
  { code: "TUR", name: "Türkiye", capital: "Ankara", region: "Asia", popM: 85.5, gdpBn: 1323, gdpPc: 15474, lifeExp: 76.5, medianAge: 33.0, urbanPct: 77, areaKm2: 769630, unempPct: 8.7, literacy: 97, internet: 87, co2Pc: 5.0, popHist: [54, 63, 73, 84, 86] },
  { code: "IRN", name: "Iran", capital: "Tehran", region: "Asia", popM: 90.6, gdpBn: 437, gdpPc: 4824, lifeExp: 76.8, medianAge: 32.8, urbanPct: 77, areaKm2: 1628550, unempPct: 9.2, literacy: 89, internet: 79, co2Pc: 7.1, popHist: [56, 66, 75, 85, 91] },
  { code: "DEU", name: "Germany", capital: "Berlin", region: "Europe", popM: 84.5, gdpBn: 4659, gdpPc: 55131, lifeExp: 81.2, medianAge: 44.9, urbanPct: 78, areaKm2: 349360, unempPct: 3.4, literacy: 99, internet: 92, co2Pc: 7.1, popHist: [79, 82, 82, 83, 85] },
  { code: "THA", name: "Thailand", capital: "Bangkok", region: "Asia", popM: 71.7, gdpBn: 529, gdpPc: 7379, lifeExp: 76.4, medianAge: 40.2, urbanPct: 54, areaKm2: 510890, unempPct: 1.0, literacy: 94, internet: 89, co2Pc: 3.7, popHist: [55, 62, 67, 70, 72] },
  { code: "GBR", name: "United Kingdom", capital: "London", region: "Europe", popM: 68.3, gdpBn: 3588, gdpPc: 52536, lifeExp: 80.7, medianAge: 40.8, urbanPct: 84, areaKm2: 241930, unempPct: 4.3, literacy: 99, internet: 95, co2Pc: 4.8, popHist: [57, 59, 63, 67, 68] },
  { code: "FRA", name: "France", capital: "Paris", region: "Europe", popM: 66.5, gdpBn: 3052, gdpPc: 45890, lifeExp: 82.2, medianAge: 42.3, urbanPct: 82, areaKm2: 547557, unempPct: 7.4, literacy: 99, internet: 86, co2Pc: 4.2, popHist: [58, 61, 63, 65, 67] },
  { code: "ITA", name: "Italy", capital: "Rome", region: "Europe", popM: 58.9, gdpBn: 2316, gdpPc: 39319, lifeExp: 82.9, medianAge: 47.7, urbanPct: 72, areaKm2: 294140, unempPct: 6.5, literacy: 99, internet: 87, co2Pc: 5.4, popHist: [57, 57, 59, 60, 59] },
  { code: "ZAF", name: "South Africa", capital: "Pretoria", region: "Africa", popM: 63.0, gdpBn: 400, gdpPc: 6349, lifeExp: 66.1, medianAge: 28.0, urbanPct: 69, areaKm2: 1213090, unempPct: 32.1, literacy: 95, internet: 75, co2Pc: 7.3, popHist: [37, 45, 51, 59, 63] },
  { code: "KOR", name: "South Korea", capital: "Seoul", region: "Asia", popM: 51.7, gdpBn: 1713, gdpPc: 33134, lifeExp: 82.7, medianAge: 45.1, urbanPct: 81, areaKm2: 97520, unempPct: 2.7, literacy: 99, internet: 97, co2Pc: 11.4, popHist: [43, 47, 49, 52, 52] },
  { code: "COL", name: "Colombia", capital: "Bogotá", region: "South America", popM: 52.3, gdpBn: 419, gdpPc: 8012, lifeExp: 77.7, medianAge: 32.0, urbanPct: 82, areaKm2: 1109500, unempPct: 9.8, literacy: 96, internet: 73, co2Pc: 1.6, popHist: [33, 39, 45, 51, 52] },
  { code: "ESP", name: "Spain", capital: "Madrid", region: "Europe", popM: 48.3, gdpBn: 1723, gdpPc: 35674, lifeExp: 83.2, medianAge: 45.3, urbanPct: 81, areaKm2: 498800, unempPct: 11.4, literacy: 99, internet: 94, co2Pc: 4.6, popHist: [39, 40, 46, 47, 48] },
  { code: "ARG", name: "Argentina", capital: "Buenos Aires", region: "South America", popM: 46.2, gdpBn: 633, gdpPc: 13701, lifeExp: 77.4, medianAge: 32.4, urbanPct: 92, areaKm2: 2736690, unempPct: 7.6, literacy: 99, internet: 89, co2Pc: 3.9, popHist: [33, 37, 41, 45, 46] },
  { code: "KEN", name: "Kenya", capital: "Nairobi", region: "Africa", popM: 55.3, gdpBn: 108, gdpPc: 1953, lifeExp: 62.0, medianAge: 20.1, urbanPct: 29, areaKm2: 569140, unempPct: 4.9, literacy: 82, internet: 41, co2Pc: 0.3, popHist: [24, 31, 41, 53, 55] },
  { code: "POL", name: "Poland", capital: "Warsaw", region: "Europe", popM: 38.1, gdpBn: 915, gdpPc: 24013, lifeExp: 77.3, medianAge: 42.5, urbanPct: 61, areaKm2: 306230, unempPct: 3.0, literacy: 100, internet: 87, co2Pc: 7.4, popHist: [38, 38, 38, 38, 38] },
  { code: "CAN", name: "Canada", capital: "Ottawa", region: "North America", popM: 41.3, gdpBn: 2241, gdpPc: 54264, lifeExp: 82.6, medianAge: 41.1, urbanPct: 82, areaKm2: 9093510, unempPct: 6.5, literacy: 99, internet: 94, co2Pc: 14.3, popHist: [28, 31, 34, 38, 41] },
  { code: "SAU", name: "Saudi Arabia", capital: "Riyadh", region: "Asia", popM: 33.7, gdpBn: 1065, gdpPc: 31601, lifeExp: 77.6, medianAge: 30.6, urbanPct: 85, areaKm2: 2149690, unempPct: 5.1, literacy: 98, internet: 99, co2Pc: 16.6, popHist: [16, 21, 28, 35, 34] },
  { code: "AUS", name: "Australia", capital: "Canberra", region: "Oceania", popM: 27.2, gdpBn: 1752, gdpPc: 64407, lifeExp: 83.3, medianAge: 37.9, urbanPct: 86, areaKm2: 7682300, unempPct: 4.1, literacy: 99, internet: 96, co2Pc: 14.8, popHist: [17, 19, 22, 26, 27] },
  { code: "NLD", name: "Netherlands", capital: "Amsterdam", region: "Europe", popM: 17.8, gdpBn: 1215, gdpPc: 68258, lifeExp: 81.9, medianAge: 42.7, urbanPct: 93, areaKm2: 33720, unempPct: 3.7, literacy: 99, internet: 97, co2Pc: 7.9, popHist: [15, 16, 17, 17, 18] },
  { code: "CHE", name: "Switzerland", capital: "Bern", region: "Europe", popM: 8.9, gdpBn: 937, gdpPc: 105289, lifeExp: 83.9, medianAge: 43.1, urbanPct: 74, areaKm2: 39516, unempPct: 2.9, literacy: 99, internet: 97, co2Pc: 4.0, popHist: [7, 7, 8, 9, 9] },
  { code: "SWE", name: "Sweden", capital: "Stockholm", region: "Europe", popM: 10.6, gdpBn: 610, gdpPc: 57547, lifeExp: 83.1, medianAge: 41.1, urbanPct: 88, areaKm2: 407310, unempPct: 7.6, literacy: 99, internet: 96, co2Pc: 3.4, popHist: [9, 9, 9, 10, 11] },
  { code: "NOR", name: "Norway", capital: "Oslo", region: "Europe", popM: 5.6, gdpBn: 580, gdpPc: 103571, lifeExp: 83.2, medianAge: 40.1, urbanPct: 84, areaKm2: 304282, unempPct: 4.0, literacy: 100, internet: 99, co2Pc: 7.0, popHist: [4, 4, 5, 5, 6] },
  { code: "SGP", name: "Singapore", capital: "Singapore", region: "Asia", popM: 6.0, gdpBn: 531, gdpPc: 88501, lifeExp: 83.0, medianAge: 42.8, urbanPct: 100, areaKm2: 728, unempPct: 1.9, literacy: 97, internet: 96, co2Pc: 9.4, popHist: [3, 4, 5, 6, 6] },
  { code: "NZL", name: "New Zealand", capital: "Wellington", region: "Oceania", popM: 5.3, gdpBn: 260, gdpPc: 49057, lifeExp: 83.0, medianAge: 37.5, urbanPct: 87, areaKm2: 263310, unempPct: 5.1, literacy: 99, internet: 96, co2Pc: 6.4, popHist: [3, 4, 4, 5, 5] },
  { code: "MAR", name: "Morocco", capital: "Rabat", region: "Africa", popM: 37.8, gdpBn: 141, gdpPc: 3730, lifeExp: 75.7, medianAge: 29.8, urbanPct: 65, areaKm2: 446300, unempPct: 13.3, literacy: 77, internet: 90, co2Pc: 1.9, popHist: [25, 29, 32, 37, 38] },
  { code: "UKR", name: "Ukraine", capital: "Kyiv", region: "Europe", popM: 37.9, gdpBn: 179, gdpPc: 4723, lifeExp: 71.6, medianAge: 43.1, urbanPct: 70, areaKm2: 579320, unempPct: 9.5, literacy: 100, internet: 79, co2Pc: 3.9, popHist: [52, 49, 46, 44, 38] }
];

const HIST_YEARS = [1990, 2000, 2010, 2020, 2024];

const REGIONS = ["Asia", "Europe", "Africa", "North America", "South America", "Oceania"];

/* Metrics the site can sort, rank and compare by. get() returns a number. */
const METRICS = [
  { id: "popM", label: "Population", unit: "people", get: (c) => c.popM * 1e6, fmt: "pop" },
  { id: "gdpBn", label: "GDP", unit: "USD", get: (c) => c.gdpBn * 1e9, fmt: "money" },
  { id: "gdpPc", label: "GDP per capita", unit: "USD", get: (c) => c.gdpPc, fmt: "money0" },
  { id: "lifeExp", label: "Life expectancy", unit: "years", get: (c) => c.lifeExp, fmt: "years" },
  { id: "density", label: "Population density", unit: "people / km²", get: (c) => (c.popM * 1e6) / c.areaKm2, fmt: "density" },
  { id: "areaKm2", label: "Land area", unit: "km²", get: (c) => c.areaKm2, fmt: "area" },
  { id: "medianAge", label: "Median age", unit: "years", get: (c) => c.medianAge, fmt: "years" },
  { id: "urbanPct", label: "Urban population", unit: "%", get: (c) => c.urbanPct, fmt: "pct" },
  { id: "internet", label: "Internet users", unit: "%", get: (c) => c.internet, fmt: "pct" },
  { id: "unempPct", label: "Unemployment", unit: "%", get: (c) => c.unempPct, fmt: "pct", lowIsGood: true },
  { id: "literacy", label: "Adult literacy", unit: "%", get: (c) => c.literacy, fmt: "pct" },
  { id: "co2Pc", label: "CO₂ per capita", unit: "tonnes", get: (c) => c.co2Pc, fmt: "co2", lowIsGood: true }
];
