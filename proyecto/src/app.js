const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const publicPath = path.resolve(__dirname, "../public");
const rutaMain = require("./routes/main");
const rutaUsers = require("./routes/users");
const rutaProducts = require("./routes/products");
const rutaAdmin = require("./routes/admin");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const rememberUserMiddleware = require("./middlewares/rememberUserMiddleware");

app.use(session({ secret: "supercalifragilisticoespialidoso" }));
app.use(cookieParser());
app.use(rememberUserMiddleware);
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(publicPath));
app.use(methodOverride("_method"));
app.use("/", rutaMain);
app.use("/users", rutaUsers);
app.use("/products", rutaProducts);
app.use("/admin", rutaAdmin);

app.listen(3000, console.log("Aplicacion levantada http://localhost:3000"));

//probar modelo
/*const db = require("./database/models");
db.User.findAll()
.then((result) => {
    console.log(result)
})
*/