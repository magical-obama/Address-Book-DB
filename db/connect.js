const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI + '/' + process.env.MONGODB_DB).then(
    () => {
        console.log('Connected to MongoDB');
    },
    err => {
        console.log('Error connecting to MongoDB: ' + err);
        process.exit(1);
    }
);