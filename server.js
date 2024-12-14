const express = require('express');
const cors = require('cors');
require('./services/firebaseConfig'); // Ensure Firebase is initialized before using handlers
const diskusiRoutes = require('./routes/diskusiRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Setup Express App
const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/diskusi', diskusiRoutes);
app.use('/comment', commentRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});