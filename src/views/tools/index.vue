<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main>
                <div v-for="items,index in tools" :key="index">
                    <h1 class="title">{{ items.title }}</h1>
                    <div  class="tools">
                    <div v-for="item,index in items.tools" :key="index" class="tools-card chunk" @click="toLink(item.url)">
                        <h1>{{item.name}}</h1>
                        <!-- <el-link :href="item.url" target="_blank">{{item.title}}</el-link> -->
                        <img alt="" :src="item.img||'https://img.ixintu.com/download/jpg/20200918/ad05735679bd286f65f6651a3539383c_512_512.jpg!bg'" />
                        <p>{{ item.desc }}</p>
                    </div>
                </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
import Header from '@/layout/header/index.vue'
import tools from './static/tools.json'

const toLink = (url) => {
    window.open(url, '_blank')
}

</script>

<style scoped>
.el-main {
    padding: 150px;
}

.tools{
    display: flex;
    flex-wrap: wrap;
}

.title{
    border-left: 5px blue solid;
    padding-left: 10px;
}

.tools-card{
    /* 阴影 */
    padding: 20px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    width: 300px;
    text-align: center;
}
</style>