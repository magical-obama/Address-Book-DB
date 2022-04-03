// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const ContactModel = require('../db/models/contact');

router.get('/', async (_req, res) => {
    var contacts = await db.collection('contacts').find().toArray();
    if (contacts.length != 0) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.render('view-contacts', { contacts: contacts });
    } else {
        res.render('500');
    }
});

router.get('/add', (req, res) => {
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

router.post('/add', (req, res) => {
    var contact = new ContactModel(req.body);
    if (contact.name != "") {
        // console.log(user);
        db.collection('contacts').insertOne(contact, (err, result) => {
            if (err) {
                console.error('An error has occurred');
            } else {
                console.log("Added new contact");
            }
        });
        res.redirect('/contacts/add?success');
    } else {
        res.redirect('/contacts/add?error');
    }
});

router.post('/delete_all', async (_req, res) => {
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