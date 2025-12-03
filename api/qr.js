import QRCode from "qrcode";

let cachedToken = null;
let cachedUntil = 0;

export default async function handler(req, res) {

  // 1) obtenemos token actual desde nuestra API local
  const tokenRes = await fetch(`${req.headers.origin}/api/token`);
  const { token } = await tokenRes.json();

  const url = `${req.headers.origin}/timbre.html?token=${token}`;

  // 2) generar QR
  const qr = await QRCode.toDataURL(url);

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <h1>QR del Timbre</h1>
    <p>Escaneá este QR para abrir el timbre con token válido</p>
    <img src="${qr}" style="width:300px"/>
    <p>${url}</p>
  `);
}
