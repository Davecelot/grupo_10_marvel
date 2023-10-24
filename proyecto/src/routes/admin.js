const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const adminController = require("../controllers/adminController");
const productsValidateMiddleware = require("../middlewares/productsValidateMiddleware");
const { body } = require('express-validator');

//subir archivo y nombre
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/images/movie-images"));
  },
  filename: function (req, file, cb) {
    cb(null, "pelicula-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/index", adminController.index);
router.get("/listProducts", adminController.listProducts); 
router.get("/userList", adminController.userList);
router.get("/createProducts", adminController.createProduct);
router.post("/createProducts", upload.single("imagen"), productsValidateMiddleware, adminController.save);
router.get("/editProducts/delete/:id", adminController.deleteProduct);
router.post("/editProducts/delete/:id", adminController.destroy)
router.get("/editProducts/:id", adminController.editProduct)
router.put("/editProducts/:id", upload.single('imagen'), productsValidateMiddleware, adminController.update);

module.exports = router;
