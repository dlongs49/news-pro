<template>
    <div class="econtainer">
      <!-- 操作区 -->
      <div class="head" id="head"></div>
      <!-- 内容区 -->
      <div class="context" id="context"></div>
    </div>
  </template>
  
  <script setup>
  import {ref,watch,onMounted,onUnmounted, getCurrentInstance} from "vue";
  import E from "wangeditor";
  const editor = ref(null)
  const {proxy} = getCurrentInstance()
  const props = defineProps({
    modelValue:{
      type:String,
      default:''
    }
  })
  watch(()=>{props.modelValue},()=>{
    editor.value.txt.html(props.modelValue)
  },{deep:true})
  const emit = defineEmits(["update:modelValue"])
  onMounted(()=>{
    editor.value= new E("#head", "#context");
    const url = '' // 注：暂无
    editor.value.config.uploadImgShowBase64 = true;
    editor.value.config.uploadImgShowBase64 = url; // 图片上传接口
    editor.value.config.uploadImgHooks = {
      customInsert: function (insertImgFn, result) {
        let uurl = result.data.url;
        insertImgFn(uurl);
      },
    };
    editor.value.config.uploadVideoServer = url; // 视频上传接口
    editor.value.config.uploadVideoHooks = {
      customInsert: function (insertImgFn, result) {
        let uurl = result.data.url;
        insertImgFn(uurl);
      },
    }
    editor.value.config.onchange = (html) => {
      emit("update:modelValue", html);
    }
    editor.value.create();
  })
  
  onUnmounted(()=>{
    editor.value.destroy();
    editor.value = null;
  })
  </script>
  
  <style lang="less" scoped>
  .econtainer {
    .head {
      border: 1px solid #eee;
    }
    .context {
      height: 600px; // 编辑区域的高度
      border: 1px solid #eee;
      border-top: 0;
    }
  }
  :deep(img){
    width: auto;
    height: auto;
  }
  </style>
  