const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const usersController = require("../controllers/usersController");
const validations = require("../middlewares/registerValidateMiddleware");
const validationsLogin = require("../middlewares/loginValidateMiddleware");

//subir archivo y nombre
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/images/user-images"));
  },
  filename: function (req, file, cb) {
    cb(null, "usuario-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", usersController.userList);
router.get("/userDetail/:id", usersController.userDetail);
router.get("/userEdit/:id", usersController.userEdit);
router.get("/userDelete/:id", usersController.userDelete);

router.get("/register", usersController.register);
router.get("/login", usersController.login);
router.post(
  "/register",
  upload.single("imagen"),
  validations,
  usersController.save
);
router.post("/login", validationsLogin, usersController.logged);

module.exports = router;
