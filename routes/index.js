var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {config: req.app.settings.MAP.configuracion});
});

module.exports = router;
