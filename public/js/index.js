const deleteAllButton = document.getElementById('delete-all-contacts-button');
if (deleteAllButton) {
    deleteAllButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete all contacts?')) {
            await fetch('/contacts/delete_all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            location.reload();
        }
    });
}
