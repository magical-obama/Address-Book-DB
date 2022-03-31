const express = require('express');
const path = require('path');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const pages = require('./routes/pages');

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

app.use('/', pages);

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});