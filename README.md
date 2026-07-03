# frontier.log

A time-series tracker for frontier tech. Chart shows a normalized progress index across four fields; each dot is a curated breakthrough. Anti-doom-scroll by design: no infinite feed, weekly updates only, ends with "you're caught up."

## Files

```
frontier-log/
├── index.html    # the page (structure + styles inline)
├── app.js        # chart + interaction logic
├── data.js       # ← the only file you edit weekly
└── README.md
```

Everything is static. No backend, no build step, no database. The `data.js` file IS your database.

## What's on the page

- **Time-series chart** across all four fields, with 1Y/3Y/All range presets and drag-to-zoom.
- **Signal feed** below the chart: every entry as a reverse-chronological row, grouped by year, with the score and its **delta** from that field's previous entry (green up, red down). This is where the anti-doom-scroll design lives — it's finite and ends in "you're caught up."
- **Search** — filter the feed live by title, description, or field.
- **Field filters** — the chips filter both the chart and the feed together.
- **Deep-link to any signal** — clicking a point or a feed row updates the URL hash (e.g. `#agi-2026-Q1`). "Copy link to this signal" puts a shareable permalink on the clipboard. Great for newsletters and threads.
- **Keyboard nav** — `←` / `→` step through signals chronologically once one is selected.
- **"New" badges** — entries with a recent `added` date show a chip for ten days so returning readers see what changed.

## The research → curation workflow

The whole point is to replace doom-scrolling with a small weekly ritual. The pipeline that feeds `data.js`:

1. **Cast a wide net, once a week.** Pull candidate items per field from a few high-signal sources: arXiv listings (cs.LG, quant-ph, physics.plasm-ph, q-bio.NC), lab/company blogs (DeepMind, IBM Quantum, LLNL, CFS, Neuralink/Synchron), and a couple of trusted aggregators. Don't read the firehose — collect titles + abstracts into one list.
2. **Judge for movement, not noise.** For each candidate ask: does this actually move the field, or is it press-release volume? Only survivors that shift the state of the art (or slip — track those too) become entries. This is the honest-scoring discipline from the section below.
3. **Attach the best explanation, not the first.** For each surviving signal, find the *highest-value* explainer — a clear author thread, a Yannic/Two Minute Papers-style breakdown, a well-written blog post — and add it as a typed link. The paper is the primary source; the explainer is what makes it readable. One or two links max; quality over completeness.
4. **Score and write.** Set the 0–100 index (see scoring philosophy), write one or two honest sentences, set `added` to today's date, and commit. The delta and "new" badge render themselves.
5. **Ship Fridays, then stop.** Batch the week's entries into one push. The "you're caught up" line is the reward — the reader is done, not pulled into the next thing.

If you later want to automate step 1–3, that's the productization path noted under *Extending later*: arXiv + Semantic Scholar + an LLM judge that drafts entry JSON for you to approve. Keep a human on the "does this actually matter" call.


## How to add a new entry (2 minutes)

1. Open `data.js` in any editor.
2. Add an object to the `events` array. The fields:

   ```js
   {
     field: "agi",              // one of: agi | quantum | fusion | bci
     date: "2026-Q3",           // year-quarter format
     score: 96,                 // 0–100 progress index (see scoring notes below)
     added: "2026-07-03",       // optional ISO date; shows a "new" chip for 10 days
     title: "Short headline",
     desc: "One or two sentences on what happened and why it matters.",
     links: [
       { type: "paper", label: "arXiv",       url: "https://arxiv.org/abs/..." },
       { type: "video", label: "Yannic video", url: "https://youtu.be/..." },
       { type: "post",  label: "Author thread", url: "https://..." },
       { type: "code",  label: "GitHub",        url: "https://github.com/..." }
     ]
   }
   ```

   `type` is optional and only sets the link icon (`paper ¶`, `video ▶`, `post ✎`, `code ⌘`). `added` is optional — set it when you ship an entry and it earns a "new" badge in the feed for ten days.

3. Save. Push to your git repo. The site is live in under a minute.

That's it. No CMS, no admin panel — the file is the CMS.

## How to add a new field

In `data.js`, add to `fields`:

```js
longevity: { label: "Longevity", short: "LNG", color: "#4a3aa7", text: "#3C3489" }
```

Then use `field: "longevity"` on your event entries. The filter chip appears automatically.

## Deploy (free, ~5 minutes)

### Option A — Cloudflare Pages

1. Push this folder to a GitHub repo (e.g. `frontier-log`).
2. Go to Cloudflare Pages → Create Project → Connect Git.
3. Build command: leave blank. Output directory: `/` (or blank).
4. Deploy. You get `frontier-log.pages.dev` for free, custom domain available.
5. Every git push auto-deploys.

### Option B — GitHub Pages

1. Push to a GitHub repo.
2. Settings → Pages → Deploy from branch → main → root.
3. Site lives at `<username>.github.io/<repo>`.

### Option C — Netlify Drop

1. Drag the folder to netlify.com/drop. Site is live instantly (no git needed).
2. Update by dragging again, or connect a repo later.

## Scoring philosophy

The progress index is a normalized 0–100 per field. It's your subjective read, not a computed metric — but keep it honest:

- Only bump the score when something genuinely moves the field, not on press-release volume.
- Allow scores to go **down** when things slip or are retracted (see SPARC entry as an example).
- Rough calibration: 0 = pre-modern-era baseline, 100 = the field is largely solved. Most active fields will sit 40–90.
- Recent = smaller relative jumps. Rate of change is what readers care about; don't inflate late-stage scores.

Optional: keep a `NOTES.md` where you jot rationale for each score change. Useful if you ever want to defend a call.

## Update cadence

Ship one batch on Fridays. The site's whole design (rev number in footer, "last update" in masthead, weekly framing in the lede) assumes this. If you slip to bi-weekly, update the copy. Don't post daily — that's the doom-scroll pattern you're avoiding.

## Extending later

Fastest wins if you want to grow this:

- **Newsletter**: pipe the week's new entries into a Substack/Buttondown email. `data.js` sorted by date → template → send.
- **RSS**: generate an `rss.xml` from the same data at build time (a 20-line script).
- **Per-event pages**: run through a static generator (11ty, Astro) to give each entry a permalink. Only worth it once you cross ~100 entries.
- **Auto-ingestion**: the workflow from earlier — arXiv + Semantic Scholar + LLM judge → writes markdown/JSON entries. That's the productization path.

For now: one HTML file, one JS data file, weekly commits. Ship it.
