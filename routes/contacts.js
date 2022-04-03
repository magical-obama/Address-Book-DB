// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const ContactModel = require('../db/models/contact');
const moment = require('moment');
const handleError = require('../error-handler');

router.get('/', async (_req, res) => {
    var contacts = await db.collection('contacts').find().toArray();
    if (contacts.length != 0) {
        contacts.forEach(contact => {
            contact.birthdate = moment(contact.birthdate).format('MMMM Do YYYY');
        });
        res.render('view-contacts', { contacts: contacts });
    } else {
        res.render('view-contacts', { contacts: contacts, message: "No contacts found." });
    }
});

router.get('/add', (req, res) => {
    // console.log(req.query);
    if (req.query.success != undefined) {
        // console.log("Success Message");
        res.render('add-contact', { message: "Successfully added contact." });
    } else if (req.query.error != undefined) {
        // console.log("Error message");
        handleError("Adding Contact failed on GET");
        res.render('add-contact', { message: "Error adding contact." });
    } else {
        // console.log("No message");
        res.render('add-contact');
    }
});

router.post('/add', (req, res) => {
    var contact = new ContactModel(req.body);
    if (contact.name != "") {
        // console.log(user);
        db.collection('contacts').insertOne(contact, (err, _result) => {
            if (err) {
                handleError("Adding Contact failed on POST", err);
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
        db.collection('contacts').deleteMany({}, (err, _result) => {
            if (err) {
                handleError("Deleting all contacts failed on POST", err);
            } else {
                console.log("Deleted all contacts");
            }
        });
        res.redirect('/');
    } else {
        res.render('500');
    }
});

router.get('/:id/edit', async (req, res) => {
    var sanitizedId = new mongoose.Types.ObjectId(req.params.id);
    // deepcode ignore Sqli: Not true
    var contact = await db.collection('contacts').findOne({ _id: sanitizedId });
    contact.birthdate = moment(contact.birthdate).format("YYYY-MM-DD");
    // console.log(contact.birthdate);
    if (req.query.success != undefined) {
        // console.log("Success Message");
            res.render('edit-contact', { contact: contact, message: "Successfully edited contact." });
    }
    res.render('edit-contact', { contact: contact });
});

router.post('/:id/update', async (req, res) => {
    var sanitizedId = new mongoose.Types.ObjectId(req.params.id);
    // deepcode ignore Sqli: <please specify a reason of ignoring this>
    // db.collection('contacts').updateOne({ _id: sanitizedId }, { $set: req.body }, (err, result) => {
    //     if (err) {
    //         handleError("Updating contact failed on POST", err);
    //     } else {
    //         console.log("Updated contact");
    //     }
    // });
    await db.collection('contacts').updateOne({ _id: sanitizedId }, { $set: req.body });
    res.redirect('/contacts/' + sanitizedId + '/edit?success');
});

router.post('/:id/delete', (req, res) => {
    var sanitizedId = new mongoose.Types.ObjectId(req.params.id);
    // deepcode ignore Sqli: <please specify a reason of ignoring this>
    db.collection('contacts').deleteOne({ _id: sanitizedId }, (err, _result) => {
        if (err) {
            handleError("Deleting contact failed on POST", err);
        } else {
            console.log("Deleted contact");
        }
    });
    res.redirect('/contacts');
});


module.exports = router;