<template>
  <div class="content">
    <div class="content-header">
      <h2>话术设置</h2>
    </div>
    
    <!-- 标签页系统 -->
    <div class="tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.name }}
      </div>
    </div>
    
    <!-- 标签页内容 -->
    <div class="tab-content" :class="{ active: activeTab === 'script-edit' }">
      <script-edit-tab />
    </div>
    
    <div class="tab-content" :class="{ active: activeTab === 'timing-settings' }">
      <timing-settings-tab />
    </div>
    
    <div class="tab-content" :class="{ active: activeTab === 'fastgpt-settings' }">
      <fastgpt-settings-tab />
    </div>
    
    <div class="tab-content" :class="{ active: activeTab === 'data-analysis' }">
      <data-analysis-tab />
    </div>
  </div>
</template>

<script>
import ScriptEditTab from './tabs/ScriptEditTab.vue'
import TimingSettingsTab from './tabs/TimingSettingsTab.vue'
import FastgptSettingsTab from './tabs/FastgptSettingsTab.vue'
import DataAnalysisTab from './tabs/DataAnalysisTab.vue'

export default {
  name: 'AppContent',
  props: {
    activeContentTab: String
  },
  components: {
    ScriptEditTab,
    TimingSettingsTab,
    FastgptSettingsTab,
    DataAnalysisTab
  },
  data() {
    return {
      tabs: [
        { id: 'script-edit', name: '话术编辑' },
        { id: 'timing-settings', name: '定时设置' },
        { id: 'fastgpt-settings', name: 'FastGPT设置' },
        { id: 'data-analysis', name: '数据分析' }
      ]
    }
  },
  computed: {
    activeTab() {
      return this.activeContentTab;
    }
  },
  methods: {
    setActiveTab(tabId) {
      this.$emit('tab-change', tabId);
    }
  }
}
</script>

<style scoped>
.content {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-header h2 {
  font-size: 18px;
  font-weight: 500;
  color: var(--dark-gray);
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab.active {
  border-bottom: 2px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.tab:hover {
  color: var(--primary-color);
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
</style>
