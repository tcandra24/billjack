<script setup>
import { ref } from "@vue/runtime-core";
import http from "./plugins/http-common";
import md5 from "md5";
import moment from 'moment';
import city from './json/pdam/city'
// sudah bisa get data pdam belum menata tiap property saat pdam dipilih

let result_bills = ref([]);
let input_number = ref();
let response_code = ref('');
let detail_data = ref({});
let type_bill = ref('PLN');
let pdam_code = ref('PDAMKOTA.SURABAYA');
let api_key = ref(import.meta.env.VITE_API_KEY)
let title = ref(import.meta.env.VITE_APP_TITLE)
let version = ref(import.meta.env.VITE_APP_VERSION)

document.title = title.value

const checkBill = async () => {
  let uniq = "id" + new Date().getTime();
  let user = "0895401001560";
  let sign = md5(user + api_key.value + uniq);
  let code = ''
  
  if (type_bill.value == 'PLN') {
    code = 'PLNPOSTPAID'
  } else {
    code = pdam_code.value
  }

  let dataForm = {
    commands: "inq-pasca",
    username: user,
    code: code,
    ref_id: uniq,
    hp: input_number.value,
    sign: sign,
  };

  let { data } = await http.post("/bill/check", dataForm);
  response_code.value = data.data.response_code
  let period = data.data.period.split(',')
  detail_data.value = {
    id_customer: data.data.hp,
    message: data.data.message,
    customer: data.data.tr_name,
    admin: data.data.admin,
    nominal: data.data.nominal,
    price: data.data.price,
    period: {
      first: period[0],
      last: period[1]
    },
  }


  if(response_code.value === '00'){
    if(type_bill.value == 'PLN') {
      result_bills.value = data.data.desc.tagihan.detail
    } else {
      result_bills.value = data.data.desc.bill.detail
    }
  } else {
    result_bills.value = []
  }
    console.log(result_bills.value)
}

const format_price = (value) => {
  let val = (value/1).toFixed(0).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const reset = () => {
  input_number.value = ''
  response_code.value = ''
  result_bills.value = []
  detail_data.value = {}
}
</script>

<template>
  <div class="absolute inset-0 bg-top bg-no-repeat bg-illustration-01"></div>
  <div class="absolute inset-0 bg-center bg-no-repeat bg-illustration-02"></div>
  <div class="container relative mx-auto">
    <div class="flex items-center justify-between py-6">
      <a href="#">
        <img class="block w-8 h-8" src="./assets/img/logo.svg" alt="" />
      </a>
      <div class="flex items-center mb-4 md:block">
        <a class="mr-8 font-semibold hover:text-white" href="#"
          >About</a
        >
        <p class="btn text-gray-400 hover:text-white">{{ version }} </p>
      </div>
    </div>
    <h1
      class="px-8 mt-16 mb-4 text-5xl font-extrabold leading-tight text-center text-white xl:text-6xl"
    >
      Check your bill with <span class="text-blue-700">{{ title }}</span>
    </h1>

    <div class="my-8 mx-auto max-w-xl xl:max-w-2xl">
      <select v-model="type_bill" @change="input_number = ''" class="border-0 px-3 py-3 w-1/5 placeholder-gray-300 text-gray-600 bg-white rounded-l-full shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
        <option value="PLN">PLN</option>
        <option value="PDAM">PDAM</option>
      </select>
      <input
        type="text"
        class="border-0 px-3 py-3 w-4/5 placeholder-gray-300 text-gray-600 bg-white rounded-r-full shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
        placeholder="Customer Number"
        v-model="input_number"
      />
      <select v-model="pdam_code" v-show="type_bill == 'PDAM'" @change="input_number = ''" class="border-0 px-3 py-3 my-5 w-full placeholder-gray-300 text-gray-600 bg-white rounded-full shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
        <option v-for="(city, index) in city" :value="city.code" > {{ city.name }} </option>
      </select>
    </div>

    <p class="max-w-xl mx-auto mb-8 text-xl text-center xl:max-w-2xl">
      This is the way that you can check your Bill easily.
    </p>
    <div
      class="flex flex-col justify-center max-w-xs mx-auto mb-12 sm:max-w-full sm:flex-row"
    >
      <button 
        class="w-full mb-4 whitespace-no-wrap bg-blue-600 btn btn-tall md:w-auto hover:bg-blue-500 sm:mr-2" 
        @click="checkBill"
      >
        Check
      </button>
      <button
        class="w-full mb-4 whitespace-no-wrap bg-gray-800 btn btn-tall md:w-auto hover:bg-gray-600 sm:ml-2"
        @click="reset()"
      >
        Reset
      </button>
    </div>
    <div v-if="response_code">
      <div v-if="response_code === '00'">
        <h2 class="title sm:text-4xl md:text-5xl">Results</h2>
        <div class="w-full md:w-1/2 lg:w-1/3 mx-auto mb-5 p-4 bg-white rounded-xl">
          <div class="flex flex-column text-md justify-between">
            <div class="w-auto font-bold">
              <h2 class="line-clamp-1 py-1">ID Customer</h2>             
              <h2 class="line-clamp-1 py-1">Admin</h2>             
              <h2 class="line-clamp-1 py-1">Nominal</h2>             
              <h2 class="line-clamp-1 py-1">Price</h2>
              <h2 class="line-clamp-2 py-1">Period</h2>
            </div>
            <div class="w-auto">
              <p class="line-clamp-1 py-1">{{ detail_data.id_customer }}</p>         
              <p class="line-clamp-1 py-1">Rp. {{ format_price(detail_data.admin) }}</p>             
              <p class="line-clamp-1 py-1">Rp. {{ format_price(detail_data.nominal) }}</p>             
              <p class="line-clamp-1 py-1">Rp. {{ format_price(detail_data.price) }}</p>
              <p class="line-clamp-2 py-1" v-if="detail_data.period.last">
                {{ moment(detail_data.period.first + '10').format("MMMM YYYY")  }} 
                - 
                {{ moment(detail_data.period.last + '10').format("MMMM YYYY")  }}
              </p>
              <p class="line-clamp-2 py-1" v-else>
                {{ moment(detail_data.period.first + '10').format("MMMM YYYY")  }}
              </p>            
            </div>
          </div>
          <p class="text-gray-400 text-sm italic">*nominal excluding admin and other fee</p>
          <p class="text-gray-400 text-sm italic">*price is nominal + admin fee + other fee</p>
        </div>
        <div class="flex flex-row flex-wrap justify-center mb-10 lg:mx-16 px-10 sm:flex-row gap-x-1.5">
          <div 
            class="flex flex-col bg-white border border-gray-300 rounded-xl overflow-hidden items-center my-1 w-full md:w-1/3 lg:w-1/4" style="cursor: auto;"
            v-for="(bill, index) in result_bills"
            :key="index"
          >
            <div class="flex px-2 py-1 w-full">
              <div class="relative w-16 h-16 flex-shrink-0">    
                <div class="w-full h-full flex items-center justify-center">                            
                  <img alt="Placeholder Photo" class="w-full h-full rounded-full object-cover object-center transition duration-50" loading="lazy" :src="`https://ui-avatars.com/api/?name=${detail_data.customer}&amp;background=4e73df&amp;color=ffffff&amp;size=100`">                        
                </div>                     
              </div>                        
              <div class="px-4">                     
                <h1 class="text-md line-clamp-1 title text-gray-500 text-lg mb-0">{{ detail_data.customer }}</h1>             
                <span class="flex items-center justify-start text-gray-500">                         
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
                  </svg>
                  <div v-if="type_bill == 'PLN'">
                    {{ moment(bill.periode + '10').format("MMMM YYYY")  }}                      
                  </div>
                  <div v-else>
                    {{ moment(bill.period + '10').format("MMMM YYYY")  }}    
                  </div>
                </span>               
              </div>
            </div>
            <div class="px-2 py-1 w-full">
              <div class="my-1 border-t w-full"></div>
              <div class="flex flex-column w-full text-md justify-evenly">
                <div class="w-auto font-bold">
                  
                  <div v-if="type_bill == 'PLN'">
                    <h2 class="line-clamp-1 ">Bill</h2>             
                    <h2 class="line-clamp-1">Adm</h2>             
                    <h2 class="line-clamp-1">Fine</h2>             
                    <h2 class="line-clamp-2">Total</h2>
                  </div>
                  <div v-else>
                    <h2 class="line-clamp-1 py-1">Bill Amount</h2>             
                    <h2 class="line-clamp-1 py-1">First Meter</h2>             
                    <h2 class="line-clamp-1 py-1">Last Meter</h2>             
                    <h2 class="line-clamp-1 py-1">Misc Amount</h2>
                    <h2 class="line-clamp-2 py-1">Penalty</h2>
                  </div>
                </div>
                <div class="w-auto">
                  <div v-if="type_bill == 'PLN'"> 
                    <p class="line-clamp-1">Rp. {{ format_price(bill.nilai_tagihan) }}</p>             
                    <p class="line-clamp-1">Rp. {{ format_price(bill.admin) }}</p>             
                    <p class="line-clamp-1">Rp. {{ format_price(bill.denda) }}</p>             
                    <p class="line-clamp-2">Rp. {{ format_price(bill.total) }}</p>
                  </div>
                  <div v-else> 
                    <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.bill_amount) }}</p>         
                    <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.first_meter) }}</p>             
                    <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.last_meter) }}</p>             
                    <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.misc_amount) }}</p>
                    <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.penalty) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <ul
          class="flex flex-col flex-wrap justify-center mb-20 border-b border-gray-900 sm:flex-row"
        >
          <li 
            class="w-full px-1 mb-8 sm:mb-16 md:w-1/2 lg:w-1/3 border b-white"
            v-for="(bill, index) in result_bills"
            :key="index"  
          >
            <span
              class="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl text-white bg-blue-700 rounded-full"
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
                  {{ format_price(bill.nilai_tagihan) }}
                </span>
              </p>
              <p class="max-w-xs mx-auto text-md text-gray-500 w-1/3 flex justify-between">
                <span>
                  Adm
                </span>
                <span>
                  {{ format_price(bill.admin) }}
                </span>
              </p>
              <p class="max-w-xs mx-auto text-md text-gray-500 w-1/3 flex justify-between">
                <span>
                  Fine
                </span>
                <span>
                  {{ format_price(bill.denda) }}
                </span>
              </p>
              <div class="max-w-xs mx-auto my-1 w-1/3 border-b border-dashed border-gray-900"></div>
              <p class="max-w-xs mx-auto text-lg text-blue-600 w-1/3 flex justify-between">
                <span>
                  Total
                </span>
                <span>
                  {{ format_price(bill.total) }}
                </span>
              </p>
            </div>
          </li>
        </ul> -->
      </div>
      <div v-else>
        <h2 class="title sm:text-4xl md:text-5xl">Results</h2>
        <p class="mb-16 mx-auto intro sm:max-w-xl">
          "{{ detail_data.message }}"
        </p>
      </div>
    </div>
    <div class="flex flex-col items-center sm:flex-row sm:justify-between">
      <div class="flex flex-row justify-center mb-4 -ml-4 -mr-4">
        <a href="#" class="p-4 text-blue-700 hover:text-blue-400">
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
        <a href="#" class="p-4 text-blue-700 hover:text-blue-400">
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
        <a href="#" class="p-4 text-blue-700 hover:text-blue-400">
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
    </div>
  </div>
</template>

<style>
@import "./assets/base.css";
</style>
