<template>
  <div class="script-editor">
    <h4>添加新话术</h4>
    
    <!-- 媒体类型选择 -->
    <div class="media-type-selector">
      <label class="media-type-option">
        <input type="checkbox" v-model="selectedTypes.text">
        <span>文字</span>
      </label>
      
      <label class="media-type-option">
        <input type="checkbox" v-model="selectedTypes.image">
        <span>图片</span>
      </label>
      
      <label class="media-type-option">
        <input type="checkbox" v-model="selectedTypes.audio">
        <span>语音</span>
      </label>
      
      <label class="media-type-option">
        <input type="checkbox" v-model="selectedTypes.video">
        <span>视频</span>
      </label>
    </div>
    
    <!-- 文本输入 -->
    <div v-if="selectedTypes.text" class="form-group">
      <textarea 
        class="form-control" 
        placeholder="输入话术内容..." 
        v-model="textContent"
      ></textarea>
    </div>
    
    <!-- 图片上传 -->
    <div v-if="selectedTypes.image" class="form-group">
      <input 
        type="text" 
        class="form-control" 
        placeholder="图片文件名或URL" 
        v-model="imageContent"
      />
    </div>
    
    <!-- 语音上传 -->
    <div v-if="selectedTypes.audio" class="form-group">
      <input 
        type="text" 
        class="form-control" 
        placeholder="语音文件名或URL" 
        v-model="audioContent"
      />
    </div>
    
    <!-- 视频上传 -->
    <div v-if="selectedTypes.video" class="form-group">
      <input 
        type="text" 
        class="form-control" 
        placeholder="视频文件名或URL" 
        v-model="videoContent"
      />
    </div>
    
    <!-- 添加按钮 -->
    <button 
      class="btn btn-primary" 
      @click="addScript"
      :disabled="!isValidInput"
    >
      添加话术
    </button>
  </div>
</template>

<script>
export default {
  name: 'ScriptEditor',
  props: {
    dayId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedTypes: {
        text: false,
        image: false,
        audio: false,
        video: false
      },
      textContent: '',
      imageContent: '',
      audioContent: '',
      videoContent: ''
    }
  },
  computed: {
    isValidInput() {
      // 至少选择了一种类型，且对应的内容不为空
      if (this.selectedTypes.text && this.textContent.trim() !== '') return true;
      if (this.selectedTypes.image && this.imageContent.trim() !== '') return true;
      if (this.selectedTypes.audio && this.audioContent.trim() !== '') return true;
      if (this.selectedTypes.video && this.videoContent.trim() !== '') return true;
      return false;
    }
  },
  methods: {
    addScript() {
      if (!this.isValidInput) return;
      
      let content = '';
      let type = '';
      
      // 确定类型和内容
      if (this.selectedTypes.text && !this.selectedTypes.image && !this.selectedTypes.audio && !this.selectedTypes.video) {
        // 纯文本
        type = 'text';
        content = this.textContent;
      } else if (!this.selectedTypes.text && this.selectedTypes.image && !this.selectedTypes.audio && !this.selectedTypes.video) {
        // 纯图片
        type = 'image';
        content = this.imageContent;
      } else if (!this.selectedTypes.text && !this.selectedTypes.image && this.selectedTypes.audio && !this.selectedTypes.video) {
        // 纯语音
        type = 'audio';
        content = this.audioContent;
      } else if (!this.selectedTypes.text && !this.selectedTypes.image && !this.selectedTypes.audio && this.selectedTypes.video) {
        // 纯视频
        type = 'video';
        content = this.videoContent;
      } else {
        // 组合类型
        type = 'combo';
        let parts = [];
        if (this.selectedTypes.text && this.textContent.trim() !== '') {
          parts.push(this.textContent);
        }
        if (this.selectedTypes.image && this.imageContent.trim() !== '') {
          parts.push(this.imageContent);
        }
        if (this.selectedTypes.audio && this.audioContent.trim() !== '') {
          parts.push(this.audioContent);
        }
        if (this.selectedTypes.video && this.videoContent.trim() !== '') {
          parts.push(this.videoContent);
        }
        content = parts.join(' + ');
      }
      
      // 发送添加事件
      this.$emit('add-script', {
        dayId: this.dayId,
        script: { type, content }
      });
      
      // 重置表单
      this.resetForm();
    },
    resetForm() {
      this.textContent = '';
      this.imageContent = '';
      this.audioContent = '';
      this.videoContent = '';
      
      // 保持类型选择不变，方便连续添加同类型话术
    }
  }
}
</script>

<style scoped>
.script-editor {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: #f9f9f9;
}

.script-editor h4 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
}

.media-type-selector {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.media-type-option {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}
</style>
