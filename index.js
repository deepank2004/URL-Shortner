const express = require('express');
const cookieParser = require('cookie-parser')
const { connectToMongoDB } = require('./connect');
const URL = require("./models/url");
const path = require('path');


const {checkForAuthentication , restrictTo} = require('./middlewares/auth')

const URLroute = require('./routes/url');
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user")

const app = express();
const PORT = 8001;

// Connect to MongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./Views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication)

// Routes
app.use('/url', restrictTo(["NORMAL"]) ,URLroute);
app.use('/user', userRoute);
app.use('/', staticRoute);

// Handle short URL redirection
app.get('/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        return res.redirect(entry.redirectURL); // ✅ Fixed property name
    } catch (error) {
        console.error("Error during redirection:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});
