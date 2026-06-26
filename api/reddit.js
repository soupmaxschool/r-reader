export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing ?url=" });
  }

  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Dest": "document"
      },
      redirect: "follow"
    });

    const text = await response.text();

    // If Reddit returned HTML, not JSON
    if (text.trim().startsWith("<")) {
      return res.status(403).json({
        error: "Reddit blocked JSON access for this subreddit."
      });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy fetch failed" });
  }
}
