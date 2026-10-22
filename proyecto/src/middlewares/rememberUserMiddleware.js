// Legacy `usuario` cookies contain an unsigned display name, not authentication.
// Only express-session and a successful password check may establish identity.
module.exports = function rememberUserMiddleware(req, res, next) {
  if (req.cookies?.usuario !== undefined) res.clearCookie('usuario');
  next();
};
