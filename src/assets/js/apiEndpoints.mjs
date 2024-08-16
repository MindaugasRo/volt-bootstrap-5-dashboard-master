const API_BASE_URL = 'http://localhost:8085/api';

const ENDPOINTS = {
    GET_CONTACTS: `${API_BASE_URL}/contacts`,

    //Get Contacts ALL
    GET_ALL_CONTACTS: () => `${API_BASE_URL}/contacts/all`,

    // Get contact byID
    GET_CONTACTS_BY_ID: (contactId) => `${API_BASE_URL}/contacts/id/${contactId}`,

    // Delete contact byID
    DELETE_CONTACT: (contactId) => `${API_BASE_URL}/contacts/delete/${contactId}`,
};

module.exports = ENDPOINTS;