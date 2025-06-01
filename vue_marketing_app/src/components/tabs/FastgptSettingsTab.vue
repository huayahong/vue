<template>
  <div>
    <h3>FastGPT设置</h3>
    
    <div class="settings-section">
      <div class="setting-row">
        <div class="setting-label">API Key</div>
        <div class="setting-input">
          <input 
            type="password" 
            class="form-control" 
            v-model="apiKey" 
            placeholder="输入您的FastGPT API Key"
          />
          <button class="btn btn-primary btn-sm" @click="testConnection">验证</button>
        </div>
      </div>
      
      <div class="setting-row">
        <div class="setting-label">模型选择</div>
        <select class="form-control" v-model="model">
          <option v-for="option in modelOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <div class="setting-row">
        <div class="setting-label">温度 ({{ temperature }})</div>
        <input 
          type="range" 
          class="form-control-range" 
          min="0" 
          max="1" 
          step="0.1" 
          v-model.number="temperature"
        />
      </div>
      
      <div class="setting-row">
        <div class="setting-label">最大输出长度</div>
        <input 
          type="number" 
          class="form-control" 
          v-model.number="maxLength" 
          min="100" 
          max="4000"
        />
      </div>
      
      <div class="setting-row">
        <div class="setting-label">使用客户历史数据</div>
        <label class="switch">
          <input type="checkbox" v-model="useCustomerHistory">
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-row">
        <div class="setting-label">使用产品知识库</div>
        <label class="switch">
          <input type="checkbox" v-model="useProductKnowledge">
          <span class="slider"></span>
        </label>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>每日不同提示词</h3>
      
      <div class="setting-row">
        <div class="setting-label">启用每日不同提示词</div>
        <label class="switch">
          <input type="checkbox" v-model="enableDailyPrompts">
          <span class="slider"></span>
        </label>
      </div>
      
      <div v-if="!enableDailyPrompts" class="form-group">
        <label>默认提示词模板</label>
        <textarea 
          class="form-control" 
          v-model="defaultPrompt" 
          rows="6"
        ></textarea>
      </div>
      
      <div v-if="enableDailyPrompts" class="daily-prompts">
        <div v-for="day in scriptDays" :key="day.id" class="daily-prompt-item">
          <h4>第{{ day.dayNumber }}天 - {{ day.title }}</h4>
          <textarea 
            class="form-control" 
            v-model="promptsByDay[day.dayNumber]" 
            rows="4"
            @change="updateDailyPrompt(day.dayNumber)"
            :placeholder="defaultPrompt"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FastgptSettingsTab',
  data() {
    return {
      modelOptions: [
        { value: 'GPT-3.5-Turbo', label: 'GPT-3.5-Turbo' },
        { value: 'GPT-4', label: 'GPT-4' },
        { value: 'GPT-4-Turbo', label: 'GPT-4-Turbo' },
        { value: 'Claude-2', label: 'Claude-2' },
        { value: 'Claude-Instant', label: 'Claude-Instant' }
      ],
      promptsByDay: {}
    }
  },
  computed: {
    ...mapState(['fastGptSettings', 'scriptDays']),
    apiKey: {
      get() {
        return this.fastGptSettings.apiKey;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { apiKey: value });
      }
    },
    model: {
      get() {
        return this.fastGptSettings.model;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { model: value });
      }
    },
    temperature: {
      get() {
        return this.fastGptSettings.temperature;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { temperature: value });
      }
    },
    maxLength: {
      get() {
        return this.fastGptSettings.maxLength;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { maxLength: value });
      }
    },
    useCustomerHistory: {
      get() {
        return this.fastGptSettings.useCustomerHistory;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { useCustomerHistory: value });
      }
    },
    useProductKnowledge: {
      get() {
        return this.fastGptSettings.useProductKnowledge;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { useProductKnowledge: value });
      }
    },
    enableDailyPrompts: {
      get() {
        return this.fastGptSettings.enableDailyPrompts;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { enableDailyPrompts: value });
      }
    },
    defaultPrompt: {
      get() {
        return this.fastGptSettings.defaultPrompt;
      },
      set(value) {
        this.$store.commit('updateFastGptSettings', { defaultPrompt: value });
      }
    }
  },
  created() {
    // 初始化每日提示词
    this.fastGptSettings.dailyPrompts.forEach(item => {
      this.promptsByDay[item.day] = item.prompt;
    });
  },
  methods: {
    testConnection() {
      this.$store.dispatch('testFastGptConnection')
        .then(result => {
          if (result.success) {
            alert('API Key 验证成功！');
          } else {
            alert('API Key 验证失败，请检查后重试。');
          }
        });
    },
    updateDailyPrompt(day) {
      this.$store.commit('updateDailyPrompt', {
        day,
        prompt: this.promptsByDay[day]
      });
    }
  }
}
</script>

<style scoped>
.settings-section {
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 15px;
  background-color: #f9f9f9;
}

.settings-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 500;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.setting-label {
  font-size: 16px;
  color: var(--dark-gray);
}

.setting-input {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 60%;
}

.form-control-range {
  width: 200px;
}

.daily-prompts {
  margin-top: 20px;
}

.daily-prompt-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.daily-prompt-item h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
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
