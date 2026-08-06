var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Registration page
router.get("/register", (req, res) => {
    res.render("auth/register", {
        title: "Create Account"
    });
});

// Register new user
router.post("/register", async (req, res) => {

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

module.exports = router;