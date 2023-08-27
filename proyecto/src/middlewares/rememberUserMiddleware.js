function rememberUserMiddleware(req, res, next) {
  next();
  if (req.cookies.usuario != undefined && req.session.Usuario == undefined) {
    req.session.Usuario = req.cookies.usuario;
  }
}

module.exports = rememberUserMiddleware;
