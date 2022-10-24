const { newsModel } = require('../model/newsModel')
const { v1: uuidv4 } = require('uuid') // 生成惟一 id

// 添加新闻
async function setNews(req, res, next) {
    const o = req.body
    try {
        await newsModel.create({ // 创建记录 相当于 sql 中 insert  into 表名 (id, title, ...) value ('16546546','xxxx', ...)
            id: uuidv4(),
            title: o.title,
            desction: o.desction,
            author: o.author,
            content: o.content,
            sort: o.sort,
            time: new Date(),
        })
        res.send({
            code:200,
            msg:'ok',
            success:true
        })
    } catch (error) {
        res.send({
            code: 500,
            msg: error.message,
            success: false
        })
    }
}