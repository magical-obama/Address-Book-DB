document.querySelectorAll('.search-container').forEach((container) => {
    container.querySelector('button').addEventListener('click', (event) => {
        var query = container.querySelector('input').value;
        if (query != "") {
            search(query);
        }
    });
});

function search(query) {
    location.href = '/contacts/search?q=' + query;
}