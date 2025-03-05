const { Sequelize } = require('sequelize');

// Initialize Sequelize with the database connection details
const sequelize = new Sequelize('mysql', 'root', 'mysql', {
  host: 'localhost',         // Replace with your database host (localhost is fine for local development)
  dialect: 'mysql',          // You can use 'postgres', 'sqlite', etc., based on your DB
  logging: console.log,      // Logs SQL queries for debugging (set to false to disable)
});

// Verify the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully. with mysql');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
