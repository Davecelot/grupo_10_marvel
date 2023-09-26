module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING(50),
            allowNull: false
        },
        genreId: dataTypes.BIGINT(10),
        length: dataTypes.BIGINT(10),
        year: dataTypes.BIGINT(4).UNSIGNED,
        classificationId: dataTypes.BIGINT(10),
        description: {
            type: dataTypes.STRING(255).UNSIGNED,
            allowNull: false
        },
        contentWarning: dataTypes.STRING(50),
        director: dataTypes.STRING(50),
        cast: dataTypes.STRING(255),
        studio: dataTypes.STRING(50),
        price: dataTypes.FLOAT,
        image: dataTypes.STRING(50),
        subtitles: dataTypes.STRING(50)
        //created_at: dataTypes.TIMESTAMP,
        //updated_at: dataTypes.TIMESTAMP,
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Movie = sequelize.define(alias,cols,config);

    Movie.associate = function (models) {
        Movie.belongsTo(models.Genero, { // models.Genre -> Genres es el valor de alias en genres.js
            as: "genres",
            foreignKey: "genreId"
        })

        Movie.belongsTo(models.Clasificacion, { // models.Actor -> Actors es el valor de alias en actor.js
            as: "classifications",
            foreignKey: 'classificationId'
        })
    }

    return Movie
};