export default async function handler(req, res) {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  const TELEGRAM_TOKEN = "8580491011:AAEuKQ14nfhk6cGjowLn4yvTD2UjOjvAX4w";
  const CHAT_ID = "6648664943";

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const data = await tgRes.json();
    console.log("Telegram response:", data);

    res.status(200).json({ ok: true, telegram: data });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    res.status(500).json({ error: "Failed to send", details: error });
  }
}
