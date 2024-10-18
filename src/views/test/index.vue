<template>
    <div class="container">
        <!-- 输入框 -->
        <el-input class="text" placeholder="请输入内容" v-model="input" @keyup.enter="handleSend">
            <template #append>
                <el-button @click="handleSend">发送</el-button>
            </template>
        </el-input>

        <!-- AI回复文本框 -->
        <div class="response" v-if="isTextShown">
            <h2>AI 回复:</h2>
            <textarea v-model="responseText" rows="5" readonly></textarea>
        </div>
        <div v-if="isLoading">加载中...</div>

        <!-- 隐藏的音频播放控件 -->
        <audio ref="audioPlayer" @ended="playNextAudio" style="display: none"></audio>
        <el-button @click="downloadMessages" type="primary">下载消息</el-button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get_tts } from '@/api/voice'; // TTS接口
import { callGLMApi } from '@/api/ai.js'; // AI模型接口
import { ElMessage } from 'element-plus'; // 引入 ElMessage

// 响应式变量
const input = ref(''); // 用户输入的文本
const responseText = ref(''); // AI的回复文本
const audioQueue = ref([]); // 存储待播放的音频URL队列
const isLoading = ref(false); // 加载状态
const isTextShown = ref(false); // 是否展示文本
const audioPlayer = ref(null); // audio元素的引用
const textBuffer = ref(''); // 缓存未完成的句子
const sentenceQueue = ref([]); // 待处理的句子队列
const isProcessingQueue = ref(false); // 队列是否正在处理
const messages = ref([]); // 用于存储用户和AI的对话历史
const currentAudioIndex = ref(0); // 当前播放音频索引


const downloadMessages = async () => {
    const json = JSON.stringify(messages.value, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `messages_${getCurrentTime()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
};


// 处理发送按钮点击事件
const handleSend = async () => {
    if (!input.value.trim()) {
        ElMessage.error('请输入内容！');
        return;
    }
    // const userInput = getCurrentTime() + input.value;
    const userInput = input.value;
    messages.value.push({ role: 'system', content: '你是一个可爱的秘书，请根据用户输入提供简洁明了的回复。对话时间：'+ getCurrentTime() }); // 添加用户消息到历史
    messages.value.push({ role: 'user', content: userInput }); // 添加用户消息到历史
    await getAIResponse(userInput);
    input.value = ''; // 清空输入框
};

// 获取当前时间
const getCurrentTime = () => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日${now.getHours()}时${now.getMinutes()}分${now.getSeconds()}秒:`;
};

onMounted(() => {
    console.log(getCurrentTime());
});

// 获取AI回复
const getAIResponse = async (userInput) => {
    resetState();
    // messages.value.unshift({ role: 'system', content: '你是一个可爱的秘书，请根据用户输入提供简洁明了的回复。对话时间：'+ getCurrentTime() });
    
    try {
        const response = await callGLMApi(messages.value);
        if (response.ok && response.body) {
            await handleStreamResponse(response.body);
        }
    } catch (error) {
        handleError(error, '请求出错');
    }
};

// 处理流式AI回复
const handleStreamResponse = async (body) => {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let doneReading = false;

    while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;
        const chunk = decoder.decode(value, { stream: true });
        processStreamChunk(chunk);
    }
    messages.value.push({ role: 'assistant', content: responseText.value }); // 添加用户消息到历史
    if (!isProcessingQueue.value) {
        processSentenceQueue();
    }
};

// 处理流式数据块
const processStreamChunk = (chunk) => {
    const lines = chunk.split('\n').filter((line) => line.startsWith('data:'));
    lines.forEach((line) => {
        const jsonStr = line.replace('data: ', '').trim();
        if (jsonStr !== '[DONE]') {
            const parsedData = JSON.parse(jsonStr);
            const content = parsedData.choices[0].delta?.content;
            if (content) {
                textBuffer.value += content; // 将内容追加到缓存
                extractCompleteSentences();
            }
        }
    });
    
};

// 提取完整句子并加入队列
const extractCompleteSentences = () => {
    const sentenceEndRegex = /[。？!！.]/;
    let match;
    while ((match = sentenceEndRegex.exec(textBuffer.value)) !== null) {
        const sentence = textBuffer.value.slice(0, match.index + 1).trim(); // 提取完整句子
        textBuffer.value = textBuffer.value.slice(match.index + 1); // 更新缓存
        responseText.value += sentence + '\n'; // 实时更新回复文本
        sentenceQueue.value.push(sentence); // 将句子加入队列
    }
    
};

// 处理句子队列
const processSentenceQueue = async () => {
    if (isProcessingQueue.value) return; // 防止并发调用
    isProcessingQueue.value = true;

    while (sentenceQueue.value.length > 0) {
        const sentence = sentenceQueue.value.shift();
        await generateAudioForSentence(sentence);
    }

    isProcessingQueue.value = false;
};

// 调用TTS接口生成语音
const generateAudioForSentence = async (sentence) => {
    try {
        await generateTTS(sentence.trim());
    } catch (error) {
        console.error('TTS 请求失败:', error);
        ElMessage.error('TTS 请求失败，请稍后再试。');
    }
};

// 生成单句语音
const generateTTS = async (text) => {
    const params = {
        text: text,
        text_lang: 'zh',
        ref_audio_path: 'E:\\losheep\\project\\AI\\GPT-SoVITS-v2-240821\\models\\jinxi\\jinxi.wav',
        prompt_lang: 'zh',
        prompt_text: '这几间密室相对隐蔽，大家都能暂时喘口气……',
        text_split_method: 'cut5',
        batch_size: 1,
        media_type: 'wav',
        streaming_mode: true,
    };

    const response = await get_tts(params);
    const audioURL = URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
    audioQueue.value.push(audioURL);

    // 如果这是队列中的第一个音频，开始播放
    if (audioQueue.value.length === 1) {
        playNextAudio();
    }
};

// 播放下一个音频
const playNextAudio = () => {
    if (currentAudioIndex.value < audioQueue.value.length) {
        const audioURL = audioQueue.value[currentAudioIndex.value];
        audioPlayer.value.src = audioURL;
        audioPlayer.value.play();
        currentAudioIndex.value++;
        if (!isTextShown.value) {
            isTextShown.value = true; // 在第一段音频播放后展示回复文本
            isLoading.value = false; // 加载完成
        }
    }
};

// 重置状态
const resetState = () => {
    
    isLoading.value = true;
    responseText.value = '';
    isTextShown.value = false;
    audioQueue.value = [];
    currentAudioIndex.value = 0;
    textBuffer.value = ''; // 重置缓存
    sentenceQueue.value = []; // 重置句子队列
    isProcessingQueue.value = false; // 重置队列处理状态
    console.log(messages.value);
    
};

// 处理错误
const handleError = (error, message) => {
    console.error(`${message}:`, error);
    ElMessage.error(`${message}: ${error.message}`);
};
</script>


<style scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.text {
    width: 400px;
    margin-bottom: 20px;
}

.response {
    width: 400px;
    margin-top: 20px;
}

textarea {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}
</style>