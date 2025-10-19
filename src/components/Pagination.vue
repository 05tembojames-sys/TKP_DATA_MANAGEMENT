<template>
  <div class="pagination-container">
    <div class="pagination-info">
      <span>Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries</span>
    </div>
    
    <div class="pagination-controls">
      <button 
        @click="goToPage(1)" 
        :disabled="currentPage === 1"
        class="pagination-btn first"
        title="First Page"
      >
        ««
      </button>
      
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="pagination-btn prev"
        title="Previous Page"
      >
        ‹
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['page-btn', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="goToPage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="pagination-btn next"
        title="Next Page"
      >
        ›
      </button>
      
      <button 
        @click="goToPage(totalPages)" 
        :disabled="currentPage === totalPages"
        class="pagination-btn last"
        title="Last Page"
      >
        »»
      </button>
    </div>
    
    <div class="pagination-size">
      <label>Show:</label>
      <select v-model="pageSize" @change="onPageSizeChange" class="size-select">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span>per page</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change', 'size-change'])

const pageSize = ref(props.pageSize)

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / pageSize.value)
})

const startItem = computed(() => {
  return props.totalItems === 0 ? 0 : (props.currentPage - 1) * pageSize.value + 1
})

const endItem = computed(() => {
  const end = props.currentPage * pageSize.value
  return Math.min(end, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2))
  const end = Math.min(totalPages.value, start + props.maxVisiblePages - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const onPageSizeChange = () => {
  emit('size-change', pageSize.value)
}

watch(() => props.pageSize, (newSize) => {
  pageSize.value = newSize
})
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #4A148C;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  min-width: 40px;
}

.pagination-btn:hover:not(:disabled) {
  background: #4A148C;
  color: white;
  border-color: #4A148C;
}

.pagination-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  border-color: #e9ecef;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
  margin: 0 0.5rem;
}

.page-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #4A148C;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  min-width: 40px;
}

.page-btn:hover {
  background: #e9ecef;
  border-color: #4A148C;
}

.page-btn.active {
  background: #4A148C;
  color: white;
  border-color: #4A148C;
}

.pagination-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.size-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #4A148C;
  background: white;
  font-size: 0.9rem;
}

.size-select:focus {
  outline: none;
  border-color: #4A148C;
}

/* Responsive Design */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .page-numbers {
    margin: 0.5rem 0;
  }
  
  .pagination-size {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .pagination-btn,
  .page-btn {
    padding: 0.4rem 0.6rem;
    min-width: 35px;
    font-size: 0.8rem;
  }
  
  .page-numbers {
    gap: 0.1rem;
  }
}
</style>
