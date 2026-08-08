var express = require('express');
var router = express.Router();

var Resource = require('../models/Resource');
var { ensureAuthenticated } = require('../middleware/auth');

// Public read-only directory
router.get('/', async function (req, res, next) {
  try {
   const search = req.query.search || "";

let query = {};

if (search) {
  query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } }
    ]
  };
}

const resources = await Resource.find(query).sort({ createdAt: -1 });

   res.render("resources/index", {
    title: "Community Resources",
    resources,
    search
});
  } catch (error) {
    next(error);
  }
});

// Show create form
router.get('/new', ensureAuthenticated, function (req, res) {
  res.render('resources/new', {
    title: 'Add Resource'
  });
});

// Save new resource
router.post('/', ensureAuthenticated, async function (req, res) {
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

// Show edit form
router.get('/:id/edit', ensureAuthenticated, async function (req, res, next) {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).send('Resource not found');
    }

    res.render('resources/edit', {
      title: 'Edit Resource',
      resource
    });
  } catch (error) {
    next(error);
  }
});

// Update resource
router.post('/:id/edit', ensureAuthenticated, async function (req, res) {
  try {
    await Resource.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        address: req.body.address,
        city: req.body.city,
        phone: req.body.phone,
        website: req.body.website,
        isFree: req.body.isFree === 'on'
      },
      {
        runValidators: true
      }
    );

    res.redirect('/resources');
  } catch (error) {
    try {
      const resource = await Resource.findById(req.params.id);

      res.status(400).render('resources/edit', {
        title: 'Edit Resource',
        errorMessage: error.message,
        resource
      });
    } catch (lookupError) {
      res.status(400).send('Unable to update resource');
    }
  }
});

// Show delete confirmation page
router.get('/:id/delete', ensureAuthenticated, async function (req, res, next) {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).send('Resource not found');
    }

    res.render('resources/delete', {
      title: 'Delete Resource',
      resource
    });
  } catch (error) {
    next(error);
  }
});

// Delete resource after confirmation
router.post('/:id/delete', ensureAuthenticated, async function (req, res, next) {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.redirect('/resources');
  } catch (error) {
    next(error);
  }
});

module.exports = router;