const express = require('express');
const router = express.Router();

// Home page route.
// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
router.get('/', function (req, res) {
    var title = "Homepage";
    if (req.query.title) {
        title = req.query.title;
    }
    res.render("index", { title: title});
});

router.get('/about', function (_req, res) {
    res.render('about');
});

module.exports = router;