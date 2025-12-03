// /api/check.js
let currentToken = null;
let validUntil = 0;

export default function handler(req, res) {
  const token = req.query.token;
  const now = Date.now();

  if (!currentToken || now > validUntil) {
    return res.status(200).json({ valid: false });
  }

  return res.status(200).json({ valid: token === currentToken });
}
