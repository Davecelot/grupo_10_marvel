const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const productsController = require("../controllers/productController");

//subir archivo y nombre
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.resolve(__dirname,'../../public/images/peliculas'))
    },
    filename: function(req,file,cb){
        cb(null, 'pelicula-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage})

router.get('/productDetail', productsController.productDetail);
router.get('/productCart', productsController.productCart);
router.get('/productList', productsController.productList);
router.get('/createProducts', productsController.createProduct);
router.post('/createProducts', upload.single('imagen'), productsController.save);

module.exports = router;