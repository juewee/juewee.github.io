import asiox from 'axios'

export function getFreeMusic() {
    const params = new URLSearchParams({
        sort: '热歌榜',
        format: 'json'
    });
    return asiox({
        url: `https://api.uomg.com/api/rand.music?${params.toString()}`,
        method: 'get'
        
    })
}