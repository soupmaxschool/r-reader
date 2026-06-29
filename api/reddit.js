export default async function handler(req, res) {
  const sub = req.query.sub;
  const sort = req.query.sort || "hot";

  if (!sub) {
    return res.status(400).json({ error: "Missing ?sub=" });
  }

  const target = `https://www.reddit.com/r/${sub}/${sort}/`;

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    const html = await response.text();

    const posts = [];
    const parts = html.split('data-testid="post-container"');

    for (let i = 1; i < parts.length; i++) {
      const chunk = parts[i];

      const titleMatch = chunk.match(/<h3[^>]*>([^<]+)<\/h3>/);
      const authorMatch = chunk.match(/data-testid="post_author_link"[^>]*>([^<]+)<\/a>/);
      const scoreMatch = chunk.match(/data-click-id="score"[^>]*>([^<]+)<\/div>/);
      const commentsMatch = chunk.match(/(\d+)\s+comments/);
      const linkMatch = chunk.match(/data-click-id="body"[^>]*href="([^"]+)"/);

      const title = titleMatch ? titleMatch[1] : null;
      if (!title) continue;

      posts.push({
        title,
        author: authorMatch ? authorMatch[1] : "unknown",
        score: scoreMatch ? scoreMatch[1] : "0",
        comments: commentsMatch ? commentsMatch[1] : "0",
        link: linkMatch ? "https://reddit.com" + linkMatch[1] : null
      });
    }

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scrape failed" });
  }
}
