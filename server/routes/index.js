const news = require('./v1/news') // 可以省略后缀名.js



// 统一注册路由，与 app.js 解耦 方便管理
function useapp(app) {
  app.use('/api/v1/news',news)  // 自动拼接 v1 下的路由前缀
}

module.exports = useapp;
