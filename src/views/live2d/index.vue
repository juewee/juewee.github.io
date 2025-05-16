<template>
  <div class="container">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';
import { onMounted } from 'vue';

window.PIXI = PIXI;

onMounted(async () => {
    try {
        const app = new PIXI.Application({
            view: document.getElementById('canvas'),
            resizeTo: window,
            backgroundColor: 0xeeeeee,
            autoStart: true,
            eventMode: 'static'
        });

        const model = await Live2DModel.from('/Hiyori/Hiyori.model3.json', {
            autoMotion: false,
            autoHitArea: false
        }).catch(e => {
            console.error('模型加载失败:', e);
            throw e;
        });

        if (!model.internalModel) {
            throw new Error('模型内部结构加载失败');
        }

        app.stage.addChild(model);
        model.x = app.screen.width / 2;
        model.y = app.screen.height / 2;
        model.scale.set(0.15, 0.15);
        model.anchor.set(0.5, 0.5);

        // 安全地添加交互
        if (model.internalModel) {
            model.on('hit', (hitAreas) => {
                if (!hitAreas) return;
                console.log('触发区域:', hitAreas);
                if (hitAreas.includes('Body')) {
                  console.log(model);
                    model.motion('TapBody').catch(e => {
                        console.warn('播放动作失败:', e);
                    });
                }
            });
        }

        window.addEventListener('resize', () => {
            model.x = app.screen.width / 2;
            model.y = app.screen.height / 2;
        });

    } catch (e) {
        console.error('初始化失败:', e);
    }
});
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>