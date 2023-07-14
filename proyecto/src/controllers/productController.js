const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, './public')))
app.set("view engine","ejs");

const controller = {
    productDetail: function(req, res) {
        res.render('products/productDetail')
    },

    productCart: function(req, res) {
        res.render('products/productCart');
    },

    productList: function(req,res){
        res.render('products/productList')
    },

    createProduct: function(req,res){
        res.render('products/createProducts')
    }
}

module.exports = controller;