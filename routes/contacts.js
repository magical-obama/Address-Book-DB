// file deepcode ignore NoRateLimitingForExpensiveWebOperation: <please specify a reason of ignoring this>
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const Contact = require('../db/models/contact');
const moment = require('moment');
const handleError = require('../error-handler');
const { body, validationResult } = require('express-validator');

function validateContact(req, res, next) {
    body('name').isLength({ min: 1 }).trim().escape();
    body('email').isEmail().normalizeEmail().trim().escape();
    body('address').isLength({ min: 1 }).trim().escape();
    body('phonenumber').isMobilePhone().trim().escape();
    body('birthday').isISO8601().trim().escape();
    next();
}


/**
router.get('/', (_req, res) => {
    db.collection('contacts').find().toArray((err, contacts) => {
        if (err) {
            handleError("500 error", err);
            res.render('500');
        } else {
            if (contacts.length != 0) {
                contacts.forEach(contact => {
                    contact.birthday = moment(contact.birthday).format('MMMM Do YYYY');
                });
                res.render('view-contacts', { contacts: contacts });
            } else {
                res.render('view-contacts', { contacts: contacts, message: "No contacts found." });
            }
        }
    });
});
*/

router.get('/', (_req, res) => {
    db.collection('contacts').find().toArray((err, contacts) => {
        if (err) {
            handleError("500 error", err);
            res.render('500', { message: err});
        } else {
            if (contacts.length != 0) {
                contacts.forEach(contact => {
                    let contactObject = contact.toObject();
                    contactObject.birthdate = moment(contactObject.birthdate).format("YYYY-MM-DD");
                });
                res.render('view-contacts', { contacts: contacts });
            } else {
                res.render('view-contacts', { contacts: contacts, message: "No contacts found." });
            }
        }
    });
});

router.get('/add', (req, res) => {
    if (req.query.success != undefined) {
        res.render('add-contact', { message: "Successfully added contact." });
    } else if (req.query.error != undefined) {
        res.render('add-contact', { message: "Error adding contact." });
    } else {
        res.render('add-contact');
    }
});

/**
router.post('/add',
    body('name').isAlpha().withMessage('Name must be alphabetic.'),
    body('email').isEmail().normalizeEmail().withMessage('Email must be valid.'),
    body('birthday').isISO8601().withMessage('birthday must be valid.'),
    (req, res) => {
        var contact = new ContactModel(req.body);
        if (contact.name != "") {
            db.collection('contacts').insertOne(contact, (err, result) => {
                if (err) {
                    handleError("Adding Contact failed on POST", err);
                } else {
                    console.log("Added new contact:" + result.insertedId);
                }
            });
            res.redirect('/contacts/add?success');
        } else {
            res.redirect('/contacts/add?error');
        }
    }
);
*/

router.post('/add', validateContact, (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.redirect('/contacts/add?error');
    } else {
        Contact.create(req.body, (contactErr, contact) => {
            db.collection('contacts').insertOne(contact, (dbErr, result) => {
                if (dbErr) {
                    handleError("Adding Contact failed on POST", dbErr);
                    res.redirect('/contacts/add?error');
                } else {
                    console.log("Added new contact:" + result.insertedId);
                    res.redirect('/contacts/add?success');
                }
            });
        });
    }
});

/**
router.post('/delete_all', (_req, res) => {
    db.collection('contacts').find().toArray((err, contacts) => {
        if (err) {
            handleError("500 error", err);
            res.render('500');
        } else {
            if (contacts.length != 0) {
                db.collection('contacts').deleteMany({}, (mongoErr, _result) => {
                    if (mongoErr) {
                        handleError("Deleting all contacts failed on POST", mongoErr);
                    } else {
                        console.log("Deleted all contacts");
                    }
                });
                res.redirect('/');
            } else {
                res.render('500');
            }
        }
    });
});
*/

router.post('/delete_all', (_req, res) => {	
    Contact.deleteMany({}, (err, _result) => {
        if (err) {
            handleError("Deleting all contacts failed on POST", err);
            res.send({
                error: "Deleting all contacts failed on POST",
                err: err
            });
        } else {
            console.log("Deleted all contacts");
            res.send({
                success: "Deleted all contacts"
            });
        }
    });
});

/**
router.get('/:id/edit', (req, res) => {
    var sanitizedId = new mongoose.Types.ObjectId(req.params.id);
    db.collection('contacts').findOne({ _id: sanitizedId }, (err, contact) => {
        if (err) {
            handleError("Editing contact failed on GET", err);
        } else {
            contact.birthday = moment(contact.birthday).format("YYYY-MM-DD");
            if (req.query.success != undefined) {
                res.render('edit-contact', { contact: contact, message: "Successfully edited contact." });
            } else {
                res.render('edit-contact', { contact: contact });
            }
        }
    });
});
*/

router.get('/:id/edit', (req, res) => {
    Contact.findById(req.params.id, (err, contact) => {
        if (err) {
            handleError("Editing contact failed on GET", err);
            res.send({
                error: "Editing contact failed on GET",
                err: err
            });
        } else {
            var contactObject = contact.toObject();
            contactObject.birthdate = moment(contactObject.birthdate).format("YYYY-MM-DD");
            console.log("Found contact:" + JSON.stringify(contactObject));
            res.render('edit-contact', { contact: contactObject });
        }
    });
});

/**
router.post('/:id/update', (req, res) => {
    var sanitizedId = new mongoose.Types.ObjectId(req.params.id);
    db.collection('contacts').updateOne({ _id: sanitizedId }, { $set: req.body }, (err, _result) => {
        if (err) {
            handleError("Updating contact failed on POST", err);
            res.redirect('/contacts/' + sanitizedId + '/edit?error');
        } else {
            console.log("Updated contact: " + sanitizedId);
            res.redirect('/contacts/' + sanitizedId + '/edit?success');
        }
    });
});
*/

router.post('/:id/update', validateContact,(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.redirect('/contacts/' + req.params.id + '/edit?error');
    } else {
        Contact.create(req.body, (err, contact) => {
            console.log("Updated contact: " + contact);
            Contact.findByIdAndUpdate(req.params.id, contact, (queryErr, contactResult) => {
                if (queryErr) {
                    handleError("Updating contact failed on POST", queryErr);
                    res.send({
                        error: "Updating contact failed on POST",
                        err: queryErr
                    });
                } else {
                    console.log("Updated contact: " + contactResult);
                    res.redirect('/contacts/');
                }
            });
        });
    }
});

router.post('/:id/delete', (req, res) => {
    var sanitizedId = new mongoose.Types.ObjectId(req.params.id);
    db.collection('contacts').deleteOne({ _id: sanitizedId }, (err, result) => {
        if (err) {
            handleError("Deleting Contact failed on POST", err);
            res.render('500');
        } else {
            console.log("Deleted Contact:", result.deletedCount);
        }
    });
    res.redirect('/contacts');
});

router.get('/search', (req, res) => {
    var search = req.query.q;
    if (search === undefined) {
        search = "";
    }
    // deepcode ignore Sqli: <please specify a reason of ignoring this>
    db.collection('contacts').find({ name: { $regex: search, $options: 'i' } }).toArray((err, contacts) => {
        if (err) {
            handleError("Searching contacts failed on GET", err);
            res.render('500');
        } else {
            contacts.forEach(contact => {
                contact.birthday = moment(contact.birthday).format('MMMM Do YYYY');
            });
            res.render('search-result', { contacts: contacts });
        }
    });
});

module.exports = router;