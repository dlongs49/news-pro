const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const app = express();
const cors = require('cors') // 解决跨域，一行代码解决，nice~~
require('./config/db.js')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // 使用 ejs 进行渲染 文档：https://ejs.bootcss.com/
app.engine('html', ejs.renderFile);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 静态资源目录
app.use(cors())
/**
 * 引入路由 这里应该在 app.use(express.urlencoded({ extended: false })); 的下面，
 * 否则 拿不到请求参数，由于先要注册中间件，才能处理请求
 */
require('./routes/')(app);
app.use('/', (req, res) => {
  res.render('index.html', {
    title:"server api",
    text: "{msg: 服务已启动, code:200 }"
  })
})
//  404 问题
app.use(function (req, res, next) {
  next(createError(404));
});

// 报错
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
