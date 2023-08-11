const express = require("express");
const path = require("path");
const fs = require("fs");
const mainController = require("./mainController");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const app = express();

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  login: function (req, res) {
    res.render("users/login");
  },
  register: function (req, res) {
    res.render("users/register");
  },
  save: function (req, res) {
    const resultValidation = validationResult(req);
    const users = mainController.leerJson("users.json");

    if (resultValidation.errors.length > 0) {
      return res.render("users/register", {
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }

    let nuevoUsuario = {
      id: users[users.length - 1].id + 1,
      nombre: req.body.nombre,
      correo: req.body.correo,
      rol: "User",
      contraseña: bcryptjs.hashSync(req.body.password, 10),
      image: "/images/user-images/" + req.file.filename,
    };

    users.push(nuevoUsuario);
    let nuevoUsuarioGuardar = JSON.stringify(users, null, 2);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/users.json"),
      nuevoUsuarioGuardar
    );

    return res.redirect("/users/login");
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
