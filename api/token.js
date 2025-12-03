let currentToken = null;
let validUntil = 0;

// duración: 7 días (no jode y evita spam)
const TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

function generateToken() {
  return Math.random().toString(36).substring(2) +
         Math.random().toString(36).substring(2);
}

export default function handler(req, res) {
  const now = Date.now();

  if (!currentToken || now > validUntil) {
    currentToken = generateToken();
    validUntil = now + TOKEN_DURATION;
  }

  res.status(200).json({
    token: currentToken,
    expires: validUntil
  });
}
