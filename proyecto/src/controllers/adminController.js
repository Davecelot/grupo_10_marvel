const express = require("express");
const path = require("path");
const fs = require("fs");
const mainController = require("./mainController");
const app = express();
const db = require("../database/models");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  index: function (req, res) {
    const myUser = req.session.Usuario;
    res.render("admin/index", { myUser });
  },

  listProducts: (req, res) => {
    const myUser = req.session.Usuario;
    db.Movie.findAll().then((movies) => {
      return res.render("admin/listProducts", { movies, myUser });
    });
  },

  createProduct: function (req, res) {
    const myUser = req.session.Usuario;
    db.Classification.findAll().then((allClassification) => {
      db.Genero.findAll().then((allGenres) => {
        res.render("admin/createProducts", { allGenres, allClassification, myUser });
      });
    });
  },

  editProduct: (req, res) => {
    const myUser = req.session.Usuario;
    const id = req.params.id;
    db.Classification.findAll().then((allClassification) => {
      db.Genero.findAll().then((allGenres) => {
        db.Movie.findByPk(req.params.id, {
          include: ["genres", "classifications"],
        }).then((peliculaEditar) => {
          console.log(id);
          res.render("admin/editProducts", {
            peliculaEditar,
            allClassification,
            allGenres,
            myUser
          });
        });
      });
    });
  },

  deleteProduct: (req, res) => {
    const myUser = req.session.Usuario;
    db.Movie.findByPk(req.params.id).then((Movie) => {
      res.render("admin/deleteProducts", { Movie, myUser });
    });
  },

  save: (req, res) => {
    const myUser = req.session.Usuario;
    let resultValidation = validationResult(req).mapped();
    db.Classification.findAll().then((allClassification) => {
      db.Genero.findAll().then((allGenres) => {
        if (validationResult(req).errors.length == 0) {
          console.log("dentro");
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
            image: "/images/movie-images/" + req.file.filename,
          })
            .then((movie) => {
              console.log(movie);
              res.redirect("/admin/listProducts");
            })
            .catch((error) => res.send(error));
        } else {
          console.log("fuera");
          res.render("admin/createProducts", {
            errors: resultValidation,
            old: req.body,
            allClassification,
            allGenres,
            myUser
          });
        }
      });
    });
  },

  update: function (req, res) {
    const myUser = req.session.Usuario;
    req.body.imagen = req.file ? req.file.filename : req.body.oldImagen;
    let resultValidation = validationResult(req).mapped();
    console.log(resultValidation);
    db.Classification.findAll().then((allClassification) => {
      db.Genero.findAll().then((allGenres) => {
        db.Movie.findByPk(req.params.id, {
          include: ["genres", "classifications"],
        }).then((peliculaEditar) => {
          if (validationResult(req).errors.length == 0) {
            db.Movie.update(
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
                image: req.body.imagen
                  ? "/images/movie-images/" + req.body.imagen
                  : req.body.poster,
              },
              {
                where: { id: req.params.id },
              }
            )
              .then(() => {
                res.redirect("/admin/listProducts");
              })
              .catch((error) => res.send(error));
          } else {
            res.render("admin/editProducts", {
              errors: resultValidation,
              old: req.body,
              allClassification,
              allGenres,
              peliculaEditar,
              myUser
            });
          }
        });
      });
    });
  },

  destroy: function (req, res) {
    db.Movie.destroy({
      where: { id: req.params.id },
    })
      .then(() => {
        return res.redirect("/admin/listProducts");
      })
      .catch((error) => res.send(error));
  },

  userList: (req, res) => {
    const myUser = req.session.Usuario;
    db.User.findAll().then((users) => {
      db.Rol.findAll().then((allRoles) => {
        return res.render("admin/userList", { users, allRoles, myUser });
      });
    });
  },

  userDetail: (req, res) => {
    const myUser = req.session.Usuario;
    const id = parseInt(req.params.id);
    const lectura = true;
    db.User.findByPk(id, {
      include: ["roles"],
    }).then((user) => res.render("admin/userDetail", { user, lectura, myUser }));
  },

  userCreate: function (req, res) {
    const myUser = req.session.Usuario;
    db.Rol.findAll().then((roles) => res.render("admin/userCreate", { roles, myUser }));
  },

  userSave: function (req, res) {
    const myUser = req.session.Usuario;
    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
      db.Rol.findAll().then((roles) =>
        res.render("admin/userCreate", {
          errors: resultValidation.mapped(),
          oldData: req.body,
          roles,
        })
      );
    } else {
      db.User.findAll().then((users) => {
        let nuevoId;
        if (users.length) {
          nuevoId = users[users.length - 1].id + 1;
        } else {
          nuevoId = 1;
        }

        console.log("req.file : ", req.file.filename);

        const nuevoUsuario = {
          id: nuevoId,
          name: req.body.nombre,
          mail: req.body.correo,
          roleId: req.body.cmbRol,
          password: req.body.password, //bcryptjs.hashSync(req.body.password, 10),
          image: "/images/user-images/usuario-1691700701547.jpg",
        };

        //  res.send(nuevoUsuario);

        db.User.create(nuevoUsuario).then(() =>
          res.redirect("/admin/userlist")
        );
      });
    }
  },

  userEdit: (req, res) => {
    const myUser = req.session.Usuario;
    const id = parseInt(req.params.id);
    db.User.findByPk(id, { include: ["roles"] }).then((user) => {
      db.Rol.findAll().then((allRoles) => {
        const oldData = {
          id: user.id,
          nombre: user.name,
          correo: user.mail,
          rolId: user.roleId,
          roles: user.roles,
        };
        console.log("oldData : ", oldData);
        console.log("roles : ", allRoles);
        return res.render("admin/userEdit", { oldData, roles: allRoles, myUser });
        //    res.send(user);
      });
    });
  },

  userUpdate: (req, res) => {
    const myUser = req.session.Usuario;
    const id = parseInt(req.params.id);
    const resultValidation = validationResult(req);
    const oldData = {
      id: id,
      nombre: req.body.nombre,
      correo: req.body.correo,
      rolId: req.body.rolId,
      roles: req.body.roles,
    };

    if (resultValidation.errors.length > 0) {
      db.Rol.findAll().then((allRoles) => {
        return res.render(`admin/userEdit`, {
          errors: resultValidation.mapped(),
          oldData,
          roles: allRoles,
          myUser
        });
      });
    } else {
      const usuario = {
        id: id,
        name: req.body.nombre,
        mail: req.body.correo,
        roleId: req.body.cmbRol,
        password: req.body.password,//bcryptjs.hashSync(req.body.password, 10),
        //image: "/images/user-images/" + req.file.filename,
      };

      db.User.update(usuario, { where: { id: id } })
        .then(() => res.redirect("/admin/userList"))
        .catch((error) => res.send(error));
    }
  },

  userDelete: (req, res) => {
    const myUser = req.session.Usuario;
    const id = parseInt(req.params.id);
    const lectura = false;
    db.User.findByPk(id, {
      include: ["roles"],
    }).then((user) => res.render("admin/userDetail", { user, lectura, myUser }));
  },

  userDestroy: (req, res) => {
    const id = parseInt(req.params.id);
    const myUser = req.session.Usuario;
    console.log(id);
    db.User.destroy({
      where: { id: id },
    })
      .then(() => {
        return res.redirect("/admin/userList");
      })
      .catch((error) => res.send(error));
  },
};

module.exports = controller;
