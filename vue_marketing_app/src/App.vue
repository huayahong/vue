<template>
  <div class="container">
    <app-header />
    <div class="main-content">
      <app-sidebar />
      <app-content />
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
  }
}
</script>

<style>
.main-content {
  display: flex;
  gap: 20px;
}
</style>
