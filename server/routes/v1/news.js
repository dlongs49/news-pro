var express = require('express');
var router = express.Router();
const { setNews, getNews, theNews, updateNews, delNews } = require('../../controller/newsController')
// 添加新闻
router.post('/set', setNews);
// 获取新闻列表
router.get('/get', getNews);
// 获取指定新闻
router.get('/the', theNews);
// 更新新闻
router.put('/update', updateNews);
// 删除新闻
router.delete('/del', delNews);

module.exports = router;
