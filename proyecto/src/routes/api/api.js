const express = require("express");
const router = express.Router();
const apiController = require("../../controllers/api/apiController");

router.get("/users", apiController.listUser);
router.get("/users/:id", apiController.detailUser);
router.get("/products", apiController.listProducts);
router.get("/products/:id", apiController.detailProducts);
router.get("/genres/", apiController.listGenres);

module.exports = router;
