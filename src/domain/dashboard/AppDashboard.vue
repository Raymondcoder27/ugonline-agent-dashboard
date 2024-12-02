<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { useDebounceFn } from "@vueuse/core"


interface Service {
  id: number;
  service: string;
  name: string;
  thumbnail: string;
  email: string;
  phone: string;
  address: string;
}

const services = ref<Service[]>([
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
    thumbnail: '/assets/coa-19c4edfc.png',
    email: 'ursb@ursb.go.ug',
    phone: '0312211211',
    address: 'Plot 1 Baskerville Avenue',
  },
  {
    id: 9,
    service: 'Passport Application',
    name: 'Ministry of Internal Affairs',
    thumbnail: '/assets/coa-19c4edfc.png',
    email: 'info@moia.go.ug',
    phone: '0312123123',
    address: '',
  },
]);

// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page:0,
  sort: [
    {
      field: "firstname",
      order: "ASC"
    }
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS"
    },
  ]
})

const updateFilter = useDebounceFn(
  () => {
    fetch()
  },
  300,
  { maxWait: 5000 }
)

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
)
</script>

<template>
   <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
    class="filter-element e-input ml-5" type="text" placeholder="Search Service" />

  <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">

    <!-- <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
    class="filter-element e-input" type="text" placeholder="SEARCH SERVICE" /> -->


    <div v-for="service in services" :key="service.id" class="service p-4 bg-white shadow rounded hover:bg-gray-200 transition duration-300">
      <div class="flex justify-between items-center">
        <img :src="service.thumbnail" alt="Service Thumbnail" class="w-10 h-10 object-cover" />
        <i class="fa-solid fa-square-arrow-up-right text-lg text-gray-600"></i>
      </div>
      <hr class="my-2" />
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
          <tr v-if="service.address">
            <td class="font-semibold">Address:</td>
            <td class="px-2">{{ service.address || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.service {
  @apply bg-white p-4 rounded-lg hover:bg-gray-200 transition duration-300;
}
</style>
