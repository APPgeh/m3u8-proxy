export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    res.status(400).send("missing url");
    return;
  }

  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
      "Referer": "https://sinal.cc/",
      "Origin": "https://sinal.cc",
      "Accept": "*/*"
    }
  });

  const data = await r.text();

  res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).send(data);
}