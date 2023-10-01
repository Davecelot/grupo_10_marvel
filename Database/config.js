//Poner este archivo en proyecto/src/database/config y configurarlo de acuerdo a tu instalacion de mysql o mariadb

module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "marvel_movies",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
