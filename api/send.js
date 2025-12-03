import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.photo) {
      console.log("Error parsing:", err);
      return res.status(400).json({ ok: false, error: "No photo" });
    }

    const photoPath = files.photo.filepath;
    const photoBuffer = fs.readFileSync(photoPath);

    try {
      // Enviar a Telegram
      const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;

      const formData = new FormData();
      formData.append("chat_id", process.env.TELEGRAM_CHAT_ID);
      formData.append("caption", "🚪 Timbre tocado");
      formData.append("photo", new Blob([photoBuffer]), "timbre.jpg");

      const tgRes = await fetch(telegramUrl, {
        method: "POST",
        body: formData
      });

      const tgJson = await tgRes.json();
      console.log("Telegram response:", tgJson);

      res.json({ ok: true });
    } catch (e) {
      console.error("Error enviando telegram:", e);
      res.status(500).json({ ok: false, error: "Telegram error" });
    }
  });
}
