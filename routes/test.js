const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CustomerModel = require('../db/models/customer');
const db = mongoose.connection;

router.get('/view_customers', async function (_req, res) {
    var customers = await db.collection('customers').find().toArray();
    if (customers.length != 0) {
        res.render('view-customers', { customers: customers });
    } else {
        res.render('500');
    }
});

module.exports = router;