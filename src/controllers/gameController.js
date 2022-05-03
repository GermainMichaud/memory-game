const path = require('path');
const Score = require('../models/score');

const gameController = {
  index: (_, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  },
  highScores: async (_, res) => {
    try {
      const highScores = await Score.getHighScores();
      res.json(highScores);
    } catch (error) {
      res.status(500).json({ error: 500, message: error.message });
    }
  },
  addScore: async (req, res) => {
    try {
      const { name, duration } = req.body;
      const result = await Score.addScore(name, duration);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 500, message: error.message });
    }
  },
};

module.exports = gameController;
