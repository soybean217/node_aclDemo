var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var config = require('../../config/config');
var db_of_mysql = config.mysql;
router.post('/stat', function(req, res) {
  var param = req.body;
  ctime = new Date()
  var today = ctime.format("yyyy-MM-dd");
  var yesterday = new Date(ctime.getTime() - 86400000).format("yyyy-MM-dd");
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: db_of_mysql.host,
    user: db_of_mysql.user,
    password: db_of_mysql.password,
    database: db_of_mysql.database,
    port: db_of_mysql.port
  });
  try {
    connection.connect();
    //查询
    connection.query("SELECT statDay,result from " + config.statTableName + " where statName='userCount' order by statDay desc ", function(err, rows01, fields) {
      if (err) console.log(err);
      if (rows01.length > 0) {
        if (rows01[0].statDay == yesterday) {
          sendResult(rows01)
        } else {
          addStat(rows01)
        }
      } else {
        initialStat()
      }
    });
  } catch (err) {
    res.end(err.stack);
  } finally {
    //关闭连接
    connection.end();
  }

  function addStat(queriedData) {
    var connection = mysql.createConnection({
      host: db_of_mysql.host,
      user: db_of_mysql.user,
      password: db_of_mysql.password,
      database: db_of_mysql.database,
      port: db_of_mysql.port
    });
    try {
      connection.connect();
      //查询
      connection.query("SELECT FROM_UNIXTIME(insertTime, '%Y-%m-%d') AS statDay , round(COUNT(*)*?)  AS result FROM imsi_users where insertTime >= UNIX_TIMESTAMP(?)+86400 and custCode not in ('Fwfzf1000') GROUP BY FROM_UNIXTIME(insertTime, '%Y-%m-%d') ORDER BY statDay DESC", [config.ratioUserCount, queriedData[0].statDay], function(err, rows, fields) {
        if (err) console.log(err);
        if (rows.length > 0) {
          insertStat(rows)
          Array.prototype.push.apply(queriedData, rows)
        }
        sendResult(queriedData)
      });
    } catch (err) {
      res.end(err.stack);
    } finally {
      connection.end();
    }
  }

  function initialStat() {
    var connection = mysql.createConnection({
      host: db_of_mysql.host,
      user: db_of_mysql.user,
      password: db_of_mysql.password,
      database: db_of_mysql.database,
      port: db_of_mysql.port
    });
    try {
      connection.connect();
      //查询
      connection.query("SELECT FROM_UNIXTIME(insertTime, '%Y-%m-%d') AS statDay ,round(COUNT(*)*?) AS result FROM imsi_users where custCode not in ('Fwfzf1000') GROUP BY FROM_UNIXTIME(insertTime, '%Y-%m-%d') ORDER BY statDay DESC", [config.ratioUserCount], function(err, rows, fields) {
        if (err) console.log(err);
        sendResult(rows)
        insertStat(rows)
      });
    } catch (err) {
      res.end(err.stack);
    } finally {
      connection.end();
    }
  }

  function sendResult(data) {
    var rows = []
    data.forEach(function(row) {
      if (row.statDay != today) {
        rows.push([row.statDay, row.result])
      }
    })
    res.send({
      code: "200",
      msg: "获取详情成功",
      data: rows,
    });
  }

  function insertStat(data) {
    var values = []
    data.forEach(function(row) {
      if (row.statDay != today) {
        values.push([row.statDay, 'userCount', row.result])
      }
    })
    var connection = mysql.createConnection({
      host: db_of_mysql.host,
      user: db_of_mysql.user,
      password: db_of_mysql.password,
      database: db_of_mysql.database,
      port: db_of_mysql.port
    });
    try {
      connection.connect();
      //查询
      connection.query("insert " + config.statTableName + " (statDay,statName,result) values ?", [values], function(err, rows01, fields) {
        if (err) console.log(err);
      });
    } catch (err) {
      res.end(err.stack);
    } finally {
      connection.end();
    }
    // data.forEach(function(row) {

    // })
  }
});

Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

// var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");


module.exports = router;