const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    username: String,
    name: String,
    address: String,
    birthdate: Date,
    email: String,
    accounts: Array,
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;