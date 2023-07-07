const express = require("express");
const path = require("path");
const app = express();
const publicPath = path.resolve(__dirname, "../public");
const rutaMain = require("./routes/main");

app.set("view engine","ejs");
app.set("views", __dirname + "/views");
app.use(express.static(publicPath));
app.use('/', rutaMain);

app.get("/productCart", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views/products/productCart.html"));
});

app.get("/productDetail", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./views/products/productDetail.html"));
});

app.listen(3000, console.log("Aplicacion levantada http://localhost:3000"));
