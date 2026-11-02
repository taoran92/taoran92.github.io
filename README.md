# Personal Website

A lightweight, responsive personal website built with plain HTML, CSS, and a small page view counter script. No package dependencies or build step.

[Live site →](https://taoran92.github.io/)

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000.

## Page view statistics

The footer displays today's and cumulative page views (PV) using [soxft/busuanzi](https://github.com/soxft/busuanzi), hosted at [busuanzi.9420.ltd](https://busuanzi.9420.ltd/). `visitors.js` calls `https://bsz.iirose.cn/api`, the endpoint used by the provider's published `/js` script. No remote JavaScript, cookies, or local storage are used by this integration.

- Counting only runs on `https://taoran92.github.io`. Local previews and other origins display `Unavailable` and send no statistics request. Update the origin and canonical hostname in `visitors.js` if the site moves.
- Each page load sends a POST with the logical date bucket `https://taoran92.github.io/__visitors/YYYY-MM-DD` in `x-bsz-referer`. These are statistics keys, not navigable pages. Dates use `Asia/Shanghai` (UTC+8), regardless of the visitor's timezone; each new day starts a new bucket. The date is derived from the visitor's clock. An already-open page refreshes its counts on the next page load.
- `data.page_pv` is today's page views in that date bucket; `data.site_pv` is cumulative page views for the hostname. Both come from the same server response. Each successful counting request adds one to both values. Reloads and repeat visits count again, with no IP, device, or visitor deduplication.
- The provider receives visitors' IP addresses, User-Agent, and the canonical date bucket. Actual page URLs, query strings, fragments, and referring URLs are not sent by this integration.
- Statistics start with this provider on November 2, 2026. Existing PV counts recorded while the footer displayed UV are retained. Counts from the former `busuanzi.cc` service were not migrated. The total includes the current day. The public service does not guarantee availability or data retention.
- While requesting statistics, the counters display `Loading…`. Each attempt times out after eight seconds. Network errors (including CORS failures), server errors (HTTP 5xx), and invalid JSON trigger one read-only GET retry after one second; other HTTP errors and invalid counts do not retry. The counting POST is never retried because the first request may already have been recorded. If that POST never reaches the service, the visit is not recorded. If no valid counts arrive, both counters display `Unavailable`. No counts are invented or cached. With JavaScript disabled, the counters display `Unavailable` and the rest of the page works normally.
- When editing `visitors.js`, bump its `?v=` value in `index.html` to avoid stale browser caches.

## Customize

- Edit `index.html` with your profile, experience, contributions, and contact details. Replace the page metadata and site URL too.
- Adjust `styles.css` for colors and layout. After changing it, update the stylesheet's `?v=` value in `index.html` to avoid stale browser caches.
- Replace `favicon.svg` and the images in `assets/logos/` as needed.
- Publish the repository root with GitHub Pages, keeping `.nojekyll` in place.

Project logos come from the official [Flink](https://flink.apache.org/), [Calcite](https://calcite.apache.org/), and [Paimon](https://paimon.apache.org/) websites and belong to their respective owners.
