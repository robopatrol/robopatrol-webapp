var express = require('express');
var models = require('../models');
var router = express.Router();


router.route('/')
  // route for GET /api/examples
  .get(function(req, res) {
    models.Example.findAll()
      .then(function(data) {
        res.json({data: data});
    });
  })
  // route for POST /api/examples
  .post(function(req, res) {
    models.Example.create(req.body)
      .then(function(data) {
        res.json({data: data});
      });
  });

router.route('/:id')
  // route for GET /api/examples/:id
  .get(function(req, res, next) {
    models.Example.findById(req.params.id)
      .then(function(data) {
        if (data === null) {
          res.status(404).json({error: "Example '" + req.params.id + "' not found"});
        } else {
          res.json({data: data});
        }
      });
  })
  // route for PUT /api/examples/:id
  .put(function(req, res) {
    delete req.body['id'];
    models.Example.update(req.body, {
      where: {
        id: req.params.id
      }
    }).then(function(numberOfUpdatedRows) {
      models.Example.findById(req.params.id)
        .then(function(data) {
          if (data === null) {
            res.status(404).json({error: "Example '" + req.params.id + "' not found"});
          } else {
            res.json({data: data});
          }
        });
    });
  })
  // route for DELETE /api/examples/:id
  .delete(function(req, res) {
    models.Example.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(numberOfDestroyedRows) {
      if (numberOfDestroyedRows === 0) {
        res.status(404).json({error: "Example '" + req.params.id+ "' not found"});
      } else {
        res.json({message: 'Deleted'});
      }
    });
  });

module.exports = router;
