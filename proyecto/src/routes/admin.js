const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const adminController = require("../controllers/adminController");
const productsEditValidateMiddleware = require("../middlewares/productsEditValidateMiddleware");
const productsCreateValidateMiddleware = require("../middlewares/productsCreateValidateMiddleware");
const validations = require("../middlewares/registerValidateMiddleware");
const validationsEdit = require("../middlewares/userEditValidations");
const validateAdmin = require("../middlewares/validateAdmin")
const { body } = require("express-validator");

//subir archivo y nombre pelicula
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/images/movie-images"));
  },
  filename: function (req, file, cb) {
    cb(null, "pelicula-" + Date.now() + path.extname(file.originalname));
  },
});

//subir archivo y nombre usuario
var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/images/user-images"));
  },
  filename: function (req, file, cb) {
    cb(null, "usuario-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const uploadUser = multer({ storage1 });

router.get("/index", validateAdmin, adminController.index);
router.get("/listProducts", validateAdmin, adminController.listProducts);
router.get("/createProducts", validateAdmin, adminController.createProduct);
router.post("/createProducts",upload.single("imagen"),productsCreateValidateMiddleware,adminController.save);
router.get("/editProducts/delete/:id", validateAdmin, adminController.deleteProduct);
router.post("/editProducts/delete/:id", adminController.destroy);
router.get("/editProducts/:id", validateAdmin, adminController.editProduct);
router.put("/editProducts/:id",upload.single("imagen"),productsEditValidateMiddleware,adminController.update);

router.get("/userList", validateAdmin, adminController.userList);
router.get("/userDetail/:id", validateAdmin, adminController.userDetail);
router.get("/userCreate", validateAdmin, adminController.userCreate);
router.post("/userCreate",uploadUser.single("imagen"),validations,adminController.userSave);
router.get("/userEdit/:id", validateAdmin, adminController.userEdit);
router.put("/userEdit/:id",uploadUser.single("imagen"),validationsEdit,adminController.userUpdate);
router.get("/userDelete/:id", validateAdmin, adminController.userDelete);
router.delete("/userDelete/:id", adminController.userDestroy);

module.exports = router;
