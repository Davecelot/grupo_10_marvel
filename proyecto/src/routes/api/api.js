const express = require("express");
const router = express.Router();
const apiController = require("../../controllers/api/apiController");
const cors = require('cors');
const validateAdmin = require('../../middlewares/validateAdmin');

router.get("/users", validateAdmin, cors(), apiController.listUser);
router.get("/users/:id", validateAdmin, cors(), apiController.detailUser);
router.get("/products", cors(), apiController.listProducts);
router.get("/products/:id", cors(), apiController.detailProducts);
router.get("/genres/", cors(), apiController.listGenres);

module.exports = router;
