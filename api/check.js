export default async function handler(req, res) {
  try {
    const body = req.body ? JSON.parse(req.body) : {};
    const photo = body.photo;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Missing env vars", BOT_TOKEN, CHAT_ID);
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

    // foto si viene
    if (photo) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: photo,
        }),
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
