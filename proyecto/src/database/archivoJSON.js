const path = require("path");
const fs = require("fs");

const lector = {
  leerJson: (archivo) => {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, `../data/${archivo}`))
    );
  },
};

module.exports = lector;
