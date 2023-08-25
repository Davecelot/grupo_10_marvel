const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

const controller = {
  index: function (req, res) {
    console.log(req.cookies);
    //     const myUserCookie = req.cookies.Usuario;
    //     if (myUserCookie) {
    //       req.session.Usuario = myUserCookie;
    //     }
    const myUser = req.session.Usuario;
    res.render("index", { myUser });
  },
  leerJson: (archivo) => {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, `../data/${archivo}`))
    );
  },
};

module.exports = controller;
