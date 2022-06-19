import { defineStore } from "pinia";

export const useConfigWeb = defineStore('configWeb', {
  persist: true,
  state: () => ({
    isDark: false
  }),
  actions: {
    darkModeToggle(){
      this.isDark = !this.isDark
    }
  },
  getters: {
    isDarkValue: (state) => {
      if (state.isDark) {
        document.documentElement.classList.add("dark");
        return true;
      } else {
        document.documentElement.classList.remove("dark");
        return false;
      }
    }
  }
})