var express = require('express');
var router = express.Router();
const { setNews } = require('../../controller/newsController')
// 添加新闻
router.get('/set', setNews);
// 获取新闻列表
router.get('/get', setNews);
// 获取指定新闻
router.get('/the', setNews);
// 删除新闻
router.get('/del', setNews);

module.exports = router;
