function handleError(msg, err) {
    if (msg) {
        if (err) {
            console.error(msg + ": " + err);
        } else {
            console.error(msg);
        } 
    } else {
        console.error("Undefined error");
    }
}

module.exports = handleError;