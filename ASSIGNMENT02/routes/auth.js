var express = require("express");
var router = express.Router();
const passport = require('passport');

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { ensureGuest } = require('../middleware/auth');

// Registration page
router.get('/register', ensureGuest, function (req, res) {
    res.render("auth/register", {
        title: "Create Account"
    });
});

// Register new user
router.post('/register', ensureGuest, async function (req, res) {

    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render("auth/register", {
            title: "Create Account",
            errorMessage: "Passwords do not match.",
            formData: req.body
        });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.render("auth/register", {
            title: "Create Account",
            errorMessage: "Email already exists.",
            formData: req.body
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.redirect("/login");
});
// Send the user to GitHub to sign in.
router.get(
  '/auth/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

// GitHub sends the user back to this route after authorization.
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