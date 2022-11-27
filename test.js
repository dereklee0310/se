/*
 * @Author: Derek Lee dereklee0310@gmail.com
 * @Date: 2022-11-25 12:41:36
 * @LastEditors: Derek Lee dereklee0310@gmail.com
 * @LastEditTime: 2022-11-27 07:07:09
 * @FilePath: /se_test/test.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Derek Lee dereklee0310@gmail.com, All Rights Reserved. 
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '1234',
    database : 'classicmodels'
});

// connection.connect();
connection.connect(function(err) {
    console.log('enter')
    if (err) {
      return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
  });

connection.end();

