export default async function handler(req, res) {
  const sub = req.query.sub;
  const sort = req.query.sort || "new";

  if (!sub) {
    return res.status(400).json({ error: "Missing ?sub=" });
  }

  // PullPush mirror (Pushshift-like)
  // sort is handled via 'sort' param: "desc" by default on created_utc
  const mirrorUrl = `https://api.pullpush.io/reddit/search/submission/?subreddit=${encodeURIComponent(
    sub
  )}&size=25&sort=desc`;

  try {
    const response = await fetch(mirrorUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Mirror returned bad status" });
    }

    const data = await response.json();
    const posts = data.data || [];

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mirror fetch failed" });
  }
}
