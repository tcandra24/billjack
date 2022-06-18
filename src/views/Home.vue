<script setup>
import { ref, shallowRef } from "@vue/runtime-core";
import http from "@/plugins/http-common";
import md5 from "md5";
import moment from "moment";
import city from "@/json/pdam/city";
import PLNComponent from "@/components/PLNComponent.vue";
import PDAMComponent from "@/components/PDAMComponent.vue";

let result_bills = ref([]);
let input_number = ref();
let response_code = ref("");
let detail_data = ref({});
let type_bill = ref("PLN");
let pdam_code = ref("PDAMKOTA.SURABAYA");
let api_key = ref(import.meta.env.VITE_API_KEY);
let title = ref(import.meta.env.VITE_APP_TITLE);
let component = shallowRef(PLNComponent);

document.title = title.value;

const checkBill = async () => {
  let uniq = "id" + new Date().getTime();
  let user = "0895401001560";
  let sign = md5(user + api_key.value + uniq);
  let code = "";

  if (type_bill.value == "PLN") {
    code = "PLNPOSTPAID";
  } else {
    code = pdam_code.value;
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
  response_code.value = data.data.response_code;

  if (response_code.value === "00") {
    let period = data.data.period.split(",");
    detail_data.value = {
      id_customer: data.data.hp,
      message: data.data.message,
      customer: data.data.tr_name,
      admin: data.data.admin,
      nominal: data.data.nominal,
      price: data.data.price,
      period: {
        first: period[0],
        last: period[1],
      },
    };

    if (type_bill.value == "PLN") {
      result_bills.value = data.data.desc.tagihan.detail;
      component.value = PLNComponent;
    } else {
      result_bills.value = data.data.desc.bill.detail;
      component.value = PDAMComponent;
    }
  } else {
    detail_data.value = {
      message: data.data.message,
    };
    result_bills.value = [];
  }
};

const format_price = (value) => {
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const reset = () => {
  input_number.value = "";
  response_code.value = "";
  result_bills.value = [];
  detail_data.value = {};
};
</script>

<template>
  <h1
    class="px-8 mt-16 mb-4 text-5xl font-extrabold leading-tight text-center text-gray-700 dark:text-white xl:text-6xl">
    Check your bill with <span class="text-blue-700">{{ title }}</span>
  </h1>

  <div class="my-8 mx-auto max-w-xl xl:max-w-2xl flex flex-col">
    <div class="flex flex-row w-full">
      <select v-model="type_bill" @change="reset"
        class="border-0 px-3 py-3 w-1/3 md:w-1/4 lg:w-1/5 placeholder-gray-300 text-gray-600 bg-white rounded-l-full shadow-lg border-solid border-l-2 border-t-2 border-b-2 focus:outline-none focus:ring ease-linear transition-all duration-150">
        <option value="PLN">PLN</option>
        <option value="PDAM">PDAM</option>
      </select>
      <input type="text"
        class="border-0 px-3 py-3 w-4/5 placeholder-gray-300 text-gray-600 bg-white rounded-r-full shadow-lg border-solid border-r-2 border-t-2 border-b-2 focus:outline-none focus:ring ease-linear transition-all duration-150"
        placeholder="Customer Number" v-model="input_number" />
    </div>
    <select v-model="pdam_code" v-show="type_bill == 'PDAM'" @change="reset"
      class="border-0 px-3 py-3 my-5 w-full placeholder-gray-300 text-gray-600 bg-white rounded-full shadow-lg border-solid border-2 focus:outline-none focus:ring ease-linear transition-all duration-150">
      <option v-for="(city, index) in city" :value="city.code">
        {{ city.name }}
      </option>
    </select>
  </div>

  <p class="max-w-xl mx-auto mb-8 text-xl text-center xl:max-w-2xl">
    This is the way that you can check your Bill easily.
  </p>
  <div class="flex flex-col justify-center max-w-xs mx-auto mb-12 sm:max-w-full sm:flex-row">
    <button class="w-full mb-4 whitespace-no-wrap bg-blue-600 btn btn-tall md:w-auto hover:bg-blue-500 sm:mr-2"
      @click="checkBill">
      Check
    </button>
    <button class="w-full mb-4 whitespace-no-wrap bg-gray-800 btn btn-tall md:w-auto hover:bg-gray-600 sm:ml-2"
      @click="reset()">
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
            <p class="line-clamp-1 py-1">
              Rp. {{ format_price(detail_data.admin) }}
            </p>
            <p class="line-clamp-1 py-1">
              Rp. {{ format_price(detail_data.nominal) }}
            </p>
            <p class="line-clamp-1 py-1">
              Rp. {{ format_price(detail_data.price) }}
            </p>
            <p class="line-clamp-2 py-1" v-if="detail_data.period.last">
              {{
                  moment(detail_data.period.first + "10").format("MMMM YYYY")
              }}
              -
              {{ moment(detail_data.period.last + "10").format("MMMM YYYY") }}
            </p>
            <p class="line-clamp-2 py-1" v-else>
              {{
                  moment(detail_data.period.first + "10").format("MMMM YYYY")
              }}
            </p>
          </div>
        </div>
        <p class="text-gray-400 text-sm italic">
          *nominal excluding admin and other fee
        </p>
        <p class="text-gray-400 text-sm italic">
          *price is nominal + admin fee + other fee
        </p>
      </div>
      <div class="flex flex-row flex-wrap justify-center mb-10 lg:mx-16 px-10 sm:flex-row gap-x-1.5">
        <component :is="component" :array="result_bills" :detail="detail_data">
        </component>
      </div>
    </div>
    <div v-else>
      <h2 class="title sm:text-4xl md:text-5xl">Results</h2>
      <p class="mb-16 mx-auto intro sm:max-w-xl">
        "{{ detail_data.message }}"
      </p>
    </div>
  </div>
</template>