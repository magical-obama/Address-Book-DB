const deleteAllButton = document.getElementById('delete-all-contacts-button');
if (deleteAllButton) {
    deleteAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all contacts?')) {
            fetch('/delete_all_contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("Deleted all contacts");
            });
            // location.pathname = '/';
            location.reload();
        }
    });
}
