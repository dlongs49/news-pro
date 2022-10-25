> demo准备 node环境【建议使用最新版】 vue3 ，mysql

### 一、mysql准备

​	关于mysql环境这里建议使用[phpstudy](https://www.xp.cn/download.html) 集成环境，因为mysql8.0以上安装配置可能比较麻烦，比较费时间，附上截图



![image-20221025173951312](C:\Users\dillonl\AppData\Roaming\Typora\typora-user-images\image-20221025173951312.png)

数据库管理工具推荐navicat

### 二、vue3准备

此demo采用vue3+vite实现，所以需要创建一个vite脚手架，如下：

`npm init vite-app 项目名称`

然后下载依赖，这里建议使用pnpm，npm和pnpm区别可以看这篇文章[pnpm与npm区别](https://www.jianshu.com/p/6c695a0692e0),全局安装如下：

`npm install pnpm -g`

`pnpm i` 即可

### 三、Node准备

首先保证计算机具有Node环境 [下载地址](http://nodejs.cn/)，全局安装[express](http://expressjs.jser.us/4x_zh-cn/api.html)环境如下：

`npm install -g cnpm --registry=https://registry.npm.taobao.org`  

`cnpm install express-generator -g` 全局安装express脚手架

创建express项目 

`express 项目名称  `



