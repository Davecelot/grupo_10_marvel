const crypto = require('node:crypto');

function csrfToken(req, res, next) {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

function validateCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const expected = req.session?.csrfToken;
  const supplied = req.get('x-csrf-token') || req.body?._csrf;
  if (typeof expected !== 'string' || typeof supplied !== 'string' ||
      !(/^[a-f0-9]{64}$/.test(supplied)) || expected.length !== supplied.length ||
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied))) {
    return res.status(403).send('Solicitud no autorizada. Recarga el formulario.');
  }
  next();
}

function validateNonMultipartCsrf(req, res, next) {
  // Upload routes validate after bounded multipart parsing. Routes without an
  // upload parser must also apply validateCsrf explicitly before the controller.
  if (req.is('multipart/form-data')) return next();
  return validateCsrf(req, res, next);
}

module.exports = { csrfToken, validateCsrf, validateNonMultipartCsrf };
