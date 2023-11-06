const db = require("../database/models");

module.exports = function (req, res, next) {
    db.User.findAll({ where: { name: req.session.Usuario } }).then((user) => {
        if (user[0].roleId == 1) {
            res.locals.user = user; next();
            console.log("Si tiene permisos de administrador");
        }
        else {
            res.sendStatus(401);
            res.end('no autorizado'); 
            console.log("No tiene permisos para acceder");
        }
    })
} 