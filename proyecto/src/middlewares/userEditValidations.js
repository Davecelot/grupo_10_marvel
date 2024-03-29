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
  //   body("password").notEmpty().withMessage("Favor de completar la contraseña"),
  //   body("conpassword")
  //     .notEmpty()
  //     .withMessage("Favor de confirmar la contraseña"),
  //   body("imagen").custom((value, { req }) => {
  //     let file = req.file;
  //     let acceptedExtensions = [".jpg", ".png", ".gif"];

  //     if (!file) {
  //       throw new Error("Tienes que subir una imagen");
  //     } else {
  //       let fileExtension = path.extname(file.originalname);
  //       if (!acceptedExtensions.includes(fileExtension)) {
  //         throw new Error(
  //           `Las extensiones de archivo permitidas son ${acceptedExtensions.join(
  //             ", "
  //           )}`
  //         );
  //       }
  //     }
  //     return true;
  //   }),
];
