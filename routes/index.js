const express = require('express');
const router = express.Router();
const ContactModel = require('../db/models/contact');
const { body, validationResult } = require('express-validator');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const db = mongoose.connection;

// Home page route.
// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
router.get('/', async (_req, res) => {
    var contactCount = await db.collection('contacts').countDocuments();
    if (contactCount == 0) {
        res.render("index", { contactCount: contactCount, message: "No contacts found." });
    } else {
        res.render("index", { contactCount: contactCount });
    }
});

router.get('/about', function (_req, res) {
    res.render('about');
});

module.exports = router;