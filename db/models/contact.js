const mongoose = require('mongoose');

//the mongoose shema for a contact with name, email, phonenumber, address and birthday
const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phonenumber: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    birthday: {
        type: Date,
        required: false
    }
});

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;