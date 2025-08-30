const shortid = require('shortid');
const URL = require('../models/url');

async function generateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ Error: 'URL is required' });

    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy : req.user._id,
    });

    const allurls = await URL.find({});
    return res.render('home', { id: shortId, urls: allurls });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = { generateNewShortURL, handleGetAnalytics };
