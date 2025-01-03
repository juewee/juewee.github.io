<template>
    <div class="container">
        <div class="input-container">
            <input class="input-field" type="text" v-model="input" @keyup.enter="talk" placeholder="请输入文本，按回车生成语音" />
            <button class="submit-button" @click="talk" :disabled="loading">
                {{ loading ? "生成中..." : "生成语音" }}
            </button>
        </div>
        <div v-if="loading" class="loading-container">
            <p class="loading-text">语音生成中，请稍候...</p>
        </div>
        <div v-if="audioUrl" class="audio-container">
            <audio ref="audioPlayer" :src="audioUrl" controls autoplay />
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "TextToSpeech",
    data() {
        return {
            input: "", // 用户输入的文本
            audioUrl: "", // 返回的语音文件地址
            loading: false, // 加载状态
        };
    },
    methods: {
        async talk() {
            if (!this.input.trim()) {
                alert("请输入有效文本");
                return;
            }

            this.loading = true; // 设置加载状态为 true
            try {
                // 调用 API 生成语音
                const response = await axios.post(
                    "/api/infer/gen",
                    {
                        access_token: "67b6cb3ac10960247bbe7401936bd3f5",
                        type: "tts",
                        brand: "gpt-sovits",
                        name: "anime",
                        method: "api",
                        prarm: {
                            speaker: "七七【原神】",
                            emotion: "中立",
                            text: this.input,
                            text_language: "中文",
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 0, // 设置超时为无限制
                    }
                );


                this.loading = false; // 加载完成

                if (response.data && response.data.audio) {
                    this.audioUrl = response.data.audio; // 更新音频地址

                    // 确保音频可以自动播放
                    this.$nextTick(() => {
                        const audio = this.$refs.audioPlayer;
                        if (audio) {
                            audio.load(); // 加载新的音频
                            audio.play().catch((err) => {
                                console.error("自动播放失败：", err);
                                alert("无法自动播放，请手动播放");
                            });
                        }
                    });
                } else {
                    alert("语音生成失败，请重试");
                }
            } catch (error) {
                this.loading = false; // 加载完成
                alert("请求失败，请检查网络连接");
                console.error(error);
            }
        },
    },
};
</script>

<style>
/* 背景和整体容器 */
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #121212;
    /* 深色背景 */
    padding: 20px;
    box-sizing: border-box;
}

/* 输入框容器 */
.input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    width: 100%;
    max-width: 600px;
}

/* 输入框 */
.input-field {
    flex: 1;
    padding: 15px;
    border: 1px solid #444;
    /* 深色边框 */
    border-radius: 10px;
    background-color: #333;
    /* 深灰色背景 */
    color: #fff;
    /* 白色文字 */
    font-size: 16px;
    outline: none;
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
    /* 微弱阴影 */
    transition: all 0.3s ease;
}

.input-field::placeholder {
    color: #bbb;
    /* 浅灰色的占位符 */
}

.input-field:focus {
    border-color: #4a90e2;
    /* 聚焦时的边框颜色 */
    box-shadow: 0 0 6px rgba(74, 144, 226, 0.7);
    /* 聚焦时的阴影 */
}

/* 提交按钮 */
.submit-button {
    margin-left: 10px;
    padding: 12px 25px;
    background-color: #4a90e2;
    /* 按钮颜色 */
    color: #fff;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.submit-button:disabled {
    background-color: #777;
    /* 禁用时按钮颜色 */
    cursor: not-allowed;
}

.submit-button:hover:enabled {
    background-color: #357ab7;
    /* 按钮悬停效果 */
}

/* 加载提示 */
.loading-container {
    margin-top: 15px;
}

.loading-text {
    color: #ccc;
    font-size: 16px;
    text-align: center;
}

/* 音频容器 */
.audio-container {
    width: 100%;
    max-width: 600px;
    margin-top: 20px;
}

audio {
    width: 100%;
    border-radius: 10px;
    background-color: #333;
    outline: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
