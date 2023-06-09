const express = require("express");
const path = require("path");
const app = express();
const publicPath = path.resolve(__dirname, "../public");
const rutaMain = require("./routes/main");
const rutaUsers = require("./routes/users");
const rutaProducts = require("./routes/products");

app.set("view engine","ejs");
app.set("views", __dirname + "/views");
app.use(express.static(publicPath));
app.use('/', rutaMain);
app.use('/users', rutaUsers);
app.use('/products', rutaProducts);

app.listen(3000, console.log("Aplicacion levantada http://localhost:3000"));
