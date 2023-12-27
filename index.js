const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const articles = [];

const newspapers = [
    {
        name: "dailymail",
        address: "https://www.dailymail.co.uk/sport/football/index.html",
        base: "https://www.dailymail.co.uk"
    },
    {
        name: "thesun",
        address: "https://www.thesun.co.uk/sport/football",
        base: "https://www.thesun.co.uk"
    },
    {
        name: "theguardian",
        address: "https://www.theguardian.com/football",
        base: "https://www.theguardian.com"
    },
    {
        name: "mirror",
        address: "https://www.thesun.co.uk/sport/football",
        base: "https://www.thesun.co.uk"
    },
];

newspapers.forEach((newspaper) => {
    axios.get(newspaper.address).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("football")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: url.includes("https://") ? url : newspaper.base + url,
                source: newspaper.name,
            });
        });
    }).catch((err) => {
        console.log(err);
    })
})



app.get('/', (req, res) => {
    res.json("Welcome to football news app");
})


app.get('/news', (req, res) => {
    res.json(articles);
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base;

    axios.get(newspaperAddress).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticles = [];

        $('a:contains("football")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: url.includes("https://") ? url : newspaperBase + url,
                source: newspaperId,
            });
        });
        res.json(specificArticles)


    }).catch((err) => {
        console.log(err);
    })
})

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
});