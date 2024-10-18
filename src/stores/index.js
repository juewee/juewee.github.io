import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('dark');


  function changeTheme(){
    if(currentTheme.value === 'dark'){
      light();
    }else{
      dark();
    }
  }

  function light(){
    currentTheme.value = 'light';
    document.documentElement.className = ''; // 清除现有的主题类
    document.documentElement.classList.add(`theme-light`);
  }

  function dark(){
    currentTheme.value = 'dark';
    document.documentElement.className = ''; // 清除现有的主题类
    document.documentElement.classList.add(`theme-dark`);
  }

  return { currentTheme, changeTheme ,light,dark};
});
