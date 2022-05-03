// Imports
require('dotenv').config();
const express = require('express');

// Set port
const PORT = process.env.PORT || 3000;

// Create express app
const app = express();

// Set static folder
app.use(express.static('public'));

// Set body parser
app.use(express.json());

// Set not found handler
app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: 'Page not found',
  });
});

// Set error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: status,
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
