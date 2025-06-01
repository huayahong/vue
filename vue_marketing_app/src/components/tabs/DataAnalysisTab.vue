<template>
  <div>
    <!-- 标签页切换 -->
    <div class="data-tabs">
      <div 
        class="data-tab" 
        :class="{ active: activeTab === 'overview' }"
        @click="setActiveTab('overview')"
      >
        总体概览
      </div>
      <div 
        class="data-tab" 
        :class="{ active: activeTab === 'daily' }"
        @click="setActiveTab('daily')"
      >
        每日分析
      </div>
    </div>
    
    <!-- 总体概览标签页内容 -->
    <div v-if="activeTab === 'overview'" class="tab-content">
      <!-- 数据筛选 -->
      <div class="data-filters">
        <div class="data-filter">
          <label>日期范围</label>
          <div class="date-range-picker">
            <input 
              type="date" 
              v-model="dateRange.start" 
              @change="updateDateRange"
            />
            <span>至</span>
            <input 
              type="date" 
              v-model="dateRange.end" 
              @change="updateDateRange"
            />
          </div>
        </div>
      </div>
      
      <!-- 数据统计卡片 -->
      <div class="stats">
        <div class="stat-card" v-for="(stat, index) in overallStats" :key="index">
          <h4>{{ stat.label }}</h4>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </div>
      
      <!-- 数据表格 -->
      <div class="data-tables">
        <h3>总体数据表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>发送量</th>
              <th>回复率</th>
              <th>封号率</th>
              <th>转化率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in dailyData" :key="day.date">
              <td>{{ formatDate(day.date) }}</td>
              <td>{{ day.sent }}</td>
              <td>{{ day.replyRate }}%</td>
              <td>{{ day.banRate }}%</td>
              <td>{{ day.conversionRate }}%</td>
            </tr>
          </tbody>
        </table>
        
        <h3>话术类型效果对比表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>话术类型</th>
              <th>使用次数</th>
              <th>平均回复率</th>
              <th>平均转化率</th>
              <th>封号风险</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(type, index) in scriptTypeStats" :key="index">
              <td>{{ type.name }}</td>
              <td>{{ type.count }}</td>
              <td>{{ type.replyRate }}%</td>
              <td>{{ type.conversionRate }}%</td>
              <td>
                <span :class="['badge', getBadgeClass(type.riskLevel)]">
                  {{ type.riskLevel }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <h3>转化漏斗数据表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>阶段</th>
              <th>数量</th>
              <th>转化率</th>
              <th>环比变化</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stage, index) in funnelData" :key="index">
              <td>{{ stage.name }}</td>
              <td>{{ stage.count }}</td>
              <td>{{ stage.rate }}%</td>
              <td :class="getChangeClass(stage.change)">{{ formatChange(stage.change) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 每日分析标签页内容 -->
    <div v-if="activeTab === 'daily'" class="tab-content">
      <!-- 日期选择器 -->
      <div class="day-selector">
        <div 
          v-for="(day, index) in dailyData" 
          :key="day.date"
          class="day-item"
          :class="{ active: activeDayTab === 'day' + (index + 1) }"
          @click="setDayTab('day' + (index + 1))"
        >
          {{ formatDate(day.date) }}
        </div>
      </div>
      
      <!-- 当日数据 -->
      <div v-if="currentDayData" class="daily-data">
        <div class="stats">
          <div class="stat-card">
            <h4>当日发送量</h4>
            <div class="stat-value">{{ currentDayData.sent }}</div>
          </div>
          <div class="stat-card">
            <h4>回复率</h4>
            <div class="stat-value">{{ currentDayData.replyRate }}%</div>
          </div>
          <div class="stat-card">
            <h4>封号数</h4>
            <div class="stat-value">{{ currentDayData.bans }}</div>
          </div>
          <div class="stat-card">
            <h4>转化率</h4>
            <div class="stat-value">{{ currentDayData.conversionRate }}%</div>
          </div>
        </div>
        
        <h3>当日话术效果表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>话术类型</th>
              <th>发送次数</th>
              <th>回复数</th>
              <th>回复率</th>
              <th>转化数</th>
              <th>转化率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(type, index) in dailyScriptStats" :key="index">
              <td>{{ type.name }}</td>
              <td>{{ type.sent }}</td>
              <td>{{ type.replies }}</td>
              <td>{{ type.replyRate }}%</td>
              <td>{{ type.conversions }}</td>
              <td>{{ type.conversionRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DataAnalysisTab',
  computed: {
    ...mapState({
      dailyData: state => state.dataAnalysis.dailyData,
      activeTab: state => state.dataAnalysis.activeTab,
      activeDayTab: state => state.dataAnalysis.activeDayTab,
      dateRangeState: state => state.dataAnalysis.dateRange
    }),
    ...mapGetters(['currentDayData', 'overallStats']),
    dateRange: {
      get() {
        return this.dateRangeState;
      },
      set(value) {
        // 在这里不直接提交，而是通过updateDateRange方法提交
      }
    },
    // 模拟数据 - 实际应用中应从API获取或计算
    scriptTypeStats() {
      return [
        { name: '文字', count: 1245, replyRate: 32.5, conversionRate: 15.8, riskLevel: '低' },
        { name: '图片', count: 876, replyRate: 38.2, conversionRate: 18.3, riskLevel: '低' },
        { name: '视频', count: 432, replyRate: 42.7, conversionRate: 22.1, riskLevel: '中' },
        { name: '语音', count: 321, replyRate: 40.5, conversionRate: 19.7, riskLevel: '低' },
        { name: '组合', count: 1694, replyRate: 45.3, conversionRate: 24.5, riskLevel: '低' }
      ];
    },
    funnelData() {
      return [
        { name: '发送', count: 4568, rate: 100, change: 0 },
        { name: '已读', count: 3982, rate: 87.2, change: 2.5 },
        { name: '回复', count: 1485, rate: 32.5, change: 4.8 },
        { name: '点击链接', count: 876, rate: 19.2, change: 3.2 },
        { name: '转化', count: 694, rate: 15.2, change: 5.7 }
      ];
    },
    dailyScriptStats() {
      // 模拟当日各类型话术效果数据
      return [
        { name: '文字', sent: 320, replies: 112, replyRate: 35.0, conversions: 48, conversionRate: 15.0 },
        { name: '图片', sent: 215, replies: 86, replyRate: 40.0, conversions: 43, conversionRate: 20.0 },
        { name: '视频', sent: 98, replies: 42, replyRate: 42.9, conversions: 24, conversionRate: 24.5 },
        { name: '语音', sent: 65, replies: 26, replyRate: 40.0, conversions: 13, conversionRate: 20.0 },
        { name: '组合', sent: 60, replies: 28, replyRate: 46.7, conversions: 16, conversionRate: 26.7 }
      ];
    }
  },
  methods: {
    ...mapMutations(['setDataAnalysisTab', 'setDayDataTab', 'updateDateRange']),
    setActiveTab(tab) {
      this.setDataAnalysisTab(tab);
    },
    setDayTab(tab) {
      this.setDayDataTab(tab);
    },
    updateDateRange() {
      this.$store.commit('updateDateRange', {
        start: this.dateRange.start,
        end: this.dateRange.end
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    getBadgeClass(riskLevel) {
      const classMap = {
        '低': 'badge-success',
        '中': 'badge-warning',
        '高': 'badge-danger'
      };
      return classMap[riskLevel] || 'badge-primary';
    },
    getChangeClass(change) {
      return change > 0 ? 'positive-change' : change < 0 ? 'negative-change' : '';
    },
    formatChange(change) {
      return change > 0 ? `+${change}%` : `${change}%`;
    }
  }
}
</script>

<style scoped>
.data-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.data-tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.data-tab.active {
  border-bottom: 2px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
}

.data-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.data-filter {
  flex: 1;
  min-width: 200px;
}

.date-range-picker {
  display: flex;
  gap: 10px;
  align-items: center;
}

.date-range-picker input {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

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

.data-tables h3 {
  margin: 20px 0 10px;
  font-size: 16px;
  font-weight: 500;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.data-table th, .data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: var(--light-gray);
  font-weight: 500;
  color: var(--dark-gray);
}

.data-table tr:hover {
  background-color: #f9f9f9;
}

.positive-change {
  color: var(--success-color);
}

.negative-change {
  color: var(--danger-color);
}

.day-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.day-item {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
}

.day-item.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.daily-data h3 {
  margin: 20px 0 10px;
  font-size: 16px;
  font-weight: 500;
}
</style>
