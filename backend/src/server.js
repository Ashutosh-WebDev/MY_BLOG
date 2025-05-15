const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const postRoutes = require('./routes/post.routes');
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const path = require('path');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "../../frontend/dist/frontend/browser")));

// Catch-all route - must be LAST
// app.get(/(.*)/, (_, res) => {
//    res.sendFile(path.resolve(__dirname, "../../frontend/dist/frontend/browser/index.html"));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});