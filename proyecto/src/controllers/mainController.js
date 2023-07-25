const express = require("express");
const path = require("path");
const fs = require('fs');
const app = express();

app.use(express.static(path.resolve(__dirname, './public')))
app.set("view engine","ejs");

const controller = {
    index: function(req,res){
        res.render('index')
    },
    leerJson: (archivo)=> {
        return JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/${archivo}`)));
    }
}

module.exports = controller;