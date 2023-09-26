module.exports = (sequelize, dataTypes) => {
  let alias = "Clasificacion";

  let cols = {
    id: {
      type: dataTypes.BIGINT(10).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: dataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: dataTypes.STRING(255),
      allowNull: true,
    },
  };

  let config = {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: false,
  };

  const Clasificacion = sequelize.define(alias, cols, config);

  Clasificacion.associate = function (models) {
    Clasificacion.hasMany(models.Movie, {
      as: "movies",
      foreign_key: classificationId,
    });
  };

  return Clasificacion;
};
