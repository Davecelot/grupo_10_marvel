const { DataTypes, Model } = require('sequelize');
const sequelize = require("../sequelize");
const Genero = sequelize.define('genres', { name: DataTypes.STRING(50), description: DataTypes.STRING(255) }, { createdAt: "created_at", updatedAt: "updated_at" });
const Classification = sequelize.define('classifications', { name: DataTypes.STRING(50), description: DataTypes.STRING(255) }, { createdAt: "created_at", updatedAt: "updated_at" });

module.exports = () => {
    const Movie = sequelize.define('Movie',
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
            genreId: { type: DataTypes.BIGINT(10), foreignKey: true },
            length: DataTypes.BIGINT(10),
            year: DataTypes.BIGINT(4).UNSIGNED,
            classificationId: { type: DataTypes.BIGINT(10), foreignKey: true },
            description: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            contentWarning: DataTypes.STRING(50),
            director: DataTypes.STRING(50),
            cast: DataTypes.STRING(255),
            studio: DataTypes.STRING(50),
            price: DataTypes.FLOAT,
            image: DataTypes.STRING(50),
            subtitles: DataTypes.STRING(50)
            //created_at: dataTypes.TIMESTAMP,
            //updated_at: dataTypes.TIMESTAMP,
        },
        {
            tableName: "movies",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: false
        }
    )

    Genero.hasMany(Movie, { foreignKey: "genreId" })
    Movie.belongsTo(Genero, { as: "genres", foreignKey: "genreId" })

    Classification.hasMany(Movie, { foreignKey: "classificationId" })
    Movie.belongsTo(Classification, { as: "classifications", foreignKey: 'classificationId' })

    return Movie;
};