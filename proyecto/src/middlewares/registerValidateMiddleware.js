const path = require('path');
const {body} = require('express-validator');

module.exports = [
	body('nombre').notEmpty().withMessage('Favor de completar el nombre'),
	body('correo')
		.notEmpty().withMessage('Favor de completar el email').bail()
		.isEmail().withMessage('Debes escribir un formato de correo válido'),
    body('password').isString().bail().isLength({ min: 12 }).withMessage('La contraseña debe tener al menos 12 caracteres').bail().custom(value => Buffer.byteLength(value, 'utf8') <= 72).withMessage('La contraseña no puede superar 72 bytes'),
	body('conpassword').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas deben coincidir'),
    body('imagen').custom((value, { req }) => {
		let file = req.file;
		let acceptedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

		if (!file) {
			throw new Error('Tienes que subir una imagen');
		} else {
			let fileExtension = path.extname(file.originalname).toLowerCase();
			if (!acceptedExtensions.includes(fileExtension)) {
				throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
			}
		}
		return true;
	})
]