import asiox from 'axios'

export function get_tts(data) {
    
    return asiox({
        url: "https://infer.acgnai.top/infer/gen",
        method: 'post',
        timeout:0,
        headers:{
            "content-type": "application/json"
        },
        data:data
    })
}