/*
 * @Author: Derek Lee dereklee0310@gmail.com
 * @Date: 2022-12-04 11:51:18
 * @LastEditors: Derek Lee dereklee0310@gmail.com
 * @LastEditTime: 2022-12-04 11:58:14
 * @FilePath: /se/bcrytest.js
 * @Description:
 *
 * Copyright (c) 2022 by Derek Lee dereklee0310@gmail.com, All Rights Reserved.
 */
const bcrypt = require("bcrypt");

const saltRounds = 10;
const myPassword = "password1";
const testPassword = "password2";
const myHash ='$2a$10$fok18OT0R/cWoR0a.VsjjuuYZV.XrfdYd5CpDWrYkhi1F0i8ABp6e'; // myPassword加密後結果(驗證用)


// 加密
const hash = bcrypt.hashSync(myPassword, saltRounds);
console.log(hash);

// 驗證密碼
console.log(bcrypt.compareSync(myPassword, myHash)); // true
console.log(bcrypt.compareSync(testPassword, myHash)); // false


