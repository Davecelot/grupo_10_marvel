const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');

const publicFormData = body => ({ nombre: body.nombre, correo: body.correo });
const sessionOperation = (session, method) => new Promise((resolve, reject) => {
  session[method](error => error ? reject(error) : resolve());
});

module.exports = {
  login(req, res) { res.render('users/login'); },
  async register(req, res, next) {
    try { res.render('users/register', { roles: await db.Rol.findAll() }); }
    catch (error) { next(error); }
  },
  async save(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/register', { errors: errors.mapped(), oldData: publicFormData(req.body) });
    }
    try {
      await db.User.create({
        name: req.body.nombre,
        mail: req.body.correo,
        roleId: 5,
        password: await bcrypt.hash(req.body.password, 12),
        image: '/images/user-images/' + req.file.filename,
      });
      return res.redirect('/users/login');
    } catch (error) { return next(error); }
  },
  async logged(req, res, next) {
    const errors = validationResult(req);
    try {
      const user = errors.isEmpty() ? await db.User.findOne({ where: { mail: req.body.correo } }) : null;
      // Existing plaintext rows must be migrated offline; never compare plaintext.
      const validHash = typeof user?.password === 'string' && /^\$2[aby]\$\d\d\$[./A-Za-z0-9]{53}$/.test(user.password);
      const matches = validHash && await bcrypt.compare(req.body.password, user.password);
      if (!errors.isEmpty() || !matches) {
        return res.render('users/login', {
          errors: { ...errors.mapped(), credenciales: { msg: 'Credenciales invalidas' } },
          oldData: publicFormData(req.body),
        });
      }
      await sessionOperation(req.session, 'regenerate');
      req.session.userId = Number(user.id);
      req.session.Usuario = user.name; // display only; authorization uses the id
      req.session.cookie.maxAge = req.body.preservar ? 3600000 : null;
      res.clearCookie('usuario');
      await sessionOperation(req.session, 'save');
      return res.redirect(Number(user.roleId) === 1 ? '/admin/index' : '/');
    } catch (error) { return next(error); }
  },
  async cerrarSesion(req, res, next) {
    try {
      await sessionOperation(req.session, 'destroy');
      res.clearCookie('marvel.sid', { path: '/' });
      res.clearCookie('usuario');
      return res.redirect('/users/login');
    } catch (error) { return next(error); }
  },
};
