<!-- <script setup lang="ts">
</script>

<template>
  <div class="flex">
    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">23</p>
        <p class="text-xs">Total Customers</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">3</p>
        <p class="text-xs">Services Provided</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">4</p>
        <p class="text-xs">Pending Float Requests</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">33</p>
        <p class="text-xs">Total Service Transactions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">13,400,000</p>
        <p class="text-xs">Available Float Balance (UGX)</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.count {
  @apply py-2 text-center border border-gray-100 rounded bg-white mx-1 shadow;
}
</style> -->


<template>
  <div class="grid grid-cols-4 gap-4 p-4">
    <div v-for="service in services" :key="service.id" class="service service-active p-4 bg-white shadow rounded">
      <div class="flex justify-between items-center">
        <img :src="service.thumbnail" alt="Service Thumbnail" class="w-10 h-10 object-cover">
        <i class="fa-solid fa-square-arrow-up-right text-lg text-gray-600"></i>
      </div>
      <hr class="my-2">
      <p class="font-bold text-gray-700 my-1">{{ service.name }}</p>
      <table class="text-sm text-gray-600">
        <tbody>
          <tr>
            <td class="font-semibold">Email:</td>
            <td class="px-2">{{ service.email }}</td>
          </tr>
          <tr>
            <td class="font-semibold">Phone:</td>
            <td class="px-2">{{ service.phone }}</td>
          </tr>
          <tr>
            <td class="font-semibold">Address:</td>
            <td class="px-2">{{ service.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      services: [
        {
          id: 1,
          name: 'Posta Uganda',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'info@ugapost.co.ug',
          phone: '+256784944479',
          address: 'Plot 35 Kampala Road, Kampala',
        },
        {
          id: 2,
          name: 'National Agricultural Research Organization',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'info@naro.go.ug',
          phone: '+256-41-320512',
          address: 'Plot 11-13, Lugard Avenue, Entebbe',
        },
        {
          id: 3,
          name: 'National Identification & Registration Authority',
          thumbnail: 'https://nira.go.ug/assets/exports/nira_logo_black@2x.png',
          email: 'info@nira.com',
          phone: '0800211700',
          address: 'National Independence Grounds, Kololo Airstrip',
        },
        // Add more services as needed
      ],
    };
  },
});
</script>

<style scoped>
.service {
  @apply bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition duration-300;
}
</style>
