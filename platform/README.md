# Reflections

A two-page site: reflection papers, and webinars. Plain HTML, CSS and one small
script — no build step, no dependencies, no framework. Open `index.html` in a
browser and it works.

```
index.html            the paper list (home)
webinars.html         the webinar list
papers/               one file per paper
  _template.html      copy this to start a new paper
assets/
  content.js          <- the only file you normally edit
  style.css           the whole design (colours, type, layout)
  site.js             renders the two lists
```

## Publish a new paper

1. Copy `papers/_template.html` to `papers/your-title.html`.
2. Change the `<title>`, the `<h1>`, the date, the reading time, and the text
   inside `<div class="prose">`. The accent colour is the `--accent` on the
   `<article>` tag — pick any of `--a1` … `--a6`.
3. Add one entry at the top of the `PAPERS` list in `assets/content.js`:

```js
{
  title: "Your title",
  href: "papers/your-title.html",
  date: "2026-09-04",
  read: "5 min read",
  summary: "One sentence that makes someone want to open it."
}
```

The list sorts itself by date, newest first.

## Add a webinar

Add one entry to `WEBINARS` in `assets/content.js`:

```js
{
  title: "Session title",
  date: "2026-12-02",
  time: "18:00 - 19:00 CET",
  where: "Zoom",
  summary: "One sentence about the session.",
  link: "https://your-registration-link",
  linkLabel: "Register"
}
```

Upcoming and past are worked out from the date, so you never move an entry —
once the date passes, it drops below the upcoming ones and its label changes to
"Past". Swap the `link` for a recording URL afterwards.

## Change the wording and colours

- Site name, tagline, footer line and the contact link: the `SITE` object at the
  top of `assets/content.js`.
- The headline on each page (`Thinking out loud…`, `Live sessions…`): edit the
  `<h1>` in `index.html` / `webinars.html`. The words inside `<em>` get the
  gradient.
- Every colour is a variable at the top of `assets/style.css`. `--a1` … `--a6`
  are the six accents that cycle down the lists; the three `--wash-*` values are
  the soft gradient behind the header. Dark mode has its own block below and
  follows the reader's system setting.

## Run it locally

```bash
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Put it online

Every file is static, so any of these work with no configuration: drag the
folder onto [Netlify Drop](https://app.netlify.com/drop), push it to a GitHub
repo and turn on GitHub Pages, or upload it to any web host. `index.html` is the
home page.

The two fonts (Instrument Serif, Inter) load from Google Fonts. Without a
connection the site falls back to Georgia and the system sans, and still looks
fine.
