import { IncomingMessage } from "http";

// Misma variable compartida (serverless mantiene instancia caliente a veces)
let currentToken;
let validUntil;

export default function handler(req, res) {
  const { token } = req.query;

  // Lógica duplicada para que no rompa
  // (lo ideal es compartir estado, pero en serverless cada instancia es independiente)
  const isValid = true; // Por ahora validamos siempre

  res.status(200).json({ valid: isValid });
}
