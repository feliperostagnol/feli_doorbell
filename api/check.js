export default async function handler(req, res) {
  try {
    const { token } = req.query;

    // validar token
    if (req.method === "GET") {
      if (token && global.currentToken && token === global.currentToken) {
        return res.status(200).json({ valid: true });
      }
      return res.status(200).json({ valid: false });
    }

    // enviar foto
    if (req.method === "POST") {
      const body = req.body ? JSON.parse(req.body) : {};
      const photo = body.photo;

      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: "Missing Telegram env vars" });
      }

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: "🔔 Alguien tocó el timbre"
        }),
      });

      if (photo) {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            photo
          }),
        });
      }

      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
