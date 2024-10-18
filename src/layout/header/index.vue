<template>
    <span style="font-size: 40px; font-weight:550;">Losheep</span>
    <div class="header-right">
        <!-- 主题切换按钮 -->
        <el-switch v-model="theme" @change="changeTheme" />
        <div class="header-link">搜索</div>
        <div class="header-link">
            <RouterLink to="/">
                首页
            </RouterLink>
        </div>
        <div>
            <RouterLink to="tools">
                工具
            </RouterLink>
        </div>
        <div class="header-link">日常</div>
        <div class="header-link">笔记</div>
        <div>
            <RouterLink to="test">
                测试
            </RouterLink>
        </div>
        <div class="header-link">登录</div>
    </div>
</template>

<script setup>
import { useThemeStore } from '@/stores';
import { ref } from 'vue';

// 主题存储
const themeStore = useThemeStore();
// 主题状态
const theme = ref(false);
// 切换主题
const changeTheme = () => {
    themeStore.changeTheme();
};
</script>
<style scoped>
.header-right {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 300px;
}

.header-right>div {
    /*margin-right: 10px;*/
    text-align: center;
    flex: 1;
}
</style>