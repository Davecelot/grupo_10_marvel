const express = require("express");
const path = require("path");
const fs = require("fs");
const mainController = require("./mainController");
const app = express();
const archivoJSON = require("../data/archivoJSON");

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  index: function (req, res) {
    res.render("admin/index");
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
    fs.writeFileSync(path.resolve(__dirname, "../data/products.json"), nuevaPelciulaGuardar);
    res.redirect("/products/productList");
  },

  delete: (req, res) => {
    let peliculas = mainController.leerJson("products.json");
    let peliculaDeleteId = parseInt(req.params.id);
    const peliculasFinal = peliculas.filter(
      (pelicula) => pelicula.id != peliculaDeleteId
    );
    let peliculaGuardar = JSON.stringify(peliculasFinal, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "/data/products.json"),
      peliculasGuardar
    );
    //res.redirect("/administrar");
  },

  put: (req, res) => {
    let peliculas = mainController.leerJson("products.json");
    req.body.id = req.params.id;
    req.body.imagen = req.file ? req.file.filename : req.body.oldImagen;
    let peliculaUpdate = peliculas.map((moto) => {
      if (pelicula.id == req.body.id) {
        return (pelicula = req.body);
      }
      return pelicula;
    });

    let peliculaActualizada = JSON.stringify(peliculaUpdate, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/products.json"),
      peliculaActualizada
    );
    //res.redirect("/administrar");
  },
};

module.exports = controller;
