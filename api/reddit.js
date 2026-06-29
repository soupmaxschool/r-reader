export default async function handler(req, res) {
  const sub = req.query.sub;
  const sort = req.query.sort || "new";

  if (!sub) {
    return res.status(400).json({ error: "Missing ?sub=" });
  }

  const mirror = `https://api.pullpush.io/reddit/search/submission/?subreddit=${sub}&size=25`;

  try {
    const response = await fetch(mirror, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await response.json();

    res.status(200).json({ posts: data.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mirror fetch failed" });
  }
}
