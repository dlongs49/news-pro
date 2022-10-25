> demo准备 node环境【建议使用最新版】 vue3 ，mysql, sequlize【node orm框架】

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

### 四、代码片段

> #### vue代码

1. 列表页面 【强烈建议使用[vite](https://cn.vitejs.dev/guide/)，速度贼快，用了vite，2.x启动感觉就跟乌龟似的~~~ (～￣▽￣)～】

```vue
<template>
    <div class="container">
        <el-row class="headRow">
            <el-col :span="20">
                <el-button @click="handleNew" type="primary" icon="Plus">新建
                </el-button>
                <el-button @click="getNews" type="success" icon="RefreshLeft">刷新
                </el-button>
                <el-button @click="batchhandleDel(idList)" type="danger" icon="Minus">删除
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-input placeholder="请输入标题" v-model="page.key" @clear="clear" clearable>
                    <template #append>
                        <el-button @click="getNews" icon="Search" />
                    </template>
                </el-input>
            </el-col>
        </el-row>
        <el-row class="tableRow">
            <el-col :span="24">
                <el-table v-loading="loading" border ref="multipleTable" :data="tableData" tooltip-effect="dark"
                    style="width: 100%" @selection-change="selchange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="title" label="标题名称" width="300" align="center"></el-table-column>
                    <el-table-column prop="desction" label="摘要" width="450" align="center"></el-table-column>
                    <el-table-column prop="author" label="作者" width="80" align="center"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
                    <el-table-column prop="time" label="操作时间" width="250" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-button @click="handleEdit(scope.row.id)" type="primary" size="small">编辑
                            </el-button>
                            <el-button @click="handleDel([scope.row.id])" type="danger" size="small">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
    <!-- 分页抽离 -->
    <pagination :page="page" @changeSize="changeSize" />
    <!-- 弹框表单抽离 -->
    <dialog-form ref="formData" :getNews="getNews" />  
</template>
  
<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import pagination from '@/components/Pagination/index.vue'
import dialogForm from "./components/dialog.vue";
const { proxy } = getCurrentInstance() // 类似与vue2.x中 Vue.prototype.xxx = xxx 全局挂载自定一数据
const formData = ref() // 操作子组件的方法
const loading = ref(false) // 加载状态
const tableData = ref([]) // 表格数据
const idList = ref([]) // 选中 删除 id 集合
const base_url = import.meta.env.VITE_APP_URL // 获取 .env 配置参数
const page = ref({ key: null, offset: 1, limit: 8, total: null, }) // 分页参数
onMounted(() => {
    getNews()
})

// 选中id
function selchange(data) {
    idList.value = data.map((v) => {
        return v.id;
    });
}

// 批量删除
function batchhandleDel(data) {
    if (data.length == 0) {
        ElMessage.warning("请选中要删除的数据");
        return;
    }
    handleDel(data);
}
// 新建
function handleNew() {
    formData.value.init(null);
}
// 编辑
function handleEdit(id) {
    formData.value.init(id);
}
// 分页
function changeSize(data) {
    page.value.offset = data;
    getNews();
}
//清除搜索框
function clear() {
    getNews();
}
// 列表
function getNews() {
    loading.value = true;
    fetch(`${base_url}/api/v1/news/get?key=${page.value.key}&offset=${page.value.offset}&limit=${page.value.limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode:'cors', // 解决跨域 ，原因：https://blog.csdn.net/qq_40653782/article/details/104271647
    }).then(response => response.json()).then(res => {
        if (res.code == 200 && res.success) {
            loading.value = false;
            tableData.value = res.data.rows
            page.value.total = res.data.count
        } else {
            loading.value = false;
            ElMessage.warning("获取失败");
        }
    }).catch(err => {
        loading.value = false;
        ElMessage.error("网络异常");
    })
}
// 删除
function handleDel(data) {
    ElMessageBox.confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            fetch(`/api/v1/news/del`, {
                method: 'DELETE',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(res => {
                if (res.code == 200 && res.success) {
                    ElMessage.success("删除成功");
                    getNews()
                } else {
                    ElMessage.warning("删除失败");
                }
            }).catch(err => {
                ElMessage.error("网络异常");
            })
        })
        .catch(() => {
        });
}
</script>

<style lang="less" scoped>
.container {
    width: 1400px;
    margin: 40px auto;

    .tableRow {
        margin-top: 10px;
    }
}
</style>
```

2. 表单页面

   ```vue
   <template>
       <el-dialog :title="title" v-model="visible" width="60%" center :before-close="handleClose">
           <el-form v-loading="loading" :model="form" :rules="rules" ref="ruleFormRef" label-width="100px">
               <el-form-item label="标题" prop="title">
                   <el-input v-model="form.title" placeholder="请输入标题"></el-input>
               </el-form-item>
               <el-form-item label="摘要">
                   <el-input v-model="form.desction" :rows="2" type="textarea" placeholder="请输入摘要"></el-input>
               </el-form-item>
               <el-form-item label="作者">
                   <el-input v-model="form.author" placeholder="请输入作者"></el-input>
               </el-form-item>
               <el-form-item label="详情" prop="content">
                   <editor v-model="form.content" />
               </el-form-item>
               <el-form-item label="排序">
                   <el-input v-model="form.sort" type="number" placeholder="请输入排序"></el-input>
               </el-form-item>
               <el-form-item class="btncen">
                   <el-button type="primary" @click="submitForm">确定</el-button>
                   <el-button @click="cancelForm">取消</el-button>
               </el-form-item>
           </el-form>
       </el-dialog>
   </template>
   <script setup>
   import { ref, defineExpose, nextTick, getCurrentInstance } from 'vue'
   import { ElMessage } from 'element-plus'
   import editor from '@/components/Editor/index.vue'
   const { proxy } = getCurrentInstance()
   const ruleFormRef = ref()
   const visible = ref(false)
   const loading = ref(false)
   const title = ref("查看")
   const form = ref({ })
   const rules = ref({
       title: [{ required: true, message: "必填", trigger: "blur" }],
       content: [{ required: true, message: "必填", trigger: "blur" }],
   })
   const props = defineProps({
       getNews: {
           type: Function,
           default: () => {
           }
       }
   })
   const base_url = import.meta.env.VITE_APP_URL
   
   // 关闭
   function handleClose() {
       visible.value = false;
   }
   
   // 父调子
   function init(id) {
       visible.value = true;
       nextTick(() => { // 等该 dom 渲染完毕操作
           ruleFormRef.value.resetFields(); // 请求校验
           form.value = { sort: 0 };
       });
       if (id != null) {
           loading.value = true;
           title.value = "编辑";
           getTheNews(id);
       } else {
           title.value = "新建";
       }
   }
   defineExpose({ init }) // 为了子组件调用父组件的方法刷新列表
   // 获取指定
   function getTheNews(id) {
       fetch(`${base_url}/api/v1/news/the?id=${id}`, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       }).then(response => response.json()).then(res => {
           loading.value = false
           if (res.code == 200 && res.success) {
               form.value = res.data;
           } else {
               ElMessage.warning("获取失败");
           }
       }).catch(err => {
           ElMessage.error("网络异常");
       })
   }
   
   // 确定
   function submitForm() {
       let { id } = form.value;
       ruleFormRef.value.validate((valid) => {
           if (!valid) {
               return false;
           }
           if (id != undefined && id != null && id != "") {
               handleEdit();
           } else {
               handleOk();
           }
       });
   }
   
   // 新建确定
   function handleOk() {
       fetch(`${base_url}/api/v1/news/set`, {
           method: 'POST',
           body: JSON.stringify(form.value),
           headers: {
               'Content-Type': 'application/json'
           }
       }).then(response => response.json()).then(res => {
           if (res.code == 200 && res.success) {
               ElMessage.success("添加成功");
               visible.value = false;
               props.getNews();
           } else {
               ElMessage.warning("获取失败");
           }
       }).catch(err => {
           ElMessage.error("网络异常");
       })
   }
   
   // 编辑确定
   function handleEdit() {
       fetch(`${base_url}/api/v1/news/update`, {
           method: 'PUT',
           body: JSON.stringify(form.value),
           headers: {
               'Content-Type': 'application/json'
           }
       }).then(response => response.json()).then(res => {
           if (res.code == 200 && res.success) {
               ElMessage.success("更新成功");
               visible.value = false;
               props.getNews();
           } else {
               ElMessage.warning("获取失败");
           }
       }).catch(err => {
           ElMessage.error("网络异常");
       })
   }
   
   // 取消
   function cancelForm() {
       visible.value = false;
   }
   </script>
     
   <style lang="less" scoped></style>
     
   ```

   3. 其他组件页面暂不列了，源码仓库在文章结尾

   4. 在附上vite.config.js配置

      ```javascript
      import { defineConfig } from 'vite'
      import vue from '@vitejs/plugin-vue'
      import { resolve } from 'path'
      
      export default defineConfig({
        plugins: [vue()],
        resolve: {
          alias: {
            '@': resolve(__dirname, '.', 'src'),
          },
        },
        server: {
          host: "0.0.0.0",
          port: 80,
          // proxy: {
          //   '/api': {
          //     target: 'http://127.0.0.1:3000',
          //   }
          // }
        },
        css: {
          preprocessorOptions: {
              less: {
                  additionalData: `@import '@/style/global.less';` // 配置全局样式 
              }
          }
      },
        build: {
          rollupOptions: {
            output: {
              manualChunks(id) {
                if (id.includes("node_modules")) { // 切割打包，减少打包体积
                  return id
                    .toString()
                    .split("node_modules/")[1]
                    .split("/")[0]
                    .toString();
                }
              }
            }
          }
        }
      })
      
      ```

      5. 效果截图

         ![image-20221025192857491](C:\Users\dillonl\AppData\Roaming\Typora\typora-user-images\image-20221025192857491.png)

   

> 服务端代码

服务端[orm框架](https://blog.csdn.net/Mr_VK/article/details/122930987)采用的是[sequlize](https://www.sequelize.cn/core-concepts/getting-started) ，这款框架在Node上占比应该是最高的，github上start有 26.9k，由于服务启动更新代码需要更新服务以达到预览，可以安装 `cnpm i nodemon -g`

项目启动：`npm run dev`

项目结构如下：

```markdown
server
├── app.js -- 入口文件
├── bin
├── config -- 配置放置，【数据库配置】
├── controller -- 控制层 【业务代码编写】
├── model -- 模型层 【控制映射数据表】
├── package.json -- 不用多说
├── public -- 静态目录 【存放可以访问到的文件,例如：js css images】
├── routes -- 路由层 【简单来说就是前端访问的接口】
└── views -- 存放html页面【如下预览图】
```

项目启动成功后的预览图：

![image-20221025195614122](C:\Users\dillonl\AppData\Roaming\Typora\typora-user-images\image-20221025195614122.png)

1. app.js 代码

   ```javascript
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
   

2. 数据库连接 【db.js】

   首页确保有数据库和数据表 【表数据在项目sql文件下，源码地址在文章结尾】

   ```javascript
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
   
   ```

3. 模型层 【model】

   ```javascript
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
   ```

   

4. 控制层 【controller】

   ```javascript
   const { newsModel } = require('../model/newsModel')
   const { v1: uuidv4 } = require('uuid') // 生成惟一 id
   const { Op } = require('sequelize')
   // 添加新闻
   async function setNews(req, res) {
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
   async function getNews(req, res) {
       const offset = Number(req.query.offset)
       const limit = Number(req.query.limit)
       const key = req.query.key != 'null' && req.query.key != '' ? req.query.key : ''
       try {
           const { rows, count } = await newsModel.findAndCountAll({
               raw: true, // 原始返回  
               offset: (offset - 1) * limit, // 分页索引
               limit, // 个数
               order: [
                   ['sort', 'DESC'] // 排序 DESC 升序 ASC 降序 通过传入的 sort
               ],
               where: {
                   title: {
                       [Op.like]: `%${key}%`
                   }
               }
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
   async function theNews(req, res) {
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
   async function updateNews(req, res) {
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
   async function delNews(req, res) {
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
   ```

5. 路由层 【router】

   ```javascript
   const express = require('express');
   const router = express.Router();
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
   
   ```

   6. 路由集中注册

   ```javascript
   const news = require('./v1/news') // 可以省略后缀名.js
   
   // 统一注册路由，与 app.js 解耦 方便管理
   function useapp(app) {
     app.use('/api/v1/news',news)  // 自动拼接 v1 下的路由前缀
      // ....
   }
   
   module.exports = useapp;
   
   ```

   