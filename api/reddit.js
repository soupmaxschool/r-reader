export default async function handler(req, res) {
  const sub = req.query.sub;
  const sort = req.query.sort || "new";

  if (!sub) {
    return res.status(400).json({ error: "Missing ?sub=" });
  }

  // PullPush search endpoint (works from Vercel)
  const query = `subreddit:${sub}`;
  const url = `https://api.pullpush.io/reddit/search/?q=${encodeURIComponent(query)}&size=25&sort=desc`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Mirror returned bad status" });
    }

    const data = await response.json();
    res.status(200).json({ posts: data.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mirror fetch failed" });
  }
}
