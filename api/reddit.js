export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "Missing ?url=" });
  }

  try {
    const response = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const text = await response.text();

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch target" });
  }
}
