const express = require('express');
const path = require('path');
const errorhandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const indexRouter = require('./routes/index');
const app = express();

var csrfProtection = csrf({ cookie: true });

require("dotenv").config();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use('/', express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler());
}

//app.use(csrfProtection);
app.use('/', indexRouter);

// 404 error handler
// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
app.use(function (req, res, _next) {
    res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({
      code: 404,
      error: 'Not found'
    });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});