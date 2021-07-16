var express = require('express');
var router = express.Router();
var chatRouter = require('./chat');
var usersRouter = require('./users');
var locationRouter = require('./location');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/chat', chatRouter);
router.use('/users', usersRouter);
router.use('/location', locationRouter);

module.exports = router;
