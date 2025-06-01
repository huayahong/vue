<template>
  <div>
    <h3>定时设置</h3>
    
    <div class="setting-row">
      <div class="setting-label">启用每日定时推送</div>
      <label class="switch">
        <input type="checkbox" v-model="timingEnabled">
        <span class="slider"></span>
      </label>
    </div>
    
    <div class="setting-row">
      <div class="setting-label">每天推送时间</div>
      <input 
        type="time" 
        class="form-control time-picker" 
        v-model="dailyTime"
        :disabled="!timingEnabled"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TimingSettingsTab',
  computed: {
    ...mapState(['timingSettings']),
    timingEnabled: {
      get() {
        return this.timingSettings.enabled;
      },
      set(value) {
        this.$store.commit('updateTimingSettings', { enabled: value });
      }
    },
    dailyTime: {
      get() {
        return this.timingSettings.dailyTime;
      },
      set(value) {
        this.$store.commit('updateTimingSettings', { dailyTime: value });
      }
    }
  }
}
</script>

<style scoped>
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
}

.setting-label {
  font-size: 16px;
  color: var(--dark-gray);
}

.time-picker {
  width: 150px;
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
