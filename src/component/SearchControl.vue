<template>
  <el-card class="search-card">
    <el-row :gutter="20" align="middle">
      <el-col :span="16">
        <el-input
          v-model="searchQuery"
          placeholder="搜尋品名 (支援部分文字)..."
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜尋</el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="info" @click="handleShowAll" plain style="width: 100%">
          顯示全部
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'showAll'])
const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleShowAll = () => {
  searchQuery.value = ''
  emit('showAll')
}
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
}
</style>