// api.js
export async function callGLMApi(messages) {
    const apiKey = import.meta.env.VITE_APP_KEY; // API 密钥
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'; // API 端点
  
    const requestBody = {
      model: 'glm-4',
      messages: messages,
    //   max_tokens: 500,
      stream: true
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
  
    return response;
  }
  