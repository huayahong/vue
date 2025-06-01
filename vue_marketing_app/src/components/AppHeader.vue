<template>
  <header class="header">
    <h1>{{ appTitle }}</h1>
    <div class="actions">
      <span>启动状态</span>
      <label class="switch">
        <input type="checkbox" v-model="isEnabled">
        <span class="slider"></span>
      </label>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['appTitle']),
    isEnabled: {
      get() {
        return this.$store.state.isEnabled
      },
      set(value) {
        this.$store.commit('setAppEnabled', value)
      }
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.header h1 {
  font-size: 24px;
  font-weight: 500;
  color: var(--dark-gray);
}

.header .actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
