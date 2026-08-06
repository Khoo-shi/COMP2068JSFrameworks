var express = require('express');
var router = express.Router();

var Resource = require('../models/Resource');

// Public directory page
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

// Display the form for creating a new resource
router.get('/new', function (req, res) {
  res.render('resources/new', {
    title: 'Add Resource'
  });
});

// Save a new resource to MongoDB
router.post('/', async function (req, res, next) {
  try {
    await Resource.create({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone,
      website: req.body.website,
      isFree: req.body.isFree === 'on'
    });

    res.redirect('/resources');
  } catch (error) {
    res.status(400).render('resources/new', {
      title: 'Add Resource',
      errorMessage: error.message,
      formData: req.body
    });
  }
});

module.exports = router;