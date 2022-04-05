const moment = require('moment');

function beautify(mongooseDocument) {
    if (Array.isArray(mongooseDocument)) {
        mongooseDocument.forEach((doc) => {
            beautify(doc);
        });
        return mongooseDocument;
    } else {
        let documentObject = mongooseDocument.toObject();
        documentObject.birthdate = moment(documentObject.birthdate).format('YYYY-MM-DD');
        return documentObject;
    }
}

module.exports = { beautify };