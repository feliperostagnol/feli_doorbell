import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // necesario para FormData
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const message = data.fields.message || "Timbre tocado";
  const photo = data.files.photo;

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Si no hay foto, mandamos solo texto
  if (!photo) {
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
  }

  // Con foto → enviar multipart a Telegram
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
}
