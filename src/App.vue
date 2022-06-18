<script setup>
import { computed, ref } from "@vue/runtime-core";

let isDark = ref(false);
let version = ref(import.meta.env.VITE_APP_VERSION);

const darkTheme = computed(() => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    return true;
  } else {
    document.documentElement.classList.remove("dark");
    return false;
  }
});
</script>

<template>
  <div class="absolute inset-0 bg-top bg-no-repeat bg-illustration-01"></div>
  <div class="absolute inset-0 bg-center bg-no-repeat bg-illustration-02"></div>
  <div class="container relative mx-auto">
    <div class="flex items-center justify-between py-6 px-2">
      <router-link to="/">
        <img class="block w-24 h-24" src="@/assets/img/billjack-logo.png" alt="Logo Billjack"
          :class="{ 'invert-image': darkTheme }" />
      </router-link>
      <div class="flex items-center mb-4 md:block">
        <router-link class="mr-4 font-semibold dark:hover:text-white" to="/about">About</router-link>
        <p class="btn mr-8 text-gray-400 dark:hover:text-white">
          {{ version }}
        </p>
        <button @click="isDark = !isDark"
          class="btn text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
            v-if="darkTheme">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" v-else>
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>

    <router-view></router-view>

    <div class="flex flex-col items-center sm:flex-row sm:justify-between">
      <div class="flex flex-row justify-center mb-4 -ml-4 -mr-4">
        <a href="#" class="p-4 text-blue-700 hover:text-blue-400">
          <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z"
              fill="currentColor"></path>
          </svg>
        </a>
        <a href="#" class="p-4 text-blue-700 hover:text-blue-400">
          <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"
              fill="currentColor"></path>
          </svg>
        </a>
        <a href="#" class="p-4 text-blue-700 hover:text-blue-400">
          <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g>
              <circle cx="12.145" cy="3.892" r="1"></circle>
              <path
                d="M8 12c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"
                fill="currentColor"></path>
              <path
                d="M12 16H4c-2.056 0-4-1.944-4-4V4c0-2.056 1.944-4 4-4h8c2.056 0 4 1.944 4 4v8c0 2.056-1.944 4-4 4zM4 2c-.935 0-2 1.065-2 2v8c0 .953 1.047 2 2 2h8c.935 0 2-1.065 2-2V4c0-.935-1.065-2-2-2H4z"
                fill="currentColor"></path>
            </g>
          </svg>
        </a>
      </div>
    </div>
    <div class="flex flex-col justify-between mb-8 text-center sm:flex-row">
      <p class="order-last mb-4 text-sm text-gray-500 sm:order-first">
        Designed by
        <a href="https://cruip.com/" class="text-black dark:text-white">Cruip</a>. Coded by
        <a href="https://michelegera.dev/" class="text-black dark:text-white">michelegera</a>
      </p>
    </div>
  </div>
</template>

<style>
@import "./assets/base.css";

.invert-image {
  filter: invert(100%);
}
</style>
