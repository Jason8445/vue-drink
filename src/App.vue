<script setup>
import { ref, onMounted } from 'vue'
import AddDrinkForm from './component/AddDrinkForm.vue'
import SearchControl from './component/SearchControl.vue'
import DrinkList from './component/DrinkList.vue'
import PriceTrendView from './component/PriceTrendView.vue'

const drinks = ref([])
const loading = ref(false)
const currentSearch = ref('')

const fetchDrinks = async (query = '') => {
  loading.value = true
  currentSearch.value = query
  try {
    // Check if we are in production (GitHub Pages) or development
    const isProd = import.meta.env.PROD
    
    if (isProd) {
      // Production path for GitHub Pages
      const response = await fetch('/vue-drink/drinks.json')
      let data = await response.json()
      
      if (query) {
        const q = query.toLowerCase()
        data = data.filter(d => 
          d.product.toLowerCase().includes(q) || 
          d.date.includes(q)
        )
      }
      drinks.value = data
    } else {
      // Local development API
      const url = query ? `/api/drinks?q=${encodeURIComponent(query)}` : '/api/drinks'
      const response = await fetch(url)
      const data = await response.json()
      drinks.value = data
    }
  } catch (error) {
    console.error('Failed to fetch drinks:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDrinks()
})
</script>

<template>
  <el-container class="app-container">
    <el-header>
      <h1 class="title">🧋 飲料價格管理系統</h1>
    </el-header>
    
    <el-main>
      <el-row :gutter="20">
        <!-- Left Side: Form and Search -->
        <el-col :md="8" :sm="24">
          <AddDrinkForm @refresh="fetchDrinks(currentSearch)" />
          <SearchControl @search="fetchDrinks" @showAll="fetchDrinks('')" />
        </el-col>
        
        <!-- Right Side: List and Chart -->
        <el-col :md="16" :sm="24">
          <DrinkList :drinks="drinks" :loading="loading" @refresh="fetchDrinks(currentSearch)" />
          <PriceTrendView :drinks="drinks" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style>
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f7fa;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  color: #303133;
  margin-bottom: 30px;
}

.el-header {
  height: auto !important;
  padding: 0;
}
</style>
