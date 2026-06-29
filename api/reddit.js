export default async function handler(req, res) {
  const sub = req.query.sub || "javascript";
  const sort = req.query.sort || "hot";

  const target = `https://old.reddit.com/r/${sub}/${sort}/`;

  const response = await fetch(target, {
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
    }
  });

  const html = await response.text();

  // TEMP: return first 2000 chars so we can inspect
  res.status(200).send(html.slice(0, 2000));
}
