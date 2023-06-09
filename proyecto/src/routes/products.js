const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");

router.get('/productDetail', productsController.productDetail);
router.get('/productCart', productsController.productCart);
router.get('/productList', productsController.productList);
router.get('/createProducts', productsController.createProduct);

module.exports = router;