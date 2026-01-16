export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    return res.status(400).send("missing url");
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
        "Referer": "https://rdcplayer.online/",
        "Origin": "https://rdcplayer.online"
      }
    });

    let text = await response.text();

    // URL base para resolver caminhos relativos
    const base = target.substring(0, target.lastIndexOf("/") + 1);

    // Reescreve links internos para passar pelo proxy
    text = text.replace(
      /^(?!#)(.+)$/gm,
      (line) => {
        if (line.startsWith("http")) {
          return `https://embedgehtv.vercel.app/api/proxy?url=${encodeURIComponent(line)}`;
        }
        return `https://embedgehtv.vercel.app/api/proxy?url=${encodeURIComponent(base + line)}`;
      }
    );

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);

  } catch (e) {
    res.status(500).send("proxy error");
  }
}