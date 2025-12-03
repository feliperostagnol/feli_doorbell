import QRCode from "qrcode";

export default async function handler(req, res) {
  try {
    // Fallback si Vercel no manda origin
    const baseUrl =
      req.headers.origin ||
      "https://" + req.headers.host ||
      "https://feli-doorbell.vercel.app";

    // Obtenemos token actual
    const tkResp = await fetch(baseUrl + "/api/token");
    const { token } = await tkResp.json();

    const url = `${baseUrl}/timbre.html?token=${token}`;
    const qr = await QRCode.toDataURL(url);

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <h2>QR del Timbre</h2>
      <img src="${qr}" width="260" />
      <p><code>${url}</code></p>
    `);

  } catch (err) {
    console.error("QR ERROR:", err);
    res.status(500).json({ error: "QR generation failed", details: err.message });
  }
}
