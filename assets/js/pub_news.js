
// Home page news: "N papers accepted at CONF YEAR!" lines, counted automatically
// from publications.html. Adding a paper there updates these lines by itself.

// Month of each conference, shown as "MM/YYYY" in the news (newest first).
// A conference missing from this list still shows up, with just the year; add it here to set the month.
var CONF_MONTHS = {
  "EMNLP 2026": "10",
  "COLM 2026": "10",
  "ACL 2026": "07",
  "ACM FAccT 2026": "06",
  "ACM CAIS 2026": "05",
  "ICLR 2026": "04",

  "NeurIPS 2025": "12",
  "EMNLP 2025": "11",
  "COLM 2025": "10",
  "ACL 2025": "07",
  "NAACL 2025": "04",
  "ICLR 2025": "04",

  "NeurIPS 2024": "12",
  "EMNLP 2024": "11",
  "TMLR 2024": "11",
  "COLM 2024": "10",
  "ACL 2024": "08",
  "ICML 2024": "07",
  "NAACL 2024": "06",
  "ICLR 2024": "05",

  "NeurIPS 2023": "12",
  "EMNLP 2023": "12",
  "ACL 2023": "07",
  "American Sociological Review 2023": "06",
  "ICLR 2023": "05",
  "AAAI 2023": "02"
};

// Special mentions (awards, spotlights, ...). Each shows right under its conference's line.
// To add one: copy a line below and change the conference, paper title, link and award text.
var HIGHLIGHTS = [
  { conf: "NAACL 2025", month: "04", html: 'Our paper <a href="https://aclanthology.org/2025.naacl-long.556/" target="_blank">"REL-A.I.: An Interaction-Centered Approach To Measuring Human-LM Reliance"</a> won the <b>Best Paper Runner-Up</b> award at <b>NAACL 2025</b>!' },
  { conf: "EMNLP 2024", month: "11", html: 'Our paper <a href="https://aclanthology.org/2024.emnlp-main.724/" target="_blank">"OATH-Frames: Characterizing Online Attitudes Towards Homelessness with LLM Assistants"</a> won an <b>Outstanding Paper Award</b> at <b>EMNLP 2024</b>!' },
  { conf: "TMLR 2024", month: "11", html: 'Our paper <a href="https://openreview.net/pdf?id=eskQMcIbMS" target="_blank">"From Decoding to Meta-Generation: Inference-time Algorithms for Large Language Models"</a> received a <b>Survey Certification</b> from <b>TMLR</b>!' },
  { conf: "ICML 2024", month: "07", html: 'Our paper <a href="https://openreview.net/forum?id=bzNwexOPWm" target="_blank">"What Will My Model Forget? Forecasting Forgotten Examples in Language Model Refinement"</a> was selected as a <b>spotlight</b> at <b>ICML 2024</b>!' },
  { conf: "ACL 2023", month: "07", html: 'Our paper <a href="https://aclanthology.org/2023.acl-long.304/" target="_blank">"SCOTT: Self-Consistent Chain-of-Thought Distillation"</a> won an <b>Outstanding Paper Award</b> at <b>ACL 2023</b>!' }
];

var NEWS_FROM_YEAR = 2023;

function confName(venue) {
  // fold Findings into the main conference
  return venue.replace(/^Findings of\s+/i, "").replace(/\s+Findings$/i, "").trim();
}

function buildPubNews(html) {
  var doc = new DOMParser().parseFromString(html, "text/html");
  var items = doc.querySelectorAll("#pub_list li");
  var counts = {};

  for (var i = 0; i < items.length; ++i) {
    var meta = items[i].querySelector("meta");
    if (!meta) continue;
    var venue = meta.getAttribute("venue") || "";
    var year = parseInt(meta.getAttribute("year"), 10);
    var confLine = items[i].querySelector(".conf_name");
    var confText = confLine ? confLine.parentNode.textContent : "";
    // skip arXiv preprints and workshops ("Workshop" in the listing, or a venue like "X@ICLR")
    if (!(year >= NEWS_FROM_YEAR) || /^arxiv/i.test(venue) || /workshop/i.test(confText) || venue.indexOf("@") >= 0) continue;

    var key = confName(venue) + " " + year;
    if (!counts[key]) counts[key] = { conf: confName(venue), year: year, n: 0 };
    counts[key].n += 1;
  }

  var news = Object.keys(counts).map(function (key) {
    var c = counts[key];
    c.month = parseInt(CONF_MONTHS[key], 10) || 0;
    return c;
  });
  news.sort(function (a, b) {
    return (b.year - a.year) || (b.month - a.month) || (b.n - a.n);
  });

  var list = document.getElementById("news-list");
  var lines = document.createDocumentFragment();
  news.forEach(function (c) {
    var date = c.month ? (c.month < 10 ? "0" : "") + c.month + "/" + c.year : c.year;
    addNewsLine(lines, date, "<b>" + c.n + (c.n == 1 ? " paper" : " papers") +
      "</b> accepted at <b>" + c.conf + " " + c.year + "</b>!");
    HIGHLIGHTS.forEach(function (h) {
      if (h.conf == c.conf + " " + c.year) addNewsLine(lines, date, h.html);
    });
  });
  list.insertBefore(lines, list.firstChild);
}

function addNewsLine(parent, date, html) {
  var li = document.createElement("li");
  li.innerHTML = "<b>" + date + "</b> - " + html;
  parent.appendChild(li);
}

if (document.getElementById("news-list")) {
  fetch("publications.html", { cache: "no-cache" })
    .then(function (r) { return r.text(); })
    .then(buildPubNews);
}
