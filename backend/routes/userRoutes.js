var express = require('express');
const { createUser, loginUser, deleteUser } = require('../controller/userController');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', createUser);
router.post('/login', loginUser);
router.delete('/delete/:userName', deleteUser);

module.exports = router;
