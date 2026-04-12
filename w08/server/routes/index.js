const express = require('express');
const router = express.Router();

router.use(require('./auth'));
router.use(require('./category'));
router.use(require('./recipe'));
router.use(require('./user'));
router.use(require('./rating'));

module.exports = router;
