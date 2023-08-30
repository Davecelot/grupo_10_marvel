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
    const myUser = req.session.Usuario;
    const id = parseInt(req.params.id);
    const datos = archivoJSON.leerJson("products.json");
    const dato = datos.find((dato) => dato.id === id);
    res.render("products/productDetail", { dato: dato, myUser: myUser });
  },

  productCart: function (req, res) {
    res.render("products/productCart");
  },

  productList: function (req, res) {
    const myUser = req.session.Usuario;
    const peliculas = archivoJSON.leerJson("products.json");
    const generosAll = peliculas.map((pelicula) => pelicula.genero);
    const generos = generosAll.filter(
      (item, index) => generosAll.indexOf(item) === index
    );
    const peliculaGeneros = peliculas.filter(
      (pelicula) => pelicula.genero === generos[0]
    );
    //     const generosClean = generos.filter((genero) => genero);
    res.render("products/productList", {
      generos: generos,
      peliculas: peliculas,
      myUser: myUser,
    });
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
      year: req.body.year,
      clasificacionEdad: req.body.clasificacionEdad,
      descripcion: req.body.descripcion,
      advertenciaContenido: req.body.advertenciaContenido,
      director: req.body.director,
      reparto: req.body.reparto,
      estudio: req.body.estudio,
      subtitulos: req.body.subtitulos,
      precio: req.body.precio,
      imagen: "/images/movie-images/" + req.file.filename,
    };
    peliculas.push(nuevaPelicula);
    let nuevaPeliculaGuardar = JSON.stringify(peliculas, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/products.json"),
      nuevaPeliculaGuardar
    );
    res.redirect("/products/productList");
  },
};

module.exports = controller;
