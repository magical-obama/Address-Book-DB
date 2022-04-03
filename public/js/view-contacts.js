async function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        await fetch('/contacts/' + id + '/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        location.reload();
    }
}