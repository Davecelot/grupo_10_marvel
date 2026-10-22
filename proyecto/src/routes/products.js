const express = require("express");
const router = express.Router();
const path = require("path");
const productsController = require("../controllers/productController");

router.get("/productDetail/:id", productsController.productDetail);
router.get("/productCart/:id", productsController.productCart);
router.get("/productList", productsController.productList);
router.get("/productList/:id", productsController.productListGenero);

module.exports = router;
