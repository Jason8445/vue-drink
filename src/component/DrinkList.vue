<template>
  <el-card>
    <el-table :data="drinks" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="date" label="日期" sortable width="150" />
      <el-table-column prop="product" label="品名" sortable />
      <el-table-column prop="price" label="價格" width="120">
        <template #default="scope">
          $ {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-popconfirm
            title="確定要刪除這筆資料嗎？"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" circle>
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  drinks: Array,
  loading: Boolean
})

const emit = defineEmits(['refresh'])

const handleDelete = async (id) => {
  // Check if we are in production
  if (import.meta.env.PROD) {
    ElMessage.warning('GitHub Pages 為靜態網站，不支援刪除功能')
    return
  }
  
  try {
    const response = await fetch(`/api/drinks/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      ElMessage.success('刪除成功')
      emit('refresh')
    } else {
      ElMessage.error('刪除失敗')
    }
  } catch (error) {
    ElMessage.error('連線錯誤')
  }
}
</script>