const express = require("express");
const path = require("path");
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });
const registrationLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });
const usersController = require("../controllers/usersController");
const validations = require("../middlewares/registerValidateMiddleware");
const validationsLogin = require("../middlewares/loginValidateMiddleware");

const { imageUpload } = require('../middlewares/imageUpload');
const { validateCsrf } = require('../middlewares/csrf');
const upload = imageUpload(path.resolve(__dirname, '../../public/images/user-images'), 'usuario');

router.get("/register", usersController.register);
router.get("/login", usersController.login);
router.post(
  "/register",
  registrationLimit,
  upload.slice(0, 2),
  validations,
  upload[2],
  usersController.save
);
router.post("/login", loginLimit, validateCsrf, validationsLogin, usersController.logged);
router.post("/cerrarSesion", validateCsrf, usersController.cerrarSesion)

module.exports = router;
