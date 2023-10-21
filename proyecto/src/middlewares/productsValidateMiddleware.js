const { body } = require('express-validator');
const path = require("path");

let validateRegister = [
	body('nombre').notEmpty().withMessage("Debes completar el nombre").bail()
		.isLength({ min: 5 }).withMessage("La longitud minima es de 5 caracteres"),
	body('descripcion').notEmpty().withMessage("Debes completar la descripcion").bail()
		.isLength({ min: 20 }).withMessage("La longitud minima es de 20 caracteres"),
	body('precio').notEmpty().withMessage("Debes completar el precio").bail(),
	body('duracion').notEmpty().withMessage("Debes completar la duracion").bail(),
	body('year').notEmpty().withMessage("Debes completar el año").bail(),
	body('clasificacionEdad').notEmpty().withMessage("Debes seleccionar una clasificacion").bail(),
	body('genero').notEmpty().withMessage("Debes seleccionar un genero").bail(),
	body('imagen').custom((value, { req }) => {
		let file = req.file;
		let acceptedExtensions = ['.jpg', '.png', '.gif', '.jpng'];
		if (!file) {
			throw new Error('Tienes que subir una imagen');
		} else {
			let fileExtension = path.extname(file.originalname);
			if (!acceptedExtensions.includes(fileExtension)) {
				throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
			}
		}
		return true;
	})
];

module.exports = validateRegister;