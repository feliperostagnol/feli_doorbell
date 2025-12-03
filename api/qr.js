import QRCode from "qrcode";

export default async function handler(req, res) {
  const tk = await fetch(`${req.headers.origin}/api/token`);
  const { token } = await tk.json();

  const url = `${req.headers.origin}/timbre.html?token=${token}`;
  const qr = await QRCode.toDataURL(url);

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <h2>QR del Timbre</h2>
    <img src="${qr}" width="280" /><br/><br/>
    <code>${url}</code>
  `);
}
