const express = require('express');
const path = require('path');
// const ejs = require('ejs');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use('/', express.static(path.join(__dirname, "public")));

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

app.get('/', (req, res) => {
    var title = "Homepage";
    if (req.query.title) {
        title = req.query.title;
    }
    res.render("index", { title: title});
});

// get about page from /about and about.ejs
app.get('/about', (req, res) => {
    res.render("about");
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});