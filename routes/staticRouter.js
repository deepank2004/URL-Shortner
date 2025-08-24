const express = require('express');
const router = express.Router();
const Url = require('../models/url'); // <-- Import your model

router.get('/', async (req, res) => {
    try {
        const allurls = await Url.find({});
        return res.render('home', {
            urls: allurls
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
