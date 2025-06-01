<template>
  <div class="sidebar">
    <h3>功能导航</h3>
    <ul class="sidebar-menu">
      <li v-for="(item, index) in menuItems" :key="index">
        <a 
          href="#" 
          :class="{ active: activeMenu === item.id }"
          @click.prevent="setActiveMenu(item.id)"
        >
          {{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
  data() {
    return {
      activeMenu: 'script',
      menuItems: [
        { id: 'script', name: '话术设置' },
        { id: 'timing', name: '定时设置' }
      ]
    }
  },
  methods: {
    setActiveMenu(id) {
      this.activeMenu = id;
      this.$emit('menu-change', id);
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.sidebar h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: var(--dark-gray);
  font-weight: 500;
}

.sidebar-menu {
  list-style: none;
}

.sidebar-menu li {
  margin-bottom: 10px;
}

.sidebar-menu a {
  display: block;
  padding: 8px 10px;
  color: #555;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.sidebar-menu a:hover, .sidebar-menu a.active {
  background-color: var(--light-gray);
  color: var(--primary-color);
}

.sidebar-menu a.active {
  border-left: 3px solid var(--primary-color);
  font-weight: 500;
}
</style>
