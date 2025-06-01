<template>
  <div class="container">
    <app-header />
    <div class="main-content">
      <app-sidebar @menu-change="handleMenuChange" />
      <app-content :active-content-tab="currentContentTab" @tab-change="handleContentTabChange" />
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppContent from './components/AppContent.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSidebar,
    AppContent
  },
  data() {
    return {
      currentContentTab: 'script-edit'
    }
  },
  methods: {
    handleMenuChange(sidebarMenuId) {
      if (sidebarMenuId === 'script') {
        this.currentContentTab = 'script-edit';
      } else if (sidebarMenuId === 'timing') {
        this.currentContentTab = 'timing-settings';
      }
    },
    handleContentTabChange(tabId) {
      this.currentContentTab = tabId;
    }
  }
}
</script>

<style>
.main-content {
  display: flex;
  gap: 20px;
}
</style>
