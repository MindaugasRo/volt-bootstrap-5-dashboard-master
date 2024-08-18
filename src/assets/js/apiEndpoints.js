const API_BASE_URL = 'http://localhost:8085/api';

const ENDPOINTS = {
  GET_CONTACTS: `${API_BASE_URL}/contacts`,
  GET_ALL_CONTACTS: `${API_BASE_URL}/contacts/all`,
  GET_CONTACTS_BY_ID: `${API_BASE_URL}/contacts/id/{contactId}`,
  DELETE_CONTACT: `${API_BASE_URL}/contacts/delete/{contactId}`,
};

async function deleteContact(contactId) {
    const url = ENDPOINTS.DELETE_CONTACT.replace('{contactId}', contactId);
    const response = await fetch(url, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    await fetchData();
    return response;
}

window.ENDPOINTS = ENDPOINTS;
window.deleteContact = deleteContact;