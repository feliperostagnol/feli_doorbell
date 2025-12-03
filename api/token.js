import fs from "fs";
import path from "path";

const FILE = "/tmp/token.json";

// Genera el token
function generateToken() {
  return Math.random().toString(36).substring(2) +
         Math.random().toString(36).substring(2);
}

function saveToken(token, validUntil) {
  fs.writeFileSync(FILE, JSON.stringify({ token, validUntil }));
}

function loadToken() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { token: null, validUntil: 0 };
  }
}

export default function handler(req, res) {
  const now = Date.now();
  let { token, validUntil } = loadToken();

  if (!token || now > validUntil) {
    token = generateToken();
    validUntil = now + 4 * 60 * 60 * 1000;
    saveToken(token, validUntil);
  }

  res.writeHead(302, {
    Location: `/timbre.html?token=${token}`
  });
  res.end();
}
