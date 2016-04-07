var express = require('express');
var router = express.Router();

var examples = require('./examples');

// register root route /api
router.get('/', function(req, res) {
  res.send('Robopatrol rest api');
});

// register example router /api/examples
router.use('/examples', examples)

// export router so it
module.exports = router;
