const express = require('express');
const mysql = require('mysql');             // 引入MySQL
const cors = require('cors');
const bodyParser = require('body-parser');  // 解析Api参数
const app = express();
const router = express.Router();

const option = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'michael',
  connectTimeout: 5000,       // 连接超时
  multipleStatements: true,  // 是否允许一个query中包含多条SQL语句
}

app.use(cors());            // 解决跨域
app.use(bodyParser.json()); // json请求
app.use(bodyParser.urlencoded({extended: false})); // 表单请求

let pool;
repool();

function Result({code = 200, msg= '', data = null}) {
  this.code = code;
  this.msg = msg;
  this.data = data;
}

// 断线重连机制
function repool() {
  // 创建连接池
  pool = mysql.createPool({
    ...option,
    waitForConnections: true,   // 当无连接池可用时，等待（true），还是抛异常（false）
    connectionLimit: 100,       // 连接数限制
    queueLimit: 0,              // 最大连接等待数（0为不限制）
  })
  pool.on('error', err => err.code === 'PROTOCOL_CONNECTION_LOST' && setTimeout(repool, 2000));
  app.all('*', (_, __, next) => pool.getConnection(err => err && setTimeout(repool, 2000) || next()));
}

module.exports = {pool, Result, router, app};
