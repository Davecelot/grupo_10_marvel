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
    .notEmpty()
    .withMessage("Favor de completar la contraseña")
    .bail()
    .isLength({ min: 8 })
    .withMessage("formato de contraseña inválido"),
];
