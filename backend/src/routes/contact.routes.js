const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const { createContact, getContacts } = require('../controllers/contact.controller');

// Public route for creating contact messages
router.post('/', createContact);

// Admin route for getting all messages
router.get('/', protect, admin, getContacts);

module.exports = router;
