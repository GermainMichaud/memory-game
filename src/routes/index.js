const router = require('express').Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.index);

module.exports = router;
