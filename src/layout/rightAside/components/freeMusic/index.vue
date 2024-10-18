<template>
    <div>
        <div v-if="musicData" class=" chunk music-card">
            <h2 @click="fetchMusicData">随机音乐：</h2>
            <div class="card-content">
                <p>歌曲：{{ musicData.data.name }}</p>
                <p>艺术家：{{ musicData.data.artistsname }}</p>
                <img :src="musicData.data.picurl" alt="音乐封面">
            </div>
            <audio controls :src="musicData.data.url" class="play-bar" @ended="playNext"></audio>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'; // Import nextTick here
import { getFreeMusic } from '@/api/freeMusic.js'

const musicData = ref(null);
const currentMusicIndex = ref(0);
const play = ref(false);

onMounted(async () => {
    try {
        const res = await getFreeMusic();
        console.log(res);
        musicData.value = res.data;
        if (play.value) {
            nextTick(() => { // Use nextTick here
                const audioElement = document.querySelector('.play-bar');
                audioElement.play();
            });
        }
        play.value = true;
    } catch (err) {
        console.log(err);
    }
});

const playNext = () => {
    currentMusicIndex.value++;
    fetchMusicData(true);
};

const fetchMusicData = async (isNext) => {
    try {
        const res = await getFreeMusic();
        console.log(res);
        musicData.value = res.data;
        if (isNext) {
            nextTick(() => { // Use nextTick here
                const audioElement = document.querySelector('.play-bar');
                audioElement.play();
            });
        }
    } catch (err) {
        console.log(err);
    }
};
</script>



<style lang="scss" scoped>
.music-card {
    border-radius: 15px;
    padding: 10px;
    margin-bottom: 20px;
}

img {
    width: 100%;
}

.card-content {
    margin-bottom: 10px;
}

.play-bar {
    width: 100%;
}
</style>