const crypto = require('node:crypto');

module.exports = function sessionOptions(environment = process.env) {
  const production = environment.NODE_ENV === 'production';
  const secret = environment.SESSION_SECRET;
  if (production && (typeof secret !== 'string' || secret.length < 32)) {
    throw new Error('SESSION_SECRET of at least 32 characters is required in production.');
  }
  return {
    name: 'marvel.sid',
    secret: secret || crypto.randomBytes(48).toString('base64url'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: production,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000,
    },
  };
};
