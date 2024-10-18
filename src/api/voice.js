import asiox from 'axios'

export function get_tts(params) {
    const url = import.meta.env.VITE_APP_TTS_URL
    
    return asiox({
        url: `http://${url}:9880/tts`,
        method: 'get',
        responseType: 'blob',
        params:params
    })
}