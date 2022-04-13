<script setup>
import { ref } from "@vue/runtime-core";
import http from "./plugins/http-common";
import md5 from "md5";

let result = ref();
let input_number = ref();

async function checkBill() {
  let uniq = "id" + new Date().getTime();
  let user = "0895401001560";
  let sign = md5(user + "280619b3ef89f80f" + uniq);
  //  27262260fef7aab1272 production API
  let data = {
    commands: "inq-pasca",
    username: user,
    code: "PLNPOSTPAID",
    ref_id: uniq,
    hp: input_number.value,
    sign: sign,
  };

  let response = await http.post("/bill/check", data);
  console.log(response);
  result.value = response.data.data.message;
}
</script>

<template>
  <main class="profile-page">
    <section class="relative py-16 bg-blueGray-200">
      <div class="container mx-auto px-4 w-1/2">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg"
        >
          <div class="px-6">
            <div class="text-center mt-12">
              <h3
                class="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2"
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
  </main>
</template>

<style>
@import "./assets/base.css";
</style>
