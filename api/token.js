let currentToken = null;
let validUntil = 0;

// Token válido por 4 horas
const TOKEN_DURATION = 4 * 60 * 60 * 1000;

// Generador de token sin dependencias externas
function generateToken() {
  return Math.random().toString(36).substring(2) +
         Math.random().toString(36).substring(2);
}

export default function handler(req, res) {
  const now = Date.now();

  // Si no hay token o venció, generar uno nuevo
  if (!currentToken || now > validUntil) {
    currentToken = generateToken();
    validUntil = now + TOKEN_DURATION;
  }

  // Redirigir al timbre con el token vigente
  res.writeHead(302, {
    Location: `/timbre.html?token=${currentToken}`
  });
  res.end();
}
