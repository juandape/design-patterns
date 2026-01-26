const express = require('express');
const config = require('./config/index');

const app = express();

// Middleware configuration
app.use(express.json());

// Define routes
app.use('/api', require('./routes/index'));

// Start the server
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});