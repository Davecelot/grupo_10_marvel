module.exports = (sequelize, dataTypes) => {
  let alias = "Clasificacion";
  let cols = {
    id: {
      type: dataTypes.INT(10).UNSIGNED,
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
};
