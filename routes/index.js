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

router.get('/add_contact', (req, res) => {
    console.log(req.query);
    if (req.query.success != undefined) {
        console.log("Success Message");
        res.render('add-contact', { message: "Successfully added contact." });
    } else if (req.query.error != undefined) {
        console.log("Error message");
        res.render('add-contact', { message: "Error adding contact." });
    } else {
        console.log("No message");
        res.render('add-contact');
    }
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
        res.redirect('/add_contact?success');
    } else {
        res.redirect('/add_contact?error');
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

router.post('/delete_all_contacts', async (_req, res) => {
    var contacts = await db.collection('contacts').find().toArray();
    if (contacts.length != 0) {
        db.collection('contacts').deleteMany({}, (err, result) => {
            if (err) {
                console.error('An error has occurred');
            } else {
                console.log("Deleted all contacts");
            }
        });
        res.redirect('/');
    } else {
        res.render('500');
    }
});

module.exports = router;