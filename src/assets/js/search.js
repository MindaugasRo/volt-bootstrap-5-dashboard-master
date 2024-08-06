document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', filterContacts);
});

/**
 * Filters the contacts table based on the value entered in the search input field.
 */
function filterContacts() {
    const filterValue = document.getElementById('search-input').value.toLowerCase();
    const tableBody = document.querySelector('.contacts-table tbody');
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const allText = row.textContent.toLowerCase();
        const match = allText.includes(filterValue);
        row.style.display = match ? '' : 'none';
    });
}