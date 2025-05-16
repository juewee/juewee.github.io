import axios from 'axios';

const BASE_URL = 'https://gsv.ai-lab.top'; // Set your base URL here

const voiceApi = {
  /**
   * Perform voice inference
   * @param {Object} params - Inference parameters
   * @param {string} params.access_token - Authentication token
   * @param {string} params.text - Text to synthesize
   * @param {string} params.speaker_name - Speaker name
   * @param {string} params.emotion - Emotion for the voice
   * @param {string} params.model_name - Model name
   * @param {number} params.speed_facter - Speed factor (default: 1)
   * @param {string} params.text_lang - Text language
   * @param {string} params.prompt_text_lang - Prompt language
   * @param {string} [params.media_type='wav'] - Output media type
   * @returns {Promise<Object>} Response containing audio URL
   */
  async inferVoice(params) {
    const defaultParams = {
      batch_size: 10,
      batch_threshold: 0.75,
      fragment_interval: 0.3,
      media_type: 'wav',
      parallel_infer: true,
      repetition_penalty: 1.35,
      seed: -1,
      split_bucket: true,
      temperature: 1,
      text_split_method: '按标点符号切',
      top_k: 10,
      top_p: 1
    };

    const requestData = { ...defaultParams, ...params };

    try {
      const response = await axios.post(`${BASE_URL}/infer_single`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error in voice inference:', error);
      throw error;
    }
  },

  /**
   * Get list of available speakers
   * @param {string} model - Model name to get speakers for
   * @returns {Promise<Object>} Response containing speaker list
   */
  async getSpeakers(model) {
    try {
      const response = await axios.post(`${BASE_URL}/spks`, { model });
      return response.data;
    } catch (error) {
      console.error('Error fetching speakers:', error);
      throw error;
    }
  }
};

export default voiceApi;