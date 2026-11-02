# Personal Website

A lightweight, responsive personal website built with plain HTML, CSS, and a small visitor counter script. No package dependencies or build step.

[Live site →](https://taoran92.github.io/)

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000.

## Visitor statistics

The footer displays today's and cumulative site visitors (UV) using [soxft/busuanzi](https://github.com/soxft/busuanzi), hosted at [busuanzi.9420.ltd](https://busuanzi.9420.ltd/). `visitors.js` calls `https://bsz.iirose.cn/api`, the endpoint used by the provider's published `/js` script. No remote JavaScript, cookies, or local storage are used by this integration.

- Counting only runs on `https://taoran92.github.io`. Local previews and other origins display `Unavailable` and send no statistics request. Update the origin and canonical hostname in `visitors.js` if the site moves.
- Each page load sends a POST with the logical date bucket `https://taoran92.github.io/__visitors/YYYY-MM-DD` in `x-bsz-referer`. These are statistics keys, not navigable pages. Dates use `Asia/Shanghai` (UTC+8), regardless of the visitor's timezone; each new day starts a new bucket. The date is derived from the visitor's clock. An already-open page refreshes its counts on the next page load.
- `data.page_uv` is today's unique visitors in that date bucket; `data.site_uv` is cumulative unique visitors for the hostname. Both come from the same server response. The service uses HyperLogLog to estimate unique visitors, so the total is not a sum of daily counts and is not a page-view counter.
- Without a stored identity token, the [service derives visitor identity from IP address and User-Agent](https://github.com/soxft/busuanzi/blob/main/app/middleware/identity.go). Repeat visits from the same IP and browser do not add UV; changing either can count again, and visitors sharing both can be merged. This integration does not store the service's optional identity token.
- The provider receives visitors' IP addresses, User-Agent, and the canonical date bucket. Actual page URLs, query strings, fragments, and referring URLs are not sent by this integration.
- Statistics start with this provider on November 2, 2026. Counts from the former `busuanzi.cc` service were not migrated. The total includes the current day. The public service does not guarantee availability or data retention.
- While requesting statistics, the counters display `Loading…`. Each attempt times out after eight seconds. Network errors (including CORS failures), server errors (HTTP 5xx), and invalid JSON trigger one retry after one second; other HTTP errors and invalid counts do not retry. If no valid counts arrive, both counters display `Unavailable`. No counts are invented or cached. With JavaScript disabled, the counters display `Unavailable` and the rest of the page works normally.
- When editing `visitors.js`, bump its `?v=` value in `index.html` to avoid stale browser caches.

## Customize

- Edit `index.html` with your profile, experience, contributions, and contact details. Replace the page metadata and site URL too.
- Adjust `styles.css` for colors and layout. After changing it, update the stylesheet's `?v=` value in `index.html` to avoid stale browser caches.
- Replace `favicon.svg` and the images in `assets/logos/` as needed.
- Publish the repository root with GitHub Pages, keeping `.nojekyll` in place.

Project logos come from the official [Flink](https://flink.apache.org/), [Calcite](https://calcite.apache.org/), and [Paimon](https://paimon.apache.org/) websites and belong to their respective owners.
