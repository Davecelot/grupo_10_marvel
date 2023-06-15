const express = require("express");
const path = require("path")
const app = express();
const publicPath = path.resolve(__dirname,"../public");

app.listen(3000,console.log("Aplicacion levantada en puerto 3000"))
app.use(express.static(publicPath));

app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname,"../views/index.html"))
})