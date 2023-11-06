const express = require("express");
const path = require("path");
const fs = require("fs");
const mainController = require("./mainController");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const app = express();
const db = require("../database/models");

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  login: function (req, res) {
    res.render("users/login");
  },

  register: function (req, res) {
    db.Rol.findAll().then((roles) => res.render("users/register", { roles }));
  },

  save: function (req, res) {
    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
      return res.render("users/register", {
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }

    db.User.findAll().then((users) => {
      console.log(req.body);
      let nuevoId;
      if (users.length) {
        nuevoId = users[users.length - 1].id + 1;
      } else {
        nuevoId = 1;
      }

      const nuevoUsuario = {
        id: nuevoId,
        name: req.body.nombre,
        mail: req.body.correo,
        roleId: 5,//req.body.cmbRol,
        password: req.body.password,//bcryptjs.hashSync(req.body.password, 10),
        image: "/images/user-images/" + req.file.filename,
      };
      db.User.create(nuevoUsuario).then(() => res.redirect("/users/login"));
    });
  },

  logged: (req, res) => {
    const resultValidation = validationResult(req);
    const mailFind = req.body.correo;
    const passFind = req.body.password;

    db.User.findAll({
      where: { mail: mailFind }
    }).then((user) => {
      if (user == "") {
        const errorCredencial = {
          type: "field",
          value: "Sin Importancia",
          msg: "Credenciales invalidas",
          path: "credenciales",
          location: "body",
        };
        resultValidation.errors.push(errorCredencial);
      } else {
        //console.log(passFind, user[0].password);
       //let result = bcryptjs.compareSync(passFind, user[0].password)
       let result = (passFind == user[0].password)
        if (result == false) {
          const errorPassword = {
            type: "field",
            value: "Sin Importancia",
            msg: "Credenciales invalidas",
            path: "credenciales",
            location: "body",
          };
          resultValidation.errors.push(errorPassword);
        }
      }
      if (resultValidation.errors.length === 0) {
        req.session.Usuario = user[0].name;
        if (req.body.preservar) {
          res.cookie("usuario", user[0].name, { maxAge: 3600000 });
        } else {
          res.clearCookie("usuario");
        }
        if (user[0].roleId == 1) {
          return res.redirect("/admin/index");
        } else {
          return res.redirect("/");
        }
      } else {
        return res.render("users/login", {
          errors: resultValidation.mapped(),
          oldData: req.body,
        });
      }
    });
  },

  cerrarSesion: (req,res) =>{
    console.log("cerrarsesion")
    req.session.Usuario = null;
    res.clearCookie("usuario");
    res.redirect('/users/login')
  }

};

module.exports = controller;
