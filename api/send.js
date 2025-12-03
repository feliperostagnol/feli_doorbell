import formidable from "formidable";
import fs from "fs";

// 🔥 Necesario para que Vercel PUEDA recibir FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // ---- PARSEAR FORM DATA ----
  const form = formidable({ multiples: false });

  let parsed;
  try {
    parsed = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });
  } catch (err) {
    console.error("Error parsing form:", err);
    return res.status(400).json({ ok: false, error: "Invalid form data" });
  }

  const message = parsed.fields.message || "Timbre tocado";
  const photo = parsed.files.photo;

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    return res.status(500).json({
      ok: false,
      error: "Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID",
    });
  }

  // ---------------------------------------------------------
  // 1) SI NO HAY FOTO → solo mandar mensaje
  // ---------------------------------------------------------
  if (!photo) {
    try {
      const resp = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
          }),
        }
      );

      const json = await resp.json();
      return res.status(200).json({ ok: true, result: json });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      return res.status(500).json({ ok: false, error: "Telegram sendMessage failed" });
    }
  }

  // ---------------------------------------------------------
  // 2) SI HAY FOTO → enviar sendPhoto
  // ---------------------------------------------------------
  try {
    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("caption", message);
    formData.append(
      "photo",
      fs.createReadStream(photo.filepath),
      "timbre.jpg"
    );

    const resp = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`,
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await resp.json();
    return res.status(200).json({ ok: true, result: json });
  } catch (error) {
    console.error("Error sending Telegram photo:", error);
    return res.status(500).json({ ok: false, error: "Telegram sendPhoto failed" });
  }
}
