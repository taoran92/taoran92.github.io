# Personal Website

A lightweight, responsive personal website built with plain HTML and CSS. No dependencies or build step.

[Live site →](https://taoran92.github.io/)

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000.

## Customize

- Edit `index.html` with your profile, experience, contributions, and contact details. Replace the page metadata and site URL too.
- Adjust `styles.css` for colors and layout. After changing it, update the stylesheet's `?v=` value in `index.html` to avoid stale browser caches.
- Replace `favicon.svg` and the images in `assets/logos/` as needed.
- Publish the repository root with GitHub Pages, keeping `.nojekyll` in place.

Project logos come from the official [Flink](https://flink.apache.org/), [Calcite](https://calcite.apache.org/), and [Paimon](https://paimon.apache.org/) websites and belong to their respective owners.
