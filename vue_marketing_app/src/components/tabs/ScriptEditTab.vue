<template>
  <div>
    <!-- 数据统计面板 -->
    <div class="stats">
      <div class="stat-card" v-for="(stat, index) in statsData" :key="index">
        <h4>{{ stat.label }}</h4>
        <div class="stat-value">{{ stat.value }}</div>
      </div>
    </div>
    
    <!-- 话术天数列表 -->
    <div v-for="day in scriptDays" :key="day.id" class="script-day">
      <div class="script-header">
        <h3>
          <input 
            type="number" 
            class="day-number-input" 
            v-model.number="day.dayNumber" 
            min="1"
            @change="updateDayNumber(day.id, day.dayNumber)"
          /> 天 - {{ day.title }}
        </h3>
        <div class="script-actions">
          <button class="btn btn-primary" @click="testScript(day.id)">测试</button>
          <button class="btn btn-danger" @click="resetDay(day.id)">重置</button>
        </div>
      </div>
      
      <div class="script-content">
        <div class="form-group">
          <label>话术主题</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="day.title"
            @change="updateDayTitle(day.id, day.title)"
          />
        </div>
        
        <div class="form-group">
          <label>随机话术列表</label>
          <div class="script-list">
            <div v-for="script in day.scripts" :key="script.id" class="script-item">
              <div>
                <span 
                  :class="['script-type', getScriptTypeClass(script.type)]"
                >
                  {{ getScriptTypeLabel(script.type) }}
                </span>
                {{ formatScriptContent(script.content) }}
              </div>
              <button 
                class="btn btn-danger btn-sm" 
                @click="removeScript(day.id, script.id)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
        
        <!-- 添加新话术 -->
        <script-editor :day-id="day.id" @add-script="addScript" />
      </div>
    </div>
    
    <!-- 添加新天数按钮 -->
    <div class="add-script-btn" @click="addNewDay">
      + 添加新天数话术
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ScriptEditor from './ScriptEditor.vue'

export default {
  name: 'ScriptEditTab',
  components: {
    ScriptEditor
  },
  computed: {
    ...mapState(['scriptDays', 'stats']),
    statsData() {
      return [
        { label: '总发送量', value: this.stats.totalSent },
        { label: '今日发送量', value: this.stats.todaySent },
        { label: '总回复数量', value: this.stats.totalReplies },
        { label: '今日回复数量', value: this.stats.todayReplies },
        { label: '平均回复率', value: this.stats.replyRate + '%' },
        { label: '封号率', value: this.stats.banRate + '%' },
        { label: '互动转化率', value: this.stats.conversionRate + '%' }
      ]
    }
  },
  methods: {
    ...mapMutations(['updateScriptDay', 'addScript', 'removeScript', 'addScriptDay']),
    updateDayNumber(dayId, number) {
      this.updateScriptDay({ id: dayId, data: { dayNumber: number } });
    },
    updateDayTitle(dayId, title) {
      this.updateScriptDay({ id: dayId, data: { title } });
    },
    addNewDay() {
      this.addScriptDay();
    },
    resetDay(dayId) {
      // 重置指定天数的话术
      this.updateScriptDay({ 
        id: dayId, 
        data: { scripts: [] } 
      });
    },
    testScript(dayId) {
      // 测试话术功能
      this.$store.dispatch('generateTestScript', { dayId })
        .then(result => {
          if (result.success) {
            this.addScript({ 
              dayId, 
              script: result.script 
            });
          }
        });
    },
    getScriptTypeClass(type) {
      const typeMap = {
        'text': 'text',
        'image': 'image',
        'video': 'video',
        'audio': 'audio',
        'combo': 'combo'
      };
      return typeMap[type] || 'text';
    },
    getScriptTypeLabel(type) {
      const typeMap = {
        'text': '文字',
        'image': '图片',
        'video': '视频',
        'audio': '语音',
        'combo': '组合'
      };
      return typeMap[type] || '文字';
    },
    formatScriptContent(content) {
      // 格式化显示内容，截断过长的内容
      if (content.length > 50) {
        return content.substring(0, 50) + '...';
      }
      return content;
    }
  }
}
</script>

<style scoped>
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 150px;
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid var(--border-color);
}

.stat-card h4 {
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
}

.stat-card .stat-value {
  font-size: 24px;
  font-weight: 500;
  color: var(--dark-gray);
}

.script-day {
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.script-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: var(--light-gray);
  border-bottom: 1px solid var(--border-color);
}

.script-header h3 {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.day-number-input {
  width: 50px;
  padding: 4px;
  margin-right: 5px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  text-align: center;
}

.script-header .script-actions {
  display: flex;
  gap: 10px;
}

.script-content {
  padding: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

.script-list {
  margin-top: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.script-item {
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.script-item:last-child {
  border-bottom: none;
}

.script-item .script-type {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 8px;
}

.script-type.text {
  background-color: #e3f2fd;
  color: #1976d2;
}

.script-type.image {
  background-color: #e8f5e9;
  color: #388e3c;
}

.script-type.video {
  background-color: #fff3e0;
  color: #f57c00;
}

.script-type.audio {
  background-color: #f3e5f5;
  color: #8e24aa;
}

.script-type.combo {
  background-color: #e8eaf6;
  color: #3f51b5;
}

.add-script-btn {
  margin-top: 10px;
  width: 100%;
  padding: 12px;
  background-color: #f5f5f5;
  border: 1px dashed var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  color: #777;
  transition: all 0.2s ease;
}

.add-script-btn:hover {
  background-color: #eee;
  color: var(--primary-color);
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
