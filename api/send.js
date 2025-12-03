export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  // ⚠️ IMPORTANTE: el token SIEMPRE entre comillas
  const TELEGRAM_BOT_TOKEN = "8580491011:AAEuKQ14nfhk6cGjowLn4yvTD2UjOjvAX4w";
  
  // tu chat ID real
  const CHAT_ID = 6648664943;

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await telegramRes.json();
    console.log("Telegram result:", data);

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return res.status(500).json({ ok: false, error });
  }
}
