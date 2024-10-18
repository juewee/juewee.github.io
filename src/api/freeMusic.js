import asiox from 'axios'

export function getFreeMusic() {
    return asiox({
        url: 'https://api.uomg.com/api/rand.music?sort=热歌榜&format=json',
        method: 'get'
        
    })
}