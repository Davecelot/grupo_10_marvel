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

    //const users = mainController.leerJson("users.json");
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
        roleId: req.body.cmbRol,
        password: bcryptjs.hashSync(req.body.password, 10),
        image: "/images/user-images/" + req.file.filename,
      };

      //  res.send(nuevoUsuario);

      db.User.create(nuevoUsuario).then(() => res.redirect("/users/login"));
    });

    //     let nuevoUsuario = {
    //       id: users[users.length - 1].id + 1,
    //       nombre: req.body.nombre,
    //       correo: req.body.correo,
    //       rol: "User",
    //       contraseña: bcryptjs.hashSync(req.body.password, 10),
    //       image: "/images/user-images/" + req.file.filename,
    //     };

    //     users.push(nuevoUsuario);
    //     let nuevoUsuarioGuardar = JSON.stringify(users, null, 2);
    //     fs.writeFileSync(
    //       path.resolve(__dirname, "../data/users.json"),
    //       nuevoUsuarioGuardar
    //     );

    //     return res.redirect("/users/login");
  },

  logged: (req, res) => {
    const resultValidation = validationResult(req);
    const mailFind = req.body.correo;
    const passFind = req.body.password;
    const users = mainController.leerJson("users.json");
    const user = users.find(
      (user) => user.correo === mailFind && user.contraseña === passFind
    );
    if (user === undefined) {
      const errorCredencial = {
        type: "field",
        value: "Sin Importancia",
        msg: "Credenciales invalidas",
        path: "credenciales",
        location: "body",
      };
      resultValidation.errors.push(errorCredencial);
    }
    if (resultValidation.errors.length === 0) {
      req.session.Usuario = user.nombre;
      if (req.body.preservar) {
        res.cookie("usuario", user.nombre, { maxAge: 3600000 });
      } else {
        res.clearCookie("usuario");
      }
      return res.redirect("/");
    } else {
      return res.render("users/login", {
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }
  },
};

module.exports = controller;
