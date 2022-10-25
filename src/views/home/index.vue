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
    <dialog-form ref="formData" :getNews="getNews" />
</template>
  
<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import pagination from '@/components/Pagination/index.vue'
import dialogForm from "./components/dialog.vue";
const { proxy } = getCurrentInstance()
const formData = ref()
const loading = ref(false)
const tableData = ref([])
const idList = ref([])
const base_url = import.meta.env.VITE_APP_URL
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

// 列表
function getNews() {
    loading.value = true;
    // `${base_url}/api/v1/news/get`
    fetch(`/api/v1/news/get`, {
        method: 'GET'
    }).then(response => response.json()).then(res => {
        if (res.code == 200 && res.success) {
            loading.value = false;
            tableData.value = res.data.rows
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
                body:JSON.stringify(data),
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

.coverimg {
    max-width: 150px;
    max-height: 60px;
    width: auto;
    height: auto;
    margin: 0 auto;
}
</style>