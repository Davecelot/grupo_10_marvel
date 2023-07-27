const express = require("express");
const path = require("path");
const fs = require("fs");
const mainController = require("./mainController");
const app = express();
const archivoJSON = require("../data/archivoJSON");

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  productDetail: function (req, res) {
    const id = parseInt(req.params.id);
    const datos = archivoJSON.leerJson("products.json");
    const dato = datos.find((dato) => dato.id === id);
    res.render("products/productDetail", { dato });
  },

  productCart: function (req, res) {
    res.render("products/productCart");
  },

  productList: function (req, res) {
    res.render("products/productList");
  }
};

module.exports = controller;
