<template>
  <div>
    <router-view></router-view>
    
  </div>
</template>

<script setup>
import {onMounted} from 'vue'
import {useThemeStore} from '@/stores'
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.dark()
})

</script>

<style lang="scss">

</style>