<template>
    <div class="glm-model">
      <h1>GLM-4 模型调用单次调用</h1>
      
      <textarea v-model="userInput" placeholder="输入您的内容..."></textarea>
      <button @click="callGLMModel">提交</button>
  
      <div class="response">
        <h2>响应结果:</h2>
        <div v-if="isLoading">加载中...</div>
        <div v-if="response">{{ response }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userInput: '', // 用户输入的对话内容
        response: '', // 保存返回的数据
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
        this.response = ''; // 清空之前的响应内容
  
        try {
          const apiKey = '854c4025af0e7c0d6c7e32889b8e0341.34gzcFnIvhFYDEsY'; // 您的API密钥
          const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'; // 正确的API端点
  
          // 准备请求参数
          const requestBody = {
            model: 'glm-4', // 使用的模型编码
            messages: [
              { role: 'system', content: '这是一个系统消息' },
              { role: 'user', content: this.userInput } // 用户输入内容
            ],
            max_tokens: 50, // 控制生成最大token数
            temperature: 0.7, // 设置采样温度
            top_p: 0.9, // 使用top_p策略
            stream: false // 使用同步方式，非流式
          };
  
          // 发起POST请求
          const result = await axios.post(
            url,
            requestBody,
            {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              }
            }
          );
  
          // 处理非流式响应
          this.response = result.data.choices[0].message.content; // 获取模型的返回结果
        } catch (error) {
          console.error('请求出错:', error);
          this.response = `请求出错: ${error.response ? error.response.data.msg : error.message}`;
        } finally {
          this.isLoading = false;
        }
      },
    },
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
    height: 100px;
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
  