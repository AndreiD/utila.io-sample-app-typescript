const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

// Generates and gives a fresh new JWT

dotenv.config();

const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;

if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY_PATH) {
  throw new Error(
    'Missing SERVICE_ACCOUNT_EMAIL or PRIVATE_KEY_PATH in environment variables.'
  );
}

const SERVICE_ACCOUNT_PRIVATE_KEY = fs
  .readFileSync(path.resolve(PRIVATE_KEY_PATH), 'utf8')
  .trim()
  .replace(/\\n/g, '\n'); // Ensure correct PEM formatting

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Generates a new JWT for Utila API.
 */
function generateToken(): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiry
  const token = jwt.sign(
    {
      sub: SERVICE_ACCOUNT_EMAIL,
      aud: 'https://api.utila.io/',
      exp,
    },
    SERVICE_ACCOUNT_PRIVATE_KEY,
    { algorithm: 'RS256' }
  );
  cachedToken = token;
  tokenExpiry = exp;
  return token;
}

/**
 * Returns a valid token, refreshing if it expires in less than 5 minutes.
 */
export function getToken(): string {
  const now = Math.floor(Date.now() / 1000);
  if (!cachedToken || !tokenExpiry || tokenExpiry - now < 5 * 60) {
    return generateToken();
  }
  return cachedToken;
}
