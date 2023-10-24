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
  productDetail: function (req, res) {
    const myUser = req.session.Usuario;
    const id = parseInt(req.params.id);
    db.Classification.findAll()
      .then(allClassification => {
        db.Genero.findAll()
          .then(allGenres => {
            db.Movie.findByPk(req.params.id, {
              include: ["genres", "classifications"]
            }).then(movie => {
              res.render("products/productDetail", { movie, myUser, allClassification, allGenres });
            });
          });
      });
  },

  productCart: function (req, res) {
    const myUser = req.session.Usuario;
    const id = parseInt(req.params.id);
    db.Classification.findAll()
      .then(allClassification => {
        db.Genero.findAll()
          .then(allGenres => {
            db.Movie.findByPk(req.params.id, {
              include: ["genres", "classifications"]
            }).then(movie => {
              res.render("products/productCart", { movie, myUser, allClassification, allGenres });
            });
          });
      });
    // res.render("products/productCart");
  },

  productList: function (req, res) {
    const myUser = req.session.Usuario;
    db.Movie.findAll({
      include: ["genres"]
    })
      .then(movies => {
        db.Genero.findAll()
          .then(generosAll => {
            return res.render("products/productList", { movies, myUser, generosAll });
          })
      })
  },

  productListGenero: function (req, res) {
    const myUser = req.session.Usuario;
    db.Movie.findAll({
      include: ["genres"],
      where: { genreId: req.params.id }
    })
      .then(movies => {
        db.Genero.findAll()
          .then(generosAll => {
            return res.render("products/productList", { movies, myUser, generosAll });
          })
      })
  }

};

module.exports = controller;
