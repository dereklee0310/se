const mysql = require("mysql");

require('dotenv').config({path: '../.env'});

// create connection to db
var pool = mysql.createPool({
  host: process.env.HOST,
  port: process.env.DB_PORT, // default port for mysql server
  user: process.env.DB_USER, // mysql user name
  password: process.env.DB_PWD, // mysql password
  database: process.env.DB, // database name
});

module.exports = {
    mysql, pool
};