export default function handler(req, res) {
  const { token } = req.query;

  const isValid = token === global.currentToken;

  res.status(200).json({ valid: isValid });
}
