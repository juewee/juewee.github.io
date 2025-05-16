<template>
    <div class="common-layout">
        <el-container>
            <!-- 头部 -->
            <el-header height="60px">
                <Header />
            </el-header>

            <!-- 主要内容 -->
            <el-main @scroll="scrollEvent">
                <!-- 头部图标 -->
                <div class="headerIcon ">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center">
                        <div class="pic "></div>
                        <span style="font-size: 40px; font-weight:550; margin-top: 20px;">Losheep</span>
                        <!-- 文字动画容器 -->
                        <div class="text-animation" ref="textAnimationContainer"></div>
                        <p>{{ visibleText }}</p>
                    </div>
                </div>
                <!-- 内容 -->
                <div class="content">
                    <!-- 左侧边栏 -->
                    <el-affix>
                        <div class="left-aside chunk">

                        </div>
                    </el-affix>
                    <!-- 文章列表 -->
                    <div class="post-list ">
                        <postList/>
                    </div>
                    <!-- 右侧边栏 -->
                    <rightAside/>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { useThemeStore } from '@/stores';
import Header from './header/index.vue'
import postList from './postList/index.vue'
import rightAside from './rightAside/index.vue'
import { ref, onMounted, nextTick } from 'vue';
import gsap from 'gsap';

// 主题存储
const themeStore = useThemeStore();
// 文字内容
const text = '梧高凤必至，花香蝶自来';
// 文字动画容器
const textAnimationContainer = ref(null);
// 主题状态
const theme = ref(false);

// 组件挂载后执行
onMounted(() => {
    // 等待DOM更新后执行动画
    nextTick(() => {
        animateText();
    });
});

// 文字动画
const animateText = () => {
    // 获取文字动画容器
    const textContainer = textAnimationContainer.value;
    // 将文字拆分成单个字符
    const chars = Array.from(text);
    // 创建单个字符元素
    const charEls = chars.map(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = 0;
        span.style.display = 'inline-block';
        textContainer.appendChild(span);
        return span;
    });

    // 创建动画时间轴
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
    // 为每个字符元素添加动画
    charEls.forEach((el, index) => {
        tl.to(el, { opacity: 1, duration: 0.1, ease: 'power1.inOut' }, index * 0.1)
            .to(el, { opacity: 0, duration: 0.1, ease: 'power1.inOut' }, (chars.length + index) * 0.1);
    });
};

// 切换主题
const changeTheme = () => {
    themeStore.changeTheme();
};

// 滚动事件
const scrollEvent = (e) => {
    // 获取头部元素
    const header = document.querySelector('.el-header');
    // 根据滚动位置调整头部高度
    header.style.height = e.target.scrollTop === 0 ? '60px' : '0px';
};
</script>

<style lang="scss">
.el-container {
    height: 100vh;
}

.el-header {

    background-color: var(--header-bg-color);
    overflow: hidden;
    transition: height 0.1s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text-animation {
    font-size: 20px;
    height: 20px;
}

.visiting {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.link:hover svg path {
    fill: rgba(171, 122, 255, 0.573);
}

.headerIcon {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
}

.headerIcon>div {
    margin-bottom: 200px;
}

.pic {
    background-image: url("https://s1.ax1x.com/2023/05/25/p9b96Cd.png");
    background-size: 250%;
    background-position: center;
    border-radius: 50%;
    height: 100px;
    width: 100px;
}

.chunk {
    border-radius: 10px;
    /* 阴影 */
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.233);
    background-color: var(--header-bg-color);
}

.chunk:hover{
    background-color: var(--hover-bg-color);
}

.logo {
    display: flex;
    background-image: url("https://s1.ax1x.com/2023/05/25/p9b96Cd.png");
    /*中心偏移*/
    background-size: 280%;
    background-position: center;
    height: 100px;
    width: 100px;
    border-radius: 50%;
}

.content {
    display: flex;
    justify-content: center;
}

.left-aside {
    margin-right: 10px;
    width: 200px;
    height: 400px;
    max-width: 200px;
    background-color: var(--header-bg-color);
}

.right-asdie {
    width: 200px;
    height: 400px;

}

.post-list {
    display: flex;
    justify-content: center;
    margin-right: 10px;
}
</style>