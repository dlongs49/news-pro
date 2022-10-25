const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js')
// 模型层 【新闻】
const newsModel = sequelize.define('db_news', {
    id: {
        type: DataTypes.STRING, // 数据类型链接供查看 https://www.sequelize.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B
        primaryKey: true, // 是否主键
    },
    title: DataTypes.STRING,
    desction: DataTypes.STRING,
    author: DataTypes.STRING,
    content: DataTypes.STRING,
    sort: { type: DataTypes.INTEGER, defaultValue: 0 }, // 默认为0  
    time: DataTypes.DATE,
}, {
    freezeTableName: true, // 强制表名称等于模型名称  https://www.sequelize.cn/core-concepts/model-basics#%E5%BC%BA%E5%88%B6%E8%A1%A8%E5%90%8D%E7%A7%B0%E7%AD%89%E4%BA%8E%E6%A8%A1%E5%9E%8B%E5%90%8D%E7%A7%B0
    timestamps: false // 查看此文档解释 https://www.sequelize.cn/core-concepts/model-basics#%E6%97%B6%E9%97%B4%E6%88%B3
});

// 导出使用
module.exports = { newsModel }