const path = require('path');

const gameController = {
  index: (_, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  },
};

module.exports = gameController;
