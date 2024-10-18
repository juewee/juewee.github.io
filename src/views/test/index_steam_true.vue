<template>
  <div class="glm-model">
      <h1>GLM-4 模型流式调用</h1>

      <textarea v-model="userInput" placeholder="输入您的内容..."></textarea>
      <button @click="callGLMModel">提交</button>

      <div class="response">
          <h2>响应结果:</h2>
          <div v-if="isLoading">加载中...</div>
          <textarea v-model="responseText" rows="10" readonly></textarea>
      </div>
  </div>
</template>

<script>
import { callGLMApi } from '@/api/ai.js'; // 导入API调用

export default {
  data() {
      return {
          userInput: '', // 用户输入的内容
          responseText: '', // 模型返回的响应文本
          isLoading: false, // 加载状态
      };
  },
  methods: {
      async callGLMModel() {
          if (!this.userInput.trim()) {
              alert('请输入内容');
              return;
          }

          this.isLoading = true;
          this.responseText = ''; // 每次调用前清空响应内容

          try {
              const response = await callGLMApi(this.userInput); // 调用拆分出的 API 请求

              if (response.ok && response.body) {
                  const reader = response.body.getReader();
                  const decoder = new TextDecoder();
                  let done = false;

                  while (!done) {
                      const { value, done: readerDone } = await reader.read();
                      done = readerDone;
                      const chunk = decoder.decode(value, { stream: true });

                      // 处理流式数据
                      const lines = chunk.split('\n').filter(line => line.startsWith('data:'));
                      lines.forEach((line) => {
                          const jsonStr = line.replace('data: ', '').trim();
                          if (jsonStr !== '[DONE]') {
                              const parsedData = JSON.parse(jsonStr);
                              const content = parsedData.choices[0].delta?.content;
                              if (content) {
                                  this.responseText += content; // 动态更新响应文本
                              }
                          }
                      });
                  }
              }

          } catch (error) {
              console.error('请求出错:', error);
              this.responseText = `请求出错: ${error.message}`;
          } finally {
              this.isLoading = false;
          }
      }

  }
};
</script>

<style scoped>
.glm-model {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

textarea {
  width: 100%;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  margin-bottom: 20px;
}

.response {
  margin-top: 20px;
}
</style>