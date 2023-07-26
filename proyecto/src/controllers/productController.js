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
  },

  createProduct: function (req, res) {
    res.render("products/createProducts");
  },

  save: (req, res) => {
    let peliculas = mainController.leerJson("products.json");
    let nuevaPelicula = {
      id: peliculas[peliculas.length - 1].id + 1,
      nombre: req.body.nombre,
      genero: req.body.genero,
      duracion: req.body.duracion,
      año: req.body.año,
      clasificacionEdad: req.body.clasificacionEdad,
      descripcion: req.body.descripcion,
      advertenciaContenido: req.body.advertenciaContenido,
      director: req.body.director,
      reparto: req.body.reparto,
      estudio: req.body.estudio,
      subtitulos: req.body.subtitulos,
      precio: req.body.precio,
      imagen: req.file.filename,
    };
    peliculas.push(nuevaPelicula);
    let nuevaPelciulaGuardar = JSON.stringify(peliculas, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/products.json"),
      nuevaPelciulaGuardar
    );
    res.redirect("/products/productList");
  },
};

module.exports = controller;
