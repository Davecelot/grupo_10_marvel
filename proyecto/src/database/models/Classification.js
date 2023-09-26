const { DataTypes } = require('sequelize');
const sequelize = require("../sequelize");

module.exports = () => {
  const Classification = sequelize.define("Classification",
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
    },
    {
      tableName: "classifications",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: false,
    }
  );

 /* Classification.associate = function (models) {
    Classification.hasMany(Movie, {
      as: "movies",
      foreign_key: "classificationId"
    });
  };
*/

  return Classification;

};
