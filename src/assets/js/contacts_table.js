document.addEventListener('DOMContentLoaded', fetchData);

const state = {
    contacts: [],
    currentPage: 1,
    rowsPerPage: 10
};

async function fetchData() {
    setLoading(true);
    try {
        const response = await fetch('http://localhost:8085/api/contacts/all');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Unexpected data format: expected an array');

        state.contacts = data;
        renderTable();
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    // Implement your loading state logic here
}

function renderTable() {
    const tableBody = document.querySelector('.table.table-hover tbody');
    if (!tableBody) {
        return console.error("Error: Table body element not found.");
    }

    const paginatedContacts = paginate(state.contacts, state.currentPage, state.rowsPerPage);
    tableBody.innerHTML = paginatedContacts.map(contact => `
        <tr>
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
        </tr>
    `).join('');

    updatePageInfo();
}

function paginate(items, page, rowsPerPage) {
    const start = (page - 1) * rowsPerPage;
    return items.slice(start, start + rowsPerPage);
}

function updatePageInfo() {
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        pageInfo.textContent = `Page ${state.currentPage} of ${Math.ceil(state.contacts.length / state.rowsPerPage)}`;
    }
}

function changePage(direction) {
    const maxPage = Math.ceil(state.contacts.length / state.rowsPerPage);
    state.currentPage = Math.max(1, Math.min(state.currentPage + direction, maxPage));
    renderTable();
}

function sortTable(columnIndex) {
    const columnKeys = ['id', 'firstName', 'lastName', 'email', 'phone1', 'phone2', 'street', 'city', 'postCode', 'country'];
    const key = columnKeys[columnIndex];

    state.contacts.sort((a, b) => {
        if (typeof a[key] === 'string') return a[key].localeCompare(b[key]);
        return a[key] - b[key];
    });

    if (JSON.stringify(state.contacts) === JSON.stringify([...state.contacts].reverse())) {
        state.contacts.reverse();
    }

    renderTable();
}