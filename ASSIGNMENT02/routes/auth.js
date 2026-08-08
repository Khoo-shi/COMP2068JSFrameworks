var express = require('express');
var router = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { ensureGuest } = require('../middleware/auth');

// Show registration page
router.get('/register', ensureGuest, function (req, res) {
  res.render('auth/register', {
    title: 'Create Account'
  });
});

// Create a local user account
router.post('/register', ensureGuest, async function (req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).render('auth/register', {
        title: 'Create Account',
        errorMessage: 'Passwords do not match.',
        formData: req.body
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).render('auth/register', {
        title: 'Create Account',
        errorMessage: 'An account with this email already exists.',
        formData: req.body
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    req.flash('success', 'Account created successfully. Please log in.');
    res.redirect('/login');
  } catch (error) {
    next(error);
  }
});

// Show login page
router.get('/login', ensureGuest, function (req, res) {
  res.render('auth/login', {
    title: 'Login'
  });
});

// Process local email/password login
router.post(
  '/login',
  ensureGuest,
  passport.authenticate('local', {
    successRedirect: '/resources',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// Log out
router.get('/logout', function (req, res, next) {
  req.logout(function (error) {
    if (error) {
      return next(error);
    }

    req.flash('success', 'You have been logged out.');
    res.redirect('/');
  });
});

// Send user to GitHub
router.get(
  '/auth/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

// GitHub callback
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  function (req, res) {
    res.redirect('/resources');
  }
);

module.exports = router;