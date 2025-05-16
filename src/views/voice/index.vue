<template>
  <div class="voice-clone-container">
    <h1>Voice Cloning</h1>
    
    <div class="control-group">
      <label for="model-select">Model:</label>
      <select id="model-select" v-model="selectedModel" @change="fetchSpeakers">
        <option value="【原神】蒙德">【原神】蒙德</option>
        <option value="【原神】稻妻">【原神】稻妻</option>
        <option value="【原神】璃月">【原神】璃月</option>
        <option value="【原神】枫丹">【原神】枫丹</option>
        <option value="【原神】纳塔">【原神】纳塔</option>
        <option value="【原神】须弥">【原神】须弥</option>
        <option value="【原神】降临者">【原神】降临者</option>
      </select>
    </div>

    <div class="control-group" v-if="speakers.length > 0">
      <label for="speaker-select">Speaker:</label>
      <select id="speaker-select" v-model="selectedSpeaker">
        <option v-for="speaker in speakers" :key="speaker" :value="speaker">
          {{ speaker }}
        </option>
      </select>
    </div>

    <div class="control-group" v-if="emotions.length > 0">
      <label for="emotion-select">Emotion:</label>
      <select id="emotion-select" v-model="selectedEmotion">
        <option v-for="emotion in emotions" :key="emotion" :value="emotion">
          {{ emotion }}
        </option>
      </select>
    </div>

    <div class="control-group">
      <label for="text-input">Text:</label>
      <textarea id="text-input" v-model="text" placeholder="Enter text to synthesize"></textarea>
    </div>

    <div class="control-group">
      <label for="speed-input">Speed:</label>
      <input 
        id="speed-input" 
        type="range" 
        v-model="speed" 
        min="0.5" 
        max="2" 
        step="0.1"
      >
      <span>{{ speed }}x</span>
    </div>

    <div class="control-group">
      <button @click="synthesize" :disabled="isLoading">
        {{ isLoading ? 'Synthesizing...' : 'Synthesize Voice' }}
      </button>
    </div>

    <div v-if="audioUrl" class="audio-player">
      <audio controls :src="audioUrl"></audio>
      <a :href="audioUrl" download="synthesized_voice.wav" class="download-btn">
        Download
      </a>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import voiceApi from '@/api/voice.js';

export default {
  name: 'VoiceClone',
  data() {
    return {
      selectedModel: '【原神】蒙德',
      selectedSpeaker: '',
      selectedEmotion: '',
      text: '',
      speed: 1,
      audioUrl: '',
      isLoading: false,
      error: '',
      speakers: [],
      emotions: [],
      speakerDetails: {}
    };
  },
  async created() {
    await this.fetchSpeakers();
  },
  watch: {
    selectedSpeaker(newVal) {
      if (newVal && this.speakerDetails[newVal]) {
        this.emotions = this.speakerDetails[newVal]['中文'] || [];
        if (this.emotions.length > 0) {
          this.selectedEmotion = this.emotions[0];
        }
      } else {
        this.emotions = [];
        this.selectedEmotion = '';
      }
    }
  },
  methods: {
    async fetchSpeakers() {
      this.isLoading = true;
      this.error = '';
      try {
        const response = await voiceApi.getSpeakers(this.selectedModel);
        
        if (response.spklist) {
          // Handle first response format
          this.speakers = Object.keys(response.spklist);
          this.speakerDetails = Object.fromEntries(
            this.speakers.map(speaker => [speaker, { '中文': response.spklist[speaker] }])
          );
        } else if (response.speakers) {
          // Handle second response format
          this.speakers = Object.keys(response.speakers);
          this.speakerDetails = response.speakers;
        }
        
        if (this.speakers.length > 0) {
          this.selectedSpeaker = this.speakers[0];
        }
      } catch (error) {
        console.error('Error fetching speakers:', error);
        this.error = 'Failed to fetch speakers. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    async synthesize() {
      if (!this.text.trim()) {
        this.error = 'Please enter some text to synthesize';
        return;
      }

      if (!this.selectedSpeaker) {
        this.error = 'Please select a speaker';
        return;
      }

      this.isLoading = true;
      this.error = '';
      this.audioUrl = '';

      try {
        const params = {
          access_token: 'e25841bfe860bf89e356b3e5b999c470', 
          text: this.text,
          speaker_name: this.selectedSpeaker,
          emotion: this.selectedEmotion || '中立_neutral',
          model_name: this.selectedModel,
          speed_facter: this.speed,
          text_lang: '中文',
          prompt_text_lang: '中文'
        };

        const response = await voiceApi.inferVoice(params);
        this.audioUrl = response.audio_url || response.audioUrl;
      } catch (error) {
        console.error('Error in voice synthesis:', error);
        this.error = 'Failed to synthesize voice. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.voice-clone-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.control-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select, textarea, input[type="range"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 100px;
  resize: vertical;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.audio-player {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.download-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #2196F3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.download-btn:hover {
  background-color: #0b7dda;
}

.error-message {
  color: #f44336;
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>