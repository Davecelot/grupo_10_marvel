const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get('/',mainController.index);
router.get('/home',mainController.index);
router.get('/register',mainController.register);
router.get('/login',mainController.login);
router.get('/products/productDetail', mainController.productDetail);

module.exports = router;