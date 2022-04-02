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

router.get('/add_contact', (_req, res) => {
    res.render('add-contact');
});

router.post('/add_contact', (req, res) => {
    var user = new ContactModel(req.body);
    if (user.name != "") {
        // console.log(user);
        db.collection('contacts').insertOne(user, (err, result) => {
            if (err) {
                console.error('An error has occurred');
            } else {
                console.log("Added new contact");
            }
        });
        res.redirect('/add_contact');
    } else {
        res.send({
            message: "Empty name"
        });
    }
});

router.get('/view_contacts', async (_req, res) => {
    var contacts = await db.collection('contacts').find().toArray();
    // console.log(contacts);
    if (contacts.length != 0) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.render('view-contacts', { contacts: contacts });
    } else {
        res.render('500');
    }
});

module.exports = router;