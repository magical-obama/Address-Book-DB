function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        fetch('/contacts/' + id + '/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("Deleted contact");
        });
        // location.pathname = '/';
        location.reload();
    }
}