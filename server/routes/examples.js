var express = require('express');
var router = express.Router();

// dummy data
var data = [{id: 37, name: 'example 1'}, {id: 23, name: 'example 2'}];

router.route('/')
  // route for GET /api/examples
  .get(function(req, res) {
    res.json({data: data});
  })
  // route for POST /api/examples
  .post(function(req, res) {
    var record = req.body;
    // id is between 1 and 100
    record.id = Math.floor((Math.random() * 100) + 1);
    data.push(record);
    res.json({data: record});
  });

router.route('/:id')
  // route for GET /api/examples/:id
  .get(function(req, res, next) {
    var record;
    var id = req.params.id;
    data.forEach(d => {
      if (d['id'] == id) {
        record = d;
      }
    });
    if (!record) {
      res.status(404).json({error: "Example '" + id + "' not found"});
    } else {
      res.json({data: record});
    }
  })
  // route for PUT /api/examples/:id
  .put(function(req, res) {
    var record;
    var id = req.params.id;
    data.forEach(d => {
      if (d['id'] == id) {
        record = Object.assign(d, req.body);
      }
    });
    if (!record) {
      res.status(404).json({error: "Example '" + id + "' not found"});
    } else {
      res.json({data: record});
    }
  })
  // route for DELETE /api/examples/:id
  .delete(function(req, res) {
    var ix = -1;
    var id = req.params.id;
    data.forEach((el, i, a) => {
      if (el['id'] == id) {
        ix = i;
      }
    });
    if (ix < 0) {
      res.status(404).json({error: "Example '" + id + "' not found"});
    } else {
      data.splice(ix, 1);
      res.json({message: 'Deleted'});
    }
  });

module.exports = router;
