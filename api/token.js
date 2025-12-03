import { v4 as uuid } from "uuid";

let currentToken = null;
let validUntil = 0;

// Token válido por 4 horas
const TOKEN_DURATION = 4 * 60 * 60 * 1000;

export default function handler(req, res) {
  const now = Date.now();

  // Si no hay token o está vencido, generar uno nuevo
  if (!currentToken || now > validUntil) {
    currentToken = uuid();
    validUntil = now + TOKEN_DURATION;
  }

  // Redirigir al timbre con el token vigente
  res.writeHead(302, {
    Location: `/timbre.html?token=${currentToken}`
  });
  res.end();
}
