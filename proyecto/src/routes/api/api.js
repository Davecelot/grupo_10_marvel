const express = require("express");
const router = express.Router();
const apiController = require("../../controllers/api/apiController");
const cors = require('cors');

router.get("/users", cors(), apiController.listUser);
router.get("/users/:id", cors(), apiController.detailUser);
router.get("/products", cors(), apiController.listProducts);
router.get("/products/:id", cors(), apiController.detailProducts);
router.get("/genres/", cors(), apiController.listGenres);

module.exports = router;
