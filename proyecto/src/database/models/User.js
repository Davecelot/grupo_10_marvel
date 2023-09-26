const { DataTypes } = require('sequelize');
const sequelize = require("../sequelize");

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
            roleId: DataTypes.BIGINT(10).UNSIGNED,
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

    return User;
};