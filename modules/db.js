const mysql = require("mysql");

// require('dotenv').config({path: '../.env'});

// // create connection to db
// var pool = mysql.createPool({
//   host: process.env.HOST,
//   port: process.env.DB_PORT, // default port for mysql server
//   user: process.env.DB_USER, // mysql user name
//   password: process.env.DB_PWD, // mysql password
//   database: process.env.DB, // database name
// });

require('dotenv').config({path: '../.env'});

// create connection to db
var pool = mysql.createPool({
  // host: 'localhost',
  host: '34.81.68.215',
  port: '3306', // default port for mysql server
  user: 'root', // mysql user name
  password: 'group10', // mysql password
  database: 'se', // database name
});

// pool.query("delete from upload_record where first_name = '明翰'", function(err, results) {
//   console.log('set ok!')
// })

// pool.query(`update user set gender = 'male' where email = 'dereklee0310@gmail.com';`, function (err, results) {
//   console.log('aslf;jhsaeoifewporfewr')
//   if(err)
//     throw err
// })

module.exports = {
    mysql, pool
};