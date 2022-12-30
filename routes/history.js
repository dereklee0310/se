const { config } = require("dotenv");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { sql, pool } = require("../modules/db");
const ensureAuthenticated = require('../modules/authen').ensureAuthenticated;

router.get('/', ensureAuthenticated, (req, res) => {
  //res.render('history');
  var plotly = require('plotly')("jerry0125", "X2n0swxmeydr28SzqTUL")
  //回傳次數
  var right  = req.query.right;
  var left = req.query.left;
  //各個次數區間的人數. 0-5,5-10...
  var average = Math.floor((Number(right)+Number(left))/2);
  //console.log(average)
  //各個次數區間的人數.
  var av = [];
  //次數區間
  var interval = [];
  for (var i = 0; i < 60; i ++) {
    interval[i] = i;
    av[i] = 0;
  }
  av[average] += 1;
  //randomy資料,之後改成讀mysql的資料
  var x0;
  var x1;
  for (var i = 0; i < 500; i ++) {
    x0 = Math.round(randn_bm(0, 60, 1));
    x1 = Math.round(randn_bm(0, 60, 1));
    av[Math.floor((x0+x1)/2)] += 1;
  }
  //繪圖參數
  var trace1 = {
  x: interval,
  y: av,
  name: "平均",
  marker: {color: "rgb(51, 51, 255)"},
  type: "scatter"
  };
  var data = [trace1];
  var layout = {
    title: "左邊次數:"+left+"\n"+"右邊次數:"+right,
    xaxis: {tickfont: {
        title: "平均次數",
        size: 14,
        color: "rgb(107, 107, 107)"
      }
    },
    yaxis: {
      title: "人數",
      titlefont: {
        size: 16,
        color: "rgb(107, 107, 107)"
      },
      tickfont: {
        size: 14,
        color: "rgb(107, 107, 107)"
      }
    },
    legend: {
      x: 0,
      y: 1.0,
      bgcolor: "rgba(255, 255, 255, 0)",
      bordercolor: "rgba(255, 255, 255, 0)"
    },
    annotations: [
      { x: average,
        y: av[average],
        xref: "x",
        yref: "y",
        text: "兩手平均次數",
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40
      }
    ]
  };
  var graphOptions = {layout: layout, filename: "style-histogram", fileopt: "overwrite"};
  
  pool.query(
    `select * from upload_record where user_id = "${req.user.user_id}"`, // todo file name
    function (err, results) {
        if (err)
            throw err
        console.log(results);
        plotly.plot(data, graphOptions, function (err, msg) {
            if (err)
                throw err
            var a = msg.url + ".embed";
            res.render('history',{url:a, user: req.user, results: results, length: results.length});
          });
    }
  );
    
  //繪圖函數
//   plotly.plot(data, graphOptions, function (err, msg) {
//     if (err)
//         throw err
//     console.log(msg)
//     var a = msg.url + ".embed";
//     res.render('history',{url:a, user: req.user});
//     //in index.pug : iframe(width="800" height="450" frameborder="0" scrolling="no" src= url)
//   });
});

function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}

module.exports = router;