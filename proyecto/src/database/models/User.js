const { DataTypes } = require('sequelize');
const sequelize = require("../sequelize");
const Rol = sequelize.define('roles', { name: DataTypes.STRING(50), description: DataTypes.STRING(255) }, { createdAt: "created_at", updatedAt: "updated_at" });

module.exports = () => {
    const User = sequelize.define('User',
        {
            id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            mail: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            roleId: {
                type: DataTypes.BIGINT(10).UNSIGNED,
                foreignKey: true
            },
            password: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            image: DataTypes.STRING(50)
            //created_at: dataTypes.TIMESTAMP,
            //updated_at: dataTypes.TIMESTAMP,
        },
        {
            tableName: "users",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: false
        }
    )

    Rol.hasMany(User, { foreignKey: "roleId" })
    User.belongsTo(Rol, { as: "roles", foreignKey: "roleId" })

    return User;
};