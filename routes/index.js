var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //Default data
    let enterprise_data = {
        title: 'Melacut G & C',
        photo_enterprise:'images/IMG-20260114-WA0007.jpg',
        celular1: '73758882',
        celular2: ''
    };

    var DB = req.app.settings.DB;

    let CollectionConfig = DB.collection("configuracion");
    CollectionConfig.find().toArray().then((data) => {

        data.forEach((configitem) => {
              console.log(configitem);
              enterprise_data = {
                  title: configitem.nombre_app,
                  photo_enterprise: configitem.foto,
                  celular1: configitem.celular_1,
                  celular2: configitem.celular_2
              };
              res.render('index', enterprise_data);
        });
    })
    .catch(error => {
          console.log(error.message);
          res.render('index', enterprise_data);
    })
});

module.exports = router;
