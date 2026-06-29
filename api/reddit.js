export default async function handler(req, res) {
  const sub = req.query.sub;
  const sort = req.query.sort || "new";

  if (!sub) {
    return res.status(400).json({ error: "Missing ?sub=" });
  }

  const mirror = `https://reddit.localhost.direct/r/${encodeURIComponent(sub)}/${encodeURIComponent(sort)}.json`;

  try {
    const response = await fetch(mirror, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Mirror returned bad status" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mirror fetch failed" });
  }
}
