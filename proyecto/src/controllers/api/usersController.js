const db = require('../../database/models/');
const sequelize = db.sequelize;

const usersController = {
    list: (req, res) => {
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
    detail: (req, res) => {
        db.User.findByPk(req.params.id,{
            attributes: ['id', 'name', 'mail', 'image']
        })
            .then(user => {
                return res.status(200).json({
                    data: user,
                    status: 200
                });
            });
    }

}

module.exports = usersController;