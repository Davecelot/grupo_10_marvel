const path = require("path");
const { body } = require("express-validator");

module.exports = [
  body("nombre").notEmpty().withMessage("Favor de completar el nombre"),
  body("correo")
    .notEmpty()
    .withMessage("Favor de completar el email")
    .bail()
    .isEmail()
    .withMessage("Debes escribir un formato de correo válido"),
  body('password').optional({ values: 'falsy' }).isString().bail().isLength({ min: 12 })
    .withMessage('La contraseña debe tener al menos 12 caracteres').bail()
    .custom(value => Buffer.byteLength(value, 'utf8') <= 72).withMessage('La contraseña no puede superar 72 bytes'),
  body('conpassword').custom((value, { req }) => !req.body.password || value === req.body.password)
    .withMessage('Las contraseñas deben coincidir'),
];
