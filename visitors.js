// API and UV fields used by https://www.busuanzi.cc/doc.php (script v3.6.9).
(async () => {
  // Keep local previews and forks out of the production statistics.
  if (window.location.origin !== "https://taoran92.github.io") return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("https://cdn.busuanzi.cc/api.php", {
      method: "POST",
      // Only the canonical homepage is needed; omit query strings and referrers.
      body: JSON.stringify({ url: "https://taoran92.github.io/", referrer: "" }),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });
    if (!response.ok) return;

    const data = await response.json();
    const counts = [data?.busuanzi_today_uv, data?.busuanzi_site_uv];
    if (!counts.every(value => Number.isSafeInteger(value) && value >= 0)) return;

    ["visitors-today", "visitors-total"].forEach((id, index) => {
      const element = document.getElementById(id);
      element.textContent = counts[index].toLocaleString("en-US");
      element.removeAttribute("title");
    });
  } catch {
    // Leave the neutral placeholders in place when statistics are unavailable.
  } finally {
    clearTimeout(timeout);
  }
})();
