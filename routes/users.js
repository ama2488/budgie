const users = require('../db/users');
const express = require('express');

const router = express.Router();

router.post('/users', (req, res, next) => {
  users.authenticateUser(req.body.email, req.body.password, (err, user) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.send(JSON.stringify(user));
    }
  });
});

router.post('/users/signup', (req, res, next) => {
  // Joi.validate(req.body, schema, (err, value) => {
  // if (err) {
  //   res.status(400);
  //   res.send(err.message);
  // } else {
  users.createUser(req.body, (error, user) => {
    if (error) {
      res.status(400);
      res.send(error);
    } else {
      res.send(JSON.stringify(user));
    }
  });
  // }
  // });
});

// router.post('/users/signout', (req, res, next) => {
//
// });

module.exports = router;