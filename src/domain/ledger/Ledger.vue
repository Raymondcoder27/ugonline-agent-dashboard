<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useAccounts } from "@/domain/accounts/stores";
import { onMounted, type Ref, ref, watch, reactive } from "vue";
import CreateAccount from "@/domain/accounts/components/CreateAccount.vue";
import moment from "moment/moment";
import type { IGoFilter } from "@/types"
import { useDebounceFn } from "@vueuse/core"
import type { IResendVerificationPayload, TAccountVerificationType } from "./types"

const store = useAccounts();
const modalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);

// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 1,
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

onMounted(() => {
  fetch()
})

function fetch() {
  filter.limit = limit.value
  filter.page = page.value
  store.fetchUserAccounts(filter)
}

function next(){
  page.value += 1
  fetch()
}

function previous(){
  page.value -= 1
  fetch()
}

function open() {
  modalOpen.value = true;
}

function convertDate(date: string) {
  return moment(date).format("DD-MM-YYYY")
}

function close() {
  modalOpen.value = false;
}

const reVerifyForm: IResendVerificationPayload = reactive({
  purpose: "",
  username: ""
})
const resend = (purpose: TAccountVerificationType, username: string) => {
  if (username.length === 0) return
  reVerifyForm.purpose = purpose
  reVerifyForm.username = username
  store.resendAccountVerification(reVerifyForm)
}

const updateFilter = useDebounceFn(
  () => {
    fetch()
  },
  300,
  { maxWait: 5000 }
)

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      // do something if that's something you're interested in
    }
  },
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
)
</script>

<template>
<!-- <div class="min-h-screen bg-gray-100 p-2"> -->
<div class="bg-white p-2">

  
  <!-- Header -->
  <div class="max-w-7xl mx-auto bg-white">
    <div class="flex items-center justify-between border-b pb-4 mb-4 mt-3">
      <!-- <h1 class="text-2xl font-bold text-gray-700">Float Ledger</h1> -->
      <div>
        <label for="date-range" class="mr-2 text-sm text-gray-600">Date Range:</label>
        <input
          type="date"
          id="date-range"
          class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Table -->
    <!-- <div class="overflow-x-auto  p-2">
      <table class="w-full border-collapse border text-left">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-200 px-4 py-2 text-gray-600">Date</th>
            <th class="border border-gray-200 px-4 py-2 text-gray-600">Description</th>
            <th class="border border-gray-200 px-4 py-2 text-gray-600 text-right">Amount</th>
            <th class="border border-gray-200 px-4 py-2 text-gray-600 text-right">Balance</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 text-gray-700">2024-11-28</td>
            <td class="px-4 py-2 text-gray-700">Opening Balance</td>
            <td class="px-4 py-2 text-right text-green-600">+ 1,000</td>
            <td class="px-4 py-2 text-right text-gray-800">1,000</td>
          </tr>
          <tr>
            <td class="px-4 py-2 text-gray-700">2024-11-29</td>
            <td class="px-4 py-2 text-gray-700">Purchase Supplies</td>
            <td class="px-4 py-2 text-right text-red-600">- 300</td>
            <td class="px-4 py-2 text-right text-gray-800">700</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-50">
            <td colspan="2" class="px-4 py-2 text-right font-bold text-gray-600">Totals:</td>
            <td class="px-4 py-2 text-right font-bold text-gray-800">+ 700</td>
            <td class="px-4 py-2 text-right font-bold text-gray-800">700</td>
          </tr>
        </tfoot>
      </table>
    </div> -->
  </div>





  <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">

            <th class="text-center">Date</th>
            <th class="text-center">Description</th>
            <th class="text-center">Amount</th>
            <th class="text-center">Balance</th>
          </tr>
        </thead> 
        <tbody>
          <tr :class="account.blockedAt ? 'body-tr-blocked' : 'body-tr'"
            v-for="(account, idx) in store.backofficeAccounts" :key="idx">
<!--            <td width="10px">{{ idx + 1 }}.</td>-->
            <td>
              <label class="font-bold py-1">
                {{ account.firstName }} {{ account.lastName }}
                {{ account.middleNames }}
              </label>
              <i class="fa-solid fa-exclamation-triangle" v-if="account.blockedAt"></i>
            </td>
            <td>
              <a class="underline" :href="'smtp:' + account.username">
                {{ account.username }}
              </a>
              <i class="fa-solid fa-exclamation-triangle text-red-600" v-if="!account.emailVerified"></i>
            </td>
            <td>
              {{ account.phone }} <i class="fa-solid fa-exclamation-triangle text-red-600"
                v-if="!account.phoneVerified"></i>
            </td>
            <td class="text-center">
              {{ account.role }}
            </td>
            <td class="text-center">
              <label v-if="account.blockedAt" class="text-red-600 font-bold">BLOCKED</label>
              <label v-else class="text-green-600 font-bold">ACTIVE</label>
            </td>
            <td class="text-center">
              <i v-if="account.activatedAt" class="fa-solid fa-check-square text-green-600"></i>
              <i v-else class="fa-solid fa-times-square text-red-600"></i>
            </td>
            <td class="text-center">{{ convertDate(account.createdAt) }}</td>
            <td class="text-center">
              <div class="flex flex-row space-x-2 w-full justify-center" v-if="!account.blockedAt">
                <i class="text-gray-600 fa-solid fa-pencil px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="open()"></i>
                <i class="text-gray-600 fa-solid fa-reply px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="open()"></i>
                <i v-if="account.phoneVerified && !account.activatedAt"
                  class="text-gray-600 fa-solid fa-unlock-keyhole px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="resend('change-password', account.username)" title="Change Password"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</div>


  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->

    <!-- Chances are high that you're starting with a form -->
    <CreateAccount @cancel="close" />
    <!-- That's also okay -->
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
