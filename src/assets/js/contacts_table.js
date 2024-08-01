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
    // Pradėkite kraunimo būseną
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8085/api/contacts/all');

        // Patikrinkite, ar atsakymas buvo sėkmingas
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Patikrinkite, ar gauti duomenys yra masyvas
        if (!Array.isArray(data)) {
            throw new Error('Unexpected data format: expected an array');
        }

        // Atnaujinkite būseną su kontaktais
        state.contacts = data;
        renderTable();
    } catch (error) {
        handleFetchError(error);
    } finally {
        // Užbaigiamas užkrovimas
        setLoading(false);
    }
}

/**
 * Handles errors during the fetch operation.
 * @param {Error} error The error object.
 */
function handleFetchError(error) {
    console.error('Error fetching data:', error);
    // Čia galite pridėti vartotojo pranešimus apie klaidą, pvz., peržiūrint vartotojo sąsają
}

/**
 * Sets the loading state.
 * @param {boolean} isLoading Whether data is being loaded or not.
 */
function setLoading(isLoading) {
    // Čia galite atnaujinti vartotojo sąsają, kad būtų rodoma, jog duomenys yra kraunami
    // Pvz., galite rodyti/krautis užimtumo indikatorių
}

/**
 * Renders the table with paginated contacts data.
 */
function renderTable() {
    const tableBody = document.querySelector('.table.table-hover tbody');
    if (!tableBody) {
        console.error("Error: Table body element not found. Ensure that the element with id 'contacts-table' and its tbody exist in the DOM.");
        return;
    }
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

