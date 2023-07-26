const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const adminController = require("../controllers/adminController");

//subir archivo y nombre
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/images/peliculas"));
  },
  filename: function (req, file, cb) {
    cb(null, "pelicula-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/index", adminController.index);
router.get("/productList", adminController.productList);
router.get("/createProducts", adminController.createProduct);
router.post("/createProducts", upload.single("imagen"), adminController.save);
router.delete("/productList/:id", adminController.delete);
router.put("/ProductList/:id", adminController.put);

module.exports = router;
