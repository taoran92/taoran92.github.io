# Personal Website

A lightweight, responsive personal website built with plain HTML, CSS, and a small visitor counter script. No package dependencies or build step.

[Live site →](https://taoran92.github.io/)

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000.

## Visitor statistics

The footer displays today's and cumulative site visitors (UV) using [Busuanzi's service](https://www.busuanzi.cc/doc.php). `visitors.js` makes one asynchronous request to the API used by the provider's v3.6.9 script; no remote JavaScript, cookies, or local storage are used by this integration.

- Counting only runs on `https://taoran92.github.io`. Local previews and other origins keep the `—` placeholders and send no statistics request. Update the origin and canonical URL in `visitors.js` if the site moves.
- The service controls visitor deduplication and the daily reset (documented as 00:00, without a specified timezone). These are UV counts, not page views or a sum calculated in the browser.
- Cumulative statistics reflect visits recorded by the service; visits before integration cannot be reconstructed. The total includes the current day.
- The provider receives visitors' IP addresses and the canonical homepage URL. Query strings, fragments, and referring URLs are not sent by this integration.
- Failed, blocked, invalid, or slow responses leave `—` in place. Requests time out after eight seconds and do not retry. With JavaScript disabled, the rest of the page works normally.
- When editing `visitors.js`, bump its `?v=` value in `index.html` to avoid stale browser caches.

## Customize

- Edit `index.html` with your profile, experience, contributions, and contact details. Replace the page metadata and site URL too.
- Adjust `styles.css` for colors and layout. After changing it, update the stylesheet's `?v=` value in `index.html` to avoid stale browser caches.
- Replace `favicon.svg` and the images in `assets/logos/` as needed.
- Publish the repository root with GitHub Pages, keeping `.nojekyll` in place.

Project logos come from the official [Flink](https://flink.apache.org/), [Calcite](https://calcite.apache.org/), and [Paimon](https://paimon.apache.org/) websites and belong to their respective owners.
