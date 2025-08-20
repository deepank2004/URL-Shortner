const express = require('express');
const URLroute = require('./routes/url')
const {connectToMongoDB} = require('./connect')
const URL = require("./models/url")
const path = require('path');
const staticRoute = require("./routes/staticRouter")

const app = express();

const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(()=>{
    console.log('Mongodb connected');
})

app.set("view engine" , "ejs");
app.set('Views' , path.resolve("./Views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/url' , URLroute);

app.use('/' , staticRoute);

app.get('/:shortId' , async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    } , {$push: {
        visitHistory: {timestamp : Date.now()}
    }})
    res.redirect(entry.redirectURL)
})

app.listen(PORT , ()=>{
    console.log(`Server Started at PORT : ${PORT}`);
})