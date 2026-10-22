const path = require("path");
const { body } = require("express-validator");

module.exports = [
  body("correo")
    .notEmpty()
    .withMessage("Favor de completar el email")
    .bail()
    .isEmail()
    .withMessage("Debes escribir un formato de correo válido"),
  body("password")
    .isString().bail()
    .notEmpty()
    .withMessage("Favor de completar la contraseña")
    .bail()
    .isLength({ min: 8 })
    .withMessage("formato de contraseña inválido").bail()
    .custom(value => Buffer.byteLength(value, "utf8") <= 72).withMessage("formato de contraseña inválido"),
];
