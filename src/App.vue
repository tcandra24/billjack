<script setup>
import { ref } from "@vue/runtime-core";
import http from "./plugins/http-common";
import md5 from "md5";
import moment from 'moment';

let result = ref({});
let result_bills = ref([]);
let input_number = ref();

async function checkBill() {
  let uniq = "id" + new Date().getTime();
  let user = "0895401001560";
  let sign = md5(user + "280619b3ef89f80f" + uniq);
  //  27262260fef7aab1272 production API
  let dataForm = {
    commands: "inq-pasca",
    username: user,
    code: "PLNPOSTPAID",
    ref_id: uniq,
    hp: input_number.value,
    sign: sign,
  };

  let { data } = await http.post("/bill/check", dataForm);
  result.value = data.data;
  result_bills.value = data.data.desc.tagihan.detail
  console.log(result.value);

}

function formatPrice(value) {
  let val = (value/1).toFixed(0).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
</script>

<template>
  <!-- <main class="profile-page">
    <section class="relative py-16 bg-blueGray-200">
      <div class="container mx-auto px-4 w-1/2">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg"
        >
          <div class="px-6">
            <div class="text-center mt-12">
              <h3
                class="text-4xl font-semibold leading-normal text-blueGray-700 mb-2"
              >
                BillJack
              </h3>
              <div class="mb-2 text-green-600">
                <input
                  type="text"
                  class="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded-full text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Customer Number"
                  v-model="input_number"
                />
              </div>
              <div class="text-center mt-6">
                <button
                  class="bg-green-700 lg:w-1/2 sm:w-full text-white active:bg-green-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="button"
                  @click="checkBill"
                >
                  Check
                </button>
              </div>
            </div>
            <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
              <div class="flex flex-wrap justify-center">
                <div class="w-full lg:w-9/12 px-4">
                  <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                    {{ result }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main> -->
  <div class="absolute inset-0 bg-top bg-no-repeat bg-illustration-01"></div>
  <div class="absolute inset-0 bg-center bg-no-repeat bg-illustration-02"></div>
  <div class="container relative">
    <div class="flex items-center justify-between py-6">
      <a href="#">
        <img class="block w-8 h-8" src="./assets/img/logo.svg" alt="" />
      </a>
      <a href="#">
        <svg
          class="w-6 h-6 fill-current md:hidden"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </a>
      <div class="flex items-center mb-4 md:block">
        <a class="mr-8 font-semibold hover:text-white" href="#"
          >Documentation</a
        >
        <a class="bg-indigo-600 btn hover:bg-indigo-500" href="#">Sign up</a>
      </div>
    </div>
    <h1
      class="px-8 mt-16 mb-4 text-5xl font-extrabold leading-tight text-center text-white xl:text-6xl"
    >
      Check your bill with <span class="text-indigo-700">BillJack</span>
    </h1>

    <div class="my-8 mx-auto max-w-xl xl:max-w-2xl">
      <input
        type="text"
        class="border-0 px-3 py-3 w-full placeholder-gray-300 text-gray-600 bg-white rounded-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
        placeholder="Customer Number"
        v-model="input_number"
      />
    </div>

    <p class="max-w-xl mx-auto mb-8 text-xl text-center xl:max-w-2xl">
      Our landing page template works on all devices, so you only have to set it
      up once, and get beautiful results forever.
    </p>
    <div
      class="flex flex-col justify-center max-w-xs mx-auto mb-12 sm:max-w-full sm:flex-row"
    >
      <button 
        class="w-full mb-4 whitespace-no-wrap bg-indigo-600 btn btn-tall md:w-auto hover:bg-indigo-500 sm:mr-2" 
        @click="checkBill"
      >
        Check
      </button>
      <button
        class="w-full mb-4 whitespace-no-wrap bg-gray-800 btn btn-tall md:w-auto hover:bg-gray-600 sm:ml-2"
        @click="input_number = ''"
      >
        Reset
      </button>
    </div>
    <div>
      <h2 class="title sm:text-4xl md:text-5xl">Results</h2>
      <p class="mb-16 mx-auto intro sm:max-w-xl">
        "ID: {{ result.hp }}"
      </p>
      <ul
        class="flex flex-col flex-wrap justify-center mb-20 border-b border-gray-900 sm:flex-row"
      >
        <li 
          class="w-full px-1 mb-8 sm:mb-16 md:w-1/2 lg:w-1/3"
          v-for="(bill, index) in result_bills"
          :key="index"  
        >
          <span
            class="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl text-white bg-indigo-700 rounded-full"
          >
            <img src="./assets/img/feature-tile-icon-01.svg" alt="" />
          </span>
          <h3 class="mb-2 text-2xl font-bold text-white text-center">{{ moment(bill.periode + '10').format("MMMM YYYY")  }}</h3>
          <div class="text-left">
            <p class="max-w-xs mx-auto text-lg text-gray-500 w-1/3 flex justify-between">
              <span>
                Bill
              </span>
              <span>
                 {{ formatPrice(bill.nilai_tagihan) }}
              </span>
            </p>
            <p class="max-w-xs mx-auto text-md text-gray-500 w-1/3 flex justify-between">
              <span>
                Adm
              </span>
              <span>
                {{ formatPrice(bill.admin) }}
              </span>
            </p>
            <p class="max-w-xs mx-auto text-md text-gray-500 w-1/3 flex justify-between">
              <span>
                Fine
              </span>
              <span>
                {{ formatPrice(bill.denda) }}
              </span>
            </p>
            <div class="max-w-xs mx-auto my-1 w-1/3 border-b border-dashed border-gray-900"></div>
            <p class="max-w-xs mx-auto text-lg text-indigo-600 w-1/3 flex justify-between">
              <span>
                Total
              </span>
              <span>
                {{ formatPrice(bill.total) }}
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex flex-col items-center sm:flex-row sm:justify-between">
      <a class="text-indigo-700" href="#">
        <img src="./assets/img/logo.svg" alt="" class="mx-auto mb-4" />
      </a>
      <div class="flex flex-row justify-center mb-4 -ml-4 -mr-4">
        <a href="#" class="p-4 text-indigo-700 hover:text-indigo-400">
          <svg
            class="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a href="#" class="p-4 text-indigo-700 hover:text-indigo-400">
          <svg
            class="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a href="#" class="p-4 text-indigo-700 hover:text-indigo-400">
          <svg
            class="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <circle cx="12.145" cy="3.892" r="1"></circle>
              <path
                d="M8 12c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"
                fill="currentColor"
              ></path>
              <path
                d="M12 16H4c-2.056 0-4-1.944-4-4V4c0-2.056 1.944-4 4-4h8c2.056 0 4 1.944 4 4v8c0 2.056-1.944 4-4 4zM4 2c-.935 0-2 1.065-2 2v8c0 .953 1.047 2 2 2h8c.935 0 2-1.065 2-2V4c0-.935-1.065-2-2-2H4z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </a>
      </div>
    </div>
    <div class="flex flex-col justify-between mb-8 text-center sm:flex-row">
      <p class="order-last mb-4 text-sm text-gray-500 sm:order-first">
        Designed by
        <a href="https://cruip.com/" class="text-white">Cruip</a>. Coded by
        <a href="https://michelegera.dev/" class="text-white">michelegera</a>
      </p>
      <ul class="flex flex-row justify-center mb-6 -ml-4 -mr-4 text-sm">
        <li>
          <a href="#" class="px-4 text-gray-500 hover:text-white">Contact</a>
        </li>
        <li>
          <a href="#" class="px-4 text-gray-500 hover:text-white">About us</a>
        </li>
        <li>
          <a href="#" class="px-4 text-gray-500 hover:text-white">FAQ's</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
@import "./assets/base.css";
</style>
