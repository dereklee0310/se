const { config } = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require('fs');
const url = require('url');
let moment = require('moment');

const multer = require('multer');
const upload = multer(/*{
    fileFilter(req, file, cb) {
        console.log(file.mimetype);
        // 只接受三種圖片格式
        if (file.mimetype!= ('video/mp4'||'video/x-mp4'||'video/quicktime'||'video/*')) {
            cb(new Error('Please upload a video'))
        }
        cb(null, true)
    }
}*/)

const { sql, pool } = require("../modules/db");
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;

var recoMime = function(mime){
  switch(mime){
      case 'video/mp4':
          return '.mp4';
      case 'video/x-msvideo':
          return '.avi'
      case 'video/quicktime':
          return '.mov'
      default:
  }
      
};

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("upload");
});


router.post("/test",upload.single('video'), (req, res) => {
  // result = '123'
  // file_name = 'file'
  // id = '3'
  // pool.query(
  //   `insert into upload_record values (NULL, '${req.body.first_name}', '${req.body.last_name}', '${req.body.pid}', '${req.body.gender}', '${req.body.birth}', '${req.body.taken_date}', \
  //     '${req.body.taken_location}', '${file_name}', '${result}', '${id}')`, // todo file name
  //   function (err, results) {
  //     if (err)
  //       throw err
  //     res.send('ok')
  //   }
  // );
  // var {date,list} = req.body;
  // var userid = req.user._id;
  // var types = list;
  console.log(req.body)
  var now_day = moment(req.body.taken_date).format('YYYYMMDD');
  var mime = recoMime(req.file.mimetype);
  // var fileBaseName = now_day+'_'+req.user.id+'_'+req.body.type;
  var fileBaseName = now_day+'_'+'123'+'_'+req.body.type;
  var fileName = fileBaseName+mime;
  var fileRoot = '../openpose/testdir/files/';
  console.log(fileName);
  console.log(fileRoot);
  var fileRoute = fileRoot+'/'+fileName;
  var fd = fs.openSync(fileRoute,'w+'); // fd = file descriptor (檔案描述符)
  fs.writeSync(fd,req.file.buffer);
  // res.redirect(url.format({
  //     pathname:"/upload/waiting",
  //     query: {
  //         "filename": fileBaseName,
  //         "mime": mime
  //     }
  // }));

  axios({
    method: 'post',
    url: 'http://localhost:50124/openpose',
    data: { "name": fileName }
  })
  .then(function(result){
    var data = result.data;
    console.log(result.data);

    // res.redirect(url.format({
    //   pathname:"/upload/completed",
    //   query: {
    //       "left": String(data[0].left),
    //       "right": String(data[0].right)
    //   }
    // }));
}) 

});

router.post("/", ensureAuthenticated, (req, res) => {
  result = '123'
  file_name = 'file'
  pool.query(
    `insert into upload_record values (NULL, ${req.body.first_name}, ${req.body.last_name}, ${req.body.gender}, ${req.body.birth}, ${req.body.taken_date}, \
      ${req.body.taken_location}, ${file_name}, ${result}, ${req.user.id})`, // todo file name
    function (err, results) {
      if (err)
        throw err
    }
  );
});

module.exports = router;
