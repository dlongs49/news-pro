const { newsModel } = require('../model/newsModel')
const { v1: uuidv4 } = require('uuid') // 生成惟一 id

// 添加新闻
async function setNews(req, res, next) {
    const o = req.body // 前台对象传参
    console.log(o);
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
            code: 200,
            msg: 'ok',
            success: true
        })
    } catch (error) {
        res.send({
            code: 500,
            msg: error.message,
            success: false
        })
    }
}
// 获取新闻
async function getNews(req, res, next) {
    const o = req.query // 字符串传参 [get]
    try {
        const { rows, count } = await newsModel.findAndCountAll({
            raw: true, // 原始返回
            order: [
                ['sort', 'DESC'] // 排序 DESC 升序 ASC 降序 通过传入的 sort
            ]
        })
        res.send({
            code: 200,
            msg: 'ok',
            data: {
                rows,
                count
            },
            success: true
        })
    } catch (error) {
        res.send({
            code: 500,
            msg: error.message,
            success: false
        })
    }
}
// 获取新闻
async function theNews(req, res, next) {
    const o = req.query
    try {
        const data = await newsModel.findOne({
            raw: true,
            where: {
                id: o.id
            }
        })
        console.log(data);
        res.send({
            code: 200,
            msg: 'ok',
            data,
            success: true
        })
    } catch (error) {
        res.send({
            code: 500,
            msg: error.message,
            success: false
        })
    }
}
// 更新新闻
async function updateNews(req, res, next) {
    const o = req.body
    try {
        const result = await newsModel.update({
            title: o.title,
            desction: o.desction,
            author: o.author,
            content: o.content,
            sort: o.sort,
            time: new Date()
        }, {
            where: {
                id: o.id
            }
        })
        if (result[0] == 1) {
            res.send({
                code: 200,
                msg: 'ok',
                success: true
            })
        } else {
            res.send({
                code: 200,
                msg: 'update error:::',
                success: false
            })
        }

    } catch (error) {
        res.send({
            code: 500,
            msg: error.message,
            success: false
        })
    }
}
// 删除新闻
async function delNews(req, res, next) {
    const o = req.body
    try {
        await newsModel.destroy({
            where: {
                id: o
            }
        })
        res.send({
            code: 200,
            msg: 'ok',
            success: true
        })
    } catch (error) {
        res.send({
            code: 500,
            msg: error.message,
            success: false
        })
    }
}
module.exports = {
    setNews,
    getNews,
    theNews,
    updateNews,
    delNews,
}