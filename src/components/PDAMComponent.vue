<script setup>
import moment from 'moment';

const props = defineProps(['array', 'detail'])

const format_price = (value) => {
  let val = (value/1).toFixed(0).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

</script>

<template>
  <div 
    class="flex flex-col bg-white border border-gray-300 rounded-xl overflow-hidden items-center my-1 w-full md:w-1/3 lg:w-1/4" style="cursor: auto;"
    v-for="(bill, index) in props.array"
    :key="index"
  >
    <div class="flex px-2 py-1 w-full">
      <div class="relative w-16 h-16 flex-shrink-0">    
        <div class="w-full h-full flex items-center justify-center">                            
          <img alt="Placeholder Photo" class="w-full h-full rounded-full object-cover object-center transition duration-50" loading="lazy" :src="`https://ui-avatars.com/api/?name=${props.detail.customer}&amp;background=4e73df&amp;color=ffffff&amp;size=100`">                        
        </div>                     
      </div>                        
      <div class="px-4">                     
        <h1 class="text-md line-clamp-1 title text-gray-500 text-lg mb-0">{{ props.detail.customer }}</h1>             
        <span class="flex items-center justify-start text-gray-500">                         
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
          </svg>
          {{ moment(bill.period + '10').format("MMMM YYYY")  }}
        </span>               
      </div>
    </div>
    <div class="px-2 py-1 w-full">
      <div class="my-1 border-t w-full"></div>
      <div class="flex flex-column w-full text-md justify-evenly">
        <div class="w-auto font-bold">
          <h2 class="line-clamp-1 py-1">Bill Amount</h2>             
          <h2 class="line-clamp-1 py-1">First Meter</h2>             
          <h2 class="line-clamp-1 py-1">Last Meter</h2>             
          <h2 class="line-clamp-1 py-1">Misc Amount</h2>
          <h2 class="line-clamp-2 py-1">Penalty</h2>
        </div>
        <div class="w-auto">
          <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.bill_amount) }}</p>         
          <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.first_meter) }}</p>             
          <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.last_meter) }}</p>             
          <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.misc_amount) }}</p>
          <p class="line-clamp-1 py-1">Rp. {{ format_price(bill.penalty) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
