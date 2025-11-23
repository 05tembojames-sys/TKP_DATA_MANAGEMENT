<template>
  <div class="org-unit-node">
    <div 
      class="node-content" 
      :class="{ selected: node.id === selected }"
      @click="handleSelect"
    >
      <button 
        v-if="node.children && node.children.length > 0"
        @click.stop="handleToggle"
        class="toggle-btn"
      >
        <i class="fas" :class="isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
      </button>
      <span v-else class="spacer"></span>
      
      <i class="fas fa-building node-icon"></i>
      <span class="node-label">{{ node.name }}</span>
    </div>
    
    <div v-if="isExpanded && node.children" class="node-children">
      <OrgUnitTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected="selected"
        :expanded="expanded"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  selected: {
    type: String,
    default: ''
  },
  expanded: {
    type: Set,
    default: () => new Set()
  }
});

const emit = defineEmits(['select', 'toggle']);

const isExpanded = computed(() => props.expanded.has(props.node.id));

const handleSelect = () => {
  emit('select', props.node.id);
};

const handleToggle = () => {
  emit('toggle', props.node.id);
};
</script>

<style scoped>
.org-unit-node {
  user-select: none;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
}

.node-content:hover {
  background: #f4f6f8;
}

.node-content.selected {
  background: #e8f3fa;
  color: #147cd7;
}

.toggle-btn {
  background: none;
  border: none;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #494949;
  font-size: 12px;
}

.toggle-btn:hover {
  color: #147cd7;
}

.spacer {
  width: 20px;
}

.node-icon {
  margin: 0 8px;
  color: #494949;
  font-size: 14px;
}

.node-content.selected .node-icon {
  color: #147cd7;
}

.node-label {
  font-size: 14px;
  flex: 1;
}

.node-children {
  padding-left: 16px;
}
</style>
