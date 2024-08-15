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
        renderPagination();
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    // Implement your loading state logic here
}

function generateActionButtons() {
    return `
        <div class="dropdown">
            <button class="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0 p-0" data-bs-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg> 
                <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu dashboard-dropdown dropdown-menu-start mt-2 py-1" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-170px, 28px);" data-popper-placement="bottom-end">
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <svg class="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                    </svg> Edit
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                    <svg class="dropdown-icon text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg> Delete
                </a>
            </div>
        </div>
    `;
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
            <td>${generateActionButtons()}</td>
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
    const delta = 1; // Kiek puslapių rodyti prieš ir po esamo puslapio
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

function changeRowsPerPage() {
    const rowsPerPageSelect = document.getElementById('rows-per-page');
    state.rowsPerPage = parseInt(rowsPerPageSelect.value, 10);
    state.currentPage = 1; // Reset to first page
    renderTable();
    renderPagination();
    updatePageInfo();
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