/* Renders the two lists from assets/content.js. No dependencies. */

(function () {
  "use strict";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* "2026-08-14" -> a local Date, so the day never shifts by timezone. */
  function parseDate(iso) {
    var p = String(iso).split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function longDate(iso) {
    var d = parseDate(iso);
    return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Each row gets one of the six accents, cycling down the page. */
  function accent(i) { return "--accent: var(--a" + ((i % 6) + 1) + ")"; }

  function today() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function fillHeader() {
    var site = window.SITE || {};
    document.querySelectorAll("[data-site-name]").forEach(function (el) {
      el.textContent = site.name || "";
    });
    document.querySelectorAll("[data-site-footer]").forEach(function (el) {
      el.textContent = site.footer || "";
    });
    document.querySelectorAll("[data-site-contact]").forEach(function (el) {
      if (!site.contact) { el.remove(); return; }
      el.href = site.contact;
      el.textContent = site.contactLabel || "Contact";
    });
    document.querySelectorAll("[data-site-tagline]").forEach(function (el) {
      el.textContent = site.tagline || "";
    });
  }

  function renderPapers(mount) {
    var papers = (window.PAPERS || []).slice().sort(function (a, b) {
      return parseDate(b.date) - parseDate(a.date);
    });

    if (!papers.length) {
      mount.innerHTML = '<p class="empty">The first paper is on its way.</p>';
      return;
    }

    mount.innerHTML = papers.map(function (p, i) {
      return '' +
        '<a class="entry" href="' + esc(p.href) + '" style="' + accent(i) + '">' +
          '<h2>' + esc(p.title) + '</h2>' +
          (p.summary ? '<p>' + esc(p.summary) + '</p>' : '') +
          '<span class="meta">' +
            '<span class="dot"></span>' +
            '<span>' + esc(longDate(p.date)) + '</span>' +
            (p.read ? '<span class="sep">/</span><span>' + esc(p.read) + '</span>' : '') +
          '</span>' +
        '</a>';
    }).join("");
  }

  function renderWebinars(mount) {
    var now = today();
    var all = (window.WEBINARS || []).slice();

    var upcoming = all.filter(function (w) { return parseDate(w.date) >= now; })
                      .sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    var past = all.filter(function (w) { return parseDate(w.date) < now; })
                  .sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });

    var rows = upcoming.concat(past);

    if (!rows.length) {
      mount.innerHTML = '<p class="empty">No sessions scheduled right now.</p>';
      return;
    }

    mount.innerHTML = rows.map(function (w, i) {
      var d = parseDate(w.date);
      var isPast = d < now;
      var detail = [w.time, w.where].filter(Boolean).join(" · ");

      return '' +
        '<article class="entry webinar" style="' + accent(i) + '">' +
          '<div class="when">' +
            '<span class="m">' + MONTHS[d.getMonth()] + '</span>' +
            '<span class="d">' + d.getDate() + '</span>' +
          '</div>' +
          '<div>' +
            '<h2>' + esc(w.title) + '</h2>' +
            (w.summary ? '<p>' + esc(w.summary) + '</p>' : '') +
            '<span class="meta">' +
              '<span class="chip' + (isPast ? ' past' : '') + '">' +
                (isPast ? "Past" : "Upcoming") +
              '</span>' +
              (detail ? '<span>' + esc(detail) + '</span>' : '') +
            '</span>' +
            (w.link
              ? '<a class="go" href="' + esc(w.link) + '" target="_blank" rel="noopener">' +
                  esc(w.linkLabel || (isPast ? "Watch the recording" : "Register")) +
                '</a>'
              : '') +
          '</div>' +
        '</article>';
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillHeader();
    var papers = document.getElementById("papers");
    if (papers) renderPapers(papers);
    var webinars = document.getElementById("webinars");
    if (webinars) renderWebinars(webinars);
  });
})();
