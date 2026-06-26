import * as cheerio from "cheerio";

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
    const $ = cheerio.load(html);

    const posts = [];

    $("div[data-testid='post-container']").each((i, el) => {
      const title = $(el).find("h3").text();
      const author = $(el).find("a[data-testid='post_author_link']").text();
      const score = $(el).find("div[data-click-id='score']").text();
      const comments = $(el).find("span:contains('comments')").text();
      const link = "https://reddit.com" + $(el).find("a[data-click-id='body']").attr("href");

      if (title) {
        posts.push({
          title,
          author,
          score,
          comments,
          link
        });
      }
    });

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scrape failed" });
  }
}
