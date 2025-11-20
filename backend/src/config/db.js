// db.js - create Sequelize connection to Postgres
const { Sequelize } = require('sequelize');

// use DATABASE_URL from env or fallback to localhost for non-docker runs
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/patient_portal';

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false, // set to console.log for debugging SQL
});

module.exports = sequelize;
