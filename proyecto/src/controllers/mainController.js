const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  index: function (req, res) {
    const myUser = req.session.Usuario;
    res.render("index", { myUser });
  },
  leerJson: (archivo) => {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, `../database/${archivo}`))
    );
  },
};

module.exports = controller;
