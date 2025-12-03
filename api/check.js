import fs from "fs";

const FILE = "/tmp/token.json";

// Carga token guardado por token.js
function loadToken() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { token: null, validUntil: 0 };
  }
}

export default async function handler(req, res) {
  const data = loadToken();

  // GET → validar token
  if (req.method === "GET") {
    const token = req.query.token;
    const now = Date.now();

    const valid = token === data.token && now < data.validUntil;
    return res.status(200).json({ valid });
  }

  // POST → enviar a telegram
  try {
    const { photo } = JSON.parse(req.body || "{}");

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: "🔔 Alguien tocó el timbre",
      }),
    });

    if (photo) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo,
        }),
      });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
