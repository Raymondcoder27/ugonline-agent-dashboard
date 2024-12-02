<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      services: [
        {
          id: 1,
          service: 'Post Office Account',
          name: 'Posta Uganda',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'info@ugapost.co.ug',
          phone: '+256784944479',
          address: 'Plot 35 Kampala Road, Kampala',
        },
        {
          id: 2,
          service: 'Agricultural Research',
          name: 'National Agricultural Research Organization',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'info@naro.go.ug',
          phone: '+256-41-320512',
          address: 'Plot 11-13, Lugard Avenue, Entebbe',
        },
        {
          id: 3,
          service: 'National ID Registration',
          name: 'National Identification & Registration Authority',
          // thumbnail: 'https://nira.go.ug/assets/exports/nira_logo_black@2x.png',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'info@nira.com',
          phone: '0800211700',
          address: 'National Independence Grounds, Kololo Airstrip',
        },
        {
          id: 4,
          service: 'Land Title Registration',
          name: 'Ministry of Lands and Urban Development',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'info@mlhud.go.ug',
          phone: '0414355355',
          address: 'Dewinton Road',
        },
        {
          id: 5,
          service: 'Name Reservation',
          name: 'URSB',
          // thumbnail: 'https://obrs.ursb.go.ug/img/full_logo.9fe8e881.jpg',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'ursb@ursb.go.ug',
          phone: '0312211211',
          address: 'Plot 1 Baskerville Avenue',
        },
        // {
        //   id: 6,
        //   service: 'Name Reservation',
        //   name: 'Ministry of Foreign Affairs',
        //   thumbnail: '/assets/coa-19c4edfc.png',
        //   email: 'info@mofa.go.ug',
        //   phone: '0312411403',
        //   address: 'Parliamentary Avenue',
        // },
        // {
        //   id: 7,
        //   name: 'Ministry of Agriculture, Animal Industry and Fisheries',
        //   thumbnail: '/assets/coa-19c4edfc.png',
        //   email: 'info@maaif.go.ug',
        //   phone: '0312123123',
        //   address: 'Kabanyoro',
        // },
        // {
        //   id: 8,
        //   name: 'National Water and Sewage Corporation',
        //   thumbnail: '/assets/coa-19c4edfc.png',
        //   email: 'info@nwsc.go.ug',
        //   phone: '0312123123',
        //   address: '',
        // },
        {
          id: 9,
          service: 'Passport Application',
          name: 'Ministry of Internal Affairs',
          thumbnail: '/assets/coa-19c4edfc.png',
          email: 'info@moia.go.ug',
          phone: '0312123123',
          address: '',
        },
        // {
        //   id: 10,
        //   name: 'Ministry of Gender, Labour and Social Development',
        //   thumbnail: '/assets/coa-19c4edfc.png',
        //   email: 'info@moglsd.go.ug',
        //   phone: '0312123123',
        //   address: '',
        // },
      ],
    };
  },
});
</script>

<style scoped>
.service {
  @apply bg-white p-4 rounded-lg hover:bg-gray-200 transition duration-300;
}
</style>

<template>
  <div class="grid grid-cols-4 gap-4 p-4">
    <div v-for="service in services" :key="service.id" class="service service-active p-4 bg-white shadow rounded">
      <div class="flex justify-between items-center">
        <!-- <img :src="service.thumbnail" alt="Service Thumbnail" class="w-10 h-10 object-cover"> -->
        <img  class="w-10 h-10 object-cover">
        <i class="fa-solid fa-square-arrow-up-right text-lg text-gray-600"></i>
      </div>
      <hr class="my-2">
      <p class="font-bold text-gray-700 my-1">{{ service.service }}</p>
      <table class="text-sm text-gray-600">
        <tbody>
          <tr>
            <td class="font-semibold">Provider:</td>
            <td class="px-2">{{ service.name }}</td>
          </tr>
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
