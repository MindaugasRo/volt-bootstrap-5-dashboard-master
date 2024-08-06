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
    const tableBody = document.querySelector('.contacts-table tbody');
    if (!tableBody) {
        return console.error("Error: Table body element not found.");
    }

    const paginatedContacts = paginate(state.contacts, state.currentPage, state.rowsPerPage);
    tableBody.innerHTML = paginatedContacts.map(contact => `
        <tr>
            <td>${contact.id}</td>
            <td>${contact.firstName}</td>
            <td>${contact.secondName}</td>
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

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        return console.error("Error: Pagination element not found.");
    }

    const maxPage = Math.ceil(state.contacts.length / state.rowsPerPage);
    const currentPage = state.currentPage;
    const pageItems = [];

    const createPageItem = (page, label = page) => {
        const isActive = page === currentPage ? 'active' : '';
        return `
            <li class="page-item ${isActive}">
                <button class="page-link" onclick="goToPage(${page})">${label}</button>
            </li>
        `;
    };

    // Pridedame "Previous" mygtuką
    pageItems.push(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(-1)">Previous</button>
        </li>
    `);

    // Puslapių logika: rodome tik ribotą kiekį aplink esamą puslapį
    const delta = 2; // Kiek puslapių rodyti prieš ir po esamo puslapio
    let startPage = Math.max(1, currentPage - delta);
    let endPage = Math.min(maxPage, currentPage + delta);

    if (startPage > 1) {
        pageItems.push(createPageItem(1)); // Pirmas puslapis
        if (startPage > 2) {
            pageItems.push(createPageItem(null, '...')); // Praleisti puslapius
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageItems.push(createPageItem(i));
    }

    if (endPage < maxPage) {
        if (endPage < maxPage - 1) {
            pageItems.push(createPageItem(null, '...')); // Praleisti puslapius
        }
        pageItems.push(createPageItem(maxPage)); // Paskutinis puslapis
    }

    // Pridedame "Next" mygtuką
    pageItems.push(`
        <li class="page-item ${currentPage === maxPage ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(1)">Next</button>
        </li>
    `);

    pagination.innerHTML = pageItems.join('');
}

function goToPage(page) {
    if (page) {
        state.currentPage = page;
        renderTable();
        renderPagination(); // Atnaujinti puslapiavimą po puslapio keitimo
    }
}

function changePage(direction) {
    const maxPage = Math.ceil(state.contacts.length / state.rowsPerPage);
    const newPage = state.currentPage + direction;
    if (newPage >= 1 && newPage <= maxPage) {
        goToPage(newPage);
    }
}

let sortDirection = 1;

function sortTable(columnIndex) {
    const columnKey = Object.keys(state.contacts[0])[columnIndex];
    state.contacts.sort((a, b) => {
        if (a[columnKey] < b[columnKey]) return -sortDirection;
        if (a[columnKey] > b[columnKey]) return sortDirection;
        return 0;
    });
    sortDirection *= -1; // toggle sort direction
    renderTable();
}