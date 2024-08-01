document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});


/**
 * Represents the state of the contacts.
 * @typedef {Object} State
 * @property {Array} contacts - The array of contacts.
 * @property {number} currentPage - The current page number.
 * @property {number} rowsPerPage - The number of rows per page.
 */

/**
 * The state object for contacts.
 * @type {State}
 */
const state = {
    contacts: [],
    currentPage: 1,
    rowsPerPage: 10
};


/**
 * Fetches data from the server and updates the state with the fetched contacts.
 * @returns {Promise<void>} A promise that resolves when the data is fetched and the table is rendered.
 */
async function fetchData() {
    try {
        const response = await fetch('http://localhost:8085/api/contacts/all');
        state.contacts = await response.json();
        renderTable();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


/**
 * Renders the table with paginated contacts data.
 */
function renderTable() {
    const tableBody = document.querySelector('#contacts-table tbody');
    tableBody.innerHTML = '';

    const start = (state.currentPage - 1) * state.rowsPerPage;
    const end = start + state.rowsPerPage;
    const paginatedContacts = state.contacts.slice(start, end);

    paginatedContacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.id}</td>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phone1}</td>
            <td>${contact.phone2}</td>
            <td>${contact.street}</td>
            <td>${contact.city}</td>
            <td>${contact.postCode}</td>
            <td>${contact.country}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('page-info').textContent = `Page ${state.currentPage} of ${Math.ceil(state.contacts.length / state.rowsPerPage)}`;
}


/**
 * Changes the current page of the table.
 * @param {number} direction - The direction to move the page. Positive number for next page, negative number for previous page.
 */
function changePage(direction) {
    state.currentPage += direction;
    if (state.currentPage < 1) state.currentPage = 1;
    if (state.currentPage > Math.ceil(state.contacts.length / state.rowsPerPage)) state.currentPage = Math.ceil(state.contacts.length / state.rowsPerPage);
    renderTable();
}


/**
 * Sorts the contacts table based on the specified column index.
 *
 * @param {number} columnIndex - The index of the column to sort by.
 */
function sortTable(columnIndex) {
    const columnKeys = [
        'id', 'firstName', 'lastName', 'email', 'phone1', 'phone2', 
        'street', 'city', 'postCode', 'country'
    ];

    const key = columnKeys[columnIndex];
    const sortedContacts = [...state.contacts].sort((a, b) => {
        if (typeof a[key] === 'string') {
            return a[key].localeCompare(b[key]);
        }
        return a[key] - b[key];
    });

    if (JSON.stringify(state.contacts) === JSON.stringify(sortedContacts)) {
        state.contacts.reverse();
    } else {
        state.contacts = sortedContacts;
    }

    renderTable();
}

