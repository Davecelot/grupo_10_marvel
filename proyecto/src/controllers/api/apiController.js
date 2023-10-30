const db = require('../../database/models');
const sequelize = db.sequelize;

const apiController = {
    listUser: (req, res) => {
        db.User.findAll({
            attributes: ['id', 'name', 'mail']
        })
            .then(users => {
                return res.status(200).json({
                    count: users.length,
                    users: users,
                    status: 200,
                    detail: '/api/users/:id'
                })
            })
    },
    detailUser: (req, res) => {
        db.User.findByPk(req.params.id,{
            attributes: ['id', 'name', 'mail', 'image']
        })
            .then(user => {
                return res.status(200).json({
                    data: user,
                    status: 200
                });
            });
    },

    listProducts: (req, res) => {
        db.Movie.findAll({
            attributes: ['id', 'name', 'description'],
             include: ["genres", "classifications"]
        })
            .then(movies => {
                return res.status(200).json({
                    count: movies.length,
                    movies: movies,
                    status: 200,
                    detail: '/api/products/:id'
                })
            })
    },

    detailProducts: (req, res) => {
        db.Movie.findByPk(req.params.id,{
            attributes: ['id', 'name', 'description', 'image'],
            include: ["genres", "classifications"]
        })
            .then(movie => {
                return res.status(200).json({
                    data: movie,
                    status: 200
                });
            });
    },
    listGenres: (req, res) => {
        db.Genero.findAll({
            attributes: ['id', 'name']
        })
            .then(genero => {
                return res.status(200).json({
                    count: genero.length,
                    genero: genero,
                    status: 200
                })
            })
    }

}

module.exports = apiController;