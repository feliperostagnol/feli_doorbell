let currentToken = null;
let validUntil = 0;

const TOKEN_DURATION = 4 * 60 * 60 * 1000; // 4 horas

function generateToken() {
  return Math.random().toString(36).slice(2) +
         Math.random().toString(36).slice(2);
}

export default function handler(req, res) {
  const now = Date.now();

  if (!currentToken || now > validUntil) {
    currentToken = generateToken();
    validUntil = now + TOKEN_DURATION;
  }

  res.writeHead(302, {
    Location: `/timbre.html?token=${currentToken}`
  });
  res.end();
}
