const Contact = require('../models/contact.model');

// Create a new contact message
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = await Contact.create({
      name,
      email,
      message
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all contact messages (admin only)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContact,
  getContacts
};
