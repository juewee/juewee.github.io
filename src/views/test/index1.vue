<template>
    <div class="container">
      <!-- 输入框 -->
      <el-input class="text" placeholder="请输入内容" v-model="input" @keyup.enter="send">
        <template #append>
          <el-button @click="send">发送</el-button>
        </template>
      </el-input>
  
      <!-- 隐藏的音频播放控件 -->
      <audio v-if="audioSrc" :src="audioSrc" autoplay style="display: none;"></audio>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { get_tts } from '@/api/voice';
  
  const input = ref('');    // 用于存储用户输入的文本
  const audioSrc = ref(null); // 用于存储返回的音频流的URL
  
  const send = async () => {
    if (!input.value) {
      ElMessage.error("请输入内容！");
      return;
    }
  
    try {
        let params= {
          text: input.value,
          text_lang: 'zh',
          ref_audio_path: 'E:\\losheep\\project\\AI\\GPT-SoVITS-v2-240821\\models\\jinxi\\jinxi.wav',
          prompt_lang: 'zh',
          prompt_text: '这几间密室相对隐蔽，大家都能暂时喘口气……',
          text_split_method: 'cut5',
          batch_size: 1,
          media_type: 'wav',
          streaming_mode: true
        }
      // 发送请求到TTS服务
      const response = await get_tts(params);
  
      // 将返回的blob数据转换为音频URL
      const audioURL = URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
      audioSrc.value = audioURL;
    } catch (error) {
      console.error("TTS 请求失败：", error);
      ElMessage.error("TTS 请求失败，请稍后再试。");
    }
  };
  </script>
  
  <style scoped>
  .container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text {
    width: 400px;
  }
  </style>
  