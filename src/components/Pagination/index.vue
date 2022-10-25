<template>
    <div class="conpagin">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="Number(page.total)"
          @current-change="changeSize"
          @prev-click="changeSize"
          @next-click="changeSize"
          :page-size="Number(page.limit)"
          :current-page="Number(page.offset)"
          :hide-on-single-page="true"
      />
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    page: {
      type: Object,
      default: {total:0}
    }
  })
  // 改变分页
  const emit = defineEmits(['changeSize'])
  
  function changeSize(data) {
    emit("changeSize", data);
  }
  </script>
  
  <style lang="less" scoped>
  .conpagin {
    display: flex;
    justify-content: center;
    text-align: center;
    margin-top: 15px;
  
  }
  </style>
  