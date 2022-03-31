const express = require('express');
const path = require('path');
const errorhandler = require('errorhandler');
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
if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler());
}

app.get('/', (req, res) => {
    res.render("index");
});

// get about page from /about and about.ejs
app.get('/about', (req, res) => {
    res.render("about");
});

// app.use((err, req, res, next) => {
//     console.log(err);
//     res.status(err.status).render("error", { error: err });
// });

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});