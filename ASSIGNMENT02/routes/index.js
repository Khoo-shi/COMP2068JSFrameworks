var express = require('express');
var router = express.Router();

/**
 * Displays the public LocalLink splash page.
 */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Home'
  });
});

module.exports = router;