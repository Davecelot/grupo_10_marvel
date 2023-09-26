const express = require("express");
const path = require("path");
const fs = require("fs");
const mainController = require("./mainController");
const app = express();
const archivoJSON = require("../database/archivoJSON");
const db = require("../database/models");

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  index: function (req, res) {
    res.render("admin/index");
  },

  userList: (req, res) => {
    db.User.findAll().then(users => {
      return res.render("admin/userList", { users });
  })
  },

  listProducts: (req, res) => {
    db.Movie.findAll().then(movies => {
      return res.render("admin/listProducts", { movies });
    })
  },

  createProduct: function (req, res) {
    res.render("admin/createProducts");
  },

  editProduct: (req, res) => {
    db.Movie.findByPk(req.params.id,{
      include: ["genres","classifications"]
    })
      .then(peliculaEditar => {
          res.render('admin/editProducts', {peliculaEditar});
      });
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
    fs.writeFileSync(path.resolve(__dirname, "../data/products.json"), nuevaPeliculaGuardar);
    res.redirect("/admin/listProducts");
  },

  delete: (req, res) => {
    let peliculas = mainController.leerJson("products.json");
    let peliculaDeleteId = parseInt(req.params.id);
    const peliculasFinal = peliculas.filter(
      (pelicula) => pelicula.id != peliculaDeleteId
    );
    let peliculaGuardar = JSON.stringify(peliculasFinal, null, 2);
    fs.writeFileSync(path.resolve(__dirname, "../data/products.json"), peliculaGuardar);
    res.redirect("/admin/listProducts");
  },

  update: function(req, res) {
    req.body.id = req.params.id;
    req.body.imagen = req.file ? req.file.filename : req.body.oldImagen;
    let promMovies = Movies.findByPk(movieId);
    Promise
        .all([promMovies])
        .then(([Movie]) => {
          //Movie.release_date = moment( new Date(Movie.release_date)).toLocaleDateString();
          Movie.release_date = moment(Movie.release_date).locale('es-us').format('YYYY-MM-DD');
          return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie})})
      .catch(error => res.send(error))
    res.redirect("/admin/listProducts");
  },

  destroy: function (req,res) {
    let movieId = req.params.id;
    Movies
    .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
    .then(()=>{
        return res.redirect('/movies')})
    .catch(error => res.send(error)) 
}
};

module.exports = controller;
