document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', filterContacts);
});

function filterContacts() {
    const filterValue = document.getElementById('search-input').value.toLowerCase();
    const tableBody = document.querySelector('.contacts-table tbody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const allText = row.textContent.toLowerCase();
        row.style.display = allText.includes(filterValue) ? '' : 'none';
    });

        // If pagination is used, ensure all pages are searched
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            const allPages = pagination.querySelectorAll('a');
            allPages.forEach(page => {
                page.click();
                const rows = tableBody.querySelectorAll('tr');
                rows.forEach(row => {
                    const allText = row.textContent.toLowerCase();
                    row.style.display = allText.includes(filterValue) ? '' : 'none';
                });
            });
        }
}

/**
 * Debounce function to limit how often the filterContacts function is called.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The time to wait before invoking the function.
 * @returns {Function} A debounced version of the input function.
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
