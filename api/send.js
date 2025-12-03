export const config = {
  api: { bodyParser: true }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, photo } = req.body;

  const TELEGRAM_BOT_TOKEN = "TU_TOKEN_AQUÍ";
  const CHAT_ID = 6648664943;

  try {
    // 1) Enviar texto
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
      }
    );

    // 2) Enviar foto
    if (photo) {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            photo: photo
          })
        }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("ERROR SEND:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
