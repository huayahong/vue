import { createStore } from 'vuex'

export default createStore({
  state: {
    // 全局状态
    appTitle: 'AI智能营销',
    isEnabled: true,
    
    // 话术数据
    scriptDays: [
      {
        id: 1,
        dayNumber: 1,
        title: '情绪破冰 + 提问钩子',
        scripts: [
          { id: 1, type: 'text', content: '👋 新的一周开始啦～你最近还在关注[产品/服务]吗？' },
          { id: 2, type: 'combo', content: '嗨，好久不见！最近有什么新发现吗？ + 新品预览图.jpg' },
          { id: 3, type: 'combo', content: '产品介绍.mp4 + 产品说明.mp3' }
        ]
      },
      {
        id: 2,
        dayNumber: 2,
        title: '用户共鸣 + 情绪引导',
        scripts: [
          { id: 4, type: 'text', content: '很多客户这两天都在问我：\'XXX 现在是不是机会窗口？\'' },
          { id: 5, type: 'combo', content: '文字提问 + 产品演示.mp4' },
          { id: 6, type: 'combo', content: '行业分析 + 专家解析.mp3' }
        ]
      },
      {
        id: 3,
        dayNumber: 3,
        title: '福利触发 + 引导互动',
        scripts: [
          { id: 7, type: 'text', content: '刚出了一个限时福利活动，我第一时间想到你。你这边现在还有需求吗？' },
          { id: 8, type: 'combo', content: '福利介绍 + 限时活动.jpg' }
        ]
      }
    ],
    
    // 定时设置
    timingSettings: {
      enabled: true,
      dailyTime: '09:30'
    },
    
    // FastGPT设置
    fastGptSettings: {
      apiKey: '',
      model: 'GPT-3.5-Turbo',
      temperature: 0.7,
      maxLength: 1000,
      useCustomerHistory: true,
      useProductKnowledge: true,
      enableDailyPrompts: false,
      defaultPrompt: '你是一位专业的营销顾问，负责与潜在客户进行沟通。请根据以下信息生成一段自然、友好且有吸引力的营销话术：\n\n产品/服务：{product}\n目标客户：{customer_type}\n沟通阶段：{stage}\n关键卖点：{selling_points}\n\n要求：\n1. 语气友好自然，避免过度营销感\n2. 包含一个问题引导客户回复\n3. 长度控制在100字以内\n4. 适当使用表情符号增加亲和力',
      dailyPrompts: [
        { day: 1, prompt: '' },
        { day: 2, prompt: '' },
        { day: 3, prompt: '' }
      ]
    },
    
    // 数据统计
    stats: {
      totalSent: 4568,
      todaySent: 758,
      totalReplies: 1485,
      todayReplies: 282,
      replyRate: 32.5,
      banRate: 0.8,
      conversionRate: 15.2
    },
    
    // 数据分析
    dataAnalysis: {
      dateRange: {
        start: '2025-05-22',
        end: '2025-05-29'
      },
      dailyData: [
        {
          date: '2025-05-23',
          sent: 652,
          replies: 185,
          replyRate: 28.4,
          bans: 3,
          banRate: 0.46,
          conversions: 82,
          conversionRate: 12.5
        },
        {
          date: '2025-05-24',
          sent: 678,
          replies: 205,
          replyRate: 30.2,
          bans: 2,
          banRate: 0.29,
          conversions: 94,
          conversionRate: 13.8
        },
        {
          date: '2025-05-25',
          sent: 695,
          replies: 228,
          replyRate: 32.8,
          bans: 1,
          banRate: 0.14,
          conversions: 101,
          conversionRate: 14.5
        },
        {
          date: '2025-05-26',
          sent: 712,
          replies: 239,
          replyRate: 33.5,
          bans: 2,
          banRate: 0.28,
          conversions: 108,
          conversionRate: 15.2
        },
        {
          date: '2025-05-27',
          sent: 728,
          replies: 249,
          replyRate: 34.2,
          bans: 1,
          banRate: 0.14,
          conversions: 117,
          conversionRate: 16.1
        },
        {
          date: '2025-05-28',
          sent: 745,
          replies: 267,
          replyRate: 35.8,
          bans: 0,
          banRate: 0.0,
          conversions: 129,
          conversionRate: 17.3
        },
        {
          date: '2025-05-29',
          sent: 758,
          replies: 282,
          replyRate: 37.2,
          bans: 0,
          banRate: 0.0,
          conversions: 140,
          conversionRate: 18.5
        }
      ],
      activeTab: 'overview',
      activeDayTab: 'day1'
    }
  },
  
  mutations: {
    // 应用状态
    setAppEnabled(state, value) {
      state.isEnabled = value;
    },
    
    // 话术管理
    addScriptDay(state) {
      const lastDay = state.scriptDays[state.scriptDays.length - 1];
      const newDayNumber = lastDay.dayNumber + 1;
      const newId = Math.max(...state.scriptDays.map(day => day.id)) + 1;
      
      state.scriptDays.push({
        id: newId,
        dayNumber: newDayNumber,
        title: '新话术主题',
        scripts: []
      });
      
      // 同步添加FastGPT每日提示词
      if (state.fastGptSettings.dailyPrompts.length < newDayNumber) {
        state.fastGptSettings.dailyPrompts.push({
          day: newDayNumber,
          prompt: ''
        });
      }
    },
    
    updateScriptDay(state, { id, data }) {
      const index = state.scriptDays.findIndex(day => day.id === id);
      if (index !== -1) {
        state.scriptDays[index] = { ...state.scriptDays[index], ...data };
      }
    },
    
    addScript(state, { dayId, script }) {
      const dayIndex = state.scriptDays.findIndex(day => day.id === dayId);
      if (dayIndex !== -1) {
        const newId = state.scriptDays[dayIndex].scripts.length > 0 
          ? Math.max(...state.scriptDays[dayIndex].scripts.map(s => s.id)) + 1 
          : 1;
        
        state.scriptDays[dayIndex].scripts.push({
          id: newId,
          ...script
        });
      }
    },
    
    removeScript(state, { dayId, scriptId }) {
      const dayIndex = state.scriptDays.findIndex(day => day.id === dayId);
      if (dayIndex !== -1) {
        state.scriptDays[dayIndex].scripts = state.scriptDays[dayIndex].scripts.filter(
          script => script.id !== scriptId
        );
      }
    },
    
    // 定时设置
    updateTimingSettings(state, settings) {
      state.timingSettings = { ...state.timingSettings, ...settings };
    },
    
    // FastGPT设置
    updateFastGptSettings(state, settings) {
      state.fastGptSettings = { ...state.fastGptSettings, ...settings };
    },
    
    updateDailyPrompt(state, { day, prompt }) {
      const index = state.fastGptSettings.dailyPrompts.findIndex(p => p.day === day);
      if (index !== -1) {
        state.fastGptSettings.dailyPrompts[index].prompt = prompt;
      } else {
        state.fastGptSettings.dailyPrompts.push({ day, prompt });
      }
    },
    
    // 数据分析
    setDataAnalysisTab(state, tab) {
      state.dataAnalysis.activeTab = tab;
    },
    
    setDayDataTab(state, tab) {
      state.dataAnalysis.activeDayTab = tab;
    },
    
    updateDateRange(state, { start, end }) {
      state.dataAnalysis.dateRange = { start, end };
    }
  },
  
  actions: {
    // 异步操作
    async testFastGptConnection({ state }) {
      // 模拟API调用
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: !!state.fastGptSettings.apiKey });
        }, 1000);
      });
    },
    
    async generateTestScript({ state }, { dayId, prompt }) {
      // 模拟生成话术
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            script: {
              type: 'text',
              content: `这是一个由AI生成的测试话术，基于第${dayId}天的提示词。`
            }
          });
        }, 1500);
      });
    }
  },
  
  getters: {
    // 计算属性
    scriptDayById: (state) => (id) => {
      return state.scriptDays.find(day => day.id === id);
    },
    
    dailyPromptByDay: (state) => (day) => {
      const prompt = state.fastGptSettings.dailyPrompts.find(p => p.day === day);
      return prompt ? prompt.prompt : '';
    },
    
    currentDayData: (state) => {
      const dayId = state.dataAnalysis.activeDayTab.replace('day', '');
      const index = parseInt(dayId) - 1;
      return index >= 0 && index < state.dataAnalysis.dailyData.length 
        ? state.dataAnalysis.dailyData[index] 
        : null;
    },
    
    overallStats: (state) => {
      // 计算总体统计数据
      return {
        totalSent: state.dataAnalysis.dailyData.reduce((sum, day) => sum + day.sent, 0),
        avgReplyRate: (state.dataAnalysis.dailyData.reduce((sum, day) => sum + day.replyRate, 0) / state.dataAnalysis.dailyData.length).toFixed(1),
        avgBanRate: (state.dataAnalysis.dailyData.reduce((sum, day) => sum + day.banRate, 0) / state.dataAnalysis.dailyData.length).toFixed(1),
        avgConversionRate: (state.dataAnalysis.dailyData.reduce((sum, day) => sum + day.conversionRate, 0) / state.dataAnalysis.dailyData.length).toFixed(1)
      };
    }
  }
})
