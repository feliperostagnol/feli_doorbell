let currentToken = null;
let validUntil = 0;

export default function handler(req, res) {
  const now = Date.now();

  // Generar token si no existe o si expiró
  if (!currentToken || now > validUntil) {
    currentToken = Math.random().toString(36).substring(2) +
                   Math.random().toString(36).substring(2);

    // 4 horas de validez
    validUntil = now + 4 * 60 * 60 * 1000;
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    token: currentToken,
    expires: validUntil
  });
}
