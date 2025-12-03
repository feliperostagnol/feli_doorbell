let currentToken = null;
let validUntil = 0;

// IMPORTANTE: debemos exportar esto desde token.js
import { currentToken, validUntil } from "./token"; 
// Si no está exportado te pongo abajo cómo hacerlo.

export default async function handler(req, res) {
  try {
    // 1) VALIDACIÓN DE TOKEN (GET)
    if (req.method === "GET") {
      const token = req.query.token;

      const now = Date.now();
      const valid = token && token === currentToken && now < validUntil;

      return res.status(200).json({ valid });
    }

    // 2) ENVÍO A TELEGRAM (POST)
    const { photo } = JSON.parse(req.body || "{}");

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Missing env vars");
      return res.status(500).json({ error: "Missing env vars" });
    }

    // mensaje
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: "🔔 Alguien tocó el timbre",
      }),
    });

    // foto opcional
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
    console.error("ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
