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
const form = ref({ image: '' })
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
    nextTick(() => {
        ruleFormRef.value.resetFields();
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
defineExpose({ init })
// 获取指定
function getTheNews(id) {
    fetch(`/api/v1/news/the?id=${id}`, {
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
    fetch(`/api/v1/news/set`, {
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
    fetch(`/api/v1/news/update`, {
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
  
<style lang="less" scoped>
.selecs {
    width: 100%;
}

.btncen {
    text-align: center;
}

.elcon {
    /deep/ .el-form-item__content {
        line-height: 0;
    }
}
</style>
  