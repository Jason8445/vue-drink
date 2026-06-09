<template>
  <el-card class="add-drink-card">
    <template #header>
      <div class="card-header">
        <span>新增飲料資料</span>
      </div>
    </template>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="選擇日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="品名" prop="product">
        <el-input v-model="form.product" placeholder="輸入飲料名稱" />
      </el-form-item>
      <el-form-item label="價格" prop="price">
        <el-input-number v-model="form.price" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading">確認新增</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refresh'])

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  date: '',
  product: '',
  price: 0
})

const rules = {
  date: [{ required: true, message: '請選擇日期', trigger: 'change' }],
  product: [{ required: true, message: '請輸入飲料品名', trigger: 'blur' }],
  price: [{ required: true, message: '請輸入價格', trigger: 'blur' }]
}

const submitForm = async () => {
  if (!formRef.value) return
  
  // Check if we are in production
  if (import.meta.env.PROD) {
    ElMessage.warning('GitHub Pages 為靜態網站，不支援線上新增資料功能')
    return
  }
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const response = await fetch('/api/drinks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        
        const result = await response.json()
        
        if (response.ok) {
          ElMessage.success('新增成功！')
          resetForm()
          emit('refresh')
        } else {
          ElMessage.error(result.error || '新增失敗')
        }
      } catch (error) {
        ElMessage.error('連線錯誤')
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
}
</script>

<style scoped>
.add-drink-card {
  margin-bottom: 20px;
}
</style>