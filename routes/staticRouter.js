const express = require('express');
const router = express.Router();
const Url = require('../models/url'); // <-- Import your model
const { restrictTo } = require('../middlewares/auth');

router.get('/', restrictTo(["NORMAL"]) , async (req, res) => {
    try {
        if(!req.user) return res.redirect('/login')
        const allurls = await Url.find({ createdBy: req.user._id });
        return res.render('home', {
            urls: allurls
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/signup", (req , res) => {
    return res.render("signup");
})

router.get("/login", (req , res) => {
    return res.render("login");
})

module.exports = router;
