const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, './public')))
app.set("view engine","ejs");

const controller = {
    index: function(req,res){
        res.render('index')
    }
}

module.exports = controller;