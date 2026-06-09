<template>
  <el-card class="chart-card">
    <template #header>
      <div class="card-header">
        <span>價格趨勢分析</span>
      </div>
    </template>
    <div class="chart-container" v-if="hasData">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <el-empty v-else description="選擇或搜尋特定飲料以查看趨勢" />
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  drinks: Array
})

// Group data by product if there's only one product in search, or just show all if search is specific
const hasData = computed(() => props.drinks && props.drinks.length > 0)

const chartData = computed(() => {
  // Sort by date ascending for the chart
  const sorted = [...props.drinks].sort((a, b) => new Date(a.date) - new Date(b.date))
  
  return {
    labels: sorted.map(d => d.date),
    datasets: [
      {
        label: '價格趨勢',
        backgroundColor: '#409EFF',
        borderColor: '#409EFF',
        data: sorted.map(d => d.price),
        tension: 0.3,
        fill: false
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        stepSize: 5
      }
    }
  }
}
</script>

<style scoped>
.chart-card {
  margin-top: 20px;
}
.chart-container {
  height: 300px;
}
</style>