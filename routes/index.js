const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const ContactModel = require('../db/models/contact');
const { body, validationResult } = require('express-validator');
const ejs = require('ejs');
const path = require('path');

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

router.get('/add_contact', function (_req, res) {
    res.render('add-contact');
});

router.post('/add_contact', (req, res) => {
    var user = new ContactModel(req.body);
    console.log(user);
    db.collection('contacts').insertOne(user, (err, result) => {
        if (err) {
            console.error('An error has occurred');
        } else {
            console.log("Added new contact");
        }
    });
    res.redirect('/add_contact');
});

router.get('/view_customers', async function (_req, res) {
    var customers = await db.collection('customers').find().toArray();
    if (customers.length != 0) {
        res.render('view-customers', { customers: customers });
    } else {
        res.render('500');
    }
});


module.exports = router;