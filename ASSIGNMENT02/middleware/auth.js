// Allows only authenticated users to continue to a private route.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error', 'Please log in to manage resources.');
  res.redirect('/login');
}

// Prevents logged-in users from opening login or registration pages.
function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/resources');
}

module.exports = {
  ensureAuthenticated,
  ensureGuest
};