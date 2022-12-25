const mysql = require("mysql");
const bcrypt = require('bcrypt');

require('dotenv').config({path: './.env'});

// create connection to db
var pool = mysql.createPool({
  host: '34.81.68.215',
  port: process.env.DB_PORT, // default port for mysql server
  user: process.env.DB_USER, // mysql user name
  password: process.env.DB_PWD, // mysql password
  database: process.env.DB, // database name
});

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
  pool.query('select * from user;', function (err, results) {
    console.log(results)
  });
});
  
// pool.query(
//   `select password from users where account = 'root@gmail.com'`,
//   function (err, results) {
//     if (err)
//       throw err;
//     if (Object.keys(results).length === 0) {
//       res.render('login', {msg: 'failed'})
//       return
//     }

//     if (bcrypt.compareSync('123', results[0].password)) //todo change this into async
//       console.log('1')
//     else
//       console.log('2')
//   }
// );