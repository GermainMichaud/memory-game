const router = require('express').Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.index);
router.get('/highscores', gameController.highScores);
router.post('/save-score', gameController.addScore);

module.exports = router;
