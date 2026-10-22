const express = require("express");
const router = express.Router();
const path = require("path");
const adminController = require("../controllers/adminController");
const productsEditValidateMiddleware = require("../middlewares/productsEditValidateMiddleware");
const productsCreateValidateMiddleware = require("../middlewares/productsCreateValidateMiddleware");
const validations = require("../middlewares/registerValidateMiddleware");
const validationsEdit = require("../middlewares/userEditValidations");
const validateAdmin = require("../middlewares/validateAdmin")

const { imageUpload } = require('../middlewares/imageUpload');
const { validateCsrf, validateNonMultipartCsrf } = require('../middlewares/csrf');
const upload = imageUpload(path.resolve(__dirname, '../../public/images/movie-images'), 'pelicula');
const uploadUser = imageUpload(path.resolve(__dirname, '../../public/images/user-images'), 'usuario');

// Guard the entire router, including all POST/PUT/DELETE routes, before uploads.
router.use(validateAdmin);
router.use(validateNonMultipartCsrf);

router.get("/index", adminController.index);
router.get("/listProducts", adminController.listProducts);
router.get("/createProducts", adminController.createProduct);
router.post("/createProducts",upload.slice(0, 2),productsCreateValidateMiddleware,upload[2],adminController.save);
router.get("/editProducts/delete/:id", adminController.deleteProduct);
router.post("/editProducts/delete/:id", validateCsrf, adminController.destroy);
router.get("/editProducts/:id", adminController.editProduct);
router.put("/editProducts/:id",upload.slice(0, 2),productsEditValidateMiddleware,upload[2],adminController.update);

router.get("/userList", adminController.userList);
router.get("/userDetail/:id", adminController.userDetail);
router.get("/userCreate", adminController.userCreate);
router.post("/userCreate",uploadUser.slice(0, 2),validations,uploadUser[2],adminController.userSave);
router.get("/userEdit/:id", adminController.userEdit);
router.put("/userEdit/:id",uploadUser.slice(0, 2),validationsEdit,uploadUser[2],adminController.userUpdate);
router.get("/userDelete/:id", adminController.userDelete);
router.delete("/userDelete/:id", validateCsrf, adminController.userDestroy);

module.exports = router;
