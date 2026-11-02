// API: https://github.com/soxft/busuanzi/wiki/API
// Endpoint used by the provider's https://busuanzi.9420.ltd/js script.
(async () => {
  // Keep local previews and forks out of the production statistics.
  if (window.location.origin !== "https://taoran92.github.io") return;

  const elements = ["visitors-today", "visitors-total"].map(id => document.getElementById(id));
  elements.forEach(element => {
    element.textContent = "Loading…";
    element.title = "Loading page view statistics";
  });

  // One virtual page per Shanghai calendar day separates daily page views.
  // The same request also returns cumulative page views for the site hostname.
  const dayFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await new Promise(resolve => setTimeout(resolve, 1000));
    // Each attempt needs its own signal: an aborted controller cannot be reused.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const dayParts = Object.fromEntries(dayFormatter.formatToParts(new Date()).map(part => [part.type, part.value]));
      const day = `${dayParts.year}-${dayParts.month}-${dayParts.day}`;
      const response = await fetch("https://bsz.iirose.cn/api", {
        // POST counts this page load; retry with GET to avoid counting it twice.
        method: attempt === 0 ? "POST" : "GET",
        // Only a canonical date bucket is sent; omit actual URLs and referrers.
        headers: { "x-bsz-referer": `https://taoran92.github.io/__visitors/${day}` },
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });
      if (!response.ok) {
        if (response.status >= 500) continue;
        break;
      }

      const data = await response.json();
      if (data?.success !== true) break;
      const counts = [data.data?.page_pv, data.data?.site_pv];
      if (!counts.every(value => Number.isSafeInteger(value) && value >= 0)) break;

      elements.forEach((element, index) => {
        element.textContent = counts[index].toLocaleString("en-US");
        element.title = index === 0
          ? "Page views today (Asia/Shanghai); repeat visits count"
          : "Page views since November 2, 2026; repeat visits count";
      });
      return;
    } catch {
      // Read once more after a failure; never repeat the counting request.
    } finally {
      clearTimeout(timeout);
    }
  }

  elements.forEach(element => {
    element.textContent = "Unavailable";
    element.title = "Page view statistics are temporarily unavailable";
  });
})();
