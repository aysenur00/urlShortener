const express = require("express")
const mongoose = require("mongoose")
const ShortUrl = require("./models/shortUrl")
const dotenv = require("dotenv")
const app = express();
dotenv.config();

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true, useUnifiedTopology: true
})
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render("index", { shortUrls: shortUrls })
})

app.post("/shortUrls", async (req, res) => {
    await ShortUrl.create({ fullUrl: req.body.fullUrl })
    res.redirect("/")
})
app.get("/:shortUrl", async (req, res) =>{
    const shortUrl = await ShortUrl.findOne({shortUrl: req.params.shortUrl})
    if(shortUrl == null){
        return res.sendStatus(404)
    }
    shortUrl.noOfClicks++
    shortUrl.save()

    res.redirect(shortUrl.fullUrl)
})

app.listen(process.env.PORT);