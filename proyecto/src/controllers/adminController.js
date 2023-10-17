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
    db.User.findAll().
      then(users => {
        db.Rol.findAll()
          .then(allRoles => {
            return res.render("admin/userList", { users, allRoles });
          });
      });
  },

  listProducts: (req, res) => {
    db.Movie.findAll().then(movies => {
      return res.render("admin/listProducts", { movies });
    })
  },

  createProduct: function (req, res) {
    db.Classification.findAll()
      .then(allClassification => {
        db.Genero.findAll()
          .then(allGenres => {
            res.render('admin/createProducts', { allGenres, allClassification });
          });
      })
  },

  editProduct: (req, res) => {
    const id = req.params.id
    db.Classification.findAll()
      .then(allClassification => {
        db.Genero.findAll()
          .then(allGenres => {
            db.Movie.findByPk(req.params.id, {
              include: ["genres", "classifications"]
            })
              .then(peliculaEditar => {
                console.log(id);
                res.render('admin/editProducts', { peliculaEditar, allClassification, allGenres });
              });
          });
      });
  },

  deleteProduct: (req, res) => {
    db.Movie.findByPk(req.params.id)
      .then(Movie => {
        res.render('admin/deleteProducts', { Movie });
      });
  },

  save: (req, res) => {
    db.Movie.create({
      name: req.body.nombre,
      genreId: req.body.genero,
      length: req.body.duracion,
      year: req.body.year,
      classificationId: req.body.clasificacionEdad,
      description: req.body.descripcion,
      contentWarning: req.body.advertenciaContenido,
      director: req.body.director,
      cast: req.body.reparto,
      studio: req.body.estudio,
      subtitles: req.body.subtitulos,
      price: req.body.precio,
      image: "/images/movie-images/" + req.file.filename
    })
      .then(movie => {
        res.redirect("/admin/listProducts");
      }).catch(error => res.send(error));

  },

  update: function (req, res) {
    req.body.imagen = req.file ? req.file.filename : req.body.oldImagen;
    db.Movie
      .update(
        {
          name: req.body.nombre,
          genreId: req.body.genero,
          length: req.body.duracion,
          year: req.body.year,
          classificationId: req.body.clasificacionEdad,
          description: req.body.descripcion,
          contentWarning: req.body.advertenciaContenido,
          director: req.body.director,
          cast: req.body.reparto,
          studio: req.body.estudio,
          subtitles: req.body.subtitulos,
          price: req.body.precio,
          image: "/images/movie-images/" + req.body.imagen,
        },
        {
          where: { id: req.params.id }
        }
      )
      .then(() => {
        res.redirect("/admin/listProducts");
      }).catch(error => res.send(error));
  },

  destroy: function (req, res) {
    db.Movie.destroy({
      where: { id: req.params.id }
    }).then(() => {
      return res.redirect('/admin/listProducts');
    })
      .catch(error => res.send(error));
  }
};

module.exports = controller;
