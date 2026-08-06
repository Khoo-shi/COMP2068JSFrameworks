var express = require('express');
var router = express.Router();

var Resource = require('../models/Resource');

// Public directory page
// Anyone can view resources, but this route does not allow editing or deleting.
router.get('/', async function (req, res, next) {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });

    res.render('resources/index', {
      title: 'Community Resources',
      resources: resources
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;