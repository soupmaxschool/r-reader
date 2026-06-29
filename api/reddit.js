import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  const sub = req.query.sub;
  if (!sub) {
    return res.status(400).json({ error: "Missing ?sub=" });
  }

  const url = `https://www.reddit.com/r/${sub}/.rss`;

  try {
    const feed = await parser.parseURL(url);

    const posts = feed.items.map(item => ({
      title: item.title,
      author: item.author,
      link: item.link,
      date: item.pubDate,
      content: item.contentSnippet
    }));

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "RSS fetch failed" });
  }
}
