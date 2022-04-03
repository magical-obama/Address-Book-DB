const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const indexRouter = require('./routes/index');
const contactRouter = require('./routes/contacts');
const handleError = require('./error-handler');
require('./db/connect');
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  if (res.type === 'text/html') {
    res.setHeader("Cache-Control", "0");
  }
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use('/', express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/contacts', contactRouter);

// 404 error handler
// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
app.use(function (err, req, res, _next) {
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

  // default to plain-text.send()
  res.type('txt').send('Not found');
  handleError("404 error", err);
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});