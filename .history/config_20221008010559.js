import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;

  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }

  return value;
}

export const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },

  port: parseInt(required('PORT', 8080)),

  db: {
    host: required('DB_HOST'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
    port: required('DB_PORT'),
  },
  cors: {
    allowedOrigin: required('CORS_ALLOW_ORIGIN'),
  },
  page: {
    scrollLimit: required('SCROLL_LIMIT'),
  },
};
