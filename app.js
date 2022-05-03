// Imports
require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./src/routes');
const db = require('./src/database');

// Set port
const PORT = process.env.PORT || 3000;

// Create express app
const app = express();

// Set static folder
app.use(express.static('public'));

// Set body parser
app.use(express.json());

// Set routes
app.use(routes);

// Set not found handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, './public/not-found.html'));
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

// Try connect to database before starting the server
db.connect()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to the database');
    // Start server
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('Error connecting to the database', err);
    process.exit(1);
  });
