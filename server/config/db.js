const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('server', 'server', '123456', { // 数据库名 用户名 密码
    host: 'localhost',
    dialect: 'mysql',
    logging: true, // 控制台打印输出  默认 true
    timezone: '+08:00', // 解决数据库表时间类型为 dataTime bug，如果无此参数，表中时间和真实时间差几个小时
})
// 检测数据量是否连接
sequelize.authenticate().then(()=>{
    console.log('******************************** 数据库连接成功 *******************************');
}).catch((error)=>{
    console.error("\'\x1B[31m\'", '******************************** 数据库连接失败 *******************************:', error);
    // 打印输出有颜色【控制台】 可以查看此博客 https://blog.csdn.net/yexudengzhidao/article/details/121016187
})
module.exports = sequelize
