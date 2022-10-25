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
                    <el-table-column prop="author" label="作者" width="100" align="center"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
                    <el-table-column prop="time" label="操作时间" width="200" align="center">
                        <template #default="scope">
                            {{moment(scope.row.time).format('YYYY-MM-DD HH:mm:ss')}}
                        </template>
                    </el-table-column>
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
import moment from 'moment'
const { proxy } = getCurrentInstance() // 类似与vue2.x中 Vue.prototype.xxx = xxx 全局挂载自定一数据
const formData = ref() // 操作子组件的方法
const loading = ref(false) // 加载状态
const tableData = ref([]) // 表格数据
const idList = ref([]) // 选中 删除 id 集合
const base_url = import.meta.env.VITE_APP_URL // 获取 .env 配置参数
console.log(import.meta.env);
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
            fetch(`${base_url}/api/v1/news/del`, {
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